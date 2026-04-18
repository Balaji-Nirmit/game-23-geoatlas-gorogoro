export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  cities: City[];
  bounds?: [[number, number], [number, number]]; // [sw, ne]
}

export const CITIES_DATA: City[] = [
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  { name: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
  { name: "Moscow", country: "Russia", lat: 55.7558, lng: 37.6173 },
  { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4232 },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978 },
];

export const COUNTRY_DATA: Record<string, City[]> = {
  "USA": [
    { name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
    { name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298 },
    { name: "Miami", country: "USA", lat: 25.7617, lng: -80.1918 },
    { name: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321 },
    { name: "Austin", country: "USA", lat: 30.2672, lng: -97.7431 },
    { name: "Denver", country: "USA", lat: 39.7392, lng: -104.9903 },
    { name: "Atlanta", country: "USA", lat: 33.749, lng: -84.388 },
    { name: "Boston", country: "USA", lat: 42.3601, lng: -71.0589 },
  ],
  "India": [
    { name: "Delhi", country: "India", lat: 28.6139, lng: 77.209 },
    { name: "Bangalore", country: "India", lat: 12.9716, lng: 77.5946 },
    { name: "Chennai", country: "India", lat: 13.0827, lng: 80.2707 },
    { name: "Kolkata", country: "India", lat: 22.5726, lng: 88.3639 },
    { name: "Hyderabad", country: "India", lat: 17.385, lng: 78.4867 },
    { name: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873 },
    { name: "Pune", country: "India", lat: 18.5204, lng: 73.8567 },
    { name: "Lucknow", country: "India", lat: 26.8467, lng: 80.9462 },
  ],
  "France": [
    { name: "Lyon", country: "France", lat: 45.764, lng: 4.8357 },
    { name: "Marseille", country: "France", lat: 43.2965, lng: 5.3698 },
    { name: "Bordeaux", country: "France", lat: 44.8378, lng: -0.5792 },
    { name: "Nice", country: "France", lat: 43.7102, lng: 7.262 },
    { name: "Toulouse", country: "France", lat: 43.6047, lng: 1.4442 },
    { name: "Nantes", country: "France", lat: 47.2184, lng: -1.5536 },
    { name: "Lille", country: "France", lat: 50.6292, lng: 3.0573 },
    { name: "Strasbourg", country: "France", lat: 48.5734, lng: 7.7521 },
  ],
  "United Kingdom": [
    { name: "Manchester", country: "UK", lat: 53.4808, lng: -2.2426 },
    { name: "Birmingham", country: "UK", lat: 52.4862, lng: -1.8904 },
    { name: "Edinburgh", country: "UK", lat: 55.9533, lng: -3.1883 },
    { name: "Glasgow", country: "UK", lat: 55.8642, lng: -4.2518 },
    { name: "Liverpool", country: "UK", lat: 53.4084, lng: -2.9916 },
    { name: "Bristol", country: "UK", lat: 51.4545, lng: -2.5879 },
    { name: "Leeds", country: "UK", lat: 53.8008, lng: -1.5491 },
  ],
  "Japan": [
    { name: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023 },
    { name: "Kyoto", country: "Japan", lat: 35.0116, lng: 135.7681 },
    { name: "Yokohama", country: "Japan", lat: 35.4437, lng: 139.638 },
    { name: "Sapporo", country: "Japan", lat: 43.0611, lng: 141.3564 },
    { name: "Fukuoka", country: "Japan", lat: 33.5902, lng: 130.4017 },
    { name: "Nagoya", country: "Japan", lat: 35.1815, lng: 136.9066 },
  ],
  "Brazil": [
    { name: "Sao Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
    { name: "Brasilia", country: "Brazil", lat: -15.7975, lng: -47.8919 },
    { name: "Salvador", country: "Brazil", lat: -12.9714, lng: -38.5014 },
    { name: "Fortaleza", country: "Brazil", lat: -3.7172, lng: -38.5433 },
    { name: "Belo Horizonte", country: "Brazil", lat: -19.9167, lng: -43.9345 },
    { name: "Manaus", country: "Brazil", lat: -3.119, lng: -60.0217 },
  ],
  "Germany": [
    { name: "Hamburg", country: "Germany", lat: 53.5511, lng: 9.9937 },
    { name: "Munich", country: "Germany", lat: 48.1351, lng: 11.582 },
    { name: "Cologne", country: "Germany", lat: 50.9375, lng: 6.9603 },
    { name: "Frankfurt", country: "Germany", lat: 50.1109, lng: 8.6821 },
    { name: "Stuttgart", country: "Germany", lat: 48.7758, lng: 9.1829 },
    { name: "Leipzig", country: "Germany", lat: 51.3397, lng: 12.3731 },
  ],
  "Italy": [
    { name: "Milan", country: "Italy", lat: 45.4642, lng: 9.19 },
    { name: "Naples", country: "Italy", lat: 40.8518, lng: 14.2681 },
    { name: "Florence", country: "Italy", lat: 43.7696, lng: 11.2558 },
    { name: "Venice", country: "Italy", lat: 45.4408, lng: 12.3155 },
    { name: "Turin", country: "Italy", lat: 45.0703, lng: 7.6869 },
    { name: "Palermo", country: "Italy", lat: 38.1157, lng: 13.3615 },
  ],
  "Canada": [
    { name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
    { name: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673 },
    { name: "Ottawa", country: "Canada", lat: 45.4215, lng: -75.6972 },
    { name: "Calgary", country: "Canada", lat: 51.0447, lng: -114.0719 },
    { name: "Edmonton", country: "Canada", lat: 53.5461, lng: -113.4938 },
  ],
  "Australia": [
    { name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631 },
    { name: "Brisbane", country: "Australia", lat: -27.4705, lng: 153.026 },
    { name: "Perth", country: "Australia", lat: -31.9505, lng: 115.8605 },
    { name: "Adelaide", country: "Australia", lat: -34.9285, lng: 138.6007 },
    { name: "Gold Coast", country: "Australia", lat: -28.0167, lng: 153.4 },
  ],
  "Spain": [
    { name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
    { name: "Valencia", country: "Spain", lat: 39.4699, lng: -0.3763 },
    { name: "Seville", country: "Spain", lat: 37.3891, lng: -5.9845 },
    { name: "Zaragoza", country: "Spain", lat: 41.6488, lng: -0.8891 },
    { name: "Malaga", country: "Spain", lat: 36.7213, lng: -4.4214 },
  ],
  "South Korea": [
    { name: "Busan", country: "South Korea", lat: 35.1796, lng: 129.0756 },
    { name: "Incheon", country: "South Korea", lat: 37.4563, lng: 126.7052 },
    { name: "Daegu", country: "South Korea", lat: 35.8714, lng: 128.6014 },
    { name: "Daejeon", country: "South Korea", lat: 36.3504, lng: 127.3845 },
  ],
  "China": [
    { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
    { name: "Guangzhou", country: "China", lat: 23.1291, lng: 113.2644 },
    { name: "Shenzhen", country: "China", lat: 22.5431, lng: 114.0579 },
    { name: "Chengdu", country: "China", lat: 30.5728, lng: 104.0668 },
    { name: "Wuhan", country: "China", lat: 30.5928, lng: 114.3055 },
  ],
  "South Africa": [
    { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4232 },
    { name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473 },
    { name: "Durban", country: "South Africa", lat: -29.8587, lng: 31.0218 },
    { name: "Pretoria", country: "South Africa", lat: -25.7479, lng: 28.2293 },
    { name: "Port Elizabeth", country: "South Africa", lat: -33.9608, lng: 25.6022 },
  ],
  "Russia": [
    { name: "Saint Petersburg", country: "Russia", lat: 59.9311, lng: 30.3609 },
    { name: "Novosibirsk", country: "Russia", lat: 55.0084, lng: 82.9357 },
    { name: "Yekaterinburg", country: "Russia", lat: 56.8389, lng: 60.6057 },
    { name: "Kazan", country: "Russia", lat: 55.8304, lng: 49.0661 },
  ],
  "Mexico": [
    { name: "Guadalajara", country: "Mexico", lat: 20.6597, lng: -103.3496 },
    { name: "Monterrey", country: "Mexico", lat: 25.6866, lng: -100.3161 },
    { name: "Puebla", country: "Mexico", lat: 19.0413, lng: -98.2062 },
    { name: "Tijuana", country: "Mexico", lat: 32.5149, lng: -117.0382 },
  ],
  "Argentina": [
    { name: "Cordoba", country: "Argentina", lat: -31.4135, lng: -64.1811 },
    { name: "Rosario", country: "Argentina", lat: -32.9468, lng: -60.6393 },
    { name: "Mendoza", country: "Argentina", lat: -32.8895, lng: -68.8458 },
  ],
  "Thailand": [
    { name: "Chiang Mai", country: "Thailand", lat: 18.7883, lng: 98.9853 },
    { name: "Phuket", country: "Thailand", lat: 7.8804, lng: 98.3923 },
    { name: "Pattaya", country: "Thailand", lat: 12.9236, lng: 100.8825 },
  ],
  "Egypt": [
    { name: "Alexandria", country: "Egypt", lat: 31.2001, lng: 29.9187 },
    { name: "Giza", country: "Egypt", lat: 30.0131, lng: 31.2089 },
    { name: "Luxor", country: "Egypt", lat: 25.6872, lng: 32.6396 },
  ],
  "Turkey": [
    { name: "Ankara", country: "Turkey", lat: 39.9334, lng: 32.8597 },
    { name: "Izmir", country: "Turkey", lat: 38.4237, lng: 27.1428 },
    { name: "Antalya", country: "Turkey", lat: 36.8969, lng: 30.7133 },
  ],
  "Netherlands": [
    { name: "Rotterdam", country: "Netherlands", lat: 51.9244, lng: 4.4777 },
    { name: "The Hague", country: "Netherlands", lat: 52.0705, lng: 4.3007 },
    { name: "Utrecht", country: "Netherlands", lat: 52.0907, lng: 5.1214 },
  ],
  "Sweden": [
    { name: "Gothenburg", country: "Sweden", lat: 57.7089, lng: 11.9746 },
    { name: "Malmo", country: "Sweden", lat: 55.605, lng: 13.0038 },
    { name: "Uppsala", country: "Sweden", lat: 59.8586, lng: 17.6389 },
  ],
  "Norway": [
    { name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
    { name: "Bergen", country: "Norway", lat: 60.3913, lng: 5.3221 },
    { name: "Trondheim", country: "Norway", lat: 63.4305, lng: 10.3951 },
  ],
  "Denmark": [
    { name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
    { name: "Aarhus", country: "Denmark", lat: 56.1567, lng: 10.2108 },
    { name: "Odense", country: "Denmark", lat: 55.4038, lng: 10.4024 },
  ],
  "Finland": [
    { name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384 },
    { name: "Espoo", country: "Finland", lat: 60.2055, lng: 24.6559 },
    { name: "Tampere", country: "Finland", lat: 61.4978, lng: 23.761 },
  ],
  "Poland": [
    { name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 },
    { name: "Krakow", country: "Poland", lat: 50.0647, lng: 19.945 },
    { name: "Lodz", country: "Poland", lat: 51.7592, lng: 19.456 },
  ],
  "Greece": [
    { name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275 },
    { name: "Thessaloniki", country: "Greece", lat: 40.6401, lng: 22.9444 },
    { name: "Patras", country: "Greece", lat: 38.2466, lng: 21.7346 },
  ],
  "Portugal": [
    { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
    { name: "Porto", country: "Portugal", lat: 41.1579, lng: -8.6291 },
    { name: "Coimbra", country: "Portugal", lat: 40.2033, lng: -8.4103 },
  ],
  "Switzerland": [
    { name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
    { name: "Geneva", country: "Switzerland", lat: 46.2044, lng: 6.1432 },
    { name: "Basel", country: "Switzerland", lat: 47.5596, lng: 7.5886 },
  ],
  "Austria": [
    { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
    { name: "Salzburg", country: "Austria", lat: 47.8095, lng: 13.055 },
    { name: "Innsbruck", country: "Austria", lat: 47.2692, lng: 11.4041 },
  ],
  "Belgium": [
    { name: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 },
    { name: "Antwerp", country: "Belgium", lat: 51.2194, lng: 4.4025 },
    { name: "Ghent", country: "Belgium", lat: 51.0543, lng: 3.7174 },
  ],
  "Ireland": [
    { name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
    { name: "Cork", country: "Ireland", lat: 51.8985, lng: -8.4756 },
    { name: "Limerick", country: "Ireland", lat: 52.6638, lng: -8.6267 },
  ],
  "New Zealand": [
    { name: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633 },
    { name: "Wellington", country: "New Zealand", lat: -41.2865, lng: 174.7762 },
    { name: "Christchurch", country: "New Zealand", lat: -43.5321, lng: 172.6362 },
  ],
  "Singapore": [
    { name: "Singapore City", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  ],
  "Malaysia": [
    { name: "Kuala Lumpur", country: "Malaysia", lat: 3.139, lng: 101.6869 },
    { name: "George Town", country: "Malaysia", lat: 5.4141, lng: 100.3288 },
    { name: "Johor Bahru", country: "Malaysia", lat: 1.4854, lng: 103.7618 },
  ],
  "Vietnam": [
    { name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lng: 106.6297 },
    { name: "Hanoi", country: "Vietnam", lat: 21.0285, lng: 105.8542 },
    { name: "Da Nang", country: "Vietnam", lat: 16.0544, lng: 108.2022 },
  ],
  "Indonesia": [
    { name: "Jakarta", country: "Indonesia", lat: -6.2088, lng: 106.8456 },
    { name: "Surabaya", country: "Indonesia", lat: -7.2575, lng: 112.7521 },
    { name: "Bandung", country: "Indonesia", lat: -6.9175, lng: 107.6191 },
  ],
  "Philippines": [
    { name: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842 },
    { name: "Quezon City", country: "Philippines", lat: 14.676, lng: 121.0437 },
    { name: "Davao City", country: "Philippines", lat: 7.1907, lng: 125.4551 },
  ],
  "Israel": [
    { name: "Jerusalem", country: "Israel", lat: 31.7683, lng: 35.2137 },
    { name: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818 },
    { name: "Haifa", country: "Israel", lat: 32.794, lng: 34.9896 },
  ],
  "Saudi Arabia": [
    { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753 },
    { name: "Jeddah", country: "Saudi Arabia", lat: 21.5433, lng: 39.1728 },
    { name: "Mecca", country: "Saudi Arabia", lat: 21.3891, lng: 39.8579 },
  ],
  "United Arab Emirates": [
    { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lng: 54.3773 },
    { name: "Sharjah", country: "UAE", lat: 25.3463, lng: 55.4209 },
  ],
  "Kenya": [
    { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
    { name: "Mombasa", country: "Kenya", lat: -4.0435, lng: 39.6682 },
  ],
  "Nigeria": [
    { name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792 },
    { name: "Abuja", country: "Nigeria", lat: 9.0765, lng: 7.3986 },
  ],
  "Morocco": [
    { name: "Casablanca", country: "Morocco", lat: 33.5731, lng: -7.5898 },
    { name: "Marrakech", country: "Morocco", lat: 31.6295, lng: -7.9811 },
    { name: "Rabat", country: "Morocco", lat: 34.0209, lng: -6.8416 },
  ],
  "Peru": [
    { name: "Lima", country: "Peru", lat: -12.0464, lng: -77.0428 },
    { name: "Cusco", country: "Peru", lat: -13.532, lng: -71.9675 },
  ],
  "Chile": [
    { name: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693 },
    { name: "Valparaiso", country: "Chile", lat: -33.0472, lng: -71.6127 },
  ],
  "Colombia": [
    { name: "Bogota", country: "Colombia", lat: 4.711, lng: -74.0721 },
    { name: "Medellin", country: "Colombia", lat: 6.2442, lng: -75.5812 },
  ],
  "Ukraine": [
    { name: "Kyiv", country: "Ukraine", lat: 50.4501, lng: 30.5234 },
    { name: "Odesa", country: "Ukraine", lat: 46.4825, lng: 30.7233 },
  ],
  "Romania": [
    { name: "Bucharest", country: "Romania", lat: 44.4268, lng: 26.1025 },
    { name: "Cluj-Napoca", country: "Romania", lat: 46.7712, lng: 23.6236 },
  ],
  "Czech Republic": [
    { name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
    { name: "Brno", country: "Czech Republic", lat: 49.1951, lng: 16.6068 },
  ],
};

export const GAME_MODES: GameMode[] = [
  {
    id: "world",
    name: "World Atlas",
    description: "Famous cities across all continents",
    cities: CITIES_DATA,
  },
  ...Object.entries(COUNTRY_DATA).map(([country, cities]) => ({
    id: country.toLowerCase().replace(/\s+/g, '-'),
    name: country,
    description: `Discover the cities of ${country}`,
    cities: cities,
  }))
];
