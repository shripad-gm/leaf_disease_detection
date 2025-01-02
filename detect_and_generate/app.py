from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
from chain import ReportGenerator  # Import your ReportGenerator class
from dlmodel import predict_name

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow only your React app's origin

report_generator = ReportGenerator()

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
