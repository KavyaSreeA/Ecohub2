import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Leaf, Zap, Calendar, Megaphone, Plus, Edit, Trash2, 
  Eye, Users, TrendingUp, X, Save, Image, MapPin, Clock,
  Sun, Wind, Droplets, CheckCircle, AlertCircle
} from 'lucide-react';

// Types
interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  deadline: string;
  status: 'active' | 'completed' | 'draft';
}

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface EnergyResource {
  id: string;
  name: string;
  type: 'solar' | 'wind' | 'hydro' | 'geothermal';
  description: string;
  capacity: string;
  location: string;
  status: 'active' | 'maintenance' | 'offline';
  growth: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'conservation' | 'energy'>('overview');
  const [conservationTab, setConservationTab] = useState<'campaigns' | 'events'>('campaigns');
  
  // Modal states
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Data states
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Plant 10,000 Trees',
      description: 'Join our mission to plant 10,000 trees across the city to combat climate change.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
      goal: 100000,
      raised: 75000,
      deadline: '2026-03-15',
      status: 'active'
    },
    {
      id: '2',
      title: 'Ocean Cleanup Drive',
      description: 'Help us remove plastic waste from our beaches and oceans.',
      image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&q=80',
      goal: 50000,
      raised: 50000,
      deadline: '2026-02-28',
      status: 'completed'
    }
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Community Tree Planting',
      description: 'Join us for a day of tree planting in Central Park.',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80',
      date: '2026-02-15',
      time: '09:00 AM',
      location: 'Central Park, Chennai',
      attendees: 150,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Green Energy Workshop',
      description: 'Learn about renewable energy solutions for your home.',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80',
      date: '2026-02-20',
      time: '02:00 PM',
      location: 'EcoHub Center, Mumbai',
      attendees: 75,
      status: 'upcoming'
    }
  ]);

  const [energyResources, setEnergyResources] = useState<EnergyResource[]>([
    {
      id: '1',
      name: 'Solar Power',
      type: 'solar',
      description: 'Harness the power of the sun with advanced photovoltaic technology.',
      capacity: '500 MW',
      location: 'Rajasthan Solar Park',
      status: 'active',
      growth: '+15%'
    },
    {
      id: '2',
      name: 'Wind Energy',
      type: 'wind',
      description: 'Clean energy from coastal wind farms.',
      capacity: '300 MW',
      location: 'Tamil Nadu Wind Farm',
      status: 'active',
      growth: '+12%'
    },
    {
      id: '3',
      name: 'Hydroelectric',
      type: 'hydro',
      description: 'Sustainable power from water resources.',
      capacity: '450 MW',
      location: 'Kerala Dam Project',
      status: 'maintenance',
      growth: '+8%'
    }
  ]);

  // Form states
  const [campaignForm, setCampaignForm] = useState({
    title: '', description: '', image: '', goal: '', deadline: '', status: 'draft' as const
  });
  const [eventForm, setEventForm] = useState({
    title: '', description: '', image: '', date: '', time: '', location: '', status: 'upcoming' as const
  });
  const [energyForm, setEnergyForm] = useState({
    name: '', type: 'solar' as const, description: '', capacity: '', location: '', growth: '', status: 'active' as const
  });

  // Check admin auth
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/login');
    }
  }, [navigate]);

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Campaign CRUD
  const handleSaveCampaign = () => {
    if (editingItem) {
      setCampaigns(campaigns.map(c => c.id === editingItem.id ? { ...c, ...campaignForm, goal: Number(campaignForm.goal) } : c));
      showSuccess('Campaign updated successfully!');
    } else {
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        ...campaignForm,
        goal: Number(campaignForm.goal),
        raised: 0
      };
      setCampaigns([...campaigns, newCampaign]);
      showSuccess('Campaign created successfully!');
    }
    setShowCampaignModal(false);
    setEditingItem(null);
    setCampaignForm({ title: '', description: '', image: '', goal: '', deadline: '', status: 'draft' });
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
      showSuccess('Campaign deleted successfully!');
    }
  };

  // Event CRUD
  const handleSaveEvent = () => {
    if (editingItem) {
      setEvents(events.map(e => e.id === editingItem.id ? { ...e, ...eventForm } : e));
      showSuccess('Event updated successfully!');
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...eventForm,
        attendees: 0
      };
      setEvents([...events, newEvent]);
      showSuccess('Event created successfully!');
    }
    setShowEventModal(false);
    setEditingItem(null);
    setEventForm({ title: '', description: '', image: '', date: '', time: '', location: '', status: 'upcoming' });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
      showSuccess('Event deleted successfully!');
    }
  };

  // Energy CRUD
  const handleSaveEnergy = () => {
    if (editingItem) {
      setEnergyResources(energyResources.map(e => e.id === editingItem.id ? { ...e, ...energyForm } : e));
      showSuccess('Energy resource updated successfully!');
    } else {
      const newResource: EnergyResource = {
        id: Date.now().toString(),
        ...energyForm
      };
      setEnergyResources([...energyResources, newResource]);
      showSuccess('Energy resource created successfully!');
    }
    setShowEnergyModal(false);
    setEditingItem(null);
    setEnergyForm({ name: '', type: 'solar', description: '', capacity: '', location: '', growth: '', status: 'active' });
  };

  const handleDeleteEnergy = (id: string) => {
    if (confirm('Are you sure you want to delete this energy resource?')) {
      setEnergyResources(energyResources.filter(e => e.id !== id));
      showSuccess('Energy resource deleted successfully!');
    }
  };

  const getEnergyIcon = (type: string) => {
    switch (type) {
      case 'solar': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'wind': return <Wind className="w-5 h-5 text-blue-500" />;
      case 'hydro': return <Droplets className="w-5 h-5 text-blue-400" />;
      default: return <Zap className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'upcoming': return 'bg-green-100 text-green-700';
      case 'completed': case 'ongoing': return 'bg-blue-100 text-blue-700';
      case 'draft': case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'offline': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-charcoal text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-semibold">Admin Dashboard</h1>
                <p className="text-gray-400 text-sm">Manage EcoHub Platform</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('isAdmin');
                navigate('/login');
              }}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl shadow-lg"
          >
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'conservation', label: 'Conservation', icon: Leaf },
              { id: 'energy', label: 'Energy', icon: Zap },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${
                  activeTab === id
                    ? 'text-primary-600 border-primary-500'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl elegant-shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-500 text-sm">Active Campaigns</span>
                </div>
                <p className="text-3xl font-serif font-semibold text-charcoal">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="bg-white rounded-2xl elegant-shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-500 text-sm">Upcoming Events</span>
                </div>
                <p className="text-3xl font-serif font-semibold text-charcoal">
                  {events.filter(e => e.status === 'upcoming').length}
                </p>
              </div>
              <div className="bg-white rounded-2xl elegant-shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-gray-500 text-sm">Energy Sources</span>
                </div>
                <p className="text-3xl font-serif font-semibold text-charcoal">
                  {energyResources.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl elegant-shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-gray-500 text-sm">Total Attendees</span>
                </div>
                <p className="text-3xl font-serif font-semibold text-charcoal">
                  {events.reduce((sum, e) => sum + e.attendees, 0)}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl elegant-shadow p-6">
              <h2 className="text-lg font-serif font-semibold text-charcoal mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => { setActiveTab('conservation'); setConservationTab('campaigns'); setShowCampaignModal(true); }}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition text-left"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">New Campaign</p>
                    <p className="text-sm text-gray-500">Create a conservation campaign</p>
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab('conservation'); setConservationTab('events'); setShowEventModal(true); }}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-left"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">New Event</p>
                    <p className="text-sm text-gray-500">Schedule a new event</p>
                  </div>
                </button>
                <button
                  onClick={() => { setActiveTab('energy'); setShowEnergyModal(true); }}
                  className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition text-left"
                >
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">New Energy Source</p>
                    <p className="text-sm text-gray-500">Add energy resource</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Conservation Tab */}
        {activeTab === 'conservation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Sub-tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setConservationTab('campaigns')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition ${
                  conservationTab === 'campaigns'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                Campaigns
              </button>
              <button
                onClick={() => setConservationTab('events')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition ${
                  conservationTab === 'events'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Events
              </button>
            </div>

            {/* Campaigns */}
            {conservationTab === 'campaigns' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-semibold text-charcoal">Campaigns</h2>
                  <button
                    onClick={() => { setEditingItem(null); setCampaignForm({ title: '', description: '', image: '', goal: '', deadline: '', status: 'draft' }); setShowCampaignModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition"
                  >
                    <Plus className="w-5 h-5" />
                    Add Campaign
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white rounded-2xl elegant-shadow overflow-hidden">
                      <div className="h-40 overflow-hidden relative">
                        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif font-semibold text-charcoal mb-2">{campaign.title}</h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{campaign.description}</p>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium text-charcoal">₹{campaign.raised.toLocaleString()} / ₹{campaign.goal.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingItem(campaign); setCampaignForm({ ...campaign, goal: campaign.goal.toString() }); setShowCampaignModal(true); }}
                            className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Events */}
            {conservationTab === 'events' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-semibold text-charcoal">Events</h2>
                  <button
                    onClick={() => { setEditingItem(null); setEventForm({ title: '', description: '', image: '', date: '', time: '', location: '', status: 'upcoming' }); setShowEventModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition"
                  >
                    <Plus className="w-5 h-5" />
                    Add Event
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-2xl elegant-shadow overflow-hidden">
                      <div className="h-40 overflow-hidden relative">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif font-semibold text-charcoal mb-2">{event.title}</h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>
                        <div className="space-y-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {event.date} at {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            {event.attendees} attendees
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingItem(event); setEventForm(event); setShowEventModal(true); }}
                            className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Energy Tab */}
        {activeTab === 'energy' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-semibold text-charcoal">Energy Resources</h2>
              <button
                onClick={() => { setEditingItem(null); setEnergyForm({ name: '', type: 'solar', description: '', capacity: '', location: '', growth: '', status: 'active' }); setShowEnergyModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition"
              >
                <Plus className="w-5 h-5" />
                Add Energy Source
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {energyResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-2xl elegant-shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {getEnergyIcon(resource.type)}
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-charcoal">{resource.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(resource.status)}`}>
                          {resource.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600">{resource.growth}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{resource.description}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-gray-400" />
                      Capacity: {resource.capacity}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {resource.location}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingItem(resource); setEnergyForm(resource); setShowEnergyModal(true); }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEnergy(resource.id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Campaign Modal */}
      <AnimatePresence>
        {showCampaignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCampaignModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-serif font-semibold text-charcoal">
                  {editingItem ? 'Edit Campaign' : 'New Campaign'}
                </h2>
                <button onClick={() => setShowCampaignModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Title</label>
                  <input
                    type="text"
                    value={campaignForm.title}
                    onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Campaign title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
                  <textarea
                    value={campaignForm.description}
                    onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={3}
                    placeholder="Describe the campaign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Image URL</label>
                  <input
                    type="text"
                    value={campaignForm.image}
                    onChange={(e) => setCampaignForm({ ...campaignForm, image: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Goal (₹)</label>
                    <input
                      type="number"
                      value={campaignForm.goal}
                      onChange={(e) => setCampaignForm({ ...campaignForm, goal: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Deadline</label>
                    <input
                      type="date"
                      value={campaignForm.deadline}
                      onChange={(e) => setCampaignForm({ ...campaignForm, deadline: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Status</label>
                  <select
                    value={campaignForm.status}
                    onChange={(e) => setCampaignForm({ ...campaignForm, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCampaign}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-serif font-semibold text-charcoal">
                  {editingItem ? 'Edit Event' : 'New Event'}
                </h2>
                <button onClick={() => setShowEventModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Title</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={3}
                    placeholder="Describe the event"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Image URL</label>
                  <input
                    type="text"
                    value={eventForm.image}
                    onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Date</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Time</label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Location</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Event location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Status</label>
                  <select
                    value={eventForm.status}
                    onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Energy Modal */}
      <AnimatePresence>
        {showEnergyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEnergyModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-serif font-semibold text-charcoal">
                  {editingItem ? 'Edit Energy Source' : 'New Energy Source'}
                </h2>
                <button onClick={() => setShowEnergyModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
                  <input
                    type="text"
                    value={energyForm.name}
                    onChange={(e) => setEnergyForm({ ...energyForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Energy source name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Type</label>
                  <select
                    value={energyForm.type}
                    onChange={(e) => setEnergyForm({ ...energyForm, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="solar">Solar</option>
                    <option value="wind">Wind</option>
                    <option value="hydro">Hydroelectric</option>
                    <option value="geothermal">Geothermal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
                  <textarea
                    value={energyForm.description}
                    onChange={(e) => setEnergyForm({ ...energyForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={3}
                    placeholder="Describe the energy source"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Capacity</label>
                    <input
                      type="text"
                      value={energyForm.capacity}
                      onChange={(e) => setEnergyForm({ ...energyForm, capacity: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 500 MW"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Growth</label>
                    <input
                      type="text"
                      value={energyForm.growth}
                      onChange={(e) => setEnergyForm({ ...energyForm, growth: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., +15%"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Location</label>
                  <input
                    type="text"
                    value={energyForm.location}
                    onChange={(e) => setEnergyForm({ ...energyForm, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Project location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Status</label>
                  <select
                    value={energyForm.status}
                    onChange={(e) => setEnergyForm({ ...energyForm, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowEnergyModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEnergy}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
