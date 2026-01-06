// Solar AI Service - Mock AI-powered solar calculations
// This service simulates AI-driven recommendations for solar panel installation

import { config, RoofType, SunlightExposure } from '../config/config';

export interface SolarInput {
  rooftopArea: number; // in sq ft
  monthlyBill: number; // in INR
  roofType: RoofType;
  sunlightExposure: SunlightExposure;
  location?: string;
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
}

export interface Recommendation {
  id: string;
  type: 'tip' | 'warning' | 'suggestion' | 'savings';
  title: string;
  description: string;
  icon: string;
  priority: number;
}

// Mock AI delay to simulate API call
const simulateAIDelay = () => new Promise(resolve => setTimeout(resolve, 1500));

// Generate AI-powered recommendations based on input
const generateRecommendations = (input: SolarInput, result: Partial<SolarCalculationResult>): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const roofInfo = config.roofTypes[input.roofType];
  const sunInfo = config.sunlightExposure[input.sunlightExposure];

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

// Main calculation function - simulates AI processing
export const calculateSolarSavings = async (input: SolarInput): Promise<SolarCalculationResult> => {
  // Simulate AI processing delay
  await simulateAIDelay();

  const { solar } = config;
  const roofInfo = config.roofTypes[input.roofType];
  const sunInfo = config.sunlightExposure[input.sunlightExposure];

  // Calculate monthly energy consumption from bill
  const monthlyConsumptionKwh = input.monthlyBill / solar.electricityRatePerKwh;
  
  // Calculate required system size to offset consumption
  const dailyConsumptionKwh = monthlyConsumptionKwh / 30;
  const effectiveSunHours = sunInfo.hours * sunInfo.multiplier * roofInfo.efficiency * solar.systemEfficiency;
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
  };

  // Generate AI recommendations
  result.recommendations = generateRecommendations(input, result);

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
