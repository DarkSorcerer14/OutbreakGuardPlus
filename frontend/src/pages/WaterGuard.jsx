import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Droplets, AlertTriangle, TrendingUp, Waves, ThermometerSun } from 'lucide-react';
import { fetchWaterTrends, fetchZones } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function WaterGuard() {
  const [trends, setTrends] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [t, z] = await Promise.all([fetchWaterTrends(), fetchZones()]);
      setTrends(t);
      setZones(z);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  const latest = trends[trends.length - 1] || {};
  const highZones = zones.filter(z => z.risk_score === 2);

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

  const phChart = {
    labels: trends.map(t => t.label),
    datasets: [{
      label: 'Average pH',
      data: trends.map(t => t.avg_ph),
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6,182,212,0.15)',
      fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#06b6d4',
    }],
  };

  const turbidityChart = {
    labels: trends.map(t => t.label),
    datasets: [{
      label: 'Turbidity (NTU)',
      data: trends.map(t => t.avg_turbidity),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239,68,68,0.15)',
      fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#ef4444',
    }],
  };

  const contaminationBar = {
    labels: trends.map(t => t.label),
    datasets: [{
      label: 'Contamination Events',
      data: trends.map(t => t.contamination_events),
      backgroundColor: 'rgba(239,68,68,0.6)',
      borderColor: '#ef4444',
      borderWidth: 1, borderRadius: 6,
    }, {
      label: 'Zones at Risk',
      data: trends.map(t => t.zones_at_risk),
      backgroundColor: 'rgba(245,158,11,0.6)',
      borderColor: '#f59e0b',
      borderWidth: 1, borderRadius: 6,
    }],
  };

  return (
    <div>
      <div className="page-title-section fade-in">
        <h1 className="page-title">💧 WaterGuard — Layer 1</h1>
        <p className="page-description">
          Real-time water quality monitoring. Detects contamination risks 5-7 days before outbreak onset.
        </p>
      </div>

      <div className="stat-grid fade-in">
        <div className="stat-card cyan">
          <div className="stat-icon"><Droplets size={20} /></div>
          <div className="stat-value">{latest.avg_ph}</div>
          <div className="stat-label">Avg Water pH</div>
          <div className={`stat-trend ${latest.avg_ph < 6.5 ? 'up' : 'down'}`}>
            {latest.avg_ph < 6.5 ? '⚠️ Below safe' : '✓ Normal range'}
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon"><Waves size={20} /></div>
          <div className="stat-value">{latest.avg_turbidity}</div>
          <div className="stat-label">Avg Turbidity (NTU)</div>
          <div className={`stat-trend ${latest.avg_turbidity > 50 ? 'up' : 'down'}`}>
            {latest.avg_turbidity > 50 ? '⚠️ High levels' : '✓ Acceptable'}
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon"><ThermometerSun size={20} /></div>
          <div className="stat-value">{latest.avg_rainfall}</div>
          <div className="stat-label">Avg Rainfall (mm)</div>
          <div className={`stat-trend ${latest.avg_rainfall > 150 ? 'up' : 'down'}`}>
            {latest.avg_rainfall > 150 ? '⚠️ Flood risk' : '✓ Moderate'}
          </div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon"><AlertTriangle size={20} /></div>
          <div className="stat-value">{latest.contamination_events}</div>
          <div className="stat-label">Active Contamination Events</div>
          <div className="stat-trend up">
            <TrendingUp size={12} /> Today's count
          </div>
        </div>
      </div>

      <div className="grid-2 fade-in">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Droplets size={18} style={{ color: '#06b6d4' }} /> pH Trend (7 Days)</div>
          </div>
          <div className="chart-container"><Line data={phChart} options={chartOptions} /></div>
          <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Safe range: 6.5 — 8.5 · Below 6.5 indicates contamination
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><Waves size={18} style={{ color: '#ef4444' }} /> Turbidity Trend (7 Days)</div>
          </div>
          <div className="chart-container"><Line data={turbidityChart} options={chartOptions} /></div>
          <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            WHO guideline: &lt;25 NTU · Above 50 NTU = High contamination risk
          </div>
        </div>
      </div>

      <div className="grid-2 fade-in">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><AlertTriangle size={18} style={{ color: '#f59e0b' }} /> Contamination Events & At-Risk Zones</div>
          </div>
          <div className="chart-container"><Bar data={contaminationBar} options={chartOptions} /></div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><AlertTriangle size={18} style={{ color: '#ef4444' }} /> Zones with Water Quality Issues</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>pH</th>
                <th>Turbidity</th>
                <th>Rainfall</th>
                <th>Flood Prox.</th>
              </tr>
            </thead>
            <tbody>
              {zones.sort((a, b) => b.water_data.turbidity - a.water_data.turbidity).slice(0, 6).map(z => (
                <tr key={z.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div>{z.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{z.state}</div>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', color: z.water_data.ph < 6.5 ? '#ef4444' : 'var(--text-secondary)' }}>
                    {z.water_data.ph}
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', color: z.water_data.turbidity > 50 ? '#ef4444' : 'var(--text-secondary)' }}>
                    {z.water_data.turbidity} NTU
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>{z.water_data.rainfall} mm</td>
                  <td style={{ fontFamily: 'JetBrains Mono', color: z.water_data.flood_proximity < 10 ? '#f59e0b' : 'var(--text-secondary)' }}>
                    {z.water_data.flood_proximity} km
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
