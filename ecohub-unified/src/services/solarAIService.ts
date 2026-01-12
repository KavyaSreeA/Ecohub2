// Solar AI Service - AI-powered solar calculations with real weather data
// This service provides accurate solar recommendations using OpenWeatherMap API

import { config, RoofType, SunlightExposure } from '../config/config';

export interface SolarInput {
  rooftopArea: number; // in sq ft
  monthlyBill: number; // in INR
  roofType: RoofType;
  sunlightExposure: SunlightExposure;
  location?: string;
}

export interface WeatherSolarData {
  city: string;
  avgTemp: number;
  avgHumidity: number;
  avgCloudCover: number;
  avgWindSpeed: number;
  solarIrradiance: number; // Estimated kWh/m²/day
  optimalMonths: string[];
  weatherAdjustmentFactor: number;
}

export interface SolarCalculationResult {
  // Panel Recommendations
  recommendedPanels: number;
  systemSizeKw: number;
  rooftopAreaRequired: number;
  
  // Cost Analysis
  totalCost: number;
  subsidyAmount: number;
  netCost: number;
  installationCost: number;
  
  // Savings Analysis
  monthlyGeneration: number; // kWh
  annualGeneration: number; // kWh
  monthlySavings: number;
  annualSavings: number;
  paybackPeriodYears: number;
  lifetimeSavings: number;
  
  // Environmental Impact
  annualCo2Offset: number; // kg
  lifetimeCo2Offset: number; // tons
  treesEquivalent: number;
  
  // AI Recommendations
  recommendations: Recommendation[];
  suitabilityScore: number; // 0-100
  roofSuitability: string;
  
  // Weather Data (if available)
  weatherData?: WeatherSolarData;
}

export interface Recommendation {
  id: string;
  type: 'tip' | 'warning' | 'suggestion' | 'savings';
  title: string;
  description: string;
  icon: string;
  priority: number;
}

// City coordinates for weather lookup
const CITY_COORDS: Record<string, { lat: number; lon: number; name: string }> = {
  'chennai': { lat: 13.08, lon: 80.27, name: 'Chennai' },
  'mumbai': { lat: 19.08, lon: 72.88, name: 'Mumbai' },
  'delhi': { lat: 28.61, lon: 77.23, name: 'Delhi' },
  'bangalore': { lat: 12.97, lon: 77.59, name: 'Bangalore' },
  'hyderabad': { lat: 17.39, lon: 78.49, name: 'Hyderabad' },
  'kolkata': { lat: 22.57, lon: 88.36, name: 'Kolkata' },
  'pune': { lat: 18.52, lon: 73.86, name: 'Pune' },
  'ahmedabad': { lat: 23.02, lon: 72.57, name: 'Ahmedabad' },
};

