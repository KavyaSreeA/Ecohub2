import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
              <span className={`${brandText} font-medium`}>
                {user?.name?.split(' ')[0]}
              </span>
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

          {!isAuthenticated && (
            <div className="pt-4 space-y-3">
              <Link
                to="/login"
                className={`block text-center px-4 py-3 rounded-full
                  ${isTransparent ? 'border border-white/40 text-white' : 'border border-primary-500'}
                `}
              >
                Sign In
              </Link>
              <Link
                to="/register"
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
