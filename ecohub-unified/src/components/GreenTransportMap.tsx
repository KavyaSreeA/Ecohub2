import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, Bike, Bus, Navigation, Leaf, Car, X, Search, Loader2 } from 'lucide-react';
import { config } from '../config/config';
import {
  Location,
  TRANSPORT_MODES,
  INDIAN_CITIES,
  DEFAULT_CENTER,
  DEFAULT_MAP_OPTIONS,
  calculateCO2Savings,
  parseDistanceToKm,
  formatCO2Savings,
  TransportMode,
} from '../services/mapsService';

const libraries: ("places" | "geometry" | "directions")[] = ['places', 'geometry', 'directions'];

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '16px',
};

interface NearbyPlace {
  placeId: string;
  name: string;
  address: string;
  location: Location;
  type: 'ev' | 'bike' | 'transit';
  rating?: number;
  distance?: string;
}

const GreenTransportMap = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [selectedMode, setSelectedMode] = useState<TransportMode>(TRANSPORT_MODES[1]); // Default to transit
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; co2Saved: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ev' | 'bike' | 'transit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState<Location | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: config.maps.google.apiKey,
    libraries,
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Fallback to selected city
          setUserLocation(INDIAN_CITIES[selectedCity]);
        }
      );
    } else {
      setUserLocation(INDIAN_CITIES[selectedCity]);
    }
  }, []);

  // Search for nearby green transport options
  const searchNearbyPlaces = useCallback(async (location: Location) => {
    if (!map) return;

    setIsSearching(true);
    const service = new google.maps.places.PlacesService(map);
    const places: NearbyPlace[] = [];

    const searchTypes = [
      { types: ['electric_vehicle_charging_station'], placeType: 'ev' as const },
      { types: ['bicycle_store'], placeType: 'bike' as const },
      { types: ['bus_station', 'train_station', 'subway_station'], placeType: 'transit' as const },
    ];

    for (const { types, placeType } of searchTypes) {
      for (const type of types) {
        try {
          await new Promise<void>((resolve) => {
            service.nearbySearch(
              {
                location: new google.maps.LatLng(location.lat, location.lng),
                radius: 5000,
                type: type,
              },
              (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                  results.slice(0, 5).forEach((place) => {
                    if (place.geometry?.location && place.place_id) {
                      places.push({
                        placeId: place.place_id,
                        name: place.name || 'Unknown',
                        address: place.vicinity || '',
                        location: {
                          lat: place.geometry.location.lat(),
                          lng: place.geometry.location.lng(),
                        },
                        type: placeType,
                        rating: place.rating,
                      });
                    }
                  });
                }
                resolve();
              }
            );
          });
        } catch (err) {
          console.error('Places search error:', err);
        }
      }
    }

    setNearbyPlaces(places);
    setIsSearching(false);
  }, [map]);

  // Calculate directions
  const calculateRoute = useCallback(async (origin: Location, dest: Location, mode: TransportMode) => {
    if (!map) return;

    const directionsService = new google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(dest.lat, dest.lng),
        travelMode: google.maps.TravelMode[mode.mode],
      });

      setDirections(result);

      if (result.routes[0]?.legs[0]) {
        const leg = result.routes[0].legs[0];
        const distanceKm = parseDistanceToKm(leg.distance?.text || '0');
        const co2Saved = calculateCO2Savings(distanceKm, TRANSPORT_MODES[0], mode); // Compare to driving

        setRouteInfo({
          distance: leg.distance?.text || '',
          duration: leg.duration?.text || '',
          co2Saved: formatCO2Savings(co2Saved),
        });
      }
    } catch (err) {
      console.error('Directions error:', err);
    }
  }, [map]);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const cityLocation = INDIAN_CITIES[city];
    if (cityLocation && map) {
      map.panTo(cityLocation);
      map.setZoom(13);
      searchNearbyPlaces(cityLocation);
    }
  };

  const handlePlaceClick = (place: NearbyPlace) => {
    setSelectedPlace(place);
    setDestination(place.location);
    if (userLocation) {
      calculateRoute(userLocation, place.location, selectedMode);
    }
  };

  const handleModeChange = (mode: TransportMode) => {
    setSelectedMode(mode);
    if (userLocation && destination) {
      calculateRoute(userLocation, destination, mode);
    }
  };

  const handleSearchLocation = async () => {
    if (!map || !searchQuery.trim()) return;

    const geocoder = new google.maps.Geocoder();
    try {
      const result = await geocoder.geocode({ address: searchQuery });
      if (result.results[0]) {
        const location = result.results[0].geometry.location;
        const newLocation = { lat: location.lat(), lng: location.lng() };
        setUserLocation(newLocation);
        map.panTo(newLocation);
        map.setZoom(14);
        searchNearbyPlaces(newLocation);
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  };

  const getMarkerIcon = (type: 'ev' | 'bike' | 'transit') => {
    const colors = {
      ev: '#22c55e',
      bike: '#3b82f6',
      transit: '#f59e0b',
    };
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: colors[type],
      fillOpacity: 1,
      strokeColor: '#fff',
      strokeWeight: 2,
      scale: 10,
    };
  };

  const filteredPlaces = nearbyPlaces.filter(
    (place) => activeFilter === 'all' || place.type === activeFilter
  );

  if (loadError) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Google Maps API Configuration Required</h3>
        <p className="text-yellow-700 mb-4">
          The Google Maps API needs to be enabled in the Google Cloud Console.
        </p>
        <div className="text-left bg-white rounded-xl p-4 max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-2">Required APIs to enable:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Maps JavaScript API</li>
            <li>✓ Places API</li>
            <li>✓ Directions API</li>
            <li>✓ Geocoding API</li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            See docs/Google-Maps-API-Setup.md for instructions
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-100 rounded-2xl p-6 flex items-center justify-center h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="ml-3 text-gray-600">Loading Map...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="flex-1 min-w-[250px] max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
              placeholder="Search location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              onClick={handleSearchLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition"
            >
              Go
            </button>
          </div>
        </div>

        {/* City Selector */}
        <select
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {Object.keys(INDIAN_CITIES).map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All', icon: MapPin },
            { id: 'ev', label: 'EV Charging', icon: Zap },
            { id: 'bike', label: 'Bike', icon: Bike },
            { id: 'transit', label: 'Transit', icon: Bus },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id as typeof activeFilter)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition ${
                activeFilter === id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || INDIAN_CITIES[selectedCity] || DEFAULT_CENTER}
          zoom={13}
          onLoad={onMapLoad}
          options={DEFAULT_MAP_OPTIONS}
        >
          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#ef4444',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 3,
                scale: 8,
              }}
              title="Your Location"
            />
          )}

          {/* Place Markers */}
          {filteredPlaces.map((place) => (
            <Marker
              key={place.placeId}
              position={place.location}
              icon={getMarkerIcon(place.type)}
              onClick={() => handlePlaceClick(place)}
              title={place.name}
            />
          ))}

          {/* Info Window */}
          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.location}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="p-2 max-w-[200px]">
                <h4 className="font-semibold text-gray-800">{selectedPlace.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedPlace.address}</p>
                {selectedPlace.rating && (
                  <p className="text-sm text-yellow-600 mt-1">★ {selectedPlace.rating}</p>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedPlace.type === 'ev' ? 'bg-green-100 text-green-700' :
                    selectedPlace.type === 'bike' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedPlace.type === 'ev' ? 'EV Charging' :
                     selectedPlace.type === 'bike' ? 'Bike Share' : 'Transit'}
                  </span>
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Directions Renderer */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: '#22c55e',
                  strokeWeight: 5,
                },
                suppressMarkers: true,
              }}
            />
          )}
        </GoogleMap>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 flex items-center justify-center"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              <span className="ml-2">Finding green transport options...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Find Nearby Button */}
        <button
          onClick={() => userLocation && searchNearbyPlaces(userLocation)}
          className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition"
        >
          <Navigation className="w-5 h-5 text-primary-500" />
          <span className="text-sm font-medium">Find Nearby</span>
        </button>
      </div>

      {/* Route Info & Transport Mode Selector */}
      <AnimatePresence>
        {routeInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <p className="text-lg font-semibold text-gray-800">{routeInfo.distance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-semibold text-gray-800">{routeInfo.duration}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-xl">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-green-600">CO₂ Saved vs Driving</p>
                    <p className="text-lg font-bold text-green-700">{routeInfo.co2Saved}</p>
                  </div>
                </div>
              </div>

              {/* Transport Mode Buttons */}
              <div className="flex gap-2">
                {TRANSPORT_MODES.map((mode) => (
                  <button
                    key={mode.mode}
                    onClick={() => handleModeChange(mode)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      selectedMode.mode === mode.mode
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {mode.mode === 'DRIVING' && <Car className="w-4 h-4" />}
                    {mode.mode === 'TRANSIT' && <Bus className="w-4 h-4" />}
                    {mode.mode === 'BICYCLING' && <Bike className="w-4 h-4" />}
                    {mode.mode === 'WALKING' && <MapPin className="w-4 h-4" />}
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setDirections(null);
                setRouteInfo(null);
                setSelectedPlace(null);
                setDestination(null);
              }}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Places List */}
      {filteredPlaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaces.slice(0, 6).map((place) => (
            <motion.div
              key={place.placeId}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePlaceClick(place)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                selectedPlace?.placeId === place.placeId
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-primary-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  place.type === 'ev' ? 'bg-green-100' :
                  place.type === 'bike' ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                  {place.type === 'ev' && <Zap className="w-5 h-5 text-green-600" />}
                  {place.type === 'bike' && <Bike className="w-5 h-5 text-blue-600" />}
                  {place.type === 'transit' && <Bus className="w-5 h-5 text-yellow-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{place.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{place.address}</p>
                  {place.rating && (
                    <p className="text-sm text-yellow-600 mt-1">★ {place.rating}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GreenTransportMap;