// Fetch real weather data for solar calculations
export const fetchWeatherSolarData = async (location: string): Promise<WeatherSolarData | null> => {
  try {
    const cityKey = location.toLowerCase().replace(/[^a-z]/g, '');
    const coords = CITY_COORDS[cityKey] || CITY_COORDS['chennai'];

    // Fetch current weather
    const weatherResponse = await fetch(
      `${config.energy.openWeather.baseUrl}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${config.energy.openWeather.apiKey}&units=metric`
    );

    // Fetch 5-day forecast for better average
    const forecastResponse = await fetch(
      `${config.energy.openWeather.baseUrl}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${config.energy.openWeather.apiKey}&units=metric`
    );

    if (!weatherResponse.ok || !forecastResponse.ok) {
      return null;
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    // Calculate averages from forecast data
    const forecasts = forecastData.list;
    const avgTemp = forecasts.reduce((sum: number, f: any) => sum + f.main.temp, 0) / forecasts.length;
    const avgHumidity = forecasts.reduce((sum: number, f: any) => sum + f.main.humidity, 0) / forecasts.length;
    const avgCloudCover = forecasts.reduce((sum: number, f: any) => sum + f.clouds.all, 0) / forecasts.length;
    const avgWindSpeed = forecasts.reduce((sum: number, f: any) => sum + f.wind.speed, 0) / forecasts.length;

    // Estimate solar irradiance based on location and cloud cover
    // Base irradiance for India is approximately 4-7 kWh/m²/day
    const latitudeFactor = Math.cos((coords.lat * Math.PI) / 180) * 0.5 + 0.5;
    const cloudFactor = 1 - (avgCloudCover / 100) * 0.6;
    const baseSolarIrradiance = 5.5; // Average for India
    const solarIrradiance = baseSolarIrradiance * latitudeFactor * cloudFactor;

    // Determine weather adjustment factor
    let weatherAdjustmentFactor = 1.0;
    if (avgCloudCover < 30) weatherAdjustmentFactor = 1.1;
    else if (avgCloudCover < 50) weatherAdjustmentFactor = 1.0;
    else if (avgCloudCover < 70) weatherAdjustmentFactor = 0.85;
    else weatherAdjustmentFactor = 0.7;

    // High humidity reduces efficiency
    if (avgHumidity > 80) weatherAdjustmentFactor *= 0.95;

    // Temperature impact (panels work better in moderate temps)
    if (avgTemp > 35) weatherAdjustmentFactor *= 0.95;
    if (avgTemp < 15) weatherAdjustmentFactor *= 0.98;

    // Determine optimal months based on location
    const optimalMonths = coords.lat > 20 
      ? ['October', 'November', 'December', 'January', 'February', 'March']
      : ['January', 'February', 'March', 'October', 'November', 'December'];

    return {
      city: coords.name,
      avgTemp: Math.round(avgTemp * 10) / 10,
      avgHumidity: Math.round(avgHumidity),
      avgCloudCover: Math.round(avgCloudCover),
      avgWindSpeed: Math.round(avgWindSpeed * 10) / 10,
      solarIrradiance: Math.round(solarIrradiance * 100) / 100,
      optimalMonths,
      weatherAdjustmentFactor: Math.round(weatherAdjustmentFactor * 100) / 100,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Simulate processing delay
const simulateAIDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

// Generate AI-powered recommendations based on input and weather data
const generateRecommendations = (input: SolarInput, result: Partial<SolarCalculationResult>, weatherData: WeatherSolarData | null): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const roofInfo = config.roofTypes[input.roofType];
  const sunInfo = config.sunlightExposure[input.sunlightExposure];

  // Weather-based recommendations (if real data available)
  if (weatherData) {
    recommendations.push({
      id: 'weather-analysis',
      type: 'tip',
      title: `Live Weather Analysis for ${weatherData.city}`,
      description: `Current conditions: ${weatherData.avgTemp}°C, ${weatherData.avgCloudCover}% cloud cover. Solar irradiance: ${weatherData.solarIrradiance} kWh/m²/day. ${weatherData.weatherAdjustmentFactor >= 1 ? 'Excellent' : weatherData.weatherAdjustmentFactor >= 0.9 ? 'Good' : 'Moderate'} conditions for solar generation.`,
      icon: 'sun',
      priority: 0,
    });

    if (weatherData.avgCloudCover > 50) {
      recommendations.push({
        id: 'cloud-advisory',
        type: 'warning',
        title: 'Cloud Cover Advisory',
        description: `Current cloud cover is ${weatherData.avgCloudCover}%. Consider that actual generation may vary. Best months for solar in ${weatherData.city}: ${weatherData.optimalMonths.slice(0, 3).join(', ')}.`,
        icon: 'cloud',
        priority: 1,
      });
    }

    if (weatherData.avgHumidity > 75) {
      recommendations.push({
        id: 'humidity-tip',
        type: 'tip',
        title: 'High Humidity Area',
        description: `Humidity levels averaging ${weatherData.avgHumidity}% can cause dust accumulation. Schedule panel cleaning more frequently (every 2-3 months) for optimal performance.`,
        icon: 'droplets',
        priority: 2,
      });
    }
  }

  // Roof-based recommendations
  if (roofInfo.efficiency < 0.9) {
    recommendations.push({
      id: 'roof-optimization',
      type: 'suggestion',
      title: 'Consider Roof Optimization',
      description: `Your ${roofInfo.name.toLowerCase()} may benefit from mounting adjustments to maximize solar exposure. This could increase efficiency by up to ${Math.round((1 - roofInfo.efficiency) * 100)}%.`,
      icon: 'home',
      priority: 2,
    });
  }

  // Sunlight recommendations
  if (input.sunlightExposure === 'limited' || input.sunlightExposure === 'moderate') {
    recommendations.push({
      id: 'tree-trimming',
      type: 'tip',
      title: 'Maximize Sunlight Exposure',
      description: 'Consider trimming nearby trees or removing obstructions that may be blocking sunlight. Even a 1-hour increase in sun exposure can boost annual generation by 15-20%.',
      icon: 'tree',
      priority: 1,
    });
  }

  // High bill savings opportunity
  if (input.monthlyBill > 5000) {
    recommendations.push({
      id: 'high-savings',
      type: 'savings',
      title: 'Excellent Savings Potential',
      description: `With your current electricity bill of ₹${input.monthlyBill.toLocaleString('en-IN')}, you could save up to ₹${((result.annualSavings || 0) * 25).toLocaleString('en-IN')} over the system's lifetime!`,
      icon: 'coins',
      priority: 1,
    });
  }

  // Government subsidy info
  recommendations.push({
    id: 'subsidy-info',
    type: 'tip',
    title: 'Government Subsidy Available',
    description: `You may be eligible for a ${config.solar.subsidyPercent * 100}% subsidy under the PM Surya Ghar scheme. This could save you ₹${(result.subsidyAmount || 0).toLocaleString('en-IN')} on installation!`,
    icon: 'landmark',
    priority: 2,
  });

  // Net metering suggestion
  if ((result.monthlyGeneration || 0) > input.monthlyBill / config.solar.electricityRatePerKwh) {
    recommendations.push({
      id: 'net-metering',
      type: 'suggestion',
      title: 'Consider Net Metering',
      description: 'Your system may generate more power than you consume. With net metering, you can sell excess electricity back to the grid and earn additional income.',
      icon: 'zap',
      priority: 2,
    });
  }

  // Battery storage suggestion
  if (input.sunlightExposure === 'excellent' || input.sunlightExposure === 'good') {
    recommendations.push({
      id: 'battery-storage',
      type: 'suggestion',
      title: 'Add Battery Storage',
      description: 'Consider adding battery storage to store excess energy generated during peak sunlight hours. This provides backup power during outages and maximizes savings.',
      icon: 'battery',
      priority: 3,
    });
  }

  // Maintenance tip
  recommendations.push({
    id: 'maintenance',
    type: 'tip',
    title: 'Regular Maintenance',
    description: 'Clean your solar panels every 3-6 months to maintain optimal efficiency. Dust and debris can reduce output by up to 25%.',
    icon: 'sparkles',
    priority: 4,
  });

  // Sort by priority
  return recommendations.sort((a, b) => a.priority - b.priority);
};

// Calculate suitability score based on inputs
const calculateSuitabilityScore = (input: SolarInput): number => {
  let score = 70; // Base score

  // Roof type impact
  const roofInfo = config.roofTypes[input.roofType];
  score += (roofInfo.efficiency - 0.75) * 40; // +0 to +10 based on roof

  // Sunlight impact
  const sunInfo = config.sunlightExposure[input.sunlightExposure];
  score += (sunInfo.multiplier - 0.7) * 25; // +0 to +10 based on sun

  // Area impact (larger area = better)
  if (input.rooftopArea >= 500) score += 5;
  if (input.rooftopArea >= 1000) score += 5;

  // Bill impact (higher bill = more savings potential)
  if (input.monthlyBill >= 3000) score += 3;
  if (input.monthlyBill >= 5000) score += 4;
  if (input.monthlyBill >= 10000) score += 3;

  return Math.min(100, Math.max(0, Math.round(score)));
};

// Main calculation function - uses real weather data when available
export const calculateSolarSavings = async (input: SolarInput): Promise<SolarCalculationResult> => {
  // Simulate AI processing delay
  await simulateAIDelay();

  const { solar } = config;
  const roofInfo = config.roofTypes[input.roofType];
  const sunInfo = config.sunlightExposure[input.sunlightExposure];

  // Fetch real weather data if location is provided
  let weatherData: WeatherSolarData | null = null;
  let weatherAdjustment = 1.0;
  
  if (input.location) {
    weatherData = await fetchWeatherSolarData(input.location);
    if (weatherData) {
      weatherAdjustment = weatherData.weatherAdjustmentFactor;
    }
  }

  // Calculate monthly energy consumption from bill
  const monthlyConsumptionKwh = input.monthlyBill / solar.electricityRatePerKwh;
  
  // Calculate required system size to offset consumption
  const dailyConsumptionKwh = monthlyConsumptionKwh / 30;
  
  // Apply weather adjustment to sun hours if real data is available
  const baseSunHours = weatherData ? weatherData.solarIrradiance : sunInfo.hours;
  const effectiveSunHours = baseSunHours * sunInfo.multiplier * roofInfo.efficiency * solar.systemEfficiency * weatherAdjustment;
  const requiredSystemKw = dailyConsumptionKwh / effectiveSunHours;
  
  // Calculate number of panels needed
  const panelsNeeded = Math.ceil((requiredSystemKw * 1000) / solar.panelWattage);
  const actualSystemKw = (panelsNeeded * solar.panelWattage) / 1000;
  
  // Calculate rooftop area required
  const areaRequired = panelsNeeded * solar.panelSizeSqFt;
  
  // Adjust if rooftop area is limited
  const maxPanels = Math.floor(input.rooftopArea / solar.panelSizeSqFt);
  const finalPanels = Math.min(panelsNeeded, maxPanels);
  const finalSystemKw = (finalPanels * solar.panelWattage) / 1000;
  
  // Cost calculations
  const equipmentCost = finalSystemKw * 1000 * solar.costPerWatt;
  const installationCost = equipmentCost * solar.installationCostPercent;
  const totalCostBeforeSubsidy = equipmentCost + installationCost;
  const subsidyAmount = totalCostBeforeSubsidy * solar.subsidyPercent;
  const netCost = totalCostBeforeSubsidy - subsidyAmount;
  
  // Generation calculations
  const dailyGeneration = finalSystemKw * effectiveSunHours;
  const monthlyGeneration = dailyGeneration * 30;
  const annualGeneration = monthlyGeneration * 12;
  
  // Savings calculations
  const monthlySavings = Math.min(monthlyGeneration, monthlyConsumptionKwh) * solar.electricityRatePerKwh;
  const annualSavings = monthlySavings * 12 - solar.maintenanceCostPerYear;
  
  // Payback period
  const paybackPeriodYears = netCost / annualSavings;
  
  // Lifetime savings (accounting for degradation)
  let lifetimeSavings = 0;
  let currentEfficiency = 1;
  for (let year = 1; year <= solar.panelLifespanYears; year++) {
    lifetimeSavings += annualSavings * currentEfficiency;
    currentEfficiency -= solar.annualDegradation;
  }
  
  // Environmental impact
  const annualCo2Offset = annualGeneration * solar.co2OffsetPerKwh;
  const lifetimeCo2Offset = annualCo2Offset * solar.panelLifespanYears / 1000; // Convert to tons
  const treesEquivalent = Math.round(lifetimeCo2Offset * 50); // ~50 trees per ton CO2

  // Build result object
  const result: SolarCalculationResult = {
    recommendedPanels: finalPanels,
    systemSizeKw: Math.round(finalSystemKw * 100) / 100,
    rooftopAreaRequired: Math.round(areaRequired),
    
    totalCost: Math.round(totalCostBeforeSubsidy),
    subsidyAmount: Math.round(subsidyAmount),
    netCost: Math.round(netCost),
    installationCost: Math.round(installationCost),
    
    monthlyGeneration: Math.round(monthlyGeneration),
    annualGeneration: Math.round(annualGeneration),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    paybackPeriodYears: Math.round(paybackPeriodYears * 10) / 10,
    lifetimeSavings: Math.round(lifetimeSavings),
    
    annualCo2Offset: Math.round(annualCo2Offset),
    lifetimeCo2Offset: Math.round(lifetimeCo2Offset * 10) / 10,
    treesEquivalent,
    
    recommendations: [],
    suitabilityScore: calculateSuitabilityScore(input),
    roofSuitability: roofInfo.suitability,
    weatherData: weatherData || undefined,
  };

  // Generate AI recommendations (including weather-based)
  result.recommendations = generateRecommendations(input, result, weatherData);

  return result;
};

// Quick estimation without full calculation (for preview)
export const quickEstimate = (monthlyBill: number): { savingsRange: string; paybackRange: string } => {
  const minSavings = Math.round(monthlyBill * 0.7);
  const maxSavings = Math.round(monthlyBill * 0.95);
  
  return {
    savingsRange: `₹${minSavings.toLocaleString('en-IN')} - ₹${maxSavings.toLocaleString('en-IN')}`,
    paybackRange: '4-7 years',
  };
};
