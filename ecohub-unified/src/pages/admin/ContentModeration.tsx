import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface PendingItem {
  id: string;
  type: 'business' | 'community' | 'campaign' | 'event' | 'listing' | 'post';
  title: string;
  description?: string;
  submittedBy: string;
  submittedAt: string;
  details?: Record<string, unknown>;
}

type TabType = 'businesses' | 'communities' | 'campaigns' | 'events' | 'listings' | 'posts';

const ContentModeration = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('businesses');
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'businesses', label: 'Businesses', icon: '🏢' },
    { id: 'communities', label: 'Communities', icon: '🌍' },
    { id: 'campaigns', label: 'Campaigns', icon: '🎯' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'listings', label: 'Waste Listings', icon: '♻️' },
    { id: 'posts', label: 'Forum Posts', icon: '💬' }
  ];

  useEffect(() => {
    fetchPendingItems();
  }, [activeTab]);

  const fetchPendingItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/pending/${activeTab}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPendingItems(data.data);
      } else {
        setError('Failed to load pending items');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (item: PendingItem) => {
    setActionLoading(true);
    try {
      const endpoint = getApproveEndpoint(item.type, item.id);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchPendingItems();
        setSelectedItem(null);
      } else {
        alert(data.message || 'Failed to approve');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (item: PendingItem) => {
    if (!rejectionReason) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setActionLoading(true);
    try {
      const endpoint = getRejectEndpoint(item.type, item.id);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });
      const data = await response.json();
      if (data.success) {
        fetchPendingItems();
        setSelectedItem(null);
        setRejectionReason('');
      } else {
        alert(data.message || 'Failed to reject');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setActionLoading(false);
    }
  };

  const getApproveEndpoint = (type: string, id: string): string => {
    const endpoints: Record<string, string> = {
      business: `/api/admin/businesses/${id}/verify`,
      community: `/api/admin/communities/${id}/verify`,
      campaign: `/api/admin/campaigns/${id}/approve`,
      event: `/api/admin/events/${id}/approve`,
      listing: `/api/admin/listings/${id}/approve`,
      post: `/api/admin/posts/${id}/approve`
    };
    return endpoints[type] || '';
  };

  const getRejectEndpoint = (type: string, id: string): string => {
    const endpoints: Record<string, string> = {
      business: `/api/admin/businesses/${id}/reject`,
      community: `/api/admin/communities/${id}/reject`,
      campaign: `/api/admin/campaigns/${id}/reject`,
      event: `/api/admin/events/${id}/reject`,
      listing: `/api/admin/listings/${id}/reject`,
      post: `/api/admin/posts/${id}/reject`
    };
    return endpoints[type] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-charcoal text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-gray-300 hover:text-white">
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-semibold">Content Moderation</h1>
              <p className="text-gray-300 text-sm">Review and approve pending content</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm"
        >
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : pendingItems.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <span className="text-4xl mb-2 block">✅</span>
              <p className="font-medium">All caught up!</p>
              <p className="text-sm">No pending items to review in this category</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingItems.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {item.type === 'business' && '🏢'}
                          {item.type === 'community' && '🌍'}
                          {item.type === 'campaign' && '🎯'}
                          {item.type === 'event' && '📅'}
                          {item.type === 'listing' && '♻️'}
                          {item.type === 'post' && '💬'}
                        </span>
                        <div>
                          <h3 className="font-medium text-charcoal">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                        <span>By: {item.submittedBy}</span>
                        <span>•</span>
                        <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-4 py-2 text-sm text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleApprove(item)}
                        disabled={actionLoading}
                        className="px-4 py-2 text-sm bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-charcoal">Review Content</h2>
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setRejectionReason('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Item Details */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">
                      {selectedItem.type === 'business' && '🏢'}
                      {selectedItem.type === 'community' && '🌍'}
                      {selectedItem.type === 'campaign' && '🎯'}
                      {selectedItem.type === 'event' && '📅'}
                      {selectedItem.type === 'listing' && '♻️'}
                      {selectedItem.type === 'post' && '💬'}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">{selectedItem.type}</p>
                    </div>
                  </div>

                  {selectedItem.description && (
                    <div className="bg-gray-50 p-4 rounded-xl mb-4">
                      <p className="text-gray-600">{selectedItem.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-gray-500">Submitted By</p>
                      <p className="font-medium">{selectedItem.submittedBy}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-gray-500">Submitted At</p>
                      <p className="font-medium">{new Date(selectedItem.submittedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (required for rejection)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason if rejecting this content..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(selectedItem)}
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : '✓ Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(selectedItem)}
                    disabled={actionLoading || !rejectionReason}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? 'Processing...' : '✕ Reject'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentModeration;
