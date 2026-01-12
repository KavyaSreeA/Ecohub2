// Google Maps Service - Location, Directions, and Places functionality
import { config } from '../config/config';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  placeId?: string;
}

export interface DirectionsResult {
  distance: string;
  duration: string;
  steps: DirectionStep[];
  polyline: string;
  co2Savings?: number;
}

export interface DirectionStep {
  instruction: string;
  distance: string;
  duration: string;
  travelMode: string;
}

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  location: Location;
  rating?: number;
  types: string[];
  distance?: string;
}

export interface TransportMode {
  mode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
  label: string;
  icon: string;
  co2PerKm: number; // kg CO2 per km
}

// Transport modes with CO2 emissions data
export const TRANSPORT_MODES: TransportMode[] = [
  { mode: 'DRIVING', label: 'Drive', icon: 'car', co2PerKm: 0.21 },
  { mode: 'TRANSIT', label: 'Transit', icon: 'bus', co2PerKm: 0.089 },
  { mode: 'BICYCLING', label: 'Cycle', icon: 'bike', co2PerKm: 0 },
  { mode: 'WALKING', label: 'Walk', icon: 'walk', co2PerKm: 0 },
];

// EV Charging station types
export const EV_CHARGING_TYPES = [
  'electric_vehicle_charging_station',
  'charging_station',
];

// Green transport place types
export const GREEN_PLACES = {
  evCharging: ['electric_vehicle_charging_station'],
  bikeShare: ['bicycle_store', 'bicycle_rental'],
  publicTransit: ['bus_station', 'train_station', 'subway_station', 'transit_station'],
  parks: ['park', 'natural_feature'],
};

// Calculate CO2 savings between transport modes
export const calculateCO2Savings = (
  distanceKm: number,
  fromMode: TransportMode,
  toMode: TransportMode
): number => {
  const fromEmissions = distanceKm * fromMode.co2PerKm;
  const toEmissions = distanceKm * toMode.co2PerKm;
  return Math.max(0, fromEmissions - toEmissions);
};

// Parse distance string to km
export const parseDistanceToKm = (distanceText: string): number => {
  const match = distanceText.match(/[\d.]+/);
  if (!match) return 0;
  const value = parseFloat(match[0]);
  if (distanceText.toLowerCase().includes('mi')) {
    return value * 1.60934; // Convert miles to km
  }
  return value;
};

// Format CO2 savings
export const formatCO2Savings = (kgCO2: number): string => {
  if (kgCO2 < 1) {
    return `${Math.round(kgCO2 * 1000)}g CO₂`;
  }
  return `${kgCO2.toFixed(2)}kg CO₂`;
};

// Get Google Maps script URL
export const getGoogleMapsScriptUrl = (): string => {
  return `https://maps.googleapis.com/maps/api/js?key=${config.maps.google.apiKey}&libraries=places,geometry,directions`;
};

// Default map center (India)
export const DEFAULT_CENTER: Location = {
  lat: 20.5937,
  lng: 78.9629,
};

// Default map options for eco-friendly appearance
export const DEFAULT_MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'on' }],
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry.fill',
      stylers: [{ color: '#e8f5e9' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#bbdefb' }],
    },
  ],
};

// Indian city coordinates for quick access
export const INDIAN_CITIES: Record<string, Location> = {
  'Mumbai': { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' },
  'Delhi': { lat: 28.6139, lng: 77.2090, address: 'New Delhi, Delhi' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, address: 'Bangalore, Karnataka' },
  'Chennai': { lat: 13.0827, lng: 80.2707, address: 'Chennai, Tamil Nadu' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, address: 'Hyderabad, Telangana' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, address: 'Kolkata, West Bengal' },
  'Pune': { lat: 18.5204, lng: 73.8567, address: 'Pune, Maharashtra' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad, Gujarat' },
};

// Marker icons for different place types
export const MARKER_ICONS = {
  evCharging: {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#22c55e">
        <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5a2.5 2.5 0 0 0 5 0V9c0-.69-.28-1.32-.73-1.77zM18 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM8 18v-4.5H6L10 6v5h2l-4 7z"/>
      </svg>
    `),
    scaledSize: { width: 32, height: 32 },
  },
  bikeShare: {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6">
        <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
      </svg>
    `),
    scaledSize: { width: 32, height: 32 },
  },
  transit: {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#f59e0b">
        <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-6H6V6h5v5zm2 0V6h5v5h-5zm3.5 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    `),
    scaledSize: { width: 32, height: 32 },
  },
  user: {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ef4444">
        <circle cx="12" cy="12" r="8" stroke="#fff" stroke-width="2"/>
      </svg>
    `),
    scaledSize: { width: 24, height: 24 },
  },
};

export default {
  config: config.maps.google,
  TRANSPORT_MODES,
  GREEN_PLACES,
  INDIAN_CITIES,
  DEFAULT_CENTER,
  DEFAULT_MAP_OPTIONS,
  calculateCO2Savings,
  parseDistanceToKm,
  formatCO2Savings,
  getGoogleMapsScriptUrl,
};
