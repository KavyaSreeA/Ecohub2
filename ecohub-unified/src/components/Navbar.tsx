import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, isBusiness, isCommunity, logout } = useAuth();

  // Base navigation items for all users
  const baseNavItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/conservation', label: 'Conservation' },
    { path: '/energy', label: 'Energy' },
    { path: '/transport', label: 'Transport' },
    { path: '/waste', label: 'Waste Exchange' },
  ];

  // Get role-specific menu items
  const getRoleMenuItems = () => {
    const items = [];
    
    if (isAdmin) {
      items.push({ path: '/admin', label: 'Admin Panel', icon: '⚙️' });
    }
    
    if (isBusiness) {
      items.push({ path: '/business/listings', label: 'My Listings', icon: '📦' });
      items.push({ path: '/business/fleet', label: 'Fleet Management', icon: '🚗' });
    }
    
    if (isCommunity) {
      items.push({ path: '/community/campaigns', label: 'My Campaigns', icon: '🎯' });
      items.push({ path: '/community/events', label: 'My Events', icon: '📅' });
    }
    
    return items;
  };

  const roleMenuItems = getRoleMenuItems();

  // Get role badge
  const getRoleBadge = () => {
    if (!user?.role || user.role === 'individual') return null;
    
    const badges: Record<string, { label: string; color: string }> = {
      business: { label: 'Business', color: 'bg-purple-100 text-purple-700' },
      community: { label: 'Community', color: 'bg-green-100 text-green-700' },
      admin: { label: 'Admin', color: 'bg-red-100 text-red-700' }
    };
    
    return badges[user.role] || null;
  };

  const roleBadge = getRoleBadge();

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-serif font-semibold text-charcoal">EcoHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {baseNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-charcoal hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Admin Link (visible only to admins) */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-red-100 text-red-700'
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
              >
                ⚙️ Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <span className="text-charcoal font-medium block text-sm">{user?.name?.split(' ')[0]}</span>
                    {roleBadge && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl py-2 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-charcoal">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {roleBadge && (
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${roleBadge.color}`}>
                          {roleBadge.label} Account
                        </span>
                      )}
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      👤 My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      📊 Dashboard
                    </Link>
                    
                    {/* Role-specific menu items */}
                    {roleMenuItems.length > 0 && (
                      <>
                        <hr className="my-2" />
                        {roleMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowUserMenu(false)}
                            className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {item.icon} {item.label}
                          </Link>
                        ))}
                      </>
                    )}
                    
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-charcoal font-medium hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-charcoal text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-charcoal p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {baseNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Admin Link for Mobile */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-red-100 text-red-700'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                ⚙️ Admin Panel
              </Link>
            )}
            
            {/* Role-specific mobile menu items */}
            {roleMenuItems.length > 0 && (
              <>
                <hr className="my-4" />
                <p className="px-4 text-xs text-gray-400 uppercase tracking-wider">
                  {user?.role === 'business' ? 'Business' : 'Community'} Menu
                </p>
                {roleMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100"
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
              </>
            )}
            
            <hr className="my-4" />
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-charcoal">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  {roleBadge && (
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${roleBadge.color}`}>
                      {roleBadge.label}
                    </span>
                  )}
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  👤 My Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                >
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <div className="space-y-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 text-charcoal font-medium border border-gray-200 rounded-full hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-charcoal text-white font-medium rounded-full hover:bg-gray-800"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
