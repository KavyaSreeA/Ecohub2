import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  /* TEXT COLOR HELPERS */
  const brandText = isTransparent ? 'text-white' : 'text-charcoal';
  const navText = isTransparent ? 'text-white/90' : 'text-gray-600';
  const navHover = isTransparent
    ? 'hover:bg-white/20 hover:text-white'
    : 'hover:text-charcoal hover:bg-gray-100';

  const baseNavItems = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/conservation', label: 'Conservation' },
    { path: '/energy', label: 'Energy' },
    { path: '/transport', label: 'Transport' },
    { path: '/waste', label: 'Waste Exchange' },
  ];

  return (
    <nav
      className={`
        ${isHome ? "fixed" : "sticky"} top-0 inset-x-0 z-50 transition-all duration-300
        ${isTransparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-sm'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🌍</span>
            </div>
            <span className={`text-2xl font-serif font-semibold ${brandText}`}>
              EcoHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {baseNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all
                  ${location.pathname === item.path
                    ? isTransparent
                      ? 'bg-white/20 text-white'
                      : 'bg-primary-100 text-primary-700'
                    : `${navText} ${navHover}`
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                {/* User Menu Button */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-full transition-all
                    ${isTransparent
                      ? 'text-white hover:bg-white/20'
                      : 'text-charcoal hover:bg-gray-100'
                    }
                  `}
                >
                  {/* User Avatar */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    ${isTransparent
                      ? 'bg-white/20 text-white'
                      : 'bg-primary-100 text-primary-700'
                    }
                  `}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <span className={`font-medium ${isTransparent ? 'text-white' : 'text-charcoal'}`}>
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className={`
                    absolute right-0 mt-2 w-56 rounded-xl shadow-lg py-2 z-50
                    ${isTransparent
                      ? 'bg-black/80 backdrop-blur-md border border-white/20'
                      : 'bg-white border border-gray-200'
                    }
                  `}>
                    {/* User Info */}
                    <div className={`px-4 py-3 border-b ${isTransparent ? 'border-white/20' : 'border-gray-200'}`}>
                      <p className={`font-semibold ${isTransparent ? 'text-white' : 'text-charcoal'}`}>
                        {user?.name}
                      </p>
                      <p className={`text-sm ${isTransparent ? 'text-white/70' : 'text-gray-500'}`}>
                        {user?.email}
                      </p>
                      {user?.role && (
                        <span className={`
                          inline-block mt-1 px-2 py-0.5 text-xs rounded-full
                          ${isTransparent
                            ? 'bg-white/20 text-white'
                            : 'bg-primary-100 text-primary-700'
                          }
                        `}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`
                          flex items-center px-4 py-2 text-sm transition-colors
                          ${isTransparent
                            ? 'text-white hover:bg-white/20'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`
                          flex items-center px-4 py-2 text-sm transition-colors
                          ${isTransparent
                            ? 'text-white hover:bg-white/20'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className={`
                            flex items-center px-4 py-2 text-sm transition-colors
                            ${isTransparent
                              ? 'text-white hover:bg-white/20'
                              : 'text-gray-700 hover:bg-gray-100'
                            }
                          `}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Admin Dashboard
                        </Link>
                      )}

                      <div className={`my-1 ${isTransparent ? 'border-white/20' : 'border-gray-200'}`} style={{ borderTopWidth: '1px' }} />

                      <button
                        onClick={handleLogout}
                        className={`
                          w-full flex items-center px-4 py-2 text-sm transition-colors
                          ${isTransparent
                            ? 'text-red-300 hover:bg-red-500/20'
                            : 'text-red-600 hover:bg-red-50'
                          }
                        `}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Sign In */}
                <Link
                  to="/login"
                  className={`
                    px-5 py-2.5 font-medium rounded-full transition
                    ${isTransparent
                      ? 'text-white border border-white/40 hover:bg-white/20'
                      : 'text-charcoal hover:text-primary-600'
                    }
                  `}
                >
                  Sign In
                </Link>

                {/* Get Started */}
                <Link
                  to="/register"
                  className={`
                    px-6 py-2.5 font-medium rounded-full transition
                    ${isTransparent
                      ? 'bg-primary-500/40 text-white backdrop-blur-md hover:bg-white/30'
                      : 'bg-primary-500 text-white hover:bg-gray-800'
                    }
                  `}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden relative w-12 h-12 ${brandText}`}
          >
            <span
              className={`
                absolute top-1/2 left-1/2 w-6 h-0.5 bg-current transition-all
                ${isOpen ? 'rotate-45 -translate-x-1/2 -translate-y-1/2' : '-translate-x-1/2 -translate-y-3'}
              `}
            />
            <span
              className={`
                absolute top-1/2 left-1/2 w-6 h-0.5 bg-current transition-all
                ${isOpen ? 'opacity-0' : '-translate-x-1/2 -translate-y-1/2'}
              `}
            />
            <span
              className={`
                absolute top-1/2 left-1/2 w-6 h-0.5 bg-current transition-all
                ${isOpen ? '-rotate-45 -translate-x-1/2 -translate-y-1/2' : '-translate-x-1/2 translate-y-2'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden overflow-hidden transition-all duration-300
          ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
          ${isTransparent ? 'bg-black/60 backdrop-blur-md' : 'bg-white'}
        `}
      >
        <div className="px-6 py-6 space-y-3">
          {baseNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium
                ${isTransparent ? 'text-white hover:bg-white/20' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="pt-4 space-y-3 border-t border-gray-200">
              {/* User Info */}
              <div className="px-4 py-2">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin Dashboard
                </Link>
              )}

              <div className="border-t border-gray-200 my-2" />

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 space-y-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`block text-center px-4 py-3 rounded-full
                  ${isTransparent ? 'border border-white/40 text-white' : 'border border-primary-500'}
                `}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-3 rounded-full bg-primary-500 text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
