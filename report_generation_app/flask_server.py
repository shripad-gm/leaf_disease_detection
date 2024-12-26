from flask import Flask, request, jsonify
from flask_cors import CORS
from chain import ReportGenerator  # Import your ReportGenerator class

app = Flask(__name__)
CORS(app)  # Enable CORS to allow communication with your React frontend

# Initialize the ReportGenerator instance
report_generator = ReportGenerator()

@app.route("/generate_report", methods=["POST"])
def generate_report():
    """
    Endpoint to generate a crop disease report.
    Expects JSON payload with 'severity' and 'disease_name'.
    Returns the generated report in JSON format.
    """
    try:
        # Parse the incoming JSON request
        data = request.json
        if not data:
            return jsonify({"error": "Invalid input: No data provided"}), 400
        
        # Extract 'severity' and 'disease_name' from the request
        severity = data.get("severity")
        disease_name = data.get("disease_name")

        # Validate input fields
        if not severity or not disease_name:
            return jsonify({"error": "Invalid input: 'severity' and 'disease_name' are required"}), 400

        # Generate the report using the ReportGenerator instance
        report = report_generator.generate_report(severity, disease_name)

        # Respond with the generated report
        return jsonify({"report": report}), 200

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    # Run the Flask server on port 5000
    app.run(debug=True, port=5000)
