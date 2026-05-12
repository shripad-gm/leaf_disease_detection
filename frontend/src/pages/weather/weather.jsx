import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCloudSun, FaArrowLeft, FaSearch, FaThermometerHalf, FaWind, FaTint, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

function App() {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-emerald-500/30 font-sans">
      
      {/* Home Theme Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[150px] animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-10 py-8 flex justify-between items-center border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
            <FaArrowLeft />
          </div>
          <span className="uppercase tracking-[0.4em] text-[9px] font-black">Return Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black">
            <FaCloudSun />
          </div>
          <span className="uppercase tracking-[0.3em] text-[10px] font-black">Climate Intel</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        
        {/* Search Header */}
        <div className="text-center mb-16 space-y-4">
           <p className="text-emerald-500 font-black tracking-[0.5em] text-[10px] uppercase italic">Atmospheric Sync</p>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Weather <br /> <span className="gradient-text italic">Prediction.</span></h1>
           
           <div className="max-w-xl mx-auto flex items-center gap-4 p-2 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-xl focus-within:border-emerald-500/50 transition-all mt-10">
              <input
                type="text"
                placeholder="Search City..."
                className="bg-transparent flex-1 px-8 py-3 outline-none text-white font-bold tracking-widest uppercase text-xs"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button 
                onClick={handleSearch}
                className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-emerald-500/30"
              >
                <FaSearch />
              </button>
           </div>
        </div>

        {error && (
          <div className="glass-card text-center border-red-500/20 py-20 !rounded-[2.5rem]">
            <h2 className="text-3xl font-black text-red-400 mb-4 uppercase tracking-tighter">City Not Found</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Unable to synchronize with specified territory.</p>
          </div>
        )}

        {isLoading && (
          <div className="py-20 text-center space-y-8">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Fetching Streams...</p>
          </div>
        )}

        {weatherData && !isLoading && (
          <div className="space-y-12">
            
            {/* Main Weather Card - Aligned to Home Theme */}
            <div className="glass-card !rounded-[2.5rem] !p-12 relative overflow-hidden group border-white/5">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl text-emerald-500 mx-auto mb-10">
                <FaCloudSun />
              </div>
              
              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left space-y-4">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-emerald-500">
                    <FaMapMarkerAlt />
                    <span className="text-2xl font-black tracking-tighter uppercase">{weatherData.name}</span>
                  </div>
                  <div className="text-[10rem] font-black leading-none tracking-tighter">
                    {Math.round(weatherData.main.temp)}°
                  </div>
                  <p className="text-2xl font-bold uppercase tracking-widest text-slate-500 italic">
                    {weatherData.weather[0].main}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: <FaThermometerHalf />, label: "Thermal", value: `${weatherData.main.temp_max}°` },
                    { icon: <FaTint />, label: "Humidity", value: `${weatherData.main.humidity}%` },
                    { icon: <FaWind />, label: "Wind", value: `${weatherData.wind.speed} m/s` },
                    { icon: <FaCloudSun />, label: "Sky", value: weatherData.weather[0].main }
                  ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center">
                      <div className="text-emerald-500 mb-3 text-xl flex justify-center">{stat.icon}</div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <button className="btn-primary !rounded-2xl !px-12">Synchronized</button>
              </div>
            </div>

            {/* Forecast Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {forecastData.map((forecast, i) => (
                <div key={i} className="glass-card !rounded-[2rem] !p-8 text-center hover:bg-emerald-500 hover:text-black transition-all duration-500 group border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-black mb-4 flex items-center justify-center gap-2">
                    <FaCalendarAlt /> {formatDate(forecast.dt_txt)}
                  </p>
                  <div className="text-4xl font-black tracking-tighter mb-2">
                    {Math.round(forecast.main.temp)}°
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">{forecast.weather[0].main}</p>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      <footer className="py-20 text-center border-t border-white/5 text-[9px] font-black uppercase tracking-[1em] text-slate-800">
        Resilient Roots Global • Weather Intel
      </footer>
    </div>
  );
}

export default App;