import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { BrainCircuit, Zap, AlertTriangle, Shield, Activity } from 'lucide-react';
import { predictRisk, fetchModelInfo } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const defaultValues = {
  rainfall_mm: 150, flood_proximity_km: 8, water_ph: 6.5, turbidity_ntu: 55,
  temperature_c: 35, humidity_pct: 80, historical_cases: 200,
  ors_sales_spike: 5.5, antibiotic_sales_spike: 4.0, fever_med_sales_spike: 4.5,
  population_density: 5000, sanitation_score: 35,
};

export default function MLPredictor() {
  const [form, setForm] = useState(defaultValues);
  const [result, setResult] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    fetchModelInfo().then(setModelInfo);
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handlePredict = async () => {
    setPredicting(true);
    const res = await predictRisk(form);
    setResult(res);
    setPredicting(false);
  };

  const fields = [
    { key: 'rainfall_mm', label: 'Rainfall (mm)', min: 0, max: 300, step: 5 },
    { key: 'flood_proximity_km', label: 'Flood Proximity (km)', min: 0, max: 50, step: 1 },
    { key: 'water_ph', label: 'Water pH', min: 5, max: 9, step: 0.1 },
    { key: 'turbidity_ntu', label: 'Turbidity (NTU)', min: 0, max: 100, step: 1 },
    { key: 'temperature_c', label: 'Temperature (°C)', min: 15, max: 45, step: 1 },
    { key: 'humidity_pct', label: 'Humidity (%)', min: 20, max: 100, step: 1 },
    { key: 'historical_cases', label: 'Historical Cases', min: 0, max: 500, step: 10 },
    { key: 'ors_sales_spike', label: 'ORS Sales Spike (x)', min: 0, max: 10, step: 0.5 },
    { key: 'antibiotic_sales_spike', label: 'Antibiotic Spike (x)', min: 0, max: 10, step: 0.5 },
    { key: 'fever_med_sales_spike', label: 'Fever Med Spike (x)', min: 0, max: 10, step: 0.5 },
    { key: 'population_density', label: 'Population Density', min: 100, max: 10000, step: 100 },
    { key: 'sanitation_score', label: 'Sanitation Score', min: 0, max: 100, step: 5 },
  ];

  // Feature importance chart
  const importanceData = modelInfo?.feature_importance ? {
    labels: Object.keys(modelInfo.feature_importance).map(k => k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
    datasets: [{
      label: 'Importance',
      data: Object.values(modelInfo.feature_importance),
      backgroundColor: Object.values(modelInfo.feature_importance).map(v =>
        v > 0.12 ? 'rgba(239,68,68,0.7)' : v > 0.08 ? 'rgba(245,158,11,0.7)' : 'rgba(59,130,246,0.5)'
      ),
      borderColor: Object.values(modelInfo.feature_importance).map(v =>
        v > 0.12 ? '#ef4444' : v > 0.08 ? '#f59e0b' : '#3b82f6'
      ),
      borderWidth: 1,
      borderRadius: 6,
    }],
  } : null;

  const chartOptions = {
    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1a1f35', titleColor: '#f0f4ff', bodyColor: '#94a3b8', borderColor: 'rgba(99,115,171,0.2)', borderWidth: 1, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { color: 'rgba(99,115,171,0.08)' }, ticks: { color: '#64748b', font: { size: 11 } } },
      y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10, family: 'Inter' } } },
    },
  };

  return (
    <div>
      <div className="page-title-section fade-in">
        <h1 className="page-title">🧠 ML Risk Predictor</h1>
        <p className="page-description">
          Interactive prediction tool using our Random Forest model. Input water quality, weather, and pharmacy data to get real-time outbreak risk assessment.
        </p>
      </div>

      <div className="grid-2 fade-in">
        {/* Prediction Form */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Zap size={18} style={{ color: '#f59e0b' }} /> Input Parameters</div>
            <button
              style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              onClick={() => setForm(defaultValues)}
            >
              Reset
            </button>
          </div>
          <div className="predict-form">
            {fields.map(f => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input
                  className="form-input"
                  type="number"
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                />
              </div>
            ))}
            <button className="predict-btn" onClick={handlePredict} disabled={predicting}>
              {predicting ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div> Analyzing...</> : <><BrainCircuit size={18} /> Run Prediction</>}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className={`prediction-result ${result.risk_level?.toLowerCase()}`}>
              <div className="result-header">
                {result.risk_score === 2 ? <AlertTriangle size={28} style={{ color: '#ef4444' }} /> : result.risk_score === 1 ? <Shield size={28} style={{ color: '#f59e0b' }} /> : <Shield size={28} style={{ color: '#10b981' }} />}
                <div>
                  <div className="result-risk-label" style={{ color: result.risk_score === 2 ? '#ef4444' : result.risk_score === 1 ? '#f59e0b' : '#10b981' }}>
                    {result.risk_level} Risk
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Predicted disease: <strong>{result.disease_predicted}</strong>
                  </div>
                </div>
              </div>
              <div className="result-grid">
                <div className="result-item">
                  <div className="result-val">{result.days_to_peak}</div>
                  <div className="result-lbl">Days to Peak</div>
                </div>
                <div className="result-item">
                  <div className="result-val">{typeof result.confidence === 'number' ? result.confidence.toFixed(1) : result.confidence}%</div>
                  <div className="result-lbl">Confidence</div>
                </div>
                <div className="result-item">
                  <div className="result-val">{result.disease_predicted}</div>
                  <div className="result-lbl">Disease Type</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Model Info */}
        <div>
          {modelInfo && (
            <>
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                  <div className="card-title"><BrainCircuit size={18} style={{ color: '#8b5cf6' }} /> Model Information</div>
                </div>
                <div className="zone-detail-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="zone-metric">
                    <div className="metric-val">{modelInfo.model_type.split(' ').slice(0, 2).join(' ')}</div>
                    <div className="metric-label">Algorithm</div>
                  </div>
                  <div className="zone-metric">
                    <div className="metric-val" style={{ color: '#10b981' }}>{modelInfo.accuracy}%</div>
                    <div className="metric-label">Accuracy</div>
                  </div>
                  <div className="zone-metric">
                    <div className="metric-val">{modelInfo.n_estimators}</div>
                    <div className="metric-label">Trees</div>
                  </div>
                  <div className="zone-metric">
                    <div className="metric-val">{modelInfo.training_samples.toLocaleString()}</div>
                    <div className="metric-label">Training Samples</div>
                  </div>
                </div>
              </div>

              {importanceData && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><Activity size={18} style={{ color: '#3b82f6' }} /> Feature Importance</div>
                  </div>
                  <div style={{ height: 350 }}>
                    <Bar data={importanceData} options={chartOptions} />
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                    Which input features have the most influence on outbreak risk prediction
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
