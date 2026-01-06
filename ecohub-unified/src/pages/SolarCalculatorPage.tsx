import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Calculator, Bot, Lightbulb, CheckCircle, Zap, Square, Ruler, Clock, Coins, TrendingUp, Globe, TreePine, Home, Landmark, Battery, Sparkles } from 'lucide-react';
import { config, RoofType, SunlightExposure } from '../config/config';
import { calculateSolarSavings, SolarCalculationResult, SolarInput } from '../services/solarAIService';

// Helper function to render recommendation icons
const getRecommendationIcon = (iconName: string) => {
  const iconClass = "w-6 h-6";
  switch (iconName) {
    case 'home': return <Home className={`${iconClass} text-gray-600`} />;
    case 'tree': return <TreePine className={`${iconClass} text-green-600`} />;
    case 'coins': return <Coins className={`${iconClass} text-yellow-600`} />;
    case 'landmark': return <Landmark className={`${iconClass} text-blue-600`} />;
    case 'zap': return <Zap className={`${iconClass} text-yellow-500`} />;
    case 'battery': return <Battery className={`${iconClass} text-green-500`} />;
    case 'sparkles': return <Sparkles className={`${iconClass} text-purple-500`} />;
    default: return <Lightbulb className={`${iconClass} text-gray-500`} />;
  }
};

