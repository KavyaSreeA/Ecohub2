import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  pendingApprovals: number;
  totalRevenue: number;
  carbonSaved: number;
  roleDistribution: {
    individual: number;
    business: number;
    community: number;
  };
  recentActivity: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }[];
}

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'bg-blue-500', link: '/admin/users' },
    { label: 'Active Users', value: stats?.activeUsers || 0, icon: '✅', color: 'bg-green-500' },
    { label: 'New This Month', value: stats?.newUsersThisMonth || 0, icon: '📈', color: 'bg-purple-500' },
    { label: 'Pending Approvals', value: stats?.pendingApprovals || 0, icon: '⏳', color: 'bg-orange-500', link: '/admin/approvals' },
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: 'bg-emerald-500' },
    { label: 'Carbon Saved', value: `${(stats?.carbonSaved || 0).toLocaleString()} kg`, icon: '🌱', color: 'bg-teal-500' },
  ];

  const quickActions = [
    { label: 'User Management', icon: '👥', link: '/admin/users', description: 'Manage all user accounts' },
    { label: 'Content Moderation', icon: '📝', link: '/admin/content', description: 'Review pending content' },
    { label: 'Analytics', icon: '📊', link: '/admin/analytics', description: 'View detailed reports' },
    { label: 'Approvals', icon: '✓', link: '/admin/approvals', description: 'Approve business/community accounts' },
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
      <div className="bg-charcoal text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-semibold">Admin Dashboard</h1>
              <p className="text-gray-300 mt-1">Welcome back! Here's what's happening on EcoHub.</p>
            </div>
            <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <span>🌍</span>
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              {stat.link ? (
                <Link to={stat.link} className="block">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-2xl font-semibold text-charcoal mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {stat.icon}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-2xl font-semibold text-charcoal mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Role Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-charcoal mb-4">User Distribution by Role</h2>
            <div className="space-y-4">
              {stats?.roleDistribution && Object.entries(stats.roleDistribution).map(([role, count]) => {
                const total = Object.values(stats.roleDistribution).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                const colors: Record<string, string> = {
                  individual: 'bg-blue-500',
                  business: 'bg-purple-500',
                  community: 'bg-green-500'
                };
                return (
                  <div key={role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-600">{role}</span>
                      <span className="font-medium">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[role] || 'bg-gray-500'} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-charcoal mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.link}
                  className="p-4 border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <span className="text-2xl mb-2 block">{action.icon}</span>
                  <h3 className="font-medium text-charcoal group-hover:text-primary-600">{action.label}</h3>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-charcoal">Recent Activity</h2>
            <Link to="/admin/logs" className="text-primary-600 text-sm hover:text-primary-700">
              View all →
            </Link>
          </div>
          
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-lg mr-3">
                    {activity.type === 'user_registered' && '👤'}
                    {activity.type === 'campaign_created' && '🎯'}
                    {activity.type === 'donation' && '💚'}
                    {activity.type === 'content_approved' && '✅'}
                    {!['user_registered', 'campaign_created', 'donation', 'content_approved'].includes(activity.type) && '📌'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-charcoal">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">📋</span>
              <p>No recent activity</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
