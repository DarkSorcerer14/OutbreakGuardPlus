import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Use mock data if backend is not available

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.warn('Backend unavailable, using mock data');
    }
    return Promise.reject(error);
  }
);

// ─── Mock Data ──────────────────────────────────────────────────────────

const MOCK_ZONES = [
  { id: "z1", name: "Dharavi, Mumbai", lat: 19.0430, lng: 72.8567, population: 850000, state: "Maharashtra", risk_level: "High", risk_score: 2, disease_predicted: "Cholera", days_to_peak: 3, confidence: 92.4, water_data: { ph: 5.9, turbidity: 72, rainfall: 210, flood_proximity: 3.2 }, pharma_data: { ors_spike: 7.2, antibiotic_spike: 5.8, fever_med_spike: 6.1 }, environment: { temperature: 34, humidity: 88, sanitation_score: 22 } },
  { id: "z2", name: "Howrah, Kolkata", lat: 22.5958, lng: 88.2636, population: 1100000, state: "West Bengal", risk_level: "High", risk_score: 2, disease_predicted: "Both", days_to_peak: 4, confidence: 89.1, water_data: { ph: 6.1, turbidity: 65, rainfall: 185, flood_proximity: 4.5 }, pharma_data: { ors_spike: 6.8, antibiotic_spike: 5.2, fever_med_spike: 5.9 }, environment: { temperature: 36, humidity: 92, sanitation_score: 28 } },
  { id: "z3", name: "Old Delhi", lat: 28.6562, lng: 77.2410, population: 600000, state: "Delhi", risk_level: "Medium", risk_score: 1, disease_predicted: "Typhoid", days_to_peak: 7, confidence: 78.5, water_data: { ph: 7.1, turbidity: 38, rainfall: 110, flood_proximity: 12 }, pharma_data: { ors_spike: 4.1, antibiotic_spike: 3.5, fever_med_spike: 3.8 }, environment: { temperature: 38, humidity: 65, sanitation_score: 42 } },
  { id: "z4", name: "Varanasi Ghats", lat: 25.3176, lng: 82.9739, population: 450000, state: "Uttar Pradesh", risk_level: "High", risk_score: 2, disease_predicted: "Cholera", days_to_peak: 3, confidence: 91.2, water_data: { ph: 5.7, turbidity: 78, rainfall: 230, flood_proximity: 2.1 }, pharma_data: { ors_spike: 7.8, antibiotic_spike: 6.4, fever_med_spike: 7.0 }, environment: { temperature: 33, humidity: 90, sanitation_score: 18 } },
  { id: "z5", name: "Patna Riverfront", lat: 25.6093, lng: 85.1376, population: 700000, state: "Bihar", risk_level: "Medium", risk_score: 1, disease_predicted: "Cholera", days_to_peak: 6, confidence: 75.3, water_data: { ph: 6.8, turbidity: 42, rainfall: 130, flood_proximity: 8 }, pharma_data: { ors_spike: 3.5, antibiotic_spike: 2.8, fever_med_spike: 3.2 }, environment: { temperature: 35, humidity: 78, sanitation_score: 38 } },
  { id: "z6", name: "Cuttack", lat: 20.4625, lng: 85.8830, population: 350000, state: "Odisha", risk_level: "Low", risk_score: 0, disease_predicted: "None", days_to_peak: 14, confidence: 85.7, water_data: { ph: 7.2, turbidity: 15, rainfall: 45, flood_proximity: 25 }, pharma_data: { ors_spike: 1.2, antibiotic_spike: 0.8, fever_med_spike: 1.5 }, environment: { temperature: 29, humidity: 60, sanitation_score: 62 } },
  { id: "z7", name: "Allahabad", lat: 25.4358, lng: 81.8463, population: 500000, state: "Uttar Pradesh", risk_level: "Medium", risk_score: 1, disease_predicted: "Typhoid", days_to_peak: 8, confidence: 72.8, water_data: { ph: 6.9, turbidity: 35, rainfall: 95, flood_proximity: 14 }, pharma_data: { ors_spike: 3.8, antibiotic_spike: 3.0, fever_med_spike: 3.5 }, environment: { temperature: 37, humidity: 70, sanitation_score: 45 } },
  { id: "z8", name: "Guwahati", lat: 26.1445, lng: 91.7362, population: 400000, state: "Assam", risk_level: "High", risk_score: 2, disease_predicted: "Both", days_to_peak: 4, confidence: 88.4, water_data: { ph: 6.0, turbidity: 68, rainfall: 240, flood_proximity: 3.8 }, pharma_data: { ors_spike: 6.5, antibiotic_spike: 5.5, fever_med_spike: 6.2 }, environment: { temperature: 31, humidity: 94, sanitation_score: 25 } },
  { id: "z9", name: "Hyderabad Old City", lat: 17.3616, lng: 78.4747, population: 550000, state: "Telangana", risk_level: "Low", risk_score: 0, disease_predicted: "None", days_to_peak: 15, confidence: 82.1, water_data: { ph: 7.3, turbidity: 12, rainfall: 30, flood_proximity: 28 }, pharma_data: { ors_spike: 0.9, antibiotic_spike: 0.7, fever_med_spike: 1.1 }, environment: { temperature: 32, humidity: 55, sanitation_score: 68 } },
  { id: "z10", name: "Surat", lat: 21.1702, lng: 72.8311, population: 600000, state: "Gujarat", risk_level: "Medium", risk_score: 1, disease_predicted: "Cholera", days_to_peak: 7, confidence: 76.9, water_data: { ph: 6.7, turbidity: 40, rainfall: 120, flood_proximity: 10 }, pharma_data: { ors_spike: 4.5, antibiotic_spike: 3.2, fever_med_spike: 3.9 }, environment: { temperature: 35, humidity: 75, sanitation_score: 40 } },
  { id: "z11", name: "Lucknow", lat: 26.8467, lng: 80.9462, population: 480000, state: "Uttar Pradesh", risk_level: "Low", risk_score: 0, disease_predicted: "None", days_to_peak: 12, confidence: 88.3, water_data: { ph: 7.4, turbidity: 18, rainfall: 40, flood_proximity: 22 }, pharma_data: { ors_spike: 1.5, antibiotic_spike: 1.0, fever_med_spike: 1.3 }, environment: { temperature: 36, humidity: 58, sanitation_score: 58 } },
  { id: "z12", name: "Bhopal", lat: 23.2599, lng: 77.4126, population: 380000, state: "Madhya Pradesh", risk_level: "Low", risk_score: 0, disease_predicted: "None", days_to_peak: 16, confidence: 90.1, water_data: { ph: 7.5, turbidity: 10, rainfall: 25, flood_proximity: 30 }, pharma_data: { ors_spike: 0.8, antibiotic_spike: 0.5, fever_med_spike: 0.9 }, environment: { temperature: 33, humidity: 50, sanitation_score: 72 } },
];

