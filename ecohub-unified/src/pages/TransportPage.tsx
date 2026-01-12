import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GreenTransportMap from '../components/GreenTransportMap';
import { MapPin, Zap, Bike } from 'lucide-react';

interface Vehicle {
  id: string;
  type: string;
  name: string;
  basePrice: number;
  pricePerKm: number;
  co2Reduction: string;
  image: string;
  eta: string;
}

interface TransportStats {
  totalRides: string;
  co2Saved: string;
  activeUsers: string;
  routesCovered: number;
}

const TransportPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<TransportStats | null>(null);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState(0);

  const vehicles: Vehicle[] = [
    {
      id: '1',
      type: 'bike',
      name: 'Eco Bike',
      basePrice: 25,
      pricePerKm: 8,
      co2Reduction: '95%',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80',
      eta: '2 min'
    },
    {
      id: '2',
      type: 'electric-auto',
      name: 'E-Auto',
      basePrice: 40,
      pricePerKm: 12,
      co2Reduction: '90%',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80',
      eta: '5 min'
    },
    {
      id: '3',
      type: 'electric-car',
      name: 'E-Car',
      basePrice: 80,
      pricePerKm: 15,
      co2Reduction: '85%',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80',
      eta: '4 min'
    },
    {
      id: '4',
      type: 'electric-bus',
      name: 'E-Bus',
      basePrice: 20,
      pricePerKm: 3,
      co2Reduction: '80%',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80',
      eta: '8 min'
    },
    {
      id: '5',
      type: 'metro',
      name: 'Metro',
      basePrice: 15,
      pricePerKm: 2,
      co2Reduction: '92%',
      image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&q=80',
      eta: '10 min'
    }
  ];

  useEffect(() => {
    fetch('/api/transport/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!pickup.trim() || !destination.trim()) return;
    
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate distance calculation
    setEstimatedDistance(Math.floor(Math.random() * 15) + 3);
    setIsSearching(false);
    setShowVehicles(true);
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedVehicle(vehicle);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsBooking(false);
    setBookingConfirmed(true);
  };

  const calculateFare = (vehicle: Vehicle) => {
    return vehicle.basePrice + (vehicle.pricePerKm * estimatedDistance);
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&q=80';
      case 'electric-auto': return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&q=80';
      case 'electric-car': return 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&q=80';
      case 'electric-bus': return 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=100&q=80';
      case 'metro': return 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=100&q=80';
      default: return 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&q=80';
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero with Booking Form */}
      <div className="relative min-h-[500px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80" 
          alt="City Transport"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-5xl font-serif font-semibold text-white mb-4">EcoRide</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Book eco-friendly rides instantly. Save money, save the planet.
            </p>
          </motion.div>

          {/* Rapido-style Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl elegant-shadow p-6"
          >
            <div className="space-y-4">
              {/* Pickup Location */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup location"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 text-charcoal placeholder-gray-400"
                />
              </div>

              {/* Connector Line */}
              <div className="flex items-center pl-5">
                <div className="w-0.5 h-6 bg-gray-200"></div>
              </div>

              {/* Destination */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 text-charcoal placeholder-gray-400"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isSearching || !pickup.trim() || !destination.trim()}
                className="w-full py-4 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Finding rides...
                  </span>
                ) : (
                  'Find Eco Rides'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Vehicle Selection */}
      <AnimatePresence>
        {showVehicles && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 py-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-charcoal">Choose Your Ride</h2>
                <p className="text-gray-500">{pickup} → {destination} • {estimatedDistance} km</p>
              </div>
              <button 
                onClick={() => setShowVehicles(false)}
                className="text-gray-500 hover:text-charcoal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectVehicle(vehicle)}
                  className="bg-white rounded-2xl elegant-shadow p-4 cursor-pointer hover:shadow-xl hover:border-primary-500 border-2 border-transparent transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={getVehicleIcon(vehicle.type)} 
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-charcoal">{vehicle.name}</h3>
                      <p className="text-sm text-gray-500">{vehicle.eta} away</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          {vehicle.co2Reduction} CO₂ saved
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-serif font-semibold text-charcoal">₹{calculateFare(vehicle)}</p>
                      <p className="text-xs text-gray-400">₹{vehicle.pricePerKm}/km</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Section */}
      {stats && !showVehicles && (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl elegant-shadow p-6 text-center"
            >
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.totalRides}</div>
              <div className="text-gray-500 text-sm mt-1">Eco Rides</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl elegant-shadow p-6 text-center"
            >
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.co2Saved}</div>
              <div className="text-gray-500 text-sm mt-1">CO₂ Saved</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl elegant-shadow p-6 text-center"
            >
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.activeUsers}</div>
              <div className="text-gray-500 text-sm mt-1">Active Riders</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl elegant-shadow p-6 text-center"
            >
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.routesCovered}</div>
              <div className="text-gray-500 text-sm mt-1">Cities Covered</div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Vehicle Fleet Showcase */}
      {!showVehicles && (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6 text-center">Our Eco Fleet</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl elegant-shadow overflow-hidden text-center group hover:shadow-xl transition-shadow"
              >
                <div className="h-24 overflow-hidden">
                  <img 
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-charcoal text-sm">{vehicle.name}</h3>
                  <p className="text-xs text-primary-600">From ₹{vehicle.basePrice}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Green Transport Map Section */}
      {!showVehicles && (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-serif font-semibold text-charcoal mb-2 text-center">
              Find Green Transport Near You
            </h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-6">
              Discover EV charging stations, bike sharing locations, and public transit options in your area.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              <div className="flex items-center justify-center gap-2 bg-green-50 px-4 py-3 rounded-xl">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">EV Charging</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-blue-50 px-4 py-3 rounded-xl">
                <Bike className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Bike Share</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-yellow-50 px-4 py-3 rounded-xl">
                <MapPin className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">Transit</span>
              </div>
            </div>
          </motion.div>

          <GreenTransportMap />
        </div>
      )}

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {showBookingModal && selectedVehicle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
            onClick={() => !isBooking && !bookingConfirmed && setShowBookingModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md overflow-hidden"
            >
              {bookingConfirmed ? (
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h2 className="text-2xl font-serif font-semibold text-charcoal mb-2">Ride Confirmed!</h2>
                  <p className="text-gray-500 mb-6">
                    Your {selectedVehicle.name} is on its way. ETA: {selectedVehicle.eta}
                  </p>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
                    <div className="flex items-center space-x-3 mb-3">
                      <img src={selectedVehicle.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-medium text-charcoal">{selectedVehicle.name}</p>
                        <p className="text-sm text-gray-500">Driver: Ramesh K.</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><span className="text-green-500">●</span> {pickup}</p>
                      <p className="ml-1.5 border-l border-gray-300 h-4"></p>
                      <p><span className="text-red-500">●</span> {destination}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-primary-50 rounded-2xl mb-6">
                    <span className="text-gray-600">Total Fare</span>
                    <span className="text-2xl font-serif font-semibold text-primary-600">₹{calculateFare(selectedVehicle)}</span>
                  </div>

                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setBookingConfirmed(false);
                      setShowVehicles(false);
                      setPickup('');
                      setDestination('');
                    }}
                    className="w-full py-4 bg-charcoal text-white rounded-2xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-serif font-semibold text-charcoal">Confirm Booking</h2>
                      <button 
                        onClick={() => setShowBookingModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Vehicle Info */}
                    <div className="flex items-center space-x-4 mb-6">
                      <img 
                        src={selectedVehicle.image} 
                        alt={selectedVehicle.name}
                        className="w-20 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-charcoal">{selectedVehicle.name}</h3>
                        <p className="text-sm text-gray-500">{selectedVehicle.eta} away</p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          {selectedVehicle.co2Reduction} CO₂ saved
                        </span>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-4">
                            <p className="text-xs text-gray-400">PICKUP</p>
                            <p className="font-medium text-charcoal">{pickup}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">DROP</p>
                            <p className="font-medium text-charcoal">{destination}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fare Breakdown */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Base Fare</span>
                        <span className="text-charcoal">₹{selectedVehicle.basePrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Distance ({estimatedDistance} km × ₹{selectedVehicle.pricePerKm})</span>
                        <span className="text-charcoal">₹{selectedVehicle.pricePerKm * estimatedDistance}</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold">
                        <span className="text-charcoal">Total</span>
                        <span className="text-primary-600 text-xl font-serif">₹{calculateFare(selectedVehicle)}</span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-xl mb-6">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">{user?.name || 'Guest'}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmBooking}
                      disabled={isBooking}
                      className="w-full py-4 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      {isBooking ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Booking...
                        </span>
                      ) : (
                        `Confirm & Pay ₹${calculateFare(selectedVehicle)}`
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransportPage;
