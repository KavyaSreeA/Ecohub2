import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
  conservation: {
    campaigns: number;
    raised: number;
    events: number;
  };
  energy: {
    totalCapacity: string;
    co2Saved: string;
    homesSupplied: string;
    projectsActive: number;
  };
  transport: {
    totalRides: string;
    co2Saved: string;
    activeUsers: string;
    routesCovered: number;
  };
  waste: {
    totalListings: number;
    wasteExchanged: string;
    co2Prevented: string;
    activeSellers: number;
  };
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated, authLoading, navigate]);

  const serviceCards = [
    {
      title: 'Conservation',
      icon: '🌲',
      path: '/conservation',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
      stats: stats ? [
        { label: 'Campaigns', value: stats.conservation.campaigns },
        { label: 'Events', value: stats.conservation.events },
        { label: 'Raised', value: `$${(stats.conservation.raised / 1000).toFixed(0)}K` }
      ] : []
    },
    {
      title: 'Renewable Energy',
      icon: '⚡',
      path: '/energy',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80',
      stats: stats ? [
        { label: 'Capacity', value: stats.energy.totalCapacity },
        { label: 'CO₂ Saved', value: stats.energy.co2Saved },
        { label: 'Homes', value: stats.energy.homesSupplied }
      ] : []
    },
    {
      title: 'Transport',
      icon: '🚌',
      path: '/transport',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
      stats: stats ? [
        { label: 'Rides', value: stats.transport.totalRides },
        { label: 'CO₂ Saved', value: stats.transport.co2Saved },
        { label: 'Routes', value: stats.transport.routesCovered }
      ] : []
    },
    {
      title: 'Waste Exchange',
      icon: '♻️',
      path: '/waste',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80',
      stats: stats ? [
        { label: 'Listings', value: stats.waste.totalListings },
        { label: 'Exchanged', value: stats.waste.wasteExchanged },
        { label: 'CO₂ Prevented', value: stats.waste.co2Prevented }
      ] : []
    }
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-xl text-gray-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif font-semibold text-charcoal"
          >
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </motion.h1>
          <p className="text-gray-500 mt-2">Your unified view of all sustainability services</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl elegant-shadow p-6"
          >
            <div className="text-3xl font-serif font-semibold text-primary-600">2.5M</div>
            <div className="text-gray-500 text-sm">Total CO₂ Saved (tons)</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl elegant-shadow p-6"
          >
            <div className="text-3xl font-serif font-semibold text-primary-600">4</div>
            <div className="text-gray-500 text-sm">Active Services</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl elegant-shadow p-6"
          >
            <div className="text-3xl font-serif font-semibold text-primary-600">100K+</div>
            <div className="text-gray-500 text-sm">Community Members</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl elegant-shadow p-6"
          >
            <div className="text-3xl font-serif font-semibold text-primary-600">1,200+</div>
            <div className="text-gray-500 text-sm">Active Projects</div>
          </motion.div>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {serviceCards.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={service.path}>
                <div className="bg-white rounded-2xl elegant-shadow overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <span className="text-3xl mr-3">{service.icon}</span>
                        <span className="text-2xl font-serif font-semibold">{service.title}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      {service.stats.map(stat => (
                        <div key={stat.label} className="text-center">
                          <div className="text-2xl font-serif font-semibold text-charcoal">{stat.value}</div>
                          <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-end text-primary-600 group-hover:text-primary-700">
                      <span className="text-sm font-medium">View Details</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Platform Status */}
        <div className="mt-10 bg-white rounded-2xl elegant-shadow p-8">
          <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Platform Status</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-charcoal">Conservation API</p>
                <p className="text-sm text-gray-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-charcoal">Energy API</p>
                <p className="text-sm text-gray-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-charcoal">Transport API</p>
                <p className="text-sm text-gray-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-charcoal">Waste API</p>
                <p className="text-sm text-gray-500">Operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <Link to="/conservation" className="bg-primary-500 text-white rounded-2xl p-6 hover:bg-primary-600 transition-colors">
            <h3 className="text-xl font-serif font-semibold mb-2">Start a Campaign</h3>
            <p className="text-primary-100">Launch a new conservation initiative</p>
          </Link>
          <Link to="/energy" className="bg-charcoal text-white rounded-2xl p-6 hover:bg-gray-800 transition-colors">
            <h3 className="text-xl font-serif font-semibold mb-2">Track Energy</h3>
            <p className="text-gray-300">Monitor your renewable energy usage</p>
          </Link>
          <Link to="/waste" className="border-2 border-primary-500 text-primary-600 rounded-2xl p-6 hover:bg-primary-50 transition-colors">
            <h3 className="text-xl font-serif font-semibold mb-2">Exchange Materials</h3>
            <p className="text-gray-500">List or find recyclable materials</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
