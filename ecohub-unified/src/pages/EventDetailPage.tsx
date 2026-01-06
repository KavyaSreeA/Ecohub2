import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EventDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  const event = location.state?.event;

  if (!event) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-semibold text-charcoal mb-4">Event not found</h1>
          <button 
            onClick={() => navigate('/conservation')}
            className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
          >
            Back to Conservation
          </button>
        </div>
      </div>
    );
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsRegistering(true);
    // Simulate registration
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRegistered(true);
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button 
                onClick={() => navigate('/conservation')}
                className="mb-4 text-white/80 hover:text-white flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Conservation
              </button>
              <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-2">{event.title}</h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl elegant-shadow p-8"
            >
              <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">About This Event</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Join us for an impactful conservation event that brings together passionate individuals 
                committed to making a difference. This event is designed to create meaningful change 
                while connecting you with like-minded people who share your passion for environmental protection.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you're a seasoned environmental advocate or just starting your conservation journey, 
                this event offers something for everyone. Participate in hands-on activities, learn from experts, 
                and contribute to tangible environmental outcomes.
              </p>
              
              <h3 className="text-xl font-serif font-semibold text-charcoal mb-4">What to Expect</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Hands-on conservation activities and workshops
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Expert-led sessions on environmental protection
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Networking opportunities with conservation enthusiasts
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Certificate of participation for your contribution
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl elegant-shadow p-8"
            >
              <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Location</h2>
              <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="font-medium text-charcoal">{event.location}</p>
                  <p className="text-sm mt-1">Detailed directions will be sent upon registration</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl elegant-shadow p-6 sticky top-24"
            >
              <div className="space-y-4 mb-6">
                <div className="flex items-center p-4 bg-primary-50 rounded-xl">
                  <svg className="w-6 h-6 text-primary-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-charcoal">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-primary-50 rounded-xl">
                  <svg className="w-6 h-6 text-primary-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-charcoal">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-primary-50 rounded-xl">
                  <svg className="w-6 h-6 text-primary-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium text-charcoal">{event.participants} registered</p>
                  </div>
                </div>
              </div>

              {registered ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-charcoal mb-2">You're Registered!</h3>
                  <p className="text-gray-500 text-sm">
                    Confirmation sent to {user?.email || 'your email'}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full py-4 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {isRegistering ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    'Register for Event'
                  )}
                </button>
              )}

              <p className="text-center text-sm text-gray-400 mt-4">
                Free registration · Limited spots available
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
