import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Pill, TrendingUp, ShoppingCart, Stethoscope, ThermometerSun } from 'lucide-react';
import { fetchPharmaTrends, fetchZones } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function PharmaSentinel() {
  const [trends, setTrends] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [t, z] = await Promise.all([fetchPharmaTrends(), fetchZones()]);
      setTrends(t);
      setZones(z);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  const latest = trends[trends.length - 1] || {};

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, usePointStyle: true } },
      tooltip: { backgroundColor: '#1a1f35', titleColor: '#f0f4ff', bodyColor: '#94a3b8', borderColor: 'rgba(99,115,171,0.2)', borderWidth: 1, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { color: 'rgba(99,115,171,0.08)' }, ticks: { color: '#64748b', font: { size: 11 } } },
      y: { grid: { color: 'rgba(99,115,171,0.08)' }, ticks: { color: '#64748b', font: { size: 11 } } },
    },
  };

  const salesChart = {
    labels: trends.map(t => t.label),
    datasets: [
      { label: 'ORS Sales', data: trends.map(t => t.ors_sales), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.12)', fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#f59e0b' },
      { label: 'Antibiotic Sales', data: trends.map(t => t.antibiotic_sales), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.12)', fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#ef4444' },
      { label: 'Fever Medicine Sales', data: trends.map(t => t.fever_med_sales), borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.12)', fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#8b5cf6' },
    ],
  };

  const anomalyChart = {
    labels: trends.map(t => t.label),
    datasets: [{
      label: 'Anomaly Score',
      data: trends.map(t => t.anomaly_score),
      backgroundColor: trends.map(t => t.anomaly_score > 0.7 ? 'rgba(239,68,68,0.7)' : t.anomaly_score > 0.4 ? 'rgba(245,158,11,0.7)' : 'rgba(16,185,129,0.7)'),
      borderColor: trends.map(t => t.anomaly_score > 0.7 ? '#ef4444' : t.anomaly_score > 0.4 ? '#f59e0b' : '#10b981'),
      borderWidth: 1, borderRadius: 6,
    }],
  };

  const spikeZones = zones.filter(z => z.pharma_data.ors_spike > 3).sort((a, b) => b.pharma_data.ors_spike - a.pharma_data.ors_spike);

  return (
    <div>
      <div className="page-title-section fade-in">
        <h1 className="page-title">💊 PharmaSentinel — Layer 2</h1>
        <p className="page-description">
          Pharmacy purchase spike tracking. Confirms disease spread through medicine demand patterns — people buy ORS before visiting hospitals.
        </p>
      </div>

      <div className="stat-grid fade-in">
        <div className="stat-card yellow">
          <div className="stat-icon"><ShoppingCart size={20} /></div>
          <div className="stat-value">{latest.ors_sales}</div>
          <div className="stat-label">ORS Packets Sold Today</div>
          <div className="stat-trend up"><TrendingUp size={12} /> +42% above baseline</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon"><Pill size={20} /></div>
          <div className="stat-value">{latest.antibiotic_sales}</div>
          <div className="stat-label">Antibiotic Units Sold</div>
          <div className="stat-trend up"><TrendingUp size={12} /> +35% above baseline</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon"><ThermometerSun size={20} /></div>
          <div className="stat-value">{latest.fever_med_sales}</div>
          <div className="stat-label">Fever Medicine Sold</div>
          <div className="stat-trend up"><TrendingUp size={12} /> +28% above baseline</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon"><Stethoscope size={20} /></div>
          <div className="stat-value">{latest.anomaly_score}</div>
          <div className="stat-label">Anomaly Score</div>
          <div className={`stat-trend ${latest.anomaly_score > 0.7 ? 'up' : 'down'}`}>
            {latest.anomaly_score > 0.7 ? '🔴 Critical' : latest.anomaly_score > 0.4 ? '🟡 Elevated' : '🟢 Normal'}
          </div>
        </div>
      </div>

      <div className="grid-2 fade-in">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><TrendingUp size={18} style={{ color: '#f59e0b' }} /> Medicine Sales Trend (7 Days)</div>
          </div>
          <div className="chart-container"><Line data={salesChart} options={chartOptions} /></div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><Stethoscope size={18} style={{ color: '#ef4444' }} /> Anomaly Score Trend</div>
          </div>
          <div className="chart-container"><Bar data={anomalyChart} options={chartOptions} /></div>
          <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Score &gt; 0.7 = Critical spike · 0.4-0.7 = Elevated · &lt; 0.4 = Normal
          </div>
        </div>
      </div>

      <div className="card fade-in">
        <div className="card-header">
          <div className="card-title"><ShoppingCart size={18} style={{ color: '#f59e0b' }} /> Zones with Pharmacy Purchase Spikes</div>
          <span className="risk-badge medium">{spikeZones.length} zones</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>State</th>
              <th>ORS Spike</th>
              <th>Antibiotic Spike</th>
              <th>Fever Med Spike</th>
              <th>Risk Level</th>
              <th>Disease</th>
            </tr>
          </thead>
          <tbody>
            {spikeZones.map(z => (
              <tr key={z.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{z.name}</td>
                <td>{z.state}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: z.pharma_data.ors_spike > 5 ? '#ef4444' : '#f59e0b' }}>
                  {z.pharma_data.ors_spike}x
                </td>
                <td style={{ fontFamily: 'JetBrains Mono', color: z.pharma_data.antibiotic_spike > 4 ? '#ef4444' : 'var(--text-secondary)' }}>
                  {z.pharma_data.antibiotic_spike}x
                </td>
                <td style={{ fontFamily: 'JetBrains Mono', color: z.pharma_data.fever_med_spike > 4 ? '#ef4444' : 'var(--text-secondary)' }}>
                  {z.pharma_data.fever_med_spike}x
                </td>
                <td><span className={`risk-badge ${z.risk_level.toLowerCase()}`}>{z.risk_level}</span></td>
                <td>{z.disease_predicted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
