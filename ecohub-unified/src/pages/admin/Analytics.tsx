import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface AnalyticsData {
  userGrowth: {
    labels: string[];
    data: number[];
  };
  roleDistribution: {
    individual: number;
    business: number;
    community: number;
  };
  impactMetrics: {
    carbonSaved: number;
    treesPlanted: number;
    wasteRecycled: number;
    ridesCompleted: number;
    donations: number;
  };
  topCampaigns: {
    id: string;
    title: string;
    raised: number;
    goal: number;
  }[];
  recentTransactions: {
    id: string;
    type: string;
    amount: number;
    date: string;
    user: string;
  }[];
}

const Analytics = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      } else {
        // Set mock data for demonstration
        setAnalytics({
          userGrowth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [120, 185, 241, 312, 398, 456]
          },
          roleDistribution: {
            individual: 350,
            business: 85,
            community: 45
          },
          impactMetrics: {
            carbonSaved: 125000,
            treesPlanted: 8500,
            wasteRecycled: 45000,
            ridesCompleted: 12500,
            donations: 245000
          },
          topCampaigns: [
            { id: '1', title: 'Save the Amazon Rainforest', raised: 75000, goal: 100000 },
            { id: '2', title: 'Ocean Cleanup Initiative', raised: 32000, goal: 50000 },
            { id: '3', title: 'Wildlife Corridor Project', raised: 45000, goal: 75000 }
          ],
          recentTransactions: [
            { id: '1', type: 'Donation', amount: 5000, date: '2024-01-15', user: 'John D.' },
            { id: '2', type: 'Energy Payment', amount: 2500, date: '2024-01-14', user: 'ABC Corp' },
            { id: '3', type: 'Ride Booking', amount: 150, date: '2024-01-14', user: 'Jane S.' }
          ]
        });
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const impactCards = [
    { label: 'Carbon Saved', value: `${((analytics?.impactMetrics.carbonSaved || 0) / 1000).toFixed(1)}T`, icon: '🌱', color: 'from-green-400 to-green-600' },
    { label: 'Trees Planted', value: analytics?.impactMetrics.treesPlanted.toLocaleString() || '0', icon: '🌳', color: 'from-emerald-400 to-emerald-600' },
    { label: 'Waste Recycled', value: `${((analytics?.impactMetrics.wasteRecycled || 0) / 1000).toFixed(1)}T`, icon: '♻️', color: 'from-teal-400 to-teal-600' },
    { label: 'Rides Completed', value: analytics?.impactMetrics.ridesCompleted.toLocaleString() || '0', icon: '🚗', color: 'from-blue-400 to-blue-600' },
    { label: 'Total Donations', value: `₹${((analytics?.impactMetrics.donations || 0) / 1000).toFixed(0)}K`, icon: '💚', color: 'from-purple-400 to-purple-600' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-charcoal text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-gray-300 hover:text-white">
                ← Back
              </Link>
              <div>
                <h1 className="text-2xl font-serif font-semibold">Analytics Dashboard</h1>
                <p className="text-gray-300 text-sm">Platform insights and metrics</p>
              </div>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/20 focus:outline-none"
            >
              <option value="7days" className="text-charcoal">Last 7 days</option>
              <option value="30days" className="text-charcoal">Last 30 days</option>
              <option value="90days" className="text-charcoal">Last 90 days</option>
              <option value="year" className="text-charcoal">This year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {impactCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white`}
            >
              <span className="text-3xl">{card.icon}</span>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
              <p className="text-sm opacity-90">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-charcoal mb-4">User Growth</h2>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics?.userGrowth.data.map((value, index) => {
                const maxValue = Math.max(...(analytics?.userGrowth.data || [1]));
                const height = (value / maxValue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{analytics?.userGrowth.labels[index]}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Role Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-charcoal mb-4">User Distribution</h2>
            <div className="flex items-center justify-center h-48">
              {/* Simple Donut Chart Representation */}
              <div className="relative w-40 h-40">
                {analytics?.roleDistribution && (() => {
                  const total = Object.values(analytics.roleDistribution).reduce((a, b) => a + b, 0);
                  const individuals = (analytics.roleDistribution.individual / total) * 100;
                  const businesses = (analytics.roleDistribution.business / total) * 100;
                  const communities = (analytics.roleDistribution.community / total) * 100;
                  
                  return (
                    <div className="absolute inset-0">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                        <circle 
                          cx="50" cy="50" r="40" fill="none" 
                          stroke="#3b82f6" strokeWidth="20"
                          strokeDasharray={`${individuals * 2.51} 251`}
                        />
                        <circle 
                          cx="50" cy="50" r="40" fill="none" 
                          stroke="#8b5cf6" strokeWidth="20"
                          strokeDasharray={`${businesses * 2.51} 251`}
                          strokeDashoffset={`-${individuals * 2.51}`}
                        />
                        <circle 
                          cx="50" cy="50" r="40" fill="none" 
                          stroke="#10b981" strokeWidth="20"
                          strokeDasharray={`${communities * 2.51} 251`}
                          strokeDashoffset={`-${(individuals + businesses) * 2.51}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-charcoal">{total}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Individual</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Business</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Community</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-charcoal mb-4">Top Campaigns</h2>
            <div className="space-y-4">
              {analytics?.topCampaigns.map((campaign, index) => {
                const progress = (campaign.raised / campaign.goal) * 100;
                return (
                  <div key={campaign.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-charcoal">{index + 1}. {campaign.title}</span>
                      <span className="text-sm text-primary-600 font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>₹{campaign.raised.toLocaleString()} raised</span>
                      <span>Goal: ₹{campaign.goal.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-charcoal mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {analytics?.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      {transaction.type === 'Donation' && '💚'}
                      {transaction.type === 'Energy Payment' && '⚡'}
                      {transaction.type === 'Ride Booking' && '🚗'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">{transaction.type}</p>
                      <p className="text-xs text-gray-500">{transaction.user} • {transaction.date}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary-600">₹{transaction.amount}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
