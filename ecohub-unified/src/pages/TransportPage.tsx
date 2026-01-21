import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, Bike, Bus, Train, Navigation, Leaf, Search, Clock, Star, Loader2, X, LocateFixed, Route, ExternalLink } from 'lucide-react';

interface TransportOption {
  id: string;
  name: string;
  type: 'ev' | 'bike' | 'transit';
  address: string;
  distance: string;
  rating: number;
  status: 'available' | 'busy' | 'closed';
  features: string[];
  hours?: string;
  image: string;
  location: { lat: number; lng: number };
}

const INDIAN_CITIES: Record<string, { lat: number; lng: number }> = {
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
};

// Mock transport data for different cities
const getMockTransportOptions = (city: string): TransportOption[] => {
  const baseOptions: TransportOption[] = [
    {
      id: '1',
      name: 'Tata Power EV Charging Hub',
      type: 'ev',
      address: `Phoenix Mall, ${city}`,
      distance: '1.2 km',
      rating: 4.5,
      status: 'available',
      features: ['Fast Charging', 'CCS2', 'CHAdeMO', '24/7'],
      hours: 'Open 24 hours',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80',
      location: INDIAN_CITIES[city] || INDIAN_CITIES.Chennai,
    },
    {
      id: '2',
      name: 'ATHER Grid Station',
      type: 'ev',
      address: `Express Avenue, ${city}`,
      distance: '2.8 km',
      rating: 4.8,
      status: 'available',
      features: ['Ather Fast Charge', 'Free for Owners', 'Parking'],
      hours: '10:00 AM - 10:00 PM',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      location: INDIAN_CITIES[city] || INDIAN_CITIES.Chennai,
    },
    {
      id: '3',
      name: 'Bounce Bike Station',
      type: 'bike',
      address: `Central Bus Stand, ${city}`,
      distance: '0.8 km',
      rating: 4.2,
      status: 'available',
      features: ['Electric Bikes', 'App Unlock', '₹5/min'],
      hours: '6:00 AM - 11:00 PM',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
      location: INDIAN_CITIES[city] || INDIAN_CITIES.Chennai,
    },
    {
      id: '4',
      name: 'Yulu Zone',
      type: 'bike',
      address: `Main Beach Road, ${city}`,
      distance: '3.5 km',
      rating: 4.0,
      status: 'available',
      features: ['Electric Cycles', '₹10 Unlock', '₹1/min'],
      hours: '5:00 AM - 10:00 PM',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=80',
      location: INDIAN_CITIES[city] || INDIAN_CITIES.Chennai,
    },
    {
      id: '5',
      name: `${city} Central Metro Station`,
      type: 'transit',
      address: `Central District, ${city}`,
      distance: '4.2 km',
      rating: 4.6,
      status: 'available',
      features: ['Metro', 'Bus Interchange', 'Wheelchair Access'],
      hours: '5:00 AM - 11:00 PM',
      image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&q=80',
      location: INDIAN_CITIES[city] || INDIAN_CITIES.Chennai,
    },
    {
      id: '6',
      name: `${city} Bus Terminal`,
      type: 'transit',
      address: `Highway Junction, ${city}`,
      distance: '6.8 km',
      rating: 4.1,
      status: 'available',
      features: ['Bus Terminal', 'Long Distance', 'Food Court'],
      hours: '24 hours',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
      location: INDIAN_CITIES[city] || INDIAN_CITIES.Chennai,
    },
    {
      id: '7',
      name: 'Reliance BP EV Station',
      type: 'ev',
      address: `Highway Toll Plaza, ${city}`,
      distance: '8.5 km',
      rating: 4.3,
      status: 'busy',
      features: ['DC Fast Charging', 'Multiple Ports', 'Cafe'],
      hours: 'Open 24 hours',
      image: 'https://images.unsplash.com/photo-1647500662061-4c3b6c95a043?w=400&q=80',
      location: INDIAN_CITIES[city] || INDIAN_CITIES.Chennai,
    },
    {
      id: '8',
      name: 'Rapido Bike Stand',
      type: 'bike',
      address: `Metro Station Exit, ${city}`,
      distance: '5.2 km',
      rating: 4.4,
      status: 'available',
      features: ['Bike Taxi', 'App Booking', 'Quick Rides'],
      hours: '6:00 AM - 12:00 AM',
      image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400&q=80',
      location: INDIAN_CITIES[city] || INDIAN_CITIES.Chennai,
    },
  ];
  return baseOptions;
};

