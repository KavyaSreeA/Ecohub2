import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole } from '../context/AuthContext';

interface RoleOption {
  id: UserRole;
  title: string;
  icon: string;
  description: string;
  features: string[];
}

const roleOptions: RoleOption[] = [
  {
    id: 'individual',
    title: 'Individual',
    icon: '👤',
    description: 'For personal sustainability journey',
    features: ['Track carbon footprint', 'Book eco-rides', 'Donate to campaigns', 'Join events']
  },
  {
    id: 'business',
    title: 'Business',
    icon: '🏢',
    description: 'For companies & enterprises',
    features: ['List recyclable waste', 'Offer energy services', 'Fleet management', 'B2B matching']
  },
  {
    id: 'community',
    title: 'Community/NGO',
    icon: '🌍',
    description: 'For organizations & groups',
    features: ['Create campaigns', 'Organize events', 'Manage volunteers', 'Bulk bookings']
  }
];

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('individual');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Business fields
    businessName: '',
    businessType: '',
    gstNumber: '',
    msmeRegistration: '',
    industry: '',
    // Community fields
    organizationName: '',
    organizationType: '',
    registrationNumber: '',
    focusAreas: [] as string[]
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFocusAreaChange = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const validateStep1 = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!formData.name || !formData.email) {
      setError('Please fill all required fields');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      if (selectedRole === 'individual') {
        handleSubmit();
      } else {
        setStep(2);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: selectedRole,
      phone: formData.phone,
      ...(selectedRole === 'business' && {
        businessName: formData.businessName,
        businessType: formData.businessType,
        gstNumber: formData.gstNumber,
        msmeRegistration: formData.msmeRegistration,
        industry: formData.industry
      }),
      ...(selectedRole === 'community' && {
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        registrationNumber: formData.registrationNumber,
        focusAreas: formData.focusAreas
      })
    };

    const result = await register(registerData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  const focusAreaOptions = [
    'Environment', 'Wildlife', 'Education', 'Health', 'Climate', 'Waste Management', 'Renewable Energy', 'Conservation'
  ];

  const industryOptions = [
    'Manufacturing', 'Retail', 'Technology', 'Healthcare', 'Construction', 'Food & Beverage', 'Logistics', 'Other'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cream overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg py-8"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🌍</span>
            </div>
            <span className="text-2xl font-serif font-semibold text-charcoal">EcoHub</span>
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="font-serif text-3xl font-semibold text-charcoal mb-2">
                  Create your account
                </h1>
                <p className="text-gray-500 mb-6">
                  Choose your account type to get started
                </p>

                {/* Role Selection */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {roleOptions.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedRole === role.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{role.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-charcoal">{role.title}</h3>
                            {selectedRole === role.id && (
                              <span className="text-primary-500">✓</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">
                        Full name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-1">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
                      Email address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1">
                        Password *
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal mb-1">
                        Confirm password *
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      required
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-charcoal text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : selectedRole === 'individual' ? (
                      'Create account'
                    ) : (
                      'Continue →'
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && selectedRole === 'business' && (
              <motion.div
                key="step2-business"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="font-serif text-3xl font-semibold text-charcoal mb-2">
                  Business Details
                </h1>
                <p className="text-gray-500 mb-6">
                  Tell us about your organization
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-charcoal mb-1">
                      Business Name *
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Your Company Pvt. Ltd."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="businessType" className="block text-sm font-medium text-charcoal mb-1">
                        Business Type *
                      </label>
                      <select
                        id="businessType"
                        name="businessType"
                        required
                        value={formData.businessType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select type</option>
                        <option value="private">Private Limited</option>
                        <option value="public">Public Limited</option>
                        <option value="partnership">Partnership</option>
                        <option value="proprietorship">Proprietorship</option>
                        <option value="llp">LLP</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-charcoal mb-1">
                        Industry *
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        required
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select industry</option>
                        {industryOptions.map(ind => (
                          <option key={ind} value={ind.toLowerCase()}>{ind}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gstNumber" className="block text-sm font-medium text-charcoal mb-1">
                        GST Number
                      </label>
                      <input
                        id="gstNumber"
                        name="gstNumber"
                        type="text"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="22AAAAA0000A1Z5"
                      />
                    </div>
                    <div>
                      <label htmlFor="msmeRegistration" className="block text-sm font-medium text-charcoal mb-1">
                        MSME/Udyam No.
                      </label>
                      <input
                        id="msmeRegistration"
                        name="msmeRegistration"
                        type="text"
                        value={formData.msmeRegistration}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="UDYAM-XX-00-0000000"
                      />
                    </div>
                  </div>

                  <div className="bg-primary-50 p-4 rounded-xl">
                    <p className="text-sm text-primary-700">
                      <span className="font-medium">Note:</span> Business accounts require verification. Your account will be activated after our team reviews your details.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3.5 border border-gray-300 text-charcoal rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3.5 bg-charcoal text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Creating...' : 'Create Business Account'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && selectedRole === 'community' && (
              <motion.div
                key="step2-community"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="font-serif text-3xl font-semibold text-charcoal mb-2">
                  Organization Details
                </h1>
                <p className="text-gray-500 mb-6">
                  Tell us about your community or NGO
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-charcoal mb-1">
                      Organization Name *
                    </label>
                    <input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      required
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Green Earth Foundation"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="organizationType" className="block text-sm font-medium text-charcoal mb-1">
                        Organization Type *
                      </label>
                      <select
                        id="organizationType"
                        name="organizationType"
                        required
                        value={formData.organizationType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select type</option>
                        <option value="ngo">NGO</option>
                        <option value="community_group">Community Group</option>
                        <option value="educational">Educational Institution</option>
                        <option value="government">Government Body</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="registrationNumber" className="block text-sm font-medium text-charcoal mb-1">
                        Registration Number
                      </label>
                      <input
                        id="registrationNumber"
                        name="registrationNumber"
                        type="text"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="NGO/REG/2024/XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Focus Areas *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {focusAreaOptions.map(area => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => handleFocusAreaChange(area)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            formData.focusAreas.includes(area)
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary-50 p-4 rounded-xl">
                    <p className="text-sm text-primary-700">
                      <span className="font-medium">Note:</span> Community accounts can create campaigns and organize events after verification.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3.5 border border-gray-300 text-charcoal rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || formData.focusAreas.length === 0}
                      className="flex-1 py-3.5 bg-charcoal text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Creating...' : 'Create Community Account'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=80" 
          alt="Sustainable Future" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-charcoal/60 to-transparent flex items-center justify-end">
          <div className="p-16 text-white max-w-lg text-right">
            <h2 className="font-serif text-4xl font-semibold mb-6">
              {selectedRole === 'individual' && 'Start your green journey'}
              {selectedRole === 'business' && 'Sustainable business starts here'}
              {selectedRole === 'community' && 'Lead the change together'}
            </h2>
            <p className="text-lg text-gray-200 leading-relaxed">
              {selectedRole === 'individual' && 'Track your impact, reduce your footprint, and be part of a growing movement for change.'}
              {selectedRole === 'business' && 'Connect with eco-conscious partners, manage waste efficiently, and showcase your sustainability efforts.'}
              {selectedRole === 'community' && 'Organize campaigns, rally volunteers, and create lasting impact in your community.'}
            </p>
            {selectedRole !== 'individual' && (
              <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur">
                <h3 className="font-medium mb-2">Benefits for {selectedRole === 'business' ? 'Businesses' : 'Organizations'}:</h3>
                <ul className="text-sm space-y-1 text-gray-200">
                  {roleOptions.find(r => r.id === selectedRole)?.features.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
