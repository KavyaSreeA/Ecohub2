import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EnergyContactPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
    interest: 'consultation'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const source = location.state?.source;

  // Company info for each energy source
  const companyInfo: Record<string, {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    founded: string;
    employees: string;
    image: string;
  }> = {
    'Solar Power': {
      name: 'SunBright Energy Solutions',
      description: 'Leading provider of residential and commercial solar panel installations. We help homes and businesses harness the power of the sun with cutting-edge photovoltaic technology.',
      address: '123 Solar Avenue, Bangalore, Karnataka 560001',
      phone: '+91 80 4567 8901',
      email: 'contact@sunbright.energy',
      website: 'www.sunbright.energy',
      founded: '2015',
      employees: '500+',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'
    },
    'Wind Energy': {
      name: 'WindForce Renewables',
      description: 'Pioneering wind energy solutions across India. Our wind farms generate clean electricity for millions of households while creating sustainable jobs.',
      address: '456 Wind Mill Road, Chennai, Tamil Nadu 600001',
      phone: '+91 44 5678 9012',
      email: 'info@windforce.in',
      website: 'www.windforce.in',
      founded: '2012',
      employees: '750+',
      image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80'
    },
    'Hydroelectric': {
      name: 'HydroPower India Ltd.',
      description: 'Harnessing the power of water to generate sustainable electricity. Our hydroelectric plants provide reliable, renewable energy to communities across the nation.',
      address: '789 Dam View Road, Dehradun, Uttarakhand 248001',
      phone: '+91 135 234 5678',
      email: 'contact@hydropowerindia.com',
      website: 'www.hydropowerindia.com',
      founded: '2008',
      employees: '1200+',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80'
    },
    'Geothermal': {
      name: 'GeoTherm Energy Systems',
      description: 'Tapping into Earth\'s natural heat for sustainable power generation. Our geothermal plants provide consistent, clean energy regardless of weather conditions.',
      address: '321 Thermal Springs Lane, Pune, Maharashtra 411001',
      phone: '+91 20 6789 0123',
      email: 'hello@geotherm.energy',
      website: 'www.geotherm.energy',
      founded: '2018',
      employees: '300+',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
    }
  };

  const company = source ? companyInfo[source.name] : null;

  if (!company) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-semibold text-charcoal mb-4">Company not found</h1>
          <button 
            onClick={() => navigate('/energy')}
            className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
          >
            Back to Energy
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img 
          src={company.image} 
          alt={company.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-charcoal/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button 
                onClick={() => navigate('/energy')}
                className="mb-4 text-white/80 hover:text-white flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Energy
              </button>
              <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-2">{company.name}</h1>
              <p className="text-lg text-gray-200">{source.name} Solutions Provider</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl elegant-shadow p-6"
            >
              <h2 className="text-xl font-serif font-semibold text-charcoal mb-4">About the Company</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{company.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-charcoal">{company.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-charcoal">{company.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-primary-600">{company.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="text-primary-600">{company.website}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl elegant-shadow p-6"
            >
              <h2 className="text-xl font-serif font-semibold text-charcoal mb-4">Quick Facts</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-serif font-semibold text-primary-600">{company.founded}</p>
                  <p className="text-sm text-gray-500">Founded</p>
                </div>
                <div className="bg-primary-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-serif font-semibold text-primary-600">{company.employees}</p>
                  <p className="text-sm text-gray-500">Employees</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl elegant-shadow p-8"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-serif font-semibold text-charcoal mb-2">Message Sent!</h2>
                  <p className="text-gray-500 mb-6">
                    Thank you for contacting {company.name}. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => navigate('/energy')}
                    className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                  >
                    Back to Energy
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-serif font-semibold text-charcoal mb-2">Contact Us</h2>
                  <p className="text-gray-500 mb-8">
                    Interested in {source.name.toLowerCase()}? Fill out the form below and our team will reach out to you.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Interest</label>
                        <select
                          value={formData.interest}
                          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                          <option value="consultation">Free Consultation</option>
                          <option value="installation">Installation Quote</option>
                          <option value="partnership">Business Partnership</option>
                          <option value="investment">Investment Opportunity</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about your energy needs..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyContactPage;
