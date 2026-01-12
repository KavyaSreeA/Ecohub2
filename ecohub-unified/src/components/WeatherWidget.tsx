import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Cloud, CloudRain, Wind, Droplets, MapPin, ChevronDown, ChevronUp, CloudSnow, CloudLightning, Haze } from 'lucide-react';
import { config } from '../config/config';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  city: string;
  country: string;
  sunrise: number;
  sunset: number;
  visibility: number;
}

interface ForecastDay {
  date: string;
  day: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  solarRating: 'Excellent' | 'Good' | 'Moderate' | 'Low';
}

interface SolarPotential {
  rating: 'Excellent' | 'Good' | 'Moderate' | 'Low';
  hours: number;
  description: string;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState({ city: 'Chennai', country: 'IN' });
  const [showForecast, setShowForecast] = useState(false);

  const getWeatherIcon = (iconCode: string, size: string = "w-12 h-12") => {
    if (iconCode.includes('01') || iconCode.includes('02')) {
      return <Sun className={`${size} text-yellow-400`} />;
    } else if (iconCode.includes('03') || iconCode.includes('04')) {
      return <Cloud className={`${size} text-gray-300`} />;
    } else if (iconCode.includes('09') || iconCode.includes('10')) {
      return <CloudRain className={`${size} text-blue-400`} />;
    } else if (iconCode.includes('11')) {
      return <CloudLightning className={`${size} text-yellow-500`} />;
    } else if (iconCode.includes('13')) {
      return <CloudSnow className={`${size} text-blue-200`} />;
    } else if (iconCode.includes('50')) {
      return <Haze className={`${size} text-gray-400`} />;
    }
    return <Sun className={`${size} text-yellow-400`} />;
  };

  const getSolarRating = (description: string): 'Excellent' | 'Good' | 'Moderate' | 'Low' => {
    const desc = description.toLowerCase();
    if (desc.includes('clear') || desc.includes('sun')) return 'Excellent';
    if (desc.includes('few clouds') || desc.includes('scattered')) return 'Good';
    if (desc.includes('cloud') || desc.includes('overcast') || desc.includes('mist') || desc.includes('haze')) return 'Moderate';
    return 'Low';
  };

  const calculateSolarPotential = (weatherData: WeatherData): SolarPotential => {
    const daylightHours = (weatherData.sunset - weatherData.sunrise) / 3600;
    const rating = getSolarRating(weatherData.description);
    
    const descriptions = {
      'Excellent': 'Perfect conditions for solar energy generation',
      'Good': 'Good solar potential with minimal cloud cover',
      'Moderate': 'Reduced solar output due to atmospheric conditions',
      'Low': 'Limited solar generation expected today',
    };

    return { rating, hours: Math.round(daylightHours * 10) / 10, description: descriptions[rating] };
  };

