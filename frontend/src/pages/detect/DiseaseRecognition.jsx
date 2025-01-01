// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import "./Disease.css";
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import { useNavigate } from 'react-router-dom';

const DiseaseRecognition = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);  
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleGenerateReport = () => {
    if (!prediction) {
      alert("No prediction available. Please predict first.");
      return;
    }
    navigate("/report", { state: { diseaseName: prediction } });
  };

  const handlePredict = async () => {
    if (imageFile) {
      console.log("Uploading file:", imageFile);
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const response = await fetch("http://127.0.0.1:5000/detect", {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error("File upload failed");
        }

        const result = await response.json();
        const class_name = result.prediction;
        setPrediction(`Model is predicting it's a ${class_name}`);
      } catch (error) {
        setPrediction(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setPrediction('Please upload an image first.');
    }
  };

  return (
    <div>
      <Navbar />
      <HeroSection />
      <div className="disease-file-input-container" style={{ padding: '20px' }}>
        <label htmlFor="file-upload" className="disease-file-input-label">
          Choose File
        </label> 
        <h2 className="disease-heading">Disease Recognition</h2>
        <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} />
        {image && <img src={image} alt="Uploaded" width="400" className="disease-image" />}
        <button onClick={handlePredict} className="disease-button">Predict</button>
        {isLoading ? (
          <p className="disease-paragraph loading">Loading...</p>
        ) : (
          prediction && <p className="disease-paragraph">{prediction}</p>
        )}
        <button onClick={handleGenerateReport} className="disease-button">
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default DiseaseRecognition;
