import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  category: string;
}

interface ForumPost {
  id: string;
  title: string;
  message: string;
  author: string;
  likes: number;
  comments: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  image: string;
}

const ConservationPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [discussionTitle, setDiscussionTitle] = useState('');
  const [discussionMessage, setDiscussionMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleStartDiscussion = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowDiscussionModal(true);
  };

  const handlePostDiscussion = async () => {
    if (!discussionTitle.trim() || !discussionMessage.trim()) return;
    
    setIsPosting(true);
    // Simulate posting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPost: ForumPost = {
      id: Date.now().toString(),
      title: discussionTitle,
      message: discussionMessage,
      author: user?.email || 'Anonymous',
      likes: 0,
      comments: 0
    };
    
    setForumPosts([newPost, ...forumPosts]);
    setDiscussionTitle('');
    setDiscussionMessage('');
    setShowDiscussionModal(false);
    setIsPosting(false);
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/conservation/campaigns')
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
          console.error('Error fetching campaigns:', err);
          return [];
        }),
      fetch('/api/conservation/forum')
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
          console.error('Error fetching forum posts:', err);
          return [];
        }),
      fetch('/api/conservation/campaigns')
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
          console.error('Error fetching events:', err);
          return [];
        })
    ]).then(([campaignsData, forumData, eventsData]) => {
      // Ensure campaigns data is properly formatted with numbers
      const formattedCampaigns = Array.isArray(campaignsData) 
        ? campaignsData.map(campaign => ({
            ...campaign,
            goal: typeof campaign.goal === 'string' ? parseFloat(campaign.goal) : (campaign.goal || 0),
            raised: typeof campaign.raised === 'string' ? parseFloat(campaign.raised) : (campaign.raised || 0)
          }))
        : [];
      
      console.log('Campaigns data received:', formattedCampaigns);
      setCampaigns(formattedCampaigns);
      console.log("Formatted campaigns: " +formattedCampaigns);
      console.log("Campaigns: " + campaigns);
      console.log("Campaigns data: " + campaignsData);
      setForumPosts(Array.isArray(forumData) ? forumData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    });
  }, []);

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', count: campaigns.length },
    { id: 'events', label: 'Events', count: events.length },
    { id: 'forum', label: 'Forum', count: forumPosts.length }
  ];

  // Conservation-related images from Unsplash
  const campaignImages = [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80'
  ];

  const eventImages = [
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80'
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80" 
          alt="Forest Conservation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-charcoal/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl font-serif font-semibold text-white mb-4">Conservation</h1>
              <p className="text-xl text-gray-200 max-w-2xl">
                Protect our planet's forests, oceans, and wildlife through community-driven campaigns and events.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex space-x-3 mb-10 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-charcoal text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 elegant-shadow'
              }`}
            >
              {tab.label} <span className="ml-1 opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(campaigns) && campaigns.length > 0 ? (
              campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl elegant-shadow overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={campaignImages[index % campaignImages.length]} 
                    alt={campaign.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-medium text-white bg-primary-500 px-3 py-1.5 rounded-full">
                      {campaign.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-charcoal mb-2">{campaign.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-charcoal">{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-primary-600 font-serif font-semibold text-lg">₹{campaign.raised.toLocaleString('en-IN')}</span>
                      <span className="text-gray-400 text-sm"> of ₹{campaign.goal.toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                      onClick={() => navigate('/payment', { state: { campaign: { ...campaign, image: campaignImages[campaigns.indexOf(campaign) % campaignImages.length] } } })}
                      className="px-4 py-2 bg-charcoal text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No campaigns available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(events) && events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl elegant-shadow overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={eventImages[index % eventImages.length]} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <p className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {event.date}
                    </p>
                    <p className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {event.location}
                    </p>
                    <p className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      {event.participants} participants
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/event', { state: { event: { ...event, image: eventImages[index % eventImages.length] } } })}
                    className="w-full py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-medium"
                  >
                    Join Event
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div className="space-y-4">
            {Array.isArray(forumPosts) && forumPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl elegant-shadow p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-serif font-semibold text-charcoal mb-2">{post.title}</h3>
                {post.message && (
                  <p className="text-gray-600 mb-4 leading-relaxed">{post.message}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <span>Posted by <span className="text-primary-600">{post.author}</span></span>
                  <div className="flex space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      {post.likes}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      {post.comments}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Add Post Button */}
            <div className="mt-8 text-center">
              <button 
                onClick={handleStartDiscussion}
                className="px-8 py-3 bg-charcoal text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                + Start a Discussion
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Discussion Modal */}
      <AnimatePresence>
        {showDiscussionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDiscussionModal(false)}
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
                  <h2 className="text-2xl font-serif font-semibold text-charcoal">Start a Discussion</h2>
                  <button 
                    onClick={() => setShowDiscussionModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
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
                  <label className="block text-sm font-medium text-charcoal mb-2">Title</label>
                  <input
                    type="text"
                    value={discussionTitle}
                    onChange={(e) => setDiscussionTitle(e.target.value)}
                    placeholder="What's your discussion about?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Message</label>
                  <textarea
                    value={discussionMessage}
                    onChange={(e) => setDiscussionMessage(e.target.value)}
                    placeholder="Share your thoughts, questions, or ideas..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDiscussionModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePostDiscussion}
                  disabled={isPosting || !discussionTitle.trim() || !discussionMessage.trim()}
                  className="px-6 py-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPosting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </span>
                  ) : (
                    'Post Discussion'
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

export default ConservationPage;