  const getDayName = (timestamp: number): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(timestamp * 1000).getDay()];
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        // Fetch current weather
        const weatherResponse = await fetch(
          `${config.energy.openWeather.baseUrl}/weather?q=${location.city},${location.country}&appid=${config.energy.openWeather.apiKey}&units=metric`
        );
        
        if (!weatherResponse.ok) throw new Error('Weather data unavailable');
        const weatherData = await weatherResponse.json();
        
        setWeather({
          temp: Math.round(weatherData.main.temp),
          feels_like: Math.round(weatherData.main.feels_like),
          humidity: weatherData.main.humidity,
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          wind_speed: weatherData.wind.speed,
          city: weatherData.name,
          country: weatherData.sys.country,
          sunrise: weatherData.sys.sunrise,
          sunset: weatherData.sys.sunset,
          visibility: weatherData.visibility / 1000,
        });

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
          `${config.energy.openWeather.baseUrl}/forecast?q=${location.city},${location.country}&appid=${config.energy.openWeather.apiKey}&units=metric`
        );
        
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json();
          
          // Group forecast by day and get daily summary
          const dailyForecasts: Record<string, any[]> = {};
          forecastData.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyForecasts[date]) {
              dailyForecasts[date] = [];
            }
            dailyForecasts[date].push(item);
          });

          // Get next 5 days forecast
          const fiveDayForecast: ForecastDay[] = Object.entries(dailyForecasts)
            .slice(0, 5)
            .map(([date, items]) => {
              const temps = items.map((i: any) => i.main.temp);
              const middayItem = items.find((i: any) => {
                const hour = new Date(i.dt * 1000).getHours();
                return hour >= 11 && hour <= 14;
              }) || items[Math.floor(items.length / 2)];
              
              return {
                date: formatDate(items[0].dt),
                day: getDayName(items[0].dt),
                temp_max: Math.round(Math.max(...temps)),
                temp_min: Math.round(Math.min(...temps)),
                description: middayItem.weather[0].description,
                icon: middayItem.weather[0].icon,
                humidity: Math.round(items.reduce((sum: number, i: any) => sum + i.main.humidity, 0) / items.length),
                wind_speed: Math.round(items.reduce((sum: number, i: any) => sum + i.wind.speed, 0) / items.length * 10) / 10,
                solarRating: getSolarRating(middayItem.weather[0].description),
              };
            });

          setForecast(fiveDayForecast);
        }

        setError(null);
      } catch (err) {
        setError('Unable to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 600000);
    return () => clearInterval(interval);
  }, [location]);

  const handleLocationChange = (city: string) => {
    const cities: Record<string, { city: string; country: string }> = {
      'Chennai': { city: 'Chennai', country: 'IN' },
      'Mumbai': { city: 'Mumbai', country: 'IN' },
      'Delhi': { city: 'Delhi', country: 'IN' },
      'Bangalore': { city: 'Bangalore', country: 'IN' },
      'Hyderabad': { city: 'Hyderabad', country: 'IN' },
      'Kolkata': { city: 'Kolkata', country: 'IN' },
      'Pune': { city: 'Pune', country: 'IN' },
      'Ahmedabad': { city: 'Ahmedabad', country: 'IN' },
    };
    setLocation(cities[city] || cities['Chennai']);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 bg-white/20 rounded w-1/2"></div>
          <div className="h-16 bg-white/20 rounded"></div>
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white">
        <p className="text-center">{error || 'Weather data unavailable'}</p>
      </div>
    );
  }

  const solarPotential = calculateSolarPotential(weather);
  const ratingColors = {
    'Excellent': 'bg-green-500',
    'Good': 'bg-yellow-500',
    'Moderate': 'bg-orange-500',
    'Low': 'bg-red-500',
  };

  const ratingBgColors = {
    'Excellent': 'bg-green-500/20 border-green-400/30',
    'Good': 'bg-yellow-500/20 border-yellow-400/30',
    'Moderate': 'bg-orange-500/20 border-orange-400/30',
    'Low': 'bg-red-500/20 border-red-400/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl text-white overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <select
              value={location.city}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="bg-white/20 backdrop-blur-sm text-white border-none rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="Chennai" className="text-gray-800">Chennai</option>
              <option value="Mumbai" className="text-gray-800">Mumbai</option>
              <option value="Delhi" className="text-gray-800">Delhi</option>
              <option value="Bangalore" className="text-gray-800">Bangalore</option>
              <option value="Hyderabad" className="text-gray-800">Hyderabad</option>
              <option value="Kolkata" className="text-gray-800">Kolkata</option>
              <option value="Pune" className="text-gray-800">Pune</option>
              <option value="Ahmedabad" className="text-gray-800">Ahmedabad</option>
            </select>
          </div>
          <span className="text-xs text-white/70 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
            Live
          </span>
        </div>

        {/* Main Weather */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-5xl font-bold mb-1">{weather.temp}°C</div>
            <div className="text-white/80 capitalize">{weather.description}</div>
            <div className="text-sm text-white/60">Feels like {weather.feels_like}°C</div>
          </div>
          <div className="transform scale-125">
            {getWeatherIcon(weather.icon)}
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Wind className="w-5 h-5 mx-auto mb-1 text-white/80" />
            <div className="text-sm font-medium">{weather.wind_speed} m/s</div>
            <div className="text-xs text-white/60">Wind</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Droplets className="w-5 h-5 mx-auto mb-1 text-white/80" />
            <div className="text-sm font-medium">{weather.humidity}%</div>
            <div className="text-xs text-white/60">Humidity</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Sun className="w-5 h-5 mx-auto mb-1 text-white/80" />
            <div className="text-sm font-medium">{solarPotential.hours}h</div>
            <div className="text-xs text-white/60">Daylight</div>
          </div>
        </div>

        {/* Solar Potential */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium flex items-center">
              <Sun className="w-4 h-4 mr-2 text-yellow-300" />
              Solar Potential Today
            </span>
            <span className={`${ratingColors[solarPotential.rating]} px-3 py-1 rounded-full text-xs font-medium`}>
              {solarPotential.rating}
            </span>
          </div>
          <p className="text-sm text-white/80">{solarPotential.description}</p>
        </div>

        {/* Forecast Toggle */}
        <button
          onClick={() => setShowForecast(!showForecast)}
          className="w-full flex items-center justify-center space-x-2 text-sm text-white/80 hover:text-white transition-colors py-2"
        >
          <span>{showForecast ? 'Hide' : 'Show'} 5-Day Forecast</span>
          {showForecast ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 5-Day Forecast */}
      <AnimatePresence>
        {showForecast && forecast.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/20 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              <h4 className="text-sm font-medium text-white/80 mb-3">5-Day Solar Forecast</h4>
              {forecast.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-xl border ${ratingBgColors[day.solarRating]}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-center w-12">
                      <div className="text-xs text-white/60">{day.day}</div>
                      <div className="text-sm font-medium">{day.date}</div>
                    </div>
                    {getWeatherIcon(day.icon, "w-8 h-8")}
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="text-sm capitalize truncate">{day.description}</div>
                    <div className="text-xs text-white/60">{day.humidity}% humidity</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{day.temp_max}° / {day.temp_min}°</div>
                    <div className={`text-xs ${
                      day.solarRating === 'Excellent' ? 'text-green-300' :
                      day.solarRating === 'Good' ? 'text-yellow-300' :
                      day.solarRating === 'Moderate' ? 'text-orange-300' : 'text-red-300'
                    }`}>
                      {day.solarRating} Solar
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WeatherWidget;
