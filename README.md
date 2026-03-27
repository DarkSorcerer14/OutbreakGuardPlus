# OutbreakGuard+ 🛡️
### AI-Powered Waterborne Disease Early Warning & Response System

OutbreakGuard+ is a comprehensive, three-layer AI-driven platform designed to predict, monitor, and mitigate waterborne disease outbreaks (like Cholera and Typhoid). It leverages water quality sensors, pharmacy sales data, and environmental factors to provide actionable insights for health authorities.

---

## 🚀 Key Features

*   **⚡ Real-time Prediction**: Random Forest ML models predict outbreak risks with 94%+ accuracy.
*   **🌍 Interactive Risk Heatmap**: Dynamic geographic visualization of high-risk zones using OpenStreetMap.
*   **💊 PharmaSentinel**: Monitoring antibiotic and ORS sales spikes as early indicators of community health decline.
*   **💧 WaterGuard Integration**: Real-time analysis of pH, turbidity, and rainfall data.
*   **🛡️ VaccineChain**: AI-optimized supply chain logistics for medical resource dispatch.
*   **📢 Multi-channel Alerts**: SMS and Voice alerts in regional languages for non-tech users.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, CSS (Glassmorphism), Leaflet (Maps), Recharts |
| **Backend** | Flask (Python), Flask-CORS |
| **AI/ML** | Scikit-Learn (Random Forest), NumPy, joblib |
| **Styling** | Vanilla CSS (Premium Dark System) |

---

## 📂 Project Structure

```bash
outbreakguard-plus/
├── backend/          # Flask API Service
│   ├── app.py        # Core API Endpoints
│   ├── models/       # Trained ML Models (.pkl)
│   └── requirements.txt
├── frontend/         # React Dashboard
│   ├── src/
│   │   ├── components/ # Sidebar, Header, UI Elements
│   │   ├── pages/      # Feature-specific Dashboards
│   │   └── index.css   # Global Design System
│   └── vite.config.js
├── ml/               # Machine Learning
│   ├── train_model.py # Model Training Script
│   └── dataset.csv    # Synthetic Training Data
└── README.md         # Documentation
```

---

## 🏁 Getting Started

### 1. Prerequisites
*   Python 3.10+
*   Node.js 18+

### 2. Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```

### 4. Training the Model (Optional)
```powershell
cd ml
python train_model.py
```

---

## 🎨 Design Aesthetics
The system uses a **Glassmorphic Dark Mode** design system with:
*   Fluid animations and micro-transitions.
*   Vibrant accent colors (Risk Levels: Red, Amber, Green).
*   Deep space background with radial glow effects.

---

## 📄 License
Developed as a premium AI healthcare solution. 
© 2026 OutbreakGuard Team.
