import React, { useState } from 'react';
import blurredImage from '../../assets/blurred.avif'; // Import the background image
import Navbar from '../detect/components/Navbar';

const FertilizationForm = () => {
  const [soilTemp, setSoilTemp] = useState('');
  const [soilHumidity, setSoilHumidity] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('');
  const [azote, setAzote] = useState('');
  const [phosphorous, setPhosphorous] = useState('');
  const [potassium, setPotassium] = useState('');
  const [soilType, setSoilType] = useState('');
  const [cropType, setCropType] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let recommendationMessage = '';
    if (soilTemp && soilHumidity && soilMoisture && azote && phosphorous && potassium && soilType && cropType) {
      recommendationMessage = `Based on your inputs, we recommend the following for ${cropType} on ${soilType} soil: 
      - Azote: ${azote}g
      - Phosphorous: ${phosphorous}g
      - Potassium: ${potassium}g
      - Soil Temperature: ${soilTemp}°C
      - Soil Humidity: ${soilHumidity}%
      - Soil Moisture: ${soilMoisture}%`;
    } else {
      recommendationMessage = 'Please fill out all the fields.';
    }

    setRecommendation(recommendationMessage);
  };

  const inputStyle = {
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };

  const inputFocusStyle = {
    borderColor: '#3b82f6',
    boxShadow: '0 4px 8px rgba(59, 130, 246, 0.2)',
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#2563eb',
  };

  const paragraphStyle = {
    marginTop: '20px',
    fontSize: '1rem',
    color: '#374151',
  };

  return (
    <div className="disease-container">
      <Navbar />
      <div className="disease-file-input-container">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden relative z-10">
          <h2 className="disease-heading">Fertilization Recommendation</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Soil Temperature */}
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700">Soil Temperature (°C)</label>
              <input
                type="number"
                value={soilTemp}
                onChange={(e) => setSoilTemp(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                placeholder="Enter soil temperature"
              />
            </div>

            {/* Soil Humidity */}
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700">Soil Humidity (%)</label>
              <input
                type="number"
                value={soilHumidity}
                onChange={(e) => setSoilHumidity(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                placeholder="Enter soil humidity"
              />
            </div>

            {/* Soil Moisture */}
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700">Soil Moisture (%)</label>
              <input
                type="number"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                placeholder="Enter soil moisture"
              />
            </div>

            {/* Amount of Azote */}
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700">Amount of Azote (g)</label>
              <input
                type="number"
                value={azote}
                onChange={(e) => setAzote(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                placeholder="Enter amount of Azote"
              />
            </div>

            {/* Amount of Phosphorous */}
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700">Amount of Phosphorous (g)</label>
              <input
                type="number"
                value={phosphorous}
                onChange={(e) => setPhosphorous(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                placeholder="Enter amount of Phosphorous"
              />
            </div>

            {/* Amount of Potassium */}
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700">Amount of Potassium (g)</label>
              <input
                type="number"
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                placeholder="Enter amount of Potassium"
              />
            </div>

            {/* Soil Type */}
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select Soil Type</option>
                <option value="Clay">Clay</option>
                <option value="Loamy">Loamy</option>
                <option value="Sandy">Sandy</option>
              </select>
            </div>

            {/* Crop Type */}
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700">Crop Type</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select Crop Type</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Corn">Corn</option>
              </select>
            </div>

            <button
              type="submit"
              style={buttonStyle}
              onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
              onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
            >
              PREDICT
            </button>
          </form>

          {recommendation && (
            <div style={paragraphStyle}>
              <p>{recommendation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FertilizationForm;