const TransportPage = () => {
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ev' | 'bike' | 'transit'>('all');
  const [selectedOption, setSelectedOption] = useState<TransportOption | null>(null);
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Pickup & Destination states
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; co2Saved: string } | null>(null);
  const [travelMode, setTravelMode] = useState<'transit' | 'bike' | 'walk'>('transit');

  // Load transport options for selected city
  useEffect(() => {
    setTransportOptions(getMockTransportOptions(selectedCity));
  }, [selectedCity]);

  // Handle city change
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setTransportOptions(getMockTransportOptions(city));
  };

  // Find nearest stations
  const findNearest = () => {
    setIsSearching(true);
    setTimeout(() => {
      setTransportOptions(getMockTransportOptions(selectedCity));
      setIsSearching(false);
    }, 1000);
  };

  // Calculate route (mock)
  const calculateRoute = () => {
    if (!pickup || !destination) return;
    
    setIsSearching(true);
    setTimeout(() => {
      // Mock route calculation
      const distances: Record<string, number> = { transit: 12, bike: 10, walk: 8 };
      const durations: Record<string, string> = { transit: '35 mins', bike: '25 mins', walk: '1 hr 20 mins' };
      const co2: Record<string, string> = { transit: '1.8 kg', bike: '2.5 kg', walk: '2.5 kg' };
      
      setRouteInfo({
        distance: `${distances[travelMode]} km`,
        duration: durations[travelMode],
        co2Saved: co2[travelMode],
      });
      setIsSearching(false);
    }, 1000);
  };

  // Open Google Maps directions
  const openDirections = (option: TransportOption) => {
    const origin = pickup || selectedCity;
    const dest = `${option.name}, ${option.address}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=${travelMode === 'bike' ? 'bicycling' : travelMode === 'walk' ? 'walking' : 'transit'}`;
    window.open(url, '_blank');
  };

  // Clear route
  const clearRoute = () => {
    setPickup('');
    setDestination('');
    setRouteInfo(null);
  };

  useEffect(() => {
    if (pickup && destination) {
      calculateRoute();
    }
  }, [pickup, destination, travelMode]);

  const filteredOptions = transportOptions.filter(option => {
    const matchesFilter = activeFilter === 'all' || option.type === activeFilter;
    const matchesSearch = option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          option.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ev': return <Zap className="w-5 h-5" />;
      case 'bike': return <Bike className="w-5 h-5" />;
      case 'transit': return <Bus className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ev': return 'bg-green-100 text-green-600';
      case 'bike': return 'bg-blue-100 text-blue-600';
      case 'transit': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80" 
          alt="Green Transport"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-charcoal/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-10 h-10 text-primary-400" />
                <Train className="w-10 h-10 text-primary-400" />
              </div>
              <h1 className="text-5xl font-serif font-semibold text-white mb-4">Green Transport</h1>
              <p className="text-xl text-gray-200 max-w-2xl">
                Find EV charging stations, bike sharing, and public transit options near you. Travel sustainably.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl elegant-shadow p-6 text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-serif font-semibold text-primary-600">156</div>
            <div className="text-gray-500 text-sm mt-1">EV Stations</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl elegant-shadow p-6 text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bike className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-serif font-semibold text-primary-600">89</div>
            <div className="text-gray-500 text-sm mt-1">Bike Stations</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl elegant-shadow p-6 text-center"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bus className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-serif font-semibold text-primary-600">45</div>
            <div className="text-gray-500 text-sm mt-1">Transit Hubs</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl elegant-shadow p-6 text-center"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-3xl font-serif font-semibold text-primary-600">2.4M</div>
            <div className="text-gray-500 text-sm mt-1">CO₂ Saved (tons)</div>
          </motion.div>
        </div>

        {/* Route Planner Card */}
        <div className="bg-white rounded-2xl elegant-shadow p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Route className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-serif font-semibold text-charcoal">Plan Your Green Route</h2>
          </div>

          <div className="space-y-4">
            {/* Pickup & Destination Inputs */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 space-y-3">
                {/* Pickup */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter pickup location (e.g., T Nagar, Chennai)"
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 text-charcoal placeholder-gray-400"
                  />
                  <button
                    onClick={() => setPickup(selectedCity + ' Central')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-lg transition"
                    title="Use city center"
                  >
                    <LocateFixed className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Connector Line */}
                <div className="flex items-center pl-5">
                  <div className="w-0.5 h-4 bg-gray-200"></div>
                </div>

                {/* Destination */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination (e.g., Airport, Chennai)"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 text-charcoal placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Right Side - City & Actions */}
              <div className="flex flex-col gap-3 lg:w-64">
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="px-4 py-3.5 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 text-charcoal font-medium"
                >
                  {Object.keys(INDIAN_CITIES).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>

                <button
                  onClick={findNearest}
                  disabled={isSearching}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      Find Nearest
                    </>
                  )}
                </button>

                {(pickup || destination) && (
                  <button
                    onClick={clearRoute}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Travel Mode Selector */}
            {(pickup || destination) && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-gray-500">Travel by:</span>
                <div className="flex gap-2">
                  {[
                    { mode: 'transit' as const, label: 'Transit', icon: Bus },
                    { mode: 'bike' as const, label: 'Bike', icon: Bike },
                    { mode: 'walk' as const, label: 'Walk', icon: MapPin },
                  ].map(({ mode, label, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setTravelMode(mode)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        travelMode === mode
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Route Info */}
            {routeInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200"
              >
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="font-semibold text-charcoal">{routeInfo.distance}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold text-charcoal">{routeInfo.duration}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600">CO₂ Saved</p>
                      <p className="font-bold text-green-700">{routeInfo.co2Saved}</p>
                    </div>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode === 'bike' ? 'bicycling' : travelMode === 'walk' ? 'walking' : 'transit'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition ml-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </motion.div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Options', icon: MapPin },
              { id: 'ev', label: 'EV Charging', icon: Zap },
              { id: 'bike', label: 'Bike Share', icon: Bike },
              { id: 'transit', label: 'Public Transit', icon: Bus },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id as typeof activeFilter)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeFilter === id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stations by name or location..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-charcoal placeholder-gray-400"
          />
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-semibold text-charcoal mb-2">
            {activeFilter === 'all' ? 'All Green Transport Options' : 
             activeFilter === 'ev' ? 'EV Charging Stations' :
             activeFilter === 'bike' ? 'Bike Sharing Stations' : 'Public Transit Hubs'}
          </h2>
          <p className="text-gray-500">{filteredOptions.length} options found in {selectedCity}</p>
        </div>

        {/* Transport Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedOption(option)}
              className="bg-white rounded-2xl elegant-shadow overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={option.image}
                  alt={option.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getTypeColor(option.type)}`}>
                    {getTypeIcon(option.type)}
                    {option.type === 'ev' ? 'EV Charging' : option.type === 'bike' ? 'Bike Share' : 'Transit'}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(option.status)}`}></span>
                  <span className="text-xs text-white bg-black/50 px-2 py-0.5 rounded-full capitalize">{option.status}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-serif font-semibold text-charcoal mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {option.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{option.address}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-charcoal">{option.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-primary-600 font-medium">
                    <Navigation className="w-4 h-4" />
                    <span>{option.distance}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5">
                  {option.features.slice(0, 2).map((feature, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-serif font-semibold mb-2">Go Green, Save the Planet</h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Every eco-friendly trip reduces carbon emissions. Choose sustainable transport and be part of the solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={findNearest}
              className="bg-white text-primary-600 px-8 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Find Nearest Station
            </button>
            <button className="bg-primary-400 text-white px-8 py-3 rounded-full font-medium hover:bg-primary-300 transition-colors flex items-center justify-center gap-2">
              <Leaf className="w-5 h-5" />
              Calculate CO₂ Savings
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOption(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl elegant-shadow w-full max-w-lg overflow-hidden"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={selectedOption.image}
                  alt={selectedOption.name}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setSelectedOption(null)}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getTypeColor(selectedOption.type)}`}>
                    {getTypeIcon(selectedOption.type)}
                    {selectedOption.type === 'ev' ? 'EV Charging' : selectedOption.type === 'bike' ? 'Bike Share' : 'Transit'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-charcoal">{selectedOption.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedOption.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-charcoal">{selectedOption.rating}</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Navigation className="w-4 h-4" />
                      Distance
                    </div>
                    <p className="font-semibold text-charcoal">{selectedOption.distance}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      Hours
                    </div>
                    <p className="font-semibold text-charcoal text-sm">{selectedOption.hours || 'Hours vary'}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Features & Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOption.features.map((feature, i) => (
                      <span key={i} className="text-sm bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-xl">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(selectedOption.status)}`}></span>
                  <span className="text-green-700 font-medium capitalize">{selectedOption.status}</span>
                  <span className="text-green-600 text-sm">- Ready for use</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedOption(null);
                      setDestination(selectedOption.name + ', ' + selectedOption.address);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    Set as Destination
                  </button>
                  <button
                    onClick={() => openDirections(selectedOption)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransportPage;
