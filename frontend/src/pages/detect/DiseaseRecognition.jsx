// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

const DiseaseRecognition = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);  // Store the actual file for prediction
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create URL for displaying image
      setImageFile(file); // Store the actual file for prediction
    }
  };

  const handlePredict = async () => {
    if (imageFile) { // Ensure that an image file is uploaded
      console.log("Uploading file:", imageFile);  // Debugging: Check the file object
      setIsLoading(true);
  
      const formData = new FormData();
      formData.append("file", imageFile);  // Send the actual file object
  
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
      <h2>Disease Recognition</h2>
      
      {/* Image Upload Section */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
      
      {/* Displaying the uploaded image */}
      {image && <img src={image} alt="Uploaded" width="400" style={{ marginTop: '20px' }} />}
      
      {/* Predict Button */}
      <button onClick={handlePredict} style={{ marginTop: '20px' }}>
        Predict
      </button>

      {/* Displaying prediction result */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        prediction && <p>{prediction}</p>
      )}
    </div>
  );
};

export default DiseaseRecognition;
