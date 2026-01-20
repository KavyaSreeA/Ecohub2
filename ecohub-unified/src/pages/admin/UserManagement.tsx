import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'individual' | 'business' | 'community' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  impactScore?: number;
  businessProfile?: {
    businessName: string;
    isVerified: boolean;
  };
  communityProfile?: {
    organizationName: string;
    isVerified: boolean;
  };
}

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters.role, filters.status, pagination.page]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
        setPagination(prev => ({ ...prev, total: data.data.total }));
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleSuspendUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Admin action' })
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setSelectedUser(null);
      } else {
        alert(data.message || 'Failed to suspend user');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateUser = async (userId: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setSelectedUser(null);
      } else {
        alert(data.message || 'Failed to activate user');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      individual: 'bg-blue-100 text-blue-700',
      business: 'bg-purple-100 text-purple-700',
      community: 'bg-green-100 text-green-700',
      admin: 'bg-red-100 text-red-700'
    };
    return styles[role] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

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
                <h1 className="text-2xl font-serif font-semibold">User Management</h1>
                <p className="text-gray-300 text-sm">Manage all user accounts</p>
              </div>
            </div>
            <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
              {pagination.total} total users
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Roles</option>
                <option value="individual">Individual</option>
                <option value="business">Business</option>
                <option value="community">Community</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-charcoal text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <span className="text-4xl mb-2 block">👥</span>
              <p>No users found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.businessProfile && (
                            <p className="text-xs text-purple-600">{user.businessProfile.businessName}</p>
                          )}
                          {user.communityProfile && (
                            <p className="text-xs text-green-600">{user.communityProfile.organizationName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                      {(user.businessProfile?.isVerified || user.communityProfile?.isVerified) && (
                        <span className="ml-1 text-primary-500" title="Verified">✓</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-lg mr-1">🌱</span>
                        <span className="text-sm font-medium">{user.impactScore || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= totalPages}
                  className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-charcoal">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-medium mr-4">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex space-x-2 mt-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getRoleBadge(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusBadge(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Business/Community Info */}
              {selectedUser.businessProfile && (
                <div className="bg-purple-50 p-4 rounded-xl">
                  <h4 className="font-medium text-purple-700 mb-2">Business Profile</h4>
                  <p className="text-sm">Name: {selectedUser.businessProfile.businessName}</p>
                  <p className="text-sm">Verified: {selectedUser.businessProfile.isVerified ? 'Yes ✓' : 'No'}</p>
                </div>
              )}

              {selectedUser.communityProfile && (
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="font-medium text-green-700 mb-2">Community Profile</h4>
                  <p className="text-sm">Name: {selectedUser.communityProfile.organizationName}</p>
                  <p className="text-sm">Verified: {selectedUser.communityProfile.isVerified ? 'Yes ✓' : 'No'}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-semibold text-primary-600">{selectedUser.impactScore || 0}</p>
                  <p className="text-sm text-gray-500">Impact Score</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-semibold text-charcoal">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Joined</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {selectedUser.status === 'active' ? (
                  <button
                    onClick={() => handleSuspendUser(selectedUser.id)}
                    disabled={actionLoading || selectedUser.role === 'admin'}
                    className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'Processing...' : 'Suspend User'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivateUser(selectedUser.id)}
                    disabled={actionLoading}
                    className="flex-1 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Activate User'}
                  </button>
                )}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2 border border-gray-300 text-charcoal rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
