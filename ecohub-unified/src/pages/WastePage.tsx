import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface Listing {
  id: string;
  title: string;
  category: string;
  quantity: string;
  location: string;
  seller: string;
  sellerEmail: string;
  sellerPhone: string;
  price: string;
  description: string;
  status: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface WasteStats {
  totalListings: number;
  wasteExchanged: string;
  co2Prevented: string;
  activeSellers: number;
}

const WastePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<WasteStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    category: 'plastic',
    quantity: '',
    location: '',
    price: '',
    description: ''
  });

  useEffect(() => {
    // Load listings from API
    fetch('/api/waste/listings')
      .then(r => r.json())
      .then(data => setListings(data))
      .catch(err => {
        console.error('Error fetching listings:', err);
        setListings([]);
      });

    // Load categories from API
    fetch('/api/waste/categories')
      .then(r => r.json())
      .then(data => setCategories(data))
      .catch(err => {
        console.error('Error fetching categories:', err);
        setCategories([]);
      });

    fetch('/api/waste/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(err => {
        console.error('Error fetching stats:', err);
      });
  }, []);

  const filteredListings = selectedCategory
    ? listings.filter(l => l.category === selectedCategory)
    : listings;

  const categoryImages: Record<string, string> = {
    'plastic': 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400&q=80',
    'paper': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
    'metal': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    'glass': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&q=80',
    'electronics': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    'organic': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80'
  };

  const handleContact = (listing: Listing) => {
    setSelectedListing(listing);
    setShowContactModal(true);
  };

  const handleAddListing = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowAddListingModal(true);
  };

  const handleSubmitListing = async () => {
    if (!newListing.title || !newListing.quantity || !newListing.location) return;
    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/waste/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newListing,
          seller_id: user.id
        })
      });

      if (response.ok) {
        const listing = await response.json();
        setListings([listing, ...listings]);
        setNewListing({
          title: '',
          category: 'plastic',
          quantity: '',
          location: '',
          price: '',
          description: ''
        });
        setShowAddListingModal(false);
      } else {
        console.error('Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1600&q=80" 
          alt="Recycling"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-charcoal/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl font-serif font-semibold text-white mb-4">Waste Exchange</h1>
              <p className="text-xl text-gray-200 max-w-2xl">
                Connect with others to recycle, reuse, and reduce waste. One person's trash is another's treasure!
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl elegant-shadow p-6 text-center"
            >
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.totalListings}</div>
              <div className="text-gray-500 text-sm mt-1">Total Listings</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl elegant-shadow p-6 text-center"
            >
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.wasteExchanged}</div>
              <div className="text-gray-500 text-sm mt-1">Waste Exchanged</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl elegant-shadow p-6 text-center"
            >
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.co2Prevented}</div>
              <div className="text-gray-500 text-sm mt-1">CO2 Prevented</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl elegant-shadow p-6 text-center"
            >
              <div className="text-3xl font-serif font-semibold text-primary-600">{stats.activeSellers}</div>
              <div className="text-gray-500 text-sm mt-1">Active Sellers</div>
            </motion.div>
          </div>
        )}

        {/* Categories */}
        <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Categories</h2>
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-full font-medium transition-all ${
              !selectedCategory
                ? 'bg-charcoal text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 elegant-shadow'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name.toLowerCase().split(' ')[0])}
              className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                selectedCategory === cat.name.toLowerCase().split(' ')[0]
                  ? 'bg-charcoal text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 elegant-shadow'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-semibold text-charcoal">Available Listings</h2>
          <button
            onClick={handleAddListing}
            className="px-5 py-2.5 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors"
          >
            + Add New Listing
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl elegant-shadow overflow-hidden group hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={categoryImages[listing.category] || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80'}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    listing.status === 'available' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-serif font-semibold text-charcoal mb-3">{listing.title}</h3>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {listing.quantity}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.location}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {listing.seller}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xl font-serif font-semibold text-primary-600">{listing.price}</span>
                  <button 
                    onClick={() => handleContact(listing)}
                    className="bg-charcoal text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors font-medium"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Listing CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-serif font-semibold mb-2">Have waste to exchange?</h3>
          <p className="text-primary-100 mb-6">List your recyclable materials and connect with buyers in your area.</p>
          <button 
            onClick={handleAddListing}
            className="bg-white text-primary-600 px-8 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors"
          >
            + Add New Listing
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl elegant-shadow w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-semibold text-charcoal">Contact Seller</h2>
                  <button 
                    onClick={() => setShowContactModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Listing Info */}
                <div className="bg-primary-50 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-charcoal mb-1">{selectedListing.title}</h3>
                  <p className="text-sm text-gray-500">{selectedListing.quantity} • {selectedListing.price}</p>
                </div>

                {/* Seller Info */}
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-lg font-medium mr-4">
                      {selectedListing.seller.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">{selectedListing.seller}</p>
                      <p className="text-sm text-gray-500">Verified Seller</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a 
                      href={`mailto:${selectedListing.sellerEmail}`}
                      className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-primary-50 hover:border-primary-200 transition-colors"
                    >
                      <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-primary-600">{selectedListing.sellerEmail}</p>
                      </div>
                    </a>

                    <a 
                      href={`tel:${selectedListing.sellerPhone}`}
                      className="flex items-center p-4 border border-gray-200 rounded-xl hover:bg-primary-50 hover:border-primary-200 transition-colors"
                    >
                      <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-primary-600">{selectedListing.sellerPhone}</p>
                      </div>
                    </a>

                    <div className="flex items-start p-4 border border-gray-200 rounded-xl">
                      <svg className="w-5 h-5 text-primary-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-charcoal">{selectedListing.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowContactModal(false)}
                  className="w-full mt-6 py-3 bg-charcoal text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Listing Modal */}
      <AnimatePresence>
        {showAddListingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddListingModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl elegant-shadow w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-semibold text-charcoal">Add New Listing</h2>
                  <button 
                    onClick={() => setShowAddListingModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-xl">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Material Title *</label>
                  <input
                    type="text"
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                    placeholder="e.g., Recycled Plastic Bottles"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Category *</label>
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="plastic">Plastic</option>
                    <option value="paper">Paper</option>
                    <option value="metal">Metal</option>
                    <option value="glass">Glass</option>
                    <option value="electronics">Electronics</option>
                    <option value="organic">Organic</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Quantity *</label>
                    <input
                      type="text"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                      placeholder="e.g., 50 kg"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Price</label>
                    <input
                      type="text"
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                      placeholder="e.g., ₹10/kg or Free"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Location *</label>
                  <input
                    type="text"
                    value={newListing.location}
                    onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                    placeholder="e.g., Mumbai, Maharashtra"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Description</label>
                  <textarea
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                    placeholder="Describe your waste material..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddListingModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitListing}
                  disabled={isSubmitting || !newListing.title || !newListing.quantity || !newListing.location}
                  className="px-6 py-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </span>
                  ) : (
                    'Post Listing'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WastePage;
