import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, TreePine, Zap, Bus, Recycle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    updateUser({ name });
    setIsEditing(false);
    setIsSaving(false);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="bg-white rounded-2xl elegant-shadow overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-32"></div>
            <div className="relative px-8 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                <div className="-mt-16 relative">
                  <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : <User className="w-16 h-16 text-gray-400" />}
                  </div>
                </div>
                <div className="mt-6 sm:mt-0 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:pb-1">
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-2xl font-serif font-semibold text-charcoal border-b-2 border-primary-500 focus:outline-none bg-transparent"
                      />
                    ) : (
                      <h1 className="text-2xl font-serif font-semibold text-charcoal truncate">{user.name}</h1>
                    )}
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  <div className="mt-4 flex space-x-3 sm:mt-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-5 py-2.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setName(user.name);
                          }}
                          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-5 py-2.5 bg-charcoal text-white rounded-full hover:bg-gray-800 transition-colors"
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="px-5 py-2.5 border border-red-300 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl elegant-shadow p-6 text-center">
              <div className="text-3xl font-serif font-semibold text-primary-600">12</div>
              <div className="text-gray-500 text-sm">Conservation Projects</div>
            </div>
            <div className="bg-white rounded-xl elegant-shadow p-6 text-center">
              <div className="text-3xl font-serif font-semibold text-primary-500">1.2K</div>
              <div className="text-gray-500 text-sm">kWh Tracked</div>
            </div>
            <div className="bg-white rounded-xl elegant-shadow p-6 text-center">
              <div className="text-3xl font-serif font-semibold text-primary-600">45</div>
              <div className="text-gray-500 text-sm">Green Rides</div>
            </div>
            <div className="bg-white rounded-xl elegant-shadow p-6 text-center">
              <div className="text-3xl font-serif font-semibold text-primary-500">8</div>
              <div className="text-gray-500 text-sm">Waste Exchanges</div>
            </div>
          </div>

          {/* Activity */}
          <div className="mt-8 bg-white rounded-2xl elegant-shadow p-8">
            <h2 className="text-xl font-serif font-semibold text-charcoal mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                <TreePine className="w-6 h-6 text-green-600 mr-4" />
                <div className="flex-1">
                  <p className="font-medium text-charcoal">Joined "Save the Rainforest" campaign</p>
                  <p className="text-sm text-gray-500">Conservation • 2 days ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                <Zap className="w-6 h-6 text-yellow-500 mr-4" />
                <div className="flex-1">
                  <p className="font-medium text-charcoal">Added solar panel to energy tracker</p>
                  <p className="text-sm text-gray-500">Renewable Energy • 5 days ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                <Bus className="w-6 h-6 text-blue-500 mr-4" />
                <div className="flex-1">
                  <p className="font-medium text-charcoal">Completed 10 eco-friendly rides</p>
                  <p className="text-sm text-gray-500">Transport • 1 week ago</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                <Recycle className="w-6 h-6 text-green-500 mr-4" />
                <div className="flex-1">
                  <p className="font-medium text-charcoal">Successfully exchanged 50kg recyclables</p>
                  <p className="text-sm text-gray-500">Waste Exchange • 2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="mt-8 bg-white rounded-2xl elegant-shadow p-8">
            <h2 className="text-xl font-serif font-semibold text-charcoal mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="font-medium text-charcoal">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates about your activities</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="font-medium text-charcoal">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <button className="px-5 py-2 border border-primary-500 text-primary-600 rounded-full hover:bg-primary-50 transition-colors">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl">
                <div>
                  <p className="font-medium text-red-600">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and data</p>
                </div>
                <button className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
