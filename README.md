# OutbreakGuard+

Advanced AI-Powered Waterborne Disease Surveillance and National Response System

OutbreakGuard+ is a comprehensive analytical platform designed for early detection, real-time monitoring, and mitigation of waterborne disease outbreaks. The system integrates environmental sensor data, pharmaceutical sales trends, and geospatial intelligence to provide public health authorities with actionable insights for cluster identification and response management.

---

## Architecture Overview

The system is structured around four specialized modules:

### WaterGuard (Environmental Health Monitoring)
- **Continuous Monitoring**: Tracking of Turbidity (NTU), pH levels, and precipitation metrics.
- **Pathogen Exposure Analysis**: Assessment of risk indicators for environmental pathogens including E. Coli and Cholera.
- **Automated Alerts**: Real-time notification to municipal health departments based on WHO safety benchmarks.
### PharmaSentinel (Pharmaceutical Anomaly Detection)
- **Sales Spike Correlation**: Analysis of rapid increases in essential medicine sales (ORS, Zinc, Antibiotics) at regional pharmacies.
- **Early Cluster Identification**: Potential identification of health anomalies 7 to 10 days prior to hospital census peaks.
- **Supply Chain Management**: Notification services for local pharmacies to maintain essential stock in high-risk zones.

### VaccineChain (Predictive Supply Management)
- **Resource Allocation**: Recommends medical resource distribution based on machine learning risk scores.
- **Demand Forecasting**: Projecting ORS and antibiotic requirements by area population density.
- **Logistics Optimization**: Identifying optimal warehouse locations for expedited supply dispatch.

### AlertCenter (Multichannel Communication)
- **Multilingual Support**: Interface support for English, Hindi (हिन्दी), and Tamil (தமிழ்).
- **Public Health Integration**: Automated SMS and voice alerts for healthcare workers and at-risk households.

---

## Machine Learning Engine

- **Model Architecture**: Random Forest classification model optimized for high-precision risk prediction.
- **Diagnostic Capabilities**: Capacity to identify indicators for six major waterborne pathogens: Cholera, Typhoid, Dysentery, Hepatitis A, E. Coli, and Gastroenteritis.
- **Analytical Simulation**: Environment for testing public health protocols and response scenarios.

---

## Technical Stack

| Category | Component | Specification |
| :--- | :--- | :--- |
| **Frontend** | Framework | React 18 / Vite |
| **Backend** | API Services | Python Flask |
| **Machine Learning** | Libraries | Scikit-Learn (Random Forest), NumPy, Joblib |
| **Geospatial** | Engine | Leaflet.js / GeoJSON |
| **Visualization** | Analytics | Chart.js |
| **Integrations** | External APIs | OpenWeatherMap, Twilio, Firebase |

---

## Deployment
Official URL: [https://outbreak-guard-plus.vercel.app/](https://outbreak-guard-plus.vercel.app/)

---

## Contributors

**Development Team**:
- Ayush Aryan
- Vivek Kumar Prusty
- Tanishq Yadav

---

## License
Distributed under the MIT License.
Copyright © 2026. All rights reserved.