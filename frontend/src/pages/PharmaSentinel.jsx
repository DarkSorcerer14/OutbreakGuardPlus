import { useState, useEffect, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Pill, TrendingUp, ShoppingCart, Stethoscope, ThermometerSun, MessageSquare, Zap, ShieldCheck, Activity, Search } from 'lucide-react';
import { fetchPharmaTrends, fetchZones, fetchPharmaRealtime } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function PharmaSentinel() {
  const [trends, setTrends] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incomingReports, setIncomingReports] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const [t, z, r] = await Promise.all([fetchPharmaTrends(), fetchZones(), fetchPharmaRealtime()]);
      setTrends(t);
      setZones(z);
      setIncomingReports(r);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [incomingReports]);

  // Simulate active stream when activated
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const wards = ["Kurla", "Varanasi Ghats", "Andheri East", "Howrah", "T. Nagar", "Lucknow", "Bandra"];
      const messages = [
        "Elevated ORS demand (3x) in last 2 hours.",
        "Pharmacists reporting low stock of pediatric Zinc.",
        "Manual override: Suspected Cholera cluster locally.",
        "Sudden surge in Fever medicine requests.",
        "Antibiotic supply chain bottleneck reported."
      ];
      
      const newReport = {
        id: Date.now(),
        ward: wards[Math.floor(Math.random() * wards.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        type: Math.random() > 0.5 ? "WhatsApp" : "API Bridge",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "Verified"
      };

      setIncomingReports(prev => [...prev.slice(-12), newReport]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  const latest = trends[trends.length - 1] || {};

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Outfit', size: 11 }, usePointStyle: true } },
      tooltip: { backgroundColor: 'rgba(10, 10, 10, 0.9)', titleColor: '#fff', bodyColor: '#A1A1AA', borderColor: 'rgba(0, 229, 255, 0.2)', borderWidth: 1, cornerRadius: 8, padding: 12 },
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#71717A', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#71717A', font: { size: 10 } } },
    },
  };

  const salesChart = {
    labels: trends.map(t => t.label),
    datasets: [
      { label: 'ORS Demand', data: trends.map(t => t.ors_sales), borderColor: 'var(--accent-cyan)', backgroundColor: 'var(--accent-cyan-soft)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: 'var(--accent-cyan)' },
      { label: 'Antibiotics', data: trends.map(t => t.antibiotic_sales), borderColor: 'var(--accent-red)', backgroundColor: 'var(--accent-red-soft)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: 'var(--accent-red)' },
      { label: 'Fever Meds', data: trends.map(t => t.fever_med_sales), borderColor: 'var(--accent-purple)', backgroundColor: 'var(--accent-purple-soft)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: 'var(--accent-purple)' },
    ],
  };

  const anomalyChart = {
    labels: trends.map(t => t.label),
    datasets: [{
      label: 'Detection Confidence',
      data: trends.map(t => t.anomaly_score),
      backgroundColor: trends.map(t => t.anomaly_score > 0.7 ? 'var(--risk-high-bg)' : 'var(--accent-cyan-soft)'),
      borderColor: trends.map(t => t.anomaly_score > 0.7 ? 'var(--risk-high)' : 'var(--accent-cyan)'),
      borderWidth: 1.5, borderRadius: 4,
    }],
  };

  const spikeZones = zones.filter(z => z.pharma_data.ors_spike > 2.5).sort((a, b) => b.pharma_data.ors_spike - a.pharma_data.ors_spike);

  return (
    <div className="fade-in">
      <div className="page-title-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">💊 PharmaSentinel — Digital Data Bridge</h1>
            <p className="page-description">
              Layer 2 Intelligence: Real-time pharmacy reporting from local networks via WhatsApp & Structured API Bridge. 
              Detecting outbreaks 7-10 days before hospital peak.
            </p>
          </div>
          <button 
            className={`header-btn ${isSimulating ? 'active' : ''}`} 
            onClick={() => setIsSimulating(!isSimulating)}
            style={{ 
              background: isSimulating ? 'var(--risk-high-bg)' : 'var(--bg-card)',
              borderColor: isSimulating ? 'var(--risk-high)' : 'var(--border)',
              boxShadow: isSimulating ? '0 0 15px var(--risk-high-glow)' : 'none',
              display: 'flex', gap: '8px', alignItems: 'center', transition: 'all 0.4s'
            }}
          >
            <Zap size={16} fill={isSimulating ? "currentColor" : "none"} />
            {isSimulating ? "Streaming Active" : "Connect Digital Bridge"}
          </button>
        </div>
      </div>

      <div className="grid-2-1" style={{ marginBottom: '24px' }}>
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 0 }}>
          <div className="stat-card cyan">
            <div className="stat-icon"><MessageSquare size={20} /></div>
            <div className="stat-value" style={{ fontSize: '2.2rem' }}>512</div>
            <div className="stat-label">Verified Networks</div>
            <div className="stat-trend down" style={{ color: 'var(--accent-cyan)', background: 'var(--accent-cyan-soft)' }}>
              Connected via IoT & WhatsApp
            </div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon"><Activity size={20} /></div>
            <div className="stat-value" style={{ color: 'var(--risk-high)', fontSize: '2.2rem' }}>{latest.anomaly_score}</div>
            <div className="stat-label">Outbreak Signal Confidence</div>
            <div className={`stat-trend ${latest.anomaly_score > 0.7 ? 'up' : 'down'}`}>
              {latest.anomaly_score > 0.7 ? '🔴 CRITICAL ANOMALY' : '🟢 SIGNAL STABLE'}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
          <div className="card-title" style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', paddingBottom: '10px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span><Activity size={14} style={{ marginRight: '6px' }} /> LIVE REPORT BRIDGE</span>
            <span className={isSimulating ? 'live-indicator' : ''} style={{ fontSize: '0.6rem' }}>{isSimulating ? 'CONNECTED' : 'STANDBY'}</span>
          </div>
          <div 
            ref={scrollRef}
            className="custom-scrollbar"
            style={{ 
              flex: 1, overflowY: 'auto', maxHeight: '115px', 
              marginTop: '12px', fontSize: '0.8rem', 
              display: 'flex', flexDirection: 'column', gap: '10px' 
            }}
          >
            {incomingReports.map(report => (
              <div key={report.id} style={{ display: 'flex', gap: '10px', opacity: 0.8, borderLeft: '2px solid var(--accent-cyan-soft)', paddingLeft: '8px', animation: 'fadeSlideLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, whiteSpace: 'nowrap' }}>[{report.ward}]</span>
                <span style={{ color: 'var(--text-secondary)', lineHeight: '1.2' }}>{report.message}</span>
                <span style={{ marginLeft: 'auto', opacity: 0.4, fontSize: '0.65rem' }}>{report.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title"><TrendingUp size={18} style={{ color: 'var(--accent-yellow)' }} /> Demand Aggregation (7D)</div>
          </div>
          <div className="chart-container" style={{ height: '300px' }}><Line data={salesChart} options={chartOptions} /></div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><ShieldCheck size={18} style={{ color: 'var(--accent-cyan)' }} /> Network Data Integrity</div>
            <span className="risk-badge low" style={{ background: 'var(--accent-cyan-soft)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}>98.4% uptime</span>
          </div>
          <div className="chart-container" style={{ height: '300px' }}><Bar data={anomalyChart} options={chartOptions} /></div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div className="card-title">
            <Search size={18} style={{ color: 'var(--accent-cyan)' }} /> Ward-Level Pharmacy Anomalies
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="risk-badge high">{spikeZones.filter(z => z.risk_level === 'High').length} High Risk</span>
            <span className="risk-badge medium">{spikeZones.filter(z => z.risk_level === 'Medium').length} Warning</span>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Zone / Ward</th>
              <th>State</th>
              <th>ORS Spike</th>
              <th>Antibiotics</th>
              <th>Risk Level</th>
              <th>Detected Pathogen</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {spikeZones.map(z => (
              <tr key={z.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{z.name}</td>
                <td>{z.state}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: z.pharma_data.ors_spike > 6 ? 'var(--risk-high)' : 'var(--accent-yellow)' }}>
                  {z.pharma_data.ors_spike}x
                </td>
                <td style={{ fontFamily: 'JetBrains Mono', color: z.pharma_data.antibiotic_spike > 5 ? 'var(--risk-high)' : 'var(--text-secondary)' }}>
                  {z.pharma_data.antibiotic_spike}x
                </td>
                <td><span className={`risk-badge ${z.risk_level.toLowerCase()}`}>{z.risk_level}</span></td>
                <td style={{ color: z.risk_level === 'High' ? 'var(--risk-high)' : 'var(--text-secondary)', fontWeight: 500 }}>{z.disease_predicted}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="header-btn" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'transparent', border: '1px solid var(--accent-cyan-soft)', color: 'var(--accent-cyan)' }}>
                    Deploy Resources
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(20px); filter: blur(5px); }
          to { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
      `}</style>
    </div>
  );
}