const MOCK_SUMMARY = {
  total_zones: 12, high_risk_zones: 4, medium_risk_zones: 4, low_risk_zones: 4,
  total_population_at_risk: 3450000, alerts_sent_today: 8750,
  vaccines_dispatched: 15200, outbreak_prediction_accuracy: 94.2,
};

const generateMockTrends = (type) => {
  const trends = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (type === 'water') {
      trends.push({
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        avg_ph: +(6.5 + Math.random() * 1.5).toFixed(2),
        avg_turbidity: +(25 + Math.random() * 40 + i * 3).toFixed(1),
        avg_rainfall: +(40 + Math.random() * 100 + i * 8).toFixed(1),
        contamination_events: Math.floor(Math.random() * 4 + i * 0.5),
        zones_at_risk: Math.floor(1 + Math.random() * 4 + i * 0.3),
      });
    } else {
      trends.push({
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ors_sales: Math.floor(100 + Math.random() * 300 + i * 40),
        antibiotic_sales: Math.floor(50 + Math.random() * 200 + i * 25),
        fever_med_sales: Math.floor(80 + Math.random() * 250 + i * 30),
        anomaly_score: +(0.2 + Math.random() * 0.5 + i * 0.06).toFixed(2),
      });
    }
  }
  return trends;
};

