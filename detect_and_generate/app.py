from flask import Flask, request, jsonify
from dotenv import load_dotenv
load_dotenv()

import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
from chain import ReportGenerator, FertilizerRecommender  # Import your ReportGenerator and FertilizerRecommender classes
from dlmodel import predict_name

app = Flask(__name__)
CORS(app) # Fix: Allow all origins to prevent CORS errors

# Fix: Create uploads directory automatically
if not os.path.exists('uploads'):
    os.makedirs('uploads')

report_generator = ReportGenerator()
fertilizer_recommender = FertilizerRecommender()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/generate-report", methods=["POST"])
def generate_report():
    try:
        data = request.json
        severity = data.get("severity")
        disease_name = data.get("disease_name")

        if not disease_name or not severity:
            return jsonify({"error": "Invalid input"}), 400

        # Generate the report
        report = report_generator.generate_report(severity, disease_name)
        return jsonify({"report": report})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/recommend-fertilizer", methods=["POST"])
def recommend_fertilizer():
    try:
        data = request.json
        soil_temp = data.get("soilTemp")
        soil_humidity = data.get("soilHumidity")
        soil_moisture = data.get("soilMoisture")
        azote = data.get("azote")
        phosphorous = data.get("phosphorous")
        potassium = data.get("potassium")
        soil_type = data.get("soilType")
        crop_type = data.get("cropType")

        # Basic check (empty strings or None values)
        required_fields = [soil_temp, soil_humidity, soil_moisture, azote, phosphorous, potassium, soil_type, crop_type]
        if any(v is None or str(v).strip() == "" for v in required_fields):
            return jsonify({"error": "Incomplete parameter values. All parameters are required."}), 400

        recommendation = fertilizer_recommender.generate_recommendation(
            soil_temp=soil_temp,
            soil_humidity=soil_humidity,
            soil_moisture=soil_moisture,
            azote=azote,
            phosphorous=phosphorous,
            potassium=potassium,
            soil_type=soil_type,
            crop_type=crop_type
        )
        return jsonify({"recommendation": recommendation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500





# Define the route to handle image upload and prediction
@app.route('/detect', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join('uploads', filename)
        file.save(file_path)

        # Make the prediction using the imported function
        predicted_class = predict_name(file_path)
        
        # Delete the file after processing (optional)
        os.remove(file_path)
        
        return jsonify({"prediction": predicted_class})
    
    else:
        return jsonify({"error": "Invalid file format"}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5000)
