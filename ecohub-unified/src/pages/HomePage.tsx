import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const services = [
    {
      title: 'Conservation',
      subtitle: 'Protect Our Planet',
      description: 'Join campaigns to preserve forests, oceans, and wildlife. Every action counts towards a sustainable future.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      path: '/conservation',
      stats: '150+ Campaigns'
    },
    {
      title: 'Renewable Energy',
      subtitle: 'Power the Future',
      description: 'Track and support clean energy projects. Solar, wind, and hydro solutions for a carbon-neutral tomorrow.',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
      path: '/energy',
      stats: '1,800 MW Generated'
    },
    {
      title: 'Sustainable Transport',
      subtitle: 'Move Mindfully',
      description: 'Discover eco-friendly routes and transportation options. Reduce your carbon footprint with every journey.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      path: '/transport',
      stats: '120 Green Routes'
    },
    {
      title: 'Waste Exchange',
      subtitle: 'Circular Economy',
      description: 'Connect with others to recycle and reuse materials. Transform waste into valuable resources.',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
      path: '/waste',
      stats: '12,500 tons Exchanged'
    }
  ];

  const impactStats = [
    { value: '2.5M', label: 'Tons CO₂ Reduced', icon: '🌱' },
    { value: '500K', label: 'Trees Planted', icon: '🌳' },
    { value: '100K', label: 'Active Members', icon: '👥' },
    { value: '1,200', label: 'Active Projects', icon: '📊' }
  ];

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 teal-gradient"></div>
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&q=80" 
            alt="Nature" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-light to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-primary-600 font-medium tracking-widest uppercase text-sm mb-4">
              Sustainability Made Simple
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-semibold text-charcoal leading-tight mb-6">
              Make your lifestyle
              <span className="block text-primary-500">work for Earth</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
              EcoHub unifies conservation, renewable energy, sustainable transport, and waste management 
              into one elegant platform for meaningful environmental action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-center">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-center">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn-outline text-center">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <span className="text-4xl mb-3 block">{stat.icon}</span>
                <div className="font-serif text-4xl md:text-5xl font-semibold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary-600 font-medium tracking-widest uppercase text-sm mb-4">
              Our Services
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal mb-6">
              Get our services well<br />styled in pieces
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Four integrated platforms working together to create meaningful 
              environmental impact through technology and community.
            </p>
          </motion.div>

          <div className="space-y-24">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                <div className="flex-1">
                  <Link to={service.path} className="block group">
                    <div className="relative overflow-hidden rounded-2xl elegant-shadow">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full">
                        <span className="text-sm font-medium text-charcoal">{service.stats}</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="flex-1 max-w-lg">
                  <p className="text-primary-500 font-medium tracking-widest uppercase text-sm mb-3">
                    {service.subtitle}
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link 
                    to={service.path}
                    className="inline-flex items-center text-charcoal font-medium hover:text-primary-600 transition-colors"
                  >
                    Explore More
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-primary-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <p className="text-primary-600 font-medium tracking-widest uppercase text-sm mb-4">
                Why Choose EcoHub
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal mb-6 leading-tight">
                Providing Economical<br />
                yet best Quality Eco-services,<br />
                premium sustainability.
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                We believe that environmental action should be accessible to everyone. 
                Our platform combines cutting-edge technology with community-driven 
                initiatives to maximize your impact.
              </p>
              <Link to="/register" className="btn-primary inline-block">
                Join Our Community
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <img 
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80" 
                alt="Sustainable living"
                className="rounded-2xl elegant-shadow w-full h-96 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
              Ready to make a difference?
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of eco-conscious individuals and organizations 
              already creating positive change through EcoHub.
            </p>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-white text-charcoal px-10 py-4 rounded-full font-medium text-lg hover:bg-gray-100 transition-all inline-block"
              >
                View Your Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-white text-charcoal px-10 py-4 rounded-full font-medium text-lg hover:bg-gray-100 transition-all inline-block"
              >
                Get Started Today
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