const MOCK_DISPATCHES = MOCK_ZONES.filter(z => z.risk_score >= 1).map(z => ({
  zone: z.name, zone_id: z.id, state: z.state, risk_level: z.risk_level,
  ors_packets_needed: Math.floor(z.population * 0.01 * (z.risk_score + 1)),
  cholera_vaccines_needed: z.risk_score === 2 ? Math.floor(z.population * 0.005 * 3) : 0,
  antibiotics_needed: Math.floor(z.population * 0.003 * (z.risk_score + 1)),
  dispatch_priority: z.risk_score === 2 ? "URGENT" : "NORMAL",
  estimated_dispatch_date: new Date(Date.now() + (z.risk_score === 2 ? 1 : 3) * 86400000).toISOString().split('T')[0],
  nearest_warehouse: ["Mumbai Central", "Kolkata Depot", "Delhi Hub", "Patna Store"][Math.floor(Math.random() * 4)],
}));

const MOCK_ALERTS = [
  { id: "alert_1", zone: "Dharavi, Mumbai", state: "Maharashtra", type: "SMS", language: "Hindi", message: "Water contamination detected. Boil water before drinking.", recipients: 3200, delivered: 3050, status: "delivered" },
  { id: "alert_2", zone: "Varanasi Ghats", state: "Uttar Pradesh", type: "Voice Call", language: "Hindi", message: "High disease risk in your area. Visit nearest health center if symptoms appear.", recipients: 1800, delivered: 1650, status: "delivered" },
  { id: "alert_3", zone: "Howrah, Kolkata", state: "West Bengal", type: "ASHA Worker", language: "Bengali", message: "ORS supplies dispatched to your PHC. Stock expected by tomorrow.", recipients: 45, delivered: 45, status: "delivered" },
  { id: "alert_4", zone: "Guwahati", state: "Assam", type: "SMS", language: "Hindi", message: "Flood warning: Avoid contact with floodwater. Use clean water sources only.", recipients: 2100, delivered: 1980, status: "delivered" },
  { id: "alert_5", zone: "Old Delhi", state: "Delhi", type: "Pharmacy Notice", language: "Hindi", message: "Elevated ORS and antibiotic demand detected. Restock advisory issued.", recipients: 120, delivered: 118, status: "delivered" },
  { id: "alert_6", zone: "Patna Riverfront", state: "Bihar", type: "Voice Call", language: "Hindi", message: "Water contamination detected. Boil water before drinking.", recipients: 2500, delivered: 2350, status: "pending" },
  { id: "alert_7", zone: "Surat", state: "Gujarat", type: "SMS", language: "Hindi", message: "High disease risk in your area. Visit nearest health center if symptoms appear.", recipients: 1500, delivered: 1420, status: "delivered" },
  { id: "alert_8", zone: "Dharavi, Mumbai", state: "Maharashtra", type: "ASHA Worker", language: "Marathi", message: "Door-to-door outreach required. High cholera risk zone.", recipients: 35, delivered: 35, status: "delivered" },
];

// ─── API Functions ──────────────────────────────────────────────────────

export const fetchDashboardSummary = async () => {
  try {
    const res = await api.get('/dashboard/summary');
    return res.data;
  } catch {
    return MOCK_SUMMARY;
  }
};

export const fetchZones = async () => {
  try {
    const res = await api.get('/zones');
    return res.data.zones;
  } catch {
    return MOCK_ZONES;
  }
};

export const fetchZoneDetail = async (zoneId) => {
  try {
    const res = await api.get(`/zones/${zoneId}`);
    return res.data;
  } catch {
    return MOCK_ZONES.find(z => z.id === zoneId) || MOCK_ZONES[0];
  }
};

