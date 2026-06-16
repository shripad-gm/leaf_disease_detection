from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os

# Load .env from parent directory (project root)
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

from flask_cors import CORS
from werkzeug.utils import secure_filename
from chain import ReportGenerator, FertilizerRecommender
from dlmodel import predict_name
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)  # Allow all origins

# ------------------------------------------------------------------
# MongoDB Setup
# ------------------------------------------------------------------
MONGO_URL = os.getenv("mongo_db_url")
db = None
history_col = None

if MONGO_URL:
    try:
        client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")  # Test connection
        db = client["leaf_disease_db"]
        history_col = db["history"]
        print("[OK] Connected to MongoDB")
    except Exception as e:
        print(f"[WARN] MongoDB connection failed: {e}")
else:
    print("[WARN] mongo_db_url not set. History will not be persisted.")

# ------------------------------------------------------------------
# Uploads directory
# ------------------------------------------------------------------
if not os.path.exists('uploads'):
    os.makedirs('uploads')

report_generator = ReportGenerator()
fertilizer_recommender = FertilizerRecommender()

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ------------------------------------------------------------------
# Helper: save a history record
# ------------------------------------------------------------------
def save_history(user_id, record_type, report_text, metadata: dict):
    """Persist a history record to MongoDB if available."""
    if history_col is None:
        return None
    try:
        doc = {
            "userId": user_id,
            "type": record_type,        # "disease" | "fertilizer"
            "report": report_text,
            "metadata": metadata,
            "createdAt": datetime.now(timezone.utc)
        }
        result = history_col.insert_one(doc)
        return str(result.inserted_id)
    except Exception as e:
        print(f"[WARN] Failed to save history: {e}")
        return None


# ------------------------------------------------------------------
# Disease detection & report generation
# ------------------------------------------------------------------
@app.route("/generate-report", methods=["POST"])
def generate_report():
    try:
        data = request.json
        severity = data.get("severity")
        disease_name = data.get("disease_name")
        user_id = data.get("userId", "anonymous")
        image_base64 = data.get("imageBase64")

        if not disease_name or not severity:
            return jsonify({"error": "Invalid input"}), 400

        report = report_generator.generate_report(severity, disease_name)
        save_history(
            user_id=user_id,
            record_type="disease",
            report_text=report,
            metadata={"diseaseName": disease_name, "severity": severity, "imageBase64": image_base64}
        )
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
        user_id = data.get("userId", "anonymous")

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
        save_history(
            user_id=user_id,
            record_type="fertilizer",
            report_text=recommendation,
            metadata={
                "cropType": crop_type,
                "soilType": soil_type,
                "soilTemp": soil_temp,
                "soilHumidity": soil_humidity,
                "soilMoisture": soil_moisture,
                "azote": azote,
                "phosphorous": phosphorous,
                "potassium": potassium,
            }
        )
        return jsonify({"recommendation": recommendation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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

        predicted_class = predict_name(file_path)
        os.remove(file_path)

        return jsonify({"prediction": predicted_class})
    else:
        return jsonify({"error": "Invalid file format"}), 400


# ------------------------------------------------------------------
# History API
# ------------------------------------------------------------------
def serialize_doc(doc):
    """Convert a MongoDB document to a JSON-serialisable dict."""
    doc["_id"] = str(doc["_id"])
    if isinstance(doc.get("createdAt"), datetime):
        doc["createdAt"] = doc["createdAt"].isoformat()
    return doc


@app.route("/api/history", methods=["GET"])
def get_history():
    if history_col is None:
        return jsonify({"error": "Database not connected"}), 500

    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    try:
        docs = list(
            history_col.find({"userId": user_id}).sort("createdAt", -1)
        )
        return jsonify([serialize_doc(d) for d in docs])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/history/clear", methods=["DELETE"])
def clear_history():
    if history_col is None:
        return jsonify({"error": "Database not connected"}), 500

    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    try:
        result = history_col.delete_many({"userId": user_id})
        return jsonify({"deleted": result.deleted_count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/history/<item_id>", methods=["DELETE"])
def delete_history_item(item_id):
    if history_col is None:
        return jsonify({"error": "Database not connected"}), 500

    user_id = request.args.get("userId")
    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    try:
        result = history_col.delete_one({"_id": ObjectId(item_id), "userId": user_id})
        if result.deleted_count == 0:
            return jsonify({"error": "Item not found"}), 404
        return jsonify({"deleted": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=False, host="0.0.0.0", port=port)
