import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import {
  Shield, AlertTriangle, Users, Send, Syringe, Target,
  TrendingUp, TrendingDown, Droplets, Pill, Truck,
  Download, Activity
} from 'lucide-react';
import { fetchDashboardSummary, fetchZones, fetchWaterTrends, fetchAlerts } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [zones, setZones] = useState([]);
  const [trends, setTrends] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, z, t, a] = await Promise.all([
        fetchDashboardSummary(),
        fetchZones(),
        fetchWaterTrends(),
        fetchAlerts(),
      ]);
      setSummary(s);
      setZones(z);
      setTrends(t);
      setAlerts(a);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  const highRiskZones = zones.filter(z => z.risk_score === 2);
  const mediumRiskZones = zones.filter(z => z.risk_score === 1);

  // Simple CSV Export function for bureaucracy feature
  const handleExportCSV = () => {
    const headers = "Zone,Disease,Risk Level,Alerts Sent,Date\n";
    const rows = highRiskZones.map(z => `${z.name},${z.disease_predicted},High,1250,${new Date().toISOString().split('T')[0]}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Health_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Historic 30-Day Outbreak data (Simulated feature)
  const historyChart = {
    labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30 (Today)'],
    datasets: [{
      label: 'Reported Cases',
      data: [12, 14, 18, 45, 120, 310, 85],
      borderColor: '#B026FF',
      backgroundColor: 'rgba(176, 38, 255, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#B026FF',
    }],
  };

  // Trend chart data
  const trendChart = {
    labels: trends.map(t => t.label),
    datasets: [
      {
        label: 'Turbidity (NTU)',
        data: trends.map(t => t.avg_turbidity),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#ef4444',
      },
      {
        label: 'Rainfall (mm)',
        data: trends.map(t => t.avg_rainfall),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, usePointStyle: true, pointStyle: 'circle' },
      },
      tooltip: {
        backgroundColor: '#1a1f35',
        titleColor: '#f0f4ff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(99, 115, 171, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(99, 115, 171, 0.08)', drawBorder: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(99, 115, 171, 0.08)', drawBorder: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
    },
  };

  // Risk distribution doughnut
  const doughnutData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [{
      data: [summary.high_risk_zones, summary.medium_risk_zones, summary.low_risk_zones],
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
      borderColor: ['rgba(239,68,68,0.3)', 'rgba(245,158,11,0.3)', 'rgba(16,185,129,0.3)'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 16, usePointStyle: true },
      },
      tooltip: {
        backgroundColor: '#1a1f35',
        titleColor: '#f0f4ff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(99,115,171,0.2)',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
  };

  const alertTypeIcon = (type) => {
    switch(type) {
      case 'SMS': return <span className="alert-type-icon sms">📱</span>;
      case 'Voice Call': return <span className="alert-type-icon voice">📞</span>;
      case 'ASHA Worker': return <span className="alert-type-icon asha">👩‍⚕️</span>;
      default: return <span className="alert-type-icon pharmacy">🏪</span>;
    }
  };

  return (
    <div>
      <div className="page-title-section fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">🛡️ Command Center</h1>
          <p className="page-description">
            Real-time overview of all three intelligence layers monitoring {summary.total_zones} zones across India
          </p>
        </div>
        <button className="header-btn" onClick={handleExportCSV} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <Download size={16} /> Export IRS Report
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-card red fade-in fade-in-delay-1">
          <div className="stat-icon"><AlertTriangle size={20} /></div>
          <div className="stat-value">{summary.high_risk_zones}</div>
          <div className="stat-label">High Risk Zones</div>
          <div className="stat-trend up"><TrendingUp size={12} /> +2 since yesterday</div>
        </div>
        <div className="stat-card yellow fade-in fade-in-delay-2">
          <div className="stat-icon"><Shield size={20} /></div>
          <div className="stat-value">{(summary.total_population_at_risk / 1000000).toFixed(1)}M</div>
          <div className="stat-label">Population at Risk</div>
          <div className="stat-trend up"><TrendingUp size={12} /> +340K this week</div>
        </div>
        <div className="stat-card blue fade-in fade-in-delay-3">
          <div className="stat-icon"><Send size={20} /></div>
          <div className="stat-value">{(summary.alerts_sent_today / 1000).toFixed(1)}K</div>
          <div className="stat-label">Alerts Sent Today</div>
          <div className="stat-trend down"><TrendingDown size={12} /> 98.2% delivered</div>
        </div>
        <div className="stat-card green fade-in fade-in-delay-4">
          <div className="stat-icon"><Syringe size={20} /></div>
          <div className="stat-value">{(summary.vaccines_dispatched / 1000).toFixed(1)}K</div>
          <div className="stat-label">Vaccines Dispatched</div>
          <div className="stat-trend down"><TrendingDown size={12} /> On schedule</div>
        </div>
      </div>

      <div className="grid-3 fade-in">
        <div className="card" style={{ borderTop: '3px solid #3b82f6' }}>
          <div className="card-header">
            <div className="card-title"><Droplets size={18} style={{ color: '#3b82f6' }} /> WaterGuard</div>
            <span className="risk-badge high"><span className="risk-dot high"></span> Active</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
            Monitoring water pH, turbidity & flood proximity across {summary.total_zones} zones
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                {trends[trends.length - 1]?.avg_turbidity || '—'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Turbidity (NTU)</div>
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                {trends[trends.length - 1]?.contamination_events || '—'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Contamination Events</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderTop: '3px solid #f59e0b' }}>
          <div className="card-header">
            <div className="card-title"><Pill size={18} style={{ color: '#f59e0b' }} /> PharmaSentinel</div>
            <span className="risk-badge medium"><span className="risk-dot medium"></span> Monitoring</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
            Tracking ORS, antibiotic & fever medicine purchase spikes at pharmacies
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#f59e0b' }}>
                {highRiskZones.length > 0 ? highRiskZones[0].pharma_data.ors_spike + 'x' : '—'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Peak ORS Spike</div>
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#f59e0b' }}>
                {mediumRiskZones.length + highRiskZones.length}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Zones with Spikes</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderTop: '3px solid #10b981' }}>
          <div className="card-header">
            <div className="card-title"><Truck size={18} style={{ color: '#10b981' }} /> VaccineChain</div>
            <span className="risk-badge low"><span className="risk-dot low"></span> Dispatching</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
            Pre-positioning vaccines and medicines at PHCs based on demand prediction
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#10b981' }}>
                {(summary.vaccines_dispatched / 1000).toFixed(1)}K
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Units Dispatched</div>
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#10b981' }}>
                {highRiskZones.length}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Urgent Dispatches</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-3 fade-in">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Activity size={18} /> Historic Outbreaks (30 Days)</div>
          </div>
          <div className="chart-container" style={{ height: 220 }}>
            <Line data={historyChart} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><TrendingUp size={18} /> Water Quality Trends (7 Days)</div>
          </div>
          <div className="chart-container" style={{ height: 220 }}>
            <Line data={trendChart} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><Target size={18} /> Risk Distribution</div>
          </div>
          <div className="chart-container" style={{ height: 240 }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ML Model Accuracy: <strong style={{ color: 'var(--accent-green)' }}>{summary.outbreak_prediction_accuracy}%</strong>
          </div>
        </div>
      </div>

      <div className="grid-2 fade-in">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><AlertTriangle size={18} style={{ color: '#ef4444' }} /> High Risk Zones</div>
            <span className="risk-badge high">{highRiskZones.length} zones</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Disease</th>
                <th>Days to Peak</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {highRiskZones.map(z => (
                <tr key={z.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div>{z.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{z.state}</div>
                  </td>
                  <td><span className="risk-badge high">{z.disease_predicted}</span></td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{z.days_to_peak} days</td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{z.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><Send size={18} style={{ color: '#3b82f6' }} /> Recent Alerts</div>
          </div>
          <div className="alert-list">
            {alerts.slice(0, 6).map(a => (
              <div className="alert-item" key={a.id}>
                {alertTypeIcon(a.type)}
                <div className="alert-content">
                  <div className="alert-zone">{a.zone}</div>
                  <div className="alert-message">{a.message}</div>
                  <div className="alert-meta">
                    <span>{a.type} • {a.language}</span>
                    <span>{a.delivered}/{a.recipients} delivered</span>
                    <span className={`alert-status ${a.status}`}>{a.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