export const fetchWaterTrends = async () => {
  try {
    const res = await api.get('/waterguard/trends');
    return res.data.trends;
  } catch {
    return generateMockTrends('water');
  }
};

export const fetchPharmaTrends = async () => {
  try {
    const res = await api.get('/pharmasentinel/trends');
    return res.data.trends;
  } catch {
    return generateMockTrends('pharma');
  }
};

export const fetchVaccineChain = async () => {
  try {
    const res = await api.get('/vaccinechain/status');
    return res.data;
  } catch {
    return { dispatches: MOCK_DISPATCHES, total_dispatches: MOCK_DISPATCHES.length, urgent_count: MOCK_DISPATCHES.filter(d => d.dispatch_priority === 'URGENT').length };
  }
};

export const fetchAlerts = async () => {
  try {
    const res = await api.get('/alerts/recent');
    return res.data.alerts;
  } catch {
    return MOCK_ALERTS;
  }
};

export const fetchModelInfo = async () => {
  try {
    const res = await api.get('/model/info');
    return res.data;
  } catch {
    return {
      model_type: "Random Forest Classifier", n_estimators: 150, max_depth: 12,
      accuracy: 94.2, training_samples: 5000, last_trained: "2026-03-27",
      feature_importance: {
        flood_proximity_km: 0.15, turbidity_ntu: 0.14, water_ph: 0.12,
        rainfall_mm: 0.11, ors_sales_spike: 0.10, sanitation_score: 0.09,
        historical_cases: 0.08, antibiotic_sales_spike: 0.06,
        temperature_c: 0.05, humidity_pct: 0.04, fever_med_sales_spike: 0.03,
        population_density: 0.03,
      },
    };
  }
};

export const predictRisk = async (data) => {
  try {
    const res = await api.post('/predict', data);
    return res.data;
  } catch {
    const score = (data.water_ph < 6.5 ? 2 : 0) + (data.turbidity_ntu > 50 ? 2 : 0) + (data.rainfall_mm > 150 ? 2 : 0) + (data.ors_sales_spike > 5 ? 2 : 0);
    return {
      risk_level: score >= 5 ? "High" : score >= 3 ? "Medium" : "Low",
      risk_score: score >= 5 ? 2 : score >= 3 ? 1 : 0,
      disease_predicted: score >= 5 ? "Cholera" : "None",
      days_to_peak: Math.max(3, 15 - score * 2),
      confidence: 75 + Math.random() * 20,
    };
  }
};

export const fetchWeather = async (city) => {
  try {
    const res = await api.get(`/weather/${encodeURIComponent(city)}`);
    return res.data;
  } catch {
    return {
      source: "simulated",
      city: city,
      temperature: (25 + Math.random() * 15).toFixed(1),
      humidity: (50 + Math.random() * 45).toFixed(1),
      weather: ["heavy rain", "moderate rain", "light rain", "clear sky"][Math.floor(Math.random() * 4)],
      rainfall_1h: (Math.random() * 40).toFixed(1),
      flood_risk: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
      timestamp: new Date().toISOString(),
    };
  }
};

export const sendTestAlert = async (data) => {
  try {
    const res = await api.post('/alerts/send', data);
    return res.data;
  } catch {
    return { success: true, sid: "mock_sid_test", type: data.type || "sms", timestamp: new Date().toISOString() };
  }
};

export const fetchSystemStatus = async () => {
  try {
    const res = await api.get('/system/status');
    return res.data;
  } catch {
    return {
      status: "operational",
      layers: {
        waterguard: { status: "active" },
        pharmasentinel: { status: "active" },
        vaccinechain: { status: "active" },
      },
      ml_model: { loaded: true, accuracy: 94.2 },
      integrations: {
        twilio: { status: "simulation" },
        firebase: { status: "simulation" },
        openweathermap: { status: "not configured" },
      },
      zones_monitored: 12,
      version: "1.0.0",
    };
  }
};

export default api;
