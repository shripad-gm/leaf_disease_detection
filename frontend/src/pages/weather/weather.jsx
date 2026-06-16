import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCloudSun, FaArrowLeft, FaSearch, FaThermometerHalf, FaWind, FaTint, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

function App() {
  const { authUser } = useAuthContext();
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = '91072731db9a387f80223a00c2aa8ae4';

  const fetchWeatherInfo = async (city) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        setError(true);
        setWeatherData(null);
      } else {
        setWeatherData(data);
        setError(false);
        await fetchForecastInfo(city);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecastInfo = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      const forecasts = data.list.filter((forecast) => forecast.dt_txt.includes('12:00:00'));
      setForecastData(forecasts);
    } catch (err) {
      setError(true);
    }
  };

  const handleSearch = () => {
    if (city.trim() !== '') fetchWeatherInfo(city);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && city.trim() !== '') fetchWeatherInfo(city);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' });
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-slate-950 text-slate-100 overflow-y-auto selection:bg-emerald-500/30 font-sans">
      
      {/* Dynamic Background Image */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/weather_bg.png"
          alt="Weather Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.15)',
            transformOrigin: 'top left'
          }}
          className="opacity-40 contrast-115 saturate-110"
        />
        <div className="absolute inset-0 bg-slate-950/45"></div>
      </div>


      {/* Navigation */}
      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-4 flex-grow flex flex-col justify-center w-full">
        
        {/* Search Header */}
        <div className="text-center mb-4 space-y-1">
           <p className="text-emerald-500 font-black tracking-[0.5em] text-[9px] uppercase italic">Atmospheric Sync</p>
           <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">Weather <span className="gradient-text italic">Prediction</span></h1>
           
           <div className="max-w-md mx-auto flex items-center gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-xl focus-within:border-emerald-500/50 transition-all mt-2">
              <input
                type="text"
                placeholder="Search City..."
                className="bg-transparent flex-1 px-6 py-2 outline-none text-white font-bold tracking-widest uppercase text-xs"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button 
                onClick={handleSearch}
                className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-emerald-500/30"
              >
                <FaSearch className="text-xs" />
              </button>
           </div>
        </div>

        {error && (
          <div className="glass-card text-center border-red-500/20 py-8 !rounded-2xl">
            <h2 className="text-xl font-black text-red-400 mb-2 uppercase tracking-tighter">City Not Found</h2>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Unable to synchronize with specified territory.</p>
          </div>
        )}

        {isLoading && (
          <div className="py-8 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.5em] animate-pulse">Fetching Streams...</p>
          </div>
        )}

        {weatherData && !isLoading && (
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            
            {/* Main Weather Card - Aligned to Home Theme */}
            <div className="glass-card !rounded-[2rem] !p-8 relative overflow-hidden group border-white/5 flex-grow flex flex-col justify-between max-h-[360px]">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl text-emerald-500 mx-auto mb-4">
                <FaCloudSun />
              </div>
              
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center flex-1">
                <div className="text-center md:text-left space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-xl font-black tracking-tighter uppercase">{weatherData.name}</span>
                  </div>
                  <div className="text-6xl md:text-7xl font-black leading-none tracking-tighter text-white">
                    {Math.round(weatherData.main.temp)}°
                  </div>
                  <p className="text-base font-bold uppercase tracking-widest text-slate-500 italic">
                    {weatherData.weather[0].main}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <FaThermometerHalf />, label: "Thermal", value: `${weatherData.main.temp_max}°` },
                    { icon: <FaTint />, label: "Humidity", value: `${weatherData.main.humidity}%` },
                    { icon: <FaWind />, label: "Wind", value: `${weatherData.wind.speed} m/s` },
                    { icon: <FaCloudSun />, label: "Sky", value: weatherData.weather[0].main }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <div className="text-emerald-500 mb-1.5 text-base flex justify-center">{stat.icon}</div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 mb-0.5">{stat.label}</p>
                      <p className="text-xl font-black text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <button className="btn-primary !rounded-xl !px-10 !py-3 text-xs uppercase font-bold tracking-wider">Synchronized</button>
              </div>
            </div>

            {/* Forecast Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecastData.map((forecast, i) => (
                <div key={i} className="glass-card !rounded-2xl !p-4 text-center hover:bg-emerald-500 hover:text-black transition-all duration-500 group border-white/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-black mb-2 flex items-center justify-center gap-1.5">
                    <FaCalendarAlt /> {formatDate(forecast.dt_txt)}
                  </p>
                  <div className="text-2xl font-black tracking-tighter mb-1">
                    {Math.round(forecast.main.temp)}°
                  </div>
                  <p className="text-[8px] font-bold uppercase tracking-widest opacity-50">{forecast.weather[0].main}</p>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      <footer className="py-4 text-center border-t border-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-slate-800 bg-slate-950/20 backdrop-blur-sm">
        Resilient Roots Global • Weather Intel
      </footer>
    </div>
  );
}

export default App;