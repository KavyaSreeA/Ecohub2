import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sun, Wind, Droplets, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from '../components/WeatherWidget';

// Helper function to render energy source icons
const getEnergyIcon = (iconName: string) => {
  const iconClass = "w-8 h-8";
  switch (iconName) {
    case 'sun': return <Sun className={`${iconClass} text-yellow-500`} />;
    case 'wind': return <Wind className={`${iconClass} text-blue-500`} />;
    case 'droplets': return <Droplets className={`${iconClass} text-blue-400`} />;
    case 'flame': return <Flame className={`${iconClass} text-orange-500`} />;
    default: return <Zap className={`${iconClass} text-yellow-500`} />;
  }
};

interface EnergySource {
  id: string;
  name: string;
  icon: string;
  description: string;
  capacity: string;
  growth: string;
}

interface EnergyStats {
  totalCapacity: string;
  co2Saved: string;
  homesSupplied: string;
  projectsActive: number;
}

interface UserEnergyData {
  enrolled: boolean;
  enrolledSources: string[];
  totalSavings: number;
  co2Reduced: number;
  monthlyProduction: number;
}

const EnergyPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [sources, setSources] = useState<EnergySource[]>([]);
  const [stats, setStats] = useState<EnergyStats | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [userEnergyData, setUserEnergyData] = useState<UserEnergyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/energy/sources')
        .then(async r => {
          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }
          const text = await r.text();
          if (!text) {
            return [];
          }
          return JSON.parse(text);
        })
        .then(data => Array.isArray(data) ? data : [])
        .catch(err => {
          console.error('Error fetching energy sources:', err);
          return [];
        }),
      fetch('/api/energy/stats')
        .then(async r => {
          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }
          const text = await r.text();
          if (!text) {
            return null;
          }
          return JSON.parse(text);
        })
        .then(data => data)
        .catch(err => {
          console.error('Error fetching energy stats:', err);
          return null;
        })
    ]).then(([sourcesData, statsData]) => {
      setSources(Array.isArray(sourcesData) ? sourcesData : []);
      setStats(statsData);
    });
  }, []);

  const handleGetStarted = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    // Simulate fetching user energy data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on registration
    setUserEnergyData({
      enrolled: true,
      enrolledSources: ['Solar Power', 'Wind Energy'],
      totalSavings: 45000,
      co2Reduced: 2.4,
      monthlyProduction: 850
    });
    
    setIsLoading(false);
    setShowResultsModal(true);
  };

  // Energy source images
  const sourceImages: Record<string, string> = {
    'Solar Power': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80',
    'Wind Energy': 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400&q=80',
    'Hydroelectric': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80',
    'Geothermal': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80" 
          alt="Solar Panels"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-charcoal/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Zap className="w-12 h-12 text-yellow-400 mb-4" />
              <h1 className="text-5xl font-serif font-semibold text-white mb-4">Renewable Energy</h1>
              <p className="text-xl text-gray-200 max-w-2xl">
                Track clean energy projects powering homes and businesses worldwide with solar, wind, and hydro.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Weather Widget & Stats Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Weather Widget - Takes 1 column */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-serif font-semibold text-charcoal mb-4">Solar Weather Forecast</h2>
            <WeatherWidget />
          </div>
          
          {/* Stats - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-serif font-semibold text-charcoal mb-4">Energy Statistics</h2>
            {stats && (
              <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl elegant-shadow p-6 text-center"
            >
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.totalCapacity}</div>
              <div className="text-gray-500 text-sm mt-1">Total Capacity</div>
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
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.homesSupplied}</div>
              <div className="text-gray-500 text-sm mt-1">Homes Powered</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl elegant-shadow p-6 text-center"
            >
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.projectsActive}</div>
              <div className="text-gray-500 text-sm mt-1">Active Projects</div>
            </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* Energy Sources */}
        <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Energy Sources</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {Array.isArray(sources) && sources.length > 0 ? (
            sources.map((source, index) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl elegant-shadow overflow-hidden group hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-32 overflow-hidden">
                <img 
                  src={sourceImages[source.name] || 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80'}
                  alt={source.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="mb-2">{getEnergyIcon(source.icon)}</div>
                <h3 className="text-lg font-serif font-semibold text-charcoal">{source.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{source.description}</p>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-600">{source.capacity}</span>
                  <span className="text-primary-600 font-medium">{source.growth}</span>
                </div>
                <button
                  onClick={() => navigate('/energy/contact', { state: { source } })}
                  className="w-full py-2.5 bg-primary-500 text-white rounded-full text-sm hover:bg-primary-600 transition-colors font-medium"
                >
                  Contact Company
                </button>
              </div>
            </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No energy sources available at the moment.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-serif font-semibold mb-2">Start Your Clean Energy Journey</h3>
          <p className="text-primary-100 mb-6">Calculate your energy savings and find the best renewable options for your home.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/energy/calculator')}
              className="bg-yellow-400 text-charcoal px-8 py-3 rounded-full font-medium hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2"
            >
              <Sun className="w-5 h-5" />
              <span>Solar Calculator</span>
            </button>
            <button 
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-white text-primary-600 px-8 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors disabled:opacity-50"
            >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Get Started →'
            )}
          </button>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      <AnimatePresence>
        {showResultsModal && userEnergyData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowResultsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl elegant-shadow w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-semibold text-charcoal">Your Energy Dashboard</h2>
                  <button 
                    onClick={() => setShowResultsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-3 p-4 bg-primary-50 rounded-xl mb-6">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-serif font-semibold text-green-600">₹{userEnergyData.totalSavings.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-gray-500">Total Savings</p>
                  </div>
                  <div className="bg-primary-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-serif font-semibold text-primary-600">{userEnergyData.co2Reduced} tons</p>
                    <p className="text-sm text-gray-500">CO₂ Reduced</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-serif font-semibold text-yellow-600">{userEnergyData.monthlyProduction} kWh</p>
                    <p className="text-sm text-gray-500">Monthly Production</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-serif font-semibold text-purple-600">{userEnergyData.enrolledSources.length}</p>
                    <p className="text-sm text-gray-500">Active Sources</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-charcoal mb-3">Your Enrolled Energy Sources</h3>
                  <div className="space-y-2">
                    {userEnergyData.enrolledSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="font-medium text-charcoal">{source}</span>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Active</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowResultsModal(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowResultsModal(false);
                      navigate('/dashboard');
                    }}
                    className="flex-1 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-medium"
                  >
                    View Dashboard
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

export default EnergyPage;
