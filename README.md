# Resilient Roots AI 🌿

Resilient Roots AI is a premium, high-tech digital agriculture platform designed to help farmers and agronomists identify plant diseases, generate AI-powered treatment recommendations, optimize fertilizer usage, and keep logs of agricultural activity.

Featuring a **dark-emerald glassmorphic theme**, this platform provides leaf classification via deep learning, customized report generation via LLMs, and real-time weather monitoring.

---

## 🏗️ System Architecture

The project consists of three core components:
1. **Frontend (React/Vite)**: A responsive single-page dashboard featuring modern HSL tailored colors, interactive micro-animations, and glassmorphic panels.
2. **Auth & Web Backend (Node.js/Express)**: Manages database connections, user registration (with unique email constraints), password recovery (via verification code), profile configurations, and historical scan persistence.
3. **ML & AI Backend (Python/Flask)**: Runs a Convolutional Neural Network (CNN) leaf disease model (`trained_plant_disease_model.keras`) and uses LangChain/Groq to generate crop treatment reports.

---

## ✨ Key Features

- **Disease Recognition**: Upload images of leaves to detect crop-specific pathogens using deep learning.
- **AI Report Generator**: Instantly drafts treatment protocols, severity analyses, and recovery steps.
- **Fertilizer Optimizer**: Input soil conditions (NPK levels, temperature, humidity) to receive optimized fertilizer suggestions.
- **Weather Station**: Tracks real-time conditions to optimize field operations.
- **Verification Recovery**: Secure OTP password recovery flow with dynamic email support.
- **Activity Tracker**: Stores diagnostic logs and stats locally or in MongoDB Atlas.

---

## 🛠️ Tech Stack

- **Client**: React (v18), Vite, TailwindCSS, DaisyUI, React Router, React Hot Toast
- **Database**: MongoDB Atlas / Mongoose
- **Auth Server**: Node.js, Express, JSON Web Tokens (JWT), Bcrypt, Nodemailer
- **ML API Server**: Python (v3.10), Flask, TensorFlow/Keras, OpenCV, LangChain, Groq API

---

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.10 recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (or a free MongoDB Atlas connection string)

---

### 2. Configure Environment Variables
Create a `.env` file in the project root directory:
```env
mongo_db_url=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key

# Optional: To receive real password recovery emails (falls back to console logs if blank)
EMAIL_USER=your_sending_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

### 3. Start the Node.js Authentication & Web Backend
From the root directory:
```bash
npm install
npm run server
```
*Runs by default on `http://localhost:5000`.*

---

### 4. Start the Python Flask ML Backend
From the `detect_and_generate/` directory:
1. Set up a virtual environment:
   ```bash
   cd detect_and_generate
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
2. Install dependencies & run:
   ```bash
   pip install -r requirements.txt
   python app.py
   ```
*Runs by default on `http://localhost:5001`.*

---

### 5. Start the React Frontend Dev Server
From the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
*Access the dashboard at `http://localhost:3000`.*

---

## ☁️ Production Deployment (Free)

The repository is pre-configured to be deployed for free:
1. **Flask ML API**: Deploy the `/detect_and_generate` folder on a free **Hugging Face Space** using the provided `Dockerfile`. This gives you 16GB of RAM for the TensorFlow model for free.
2. **React + Node Web App**: Deploy the repository on **Render** as a Web Service. The Node server will build the React bundle and host it statically out-of-the-box. Add the environment variables from your `.env`, and set `VITE_FLASK_API_URL` to point to your Hugging Face Space URL.
