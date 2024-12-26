from flask import Flask, request, jsonify
from flask_cors import CORS
from chain import ReportGenerator  # Import your ReportGenerator class

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow only your React app's origin

report_generator = ReportGenerator()

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

if __name__ == "__main__":
    app.run(debug=True, port=5000)
