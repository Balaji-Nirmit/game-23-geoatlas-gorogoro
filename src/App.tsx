import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline, Circle, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, Award, RefreshCw, Trophy, ChevronRight, Check } from 'lucide-react';
import { CITIES_DATA, GAME_MODES, type City, type GameMode } from './data/cities';
import { calculateDistance, calculateScore, cn } from './lib/utils';

// Fix Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const USER_MARKER_ICON = L.divIcon({
  className: 'custom-marker',
  html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-animation"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const TARGET_MARKER_ICON = L.divIcon({
  className: 'target-marker',
  html: `<div class="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white font-bold scale-110">✓</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Sound URLs
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  fail: 'https://assets.mixkit.co/active_storage/sfx/253/253-preview.mp3',
  tick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  tada: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
};

const playSound = (url: string, volume = 0.5) => {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play().catch(e => console.log('Audio play blocked', e));
};

function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [selectedMode, setSelectedMode] = useState<GameMode>(GAME_MODES[0]);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [userGuess, setUserGuess] = useState<{ lat: number; lng: number } | null>(null);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [round, setRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [maxRounds] = useState(10);
  const [shuffledCities, setShuffledCities] = useState<City[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showLabels, setShowLabels] = useState(false);
  const [worldGeoJson, setWorldGeoJson] = useState<any>(null);
  const [isGeoLoading, setIsGeoLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Load GeoJSON for masking
  useEffect(() => {
    setIsGeoLoading(true);
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
      .then(res => res.json())
      .then(data => {
        setWorldGeoJson(data);
        setIsGeoLoading(false);
      })
      .catch(err => {
        console.error('Failed to load GeoJSON', err);
        setIsGeoLoading(false);
      });
  }, []);

  // Filtered GeoJSON for current country
  const countryMask = useMemo(() => {
    if (!worldGeoJson || selectedMode.id === 'world') return null;
    
    const countryName = selectedMode.name.toLowerCase();
    const aliases: Record<string, string[]> = {
      'usa': ['united states of america', 'united states', 'usa', 'united states of america'],
      'uk': ['united kingdom', 'uk', 'great britain', 'england'],
      'united kingdom': ['united kingdom', 'uk', 'great britain', 'england'],
      'uae': ['united arab emirates', 'uae', 'united arab emirates'],
      'south korea': ['south korea', 'republic of korea', 'korea', 'korea, republic of'],
      'russia': ['russia', 'russian federation', 'russia'],
      'china': ['china', 'peoples republic of china'],
    };

    const targetNames = aliases[countryName] || [countryName];

    const filteredFeatures = worldGeoJson.features.filter((f: any) => {
      const p = f.properties;
      const geoName = (p.name || p.NAME || p.ADMIN || p.admin || p.name_long || "").toLowerCase();
      // Check if this feature is NOT one of our targeted country features
      return !targetNames.some(t => geoName.includes(t) || t.includes(geoName));
    });

    // If we filtered out nothing, matching failed. 
    // We don't want to mask the WHOLE world if we can't find the hole.
    if (filteredFeatures.length === worldGeoJson.features.length) {
      console.warn(`Could not find boundary for ${selectedMode.name}. Masking disabled.`);
      return null;
    }

    return {
      ...worldGeoJson,
      features: filteredFeatures
    };
  }, [worldGeoJson, selectedMode]);

  // Fit bounds when mode or mask changes
  useEffect(() => {
    if (gameState === 'playing' && selectedMode.id !== 'world' && worldGeoJson && mapRef.current) {
      const countryName = selectedMode.name.toLowerCase();
      const aliases: Record<string, string[]> = {
        'usa': ['united states of america', 'united states', 'usa'],
        'uk': ['united kingdom', 'uk', 'great britain'],
        'uae': ['united arab emirates', 'uae'],
        'south korea': ['south korea', 'republic of korea', 'korea'],
      };
      const targetNames = aliases[countryName] || [countryName];

      const countryFeature = worldGeoJson.features.find((f: any) => {
        const p = f.properties;
        const geoName = (p.name || p.NAME || p.ADMIN || p.admin || p.name_long || "").toLowerCase();
        return targetNames.some(t => geoName.includes(t) || t.includes(geoName));
      });

      if (countryFeature) {
        const bounds = L.geoJSON(countryFeature).getBounds();
        mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: true });
        mapRef.current.setMaxBounds(bounds.pad(2));
      }
    } else if (gameState === 'playing' && selectedMode.id === 'world' && mapRef.current) {
        mapRef.current.setView([20, 0], 3);
        mapRef.current.setMaxBounds([[-120, -200], [120, 200]]);
    }
  }, [gameState, selectedMode, worldGeoJson]);

  const endRound = useCallback((lat?: number, lng?: number) => {
    if (gameState !== 'playing' || userGuess) return;
    
    // Clear timer
    if (timerRef.current) clearInterval(timerRef.current);

    const guess = lat !== undefined && lng !== undefined ? { lat, lng } : null;
    setUserGuess(guess);

    if (currentCity) {
      if (guess) {
        const dist = calculateDistance(guess.lat, guess.lng, currentCity.lat, currentCity.lng);
        const points = calculateScore(dist);
        setDistance(dist);
        setScore(points);
        setTotalScore(prev => prev + points);
        if (points > 700) playSound(SOUNDS.success);
        else playSound(SOUNDS.click);
      } else {
        // Time ran out and no guess
        playSound(SOUNDS.fail);
        setDistance(0);
        setScore(0);
      }
      setGameState('result');
    }
  }, [gameState, userGuess, currentCity]);

  // Timer logic
  useEffect(() => {
    if (gameState === 'playing') {
      setTimeLeft(30);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endRound();
            return 0;
          }
          if (prev <= 6) {
            playSound(SOUNDS.tick, 0.2);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, endRound]);

  const startNewRound = useCallback((index: number, citiesList?: City[]) => {
    const list = citiesList || shuffledCities;
    if (list.length > 0 && index <= list.length) {
      setCurrentCity(list[index - 1]);
      setUserGuess(null);
      setGameState('playing');
    }
  }, [shuffledCities]);

  const handleModeSelect = (mode: GameMode) => {
    playSound(SOUNDS.click);
    // Shuffle cities for the selected mode
    const shuffled = [...mode.cities].sort(() => Math.random() - 0.5);
    setShuffledCities(shuffled);
    setSelectedMode(mode);
    setTotalScore(0);
    setRound(1);
    startNewRound(1, shuffled);
  };

  const handleMapClick = (lat: number, lng: number) => {
    endRound(lat, lng);
  };

  const handleNextRound = () => {
    playSound(SOUNDS.click);
    if (round < maxRounds && round < shuffledCities.length) {
      const nextRound = round + 1;
      setRound(nextRound);
      startNewRound(nextRound);
    } else {
      playSound(SOUNDS.tada);
      setGameState('menu');
    }
  };

  return (
    <div className="relative w-screen h-screen font-sans">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          key={selectedMode.id}
          center={[20, 0]}
          zoom={3}
          zoomControl={false}
          className="w-full h-full"
          maxBounds={[[ -90, -180 ], [ 90, 180 ]]}
          minZoom={2}
          maxZoom={selectedMode.id === 'world' ? 7 : 10}
          ref={mapRef}
        >
          <TileLayer
            key={showLabels ? 'labels' : 'no-labels'}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={showLabels 
              ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png"
            }
          />

          {/* Masking Layer */}
          {countryMask && (
            <GeoJSON 
              key={`mask-${selectedMode.id}-${showLabels}`}
              data={countryMask} 
              style={{
                fillColor: '#ffffff',
                fillOpacity: 1,
                color: '#f1f5f9',
                weight: 1,
                opacity: 1
              }}
              interactive={false}
            />
          )}

          {/* Outline for the selected country (Hole) to make it stand out */}
          {!isGeoLoading && worldGeoJson && selectedMode.id !== 'world' && (
            <GeoJSON 
              key={`outline-${selectedMode.id}`}
              data={{
                type: 'FeatureCollection',
                features: worldGeoJson.features.filter((f: any) => {
                  const countryName = selectedMode.name.toLowerCase();
                  const aliases: Record<string, string[]> = {
                    'usa': ['united states of america', 'united states', 'usa'],
                    'uk': ['united kingdom', 'uk', 'great britain', 'england'],
                    'uae': ['united arab emirates', 'uae'],
                    'south korea': ['south korea', 'republic of korea', 'korea'],
                  };
                  const targetNames = aliases[countryName] || [countryName];
                  const p = f.properties;
                  const geoName = (p.name || p.NAME || p.ADMIN || p.admin || p.name_long || "").toLowerCase();
                  return targetNames.some(t => geoName.includes(t) || t.includes(geoName));
                })
              }}
              style={{
                fillColor: 'transparent',
                color: '#3b82f6',
                weight: 2,
                opacity: 0.8
              }}
              interactive={false}
            />
          )}

          <MapEvents onMapClick={handleMapClick} />
          
          {userGuess && (
            <Marker position={[userGuess.lat, userGuess.lng]} icon={USER_MARKER_ICON} />
          )}
          
          {gameState === 'result' && currentCity && (
            <>
              <Marker position={[currentCity.lat, currentCity.lng]} icon={TARGET_MARKER_ICON} />
              {userGuess && (
                <>
                  <Polyline 
                    positions={[[userGuess.lat, userGuess.lng], [currentCity.lat, currentCity.lng]]} 
                    color="#3b82f6" 
                    dashArray="5, 10"
                    weight={2}
                  />
                  <Circle 
                    center={[currentCity.lat, currentCity.lng]} 
                    radius={distance * 1000} 
                    pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 }} 
                  />
                </>
              )}
            </>
          )}
        </MapContainer>
      </div>

      {/* UI Overlay */}
      {/* Masking Layer */}
      <AnimatePresence>
        {isGeoLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-white flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-black text-gray-900 mb-2">Syncing Global Atlas...</h2>
            <p className="text-gray-500 max-w-sm">We're loading high-precision map boundaries to ensure the best experience.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6 sm:mb-8 shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">GeoAtlas</h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">Test your world knowledge</p>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col gap-4">
                <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider text-gray-400 px-1 shrink-0">Game Modes</p>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                  {GAME_MODES.map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => handleModeSelect(mode)}
                      className="group flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all text-left shadow-sm hover:shadow-md active:scale-98"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-tight">{mode.name}</h3>
                          <p className="text-[10px] sm:text-xs text-gray-500">{mode.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {totalScore > 0 && (
                <div className="mt-6 p-3 sm:p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Recent Final Score</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-gray-900">{totalScore}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-20 sm:top-8 left-0 right-0 z-[45] px-4 flex flex-col items-center gap-2 pointer-events-none"
          >
            <div className="glass px-6 py-3 sm:py-4 rounded-[2rem] shadow-xl border border-white w-full max-w-xs sm:max-w-sm pointer-events-auto">
              <div className="flex justify-between w-full items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Locate:</span>
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm sm:text-xs font-black transition-colors flex items-center gap-2",
                  timeLeft <= 5 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"
                )}>
                  <span>{timeLeft}s</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-gray-900 text-center tracking-tight truncate px-2">
                {currentCity?.name}
              </h2>
              <div className="w-full bg-gray-200 h-1 rounded-full mt-3 overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: `${((round - 1) / maxRounds) * 100}%` }}
                  animate={{ width: `${(round / maxRounds) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Round {round} of {maxRounds}</p>
                <p className="text-[10px] font-black uppercase text-blue-600/50">{selectedMode.name}</p>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
          >
            <motion.div 
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white/95 backdrop-blur-2xl p-4 sm:p-6 rounded-[2.5rem] shadow-2xl border border-white max-w-sm sm:max-w-md w-full flex flex-col items-center gap-4 pointer-events-auto"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <div className="text-center flex-1">
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Distance</p>
                  <p className="text-xl sm:text-2xl font-black text-gray-900">
                    {userGuess ? `${Math.round(distance)}` : "—"} 
                    {userGuess && <span className="text-xs font-normal text-gray-500 ml-1">km</span>}
                  </p>
                </div>
                <div className="w-[1px] h-10 bg-gray-100" />
                <div className="text-center flex-1">
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Score</p>
                  <p className={cn("text-2xl sm:text-3xl font-black", score > 0 ? "text-blue-600" : "text-red-500")}>
                    {userGuess ? `+${score}` : "TIME OUT"}
                  </p>
                </div>
              </div>

              <div className="w-full space-y-3">
                <div className="p-3 sm:p-4 rounded-2xl bg-blue-50 flex items-center justify-between">
                   <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm text-blue-900 truncate">
                      {currentCity?.name}, {currentCity?.country}
                    </span>
                   </div>
                </div>

                <button
                  onClick={handleNextRound}
                  className="w-full bg-gray-900 text-white py-3 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors active:scale-95 transform shadow-lg"
                >
                  {round < maxRounds ? (
                    <>Next Round <ChevronRight className="w-5 h-5" /></>
                  ) : (
                    <>Finish Game <Award className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Header for Score */}
      {(gameState === 'playing' || gameState === 'result') && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 sm:top-8 right-4 sm:right-8 z-40"
        >
          <div className="glass px-3 py-2 sm:px-5 sm:py-3 rounded-[1.5rem] shadow-lg border border-white flex items-center gap-2 sm:gap-4 transition-all">
            <div className="flex flex-col items-end">
              <span className="text-[8px] sm:text-[10px] font-black uppercase text-gray-400 tracking-widest">Score</span>
              <span className="text-sm sm:text-xl font-black text-gray-900 tabular-nums">{totalScore}</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white shadow-inner">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Mode Indicator & Label Toggle */}
      {(gameState === 'playing' || gameState === 'result') && (
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-40 flex flex-col gap-2 sm:gap-3">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setGameState('menu')}
            className="glass p-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg border border-white flex items-center gap-3 hover:bg-white transition-all cursor-pointer group active:scale-95"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 group-hover:text-red-500" />
            </div>
            <span className="hidden sm:inline font-bold text-gray-700">{selectedMode.name}</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setShowLabels(!showLabels)}
            className={cn(
              "glass p-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg border border-white flex items-center gap-3 transition-all cursor-pointer group active:scale-95",
              showLabels ? "bg-blue-50 border-blue-200" : "hover:bg-white"
            )}
          >
            <div className={cn(
              "w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors",
              showLabels ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-100 text-gray-500"
            )}>
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <span className={cn("hidden sm:inline font-bold", showLabels ? "text-blue-700" : "text-gray-700")}>
              {showLabels ? "Labels ON" : "Labels OFF"}
            </span>
          </motion.button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