const SolarCalculatorPage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<SolarInput>({
    rooftopArea: 500,
    monthlyBill: 3000,
    roofType: 'sloped',
    sunlightExposure: 'good',
    location: '',
  });
  
  // UI state
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<SolarCalculationResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rooftopArea' || name === 'monthlyBill' ? Number(value) : value,
    }));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const calculationResult = await calculateSolarSavings(formData);
      setResult(calculationResult);
      setShowResults(true);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative h-72 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80" 
          alt="Solar Panels"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-charcoal/40 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sun className="w-12 h-12 text-yellow-400 mb-4" />
              <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-4">Solar Calculator</h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                AI-powered analysis to estimate your solar savings, costs, and environmental impact.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              {/* Calculator Form */}
              <div className="bg-white rounded-2xl elegant-shadow p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-charcoal">Calculate Your Solar Potential</h2>
                    <p className="text-sm text-gray-500">Fill in your details for a personalized estimate</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Rooftop Area */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Available Rooftop Area (sq ft)
                    </label>
                    <input
                      type="number"
                      name="rooftopArea"
                      value={formData.rooftopArea}
                      onChange={handleInputChange}
                      min="100"
                      max="10000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="e.g., 500"
                    />
                    <p className="mt-1 text-xs text-gray-400">Approximate area available for solar panel installation</p>
                  </div>

                  {/* Monthly Electricity Bill */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Monthly Electricity Bill (₹)
                    </label>
                    <input
                      type="number"
                      name="monthlyBill"
                      value={formData.monthlyBill}
                      onChange={handleInputChange}
                      min="500"
                      max="100000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="e.g., 3000"
                    />
                    <p className="mt-1 text-xs text-gray-400">Your average monthly electricity bill</p>
                  </div>

                  {/* Roof Type */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Roof Type
                    </label>
                    <select
                      name="roofType"
                      value={formData.roofType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                    >
                      {Object.entries(config.roofTypes).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.name} - {value.suitability}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sunlight Exposure */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Daily Sunlight Exposure
                    </label>
                    <select
                      name="sunlightExposure"
                      value={formData.sunlightExposure}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                    >
                      {Object.entries(config.sunlightExposure).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-400">Average direct sunlight hours on your roof</p>
                  </div>

                  {/* Location (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="e.g., Mumbai, Maharashtra"
                    />
                  </div>

                  {/* Calculate Button */}
                  <button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isCalculating ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>AI is analyzing your data...</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-5 h-5" />
                        <span>Calculate with AI</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Info Banner */}
                <div className="mt-6 p-4 bg-primary-50 rounded-xl flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary-700">Powered by AI</p>
                    <p className="text-xs text-primary-600">Our AI analyzes your inputs to provide personalized recommendations and accurate cost estimates based on current market rates.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Results Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-serif font-semibold text-charcoal mb-2">Your Solar Analysis is Ready!</h2>
                <p className="text-gray-500">AI-powered insights for your solar installation</p>
              </div>

              {/* Suitability Score */}
              <div className="max-w-md mx-auto mb-8">
                <div className="bg-white rounded-2xl elegant-shadow p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Solar Suitability Score</p>
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                      <circle 
                        cx="64" cy="64" r="56" 
                        stroke={result.suitabilityScore >= 80 ? '#22c55e' : result.suitabilityScore >= 60 ? '#eab308' : '#ef4444'} 
                        strokeWidth="12" 
                        fill="none"
                        strokeDasharray={`${result.suitabilityScore * 3.52} 352`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-3xl font-serif font-semibold text-charcoal">{result.suitabilityScore}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-primary-600">{result.roofSuitability} for Solar</p>
                </div>
              </div>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl elegant-shadow p-5 text-center"
                >
                  <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-serif font-semibold text-charcoal">{result.systemSizeKw} kW</p>
                  <p className="text-sm text-gray-500">System Size</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl elegant-shadow p-5 text-center"
                >
                  <Square className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-serif font-semibold text-charcoal">{result.recommendedPanels}</p>
                  <p className="text-sm text-gray-500">Solar Panels</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl elegant-shadow p-5 text-center"
                >
                  <Ruler className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-serif font-semibold text-charcoal">{result.rooftopAreaRequired}</p>
                  <p className="text-sm text-gray-500">Sq Ft Required</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl elegant-shadow p-5 text-center"
                >
                  <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-serif font-semibold text-charcoal">{result.paybackPeriodYears} yrs</p>
                  <p className="text-sm text-gray-500">Payback Period</p>
                </motion.div>
              </div>

              {/* Cost & Savings Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Cost Breakdown */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl elegant-shadow p-6"
                >
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Coins className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-charcoal">Cost Breakdown</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Equipment & Panels</span>
                      <span className="font-medium text-charcoal">₹{(result.totalCost - result.installationCost).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Installation</span>
                      <span className="font-medium text-charcoal">₹{result.installationCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Total Cost</span>
                      <span className="font-medium text-charcoal">₹{result.totalCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-green-600 font-medium">Govt. Subsidy (40%)</span>
                      <span className="font-medium text-green-600">- ₹{result.subsidyAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold text-charcoal">Net Cost</span>
                      <span className="text-2xl font-serif font-semibold text-primary-600">₹{result.netCost.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Savings Breakdown */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl elegant-shadow p-6"
                >
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-charcoal">Savings Analysis</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Monthly Generation</span>
                      <span className="font-medium text-charcoal">{result.monthlyGeneration.toLocaleString('en-IN')} kWh</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Monthly Savings</span>
                      <span className="font-medium text-green-600">₹{result.monthlySavings.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Annual Savings</span>
                      <span className="font-medium text-green-600">₹{result.annualSavings.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold text-charcoal">25-Year Savings</span>
                      <span className="text-2xl font-serif font-semibold text-green-600">₹{result.lifetimeSavings.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Environmental Impact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-8 text-white"
              >
                <h3 className="text-xl font-serif font-semibold mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-2" /> Environmental Impact
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-serif font-semibold">{result.annualCo2Offset.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-green-100">kg CO₂/year offset</p>
                  </div>
                  <div className="text-center border-x border-green-400">
                    <p className="text-3xl font-serif font-semibold">{result.lifetimeCo2Offset}</p>
                    <p className="text-sm text-green-100">tons CO₂ lifetime</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-serif font-semibold">{result.treesEquivalent}</p>
                    <p className="text-sm text-green-100 flex items-center justify-center"><TreePine className="w-4 h-4 mr-1" /> trees equivalent</p>
                  </div>
                </div>
              </motion.div>

              {/* AI Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl elegant-shadow p-6 mb-8"
              >
                <div className="flex items-center space-x-3 mb-5">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-charcoal">AI Recommendations</h3>
                    <p className="text-sm text-gray-500">Personalized tips to maximize your solar investment</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {result.recommendations.map((rec) => (
                    <div 
                      key={rec.id} 
                      className={`p-4 rounded-xl border ${
                        rec.type === 'savings' ? 'bg-green-50 border-green-200' :
                        rec.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        rec.type === 'tip' ? 'bg-blue-50 border-blue-200' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getRecommendationIcon(rec.icon)}
                        <div>
                          <h4 className="font-medium text-charcoal">{rec.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  ← Recalculate
                </button>
                <button
                  onClick={() => navigate('/energy/contact', { state: { source: { name: 'Solar Power' }, calculation: result } })}
                  className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-medium hover:from-primary-600 hover:to-primary-700 transition-all"
                >
                  Contact Solar Providers →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SolarCalculatorPage;
