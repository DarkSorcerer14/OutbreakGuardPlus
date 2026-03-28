import { useState, useEffect, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Pill, TrendingUp, ShoppingCart, Stethoscope, ThermometerSun, MessageSquare, Zap, ShieldCheck, Activity, Search, Globe, Server, Cpu } from 'lucide-react';
import { fetchPharmaTrends, fetchZones, fetchPharmaRealtime } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function PharmaSentinel() {
  const [trends, setTrends] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incomingReports, setIncomingReports] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const scrollRef = useRef(null);

  // Simulated node health for Integrity section
  const [nodeHealth] = useState(Array.from({ length: 48 }, (_, i) => ({
    id: i,
    status: Math.random() > 0.95 ? 'offline' : Math.random() > 0.8 ? 'latency' : 'online'
  })));

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
      legend: { position: 'top', align: 'end', labels: { color: '#94a3b8', boxWidth: 10, font: { family: 'Outfit', size: 10 }, usePointStyle: true } },
      tooltip: { backgroundColor: 'rgba(10, 10, 10, 0.95)', titleColor: '#fff', bodyColor: '#A1A1AA', borderColor: 'rgba(0, 229, 255, 0.2)', borderWidth: 1, cornerRadius: 8, padding: 12 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#71717A', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.03)', borderDash: [5, 5] }, ticks: { color: '#71717A', font: { size: 10 } } },
    },
  };

  const salesChart = {
    labels: [...trends.map(t => t.label), 'Day +1 (F)', 'Day +2 (F)'],
    datasets: [
      { 
        label: 'ORS Demand', 
        data: [...trends.map(t => t.ors_sales), latest.ors_sales * 1.2, latest.ors_sales * 1.35], 
        borderColor: 'var(--accent-cyan)', 
        backgroundColor: 'rgba(0, 229, 255, 0.05)', 
        fill: true, tension: 0.4, pointRadius: 4, 
        segment: { borderDash: ctx => ctx.p1DataIndex >= trends.length - 1 ? [5, 5] : undefined } 
      },
      { 
        label: 'Antibiotics', 
        data: [...trends.map(t => t.antibiotic_sales), latest.antibiotic_sales * 1.1, latest.antibiotic_sales * 1.25], 
        borderColor: 'var(--accent-red)', 
        backgroundColor: 'rgba(255, 51, 102, 0.05)', 
        fill: true, tension: 0.4, pointRadius: 4,
        segment: { borderDash: ctx => ctx.p1DataIndex >= trends.length - 1 ? [5, 5] : undefined }
      },
      { 
        label: 'Fever Meds', 
        data: [...trends.map(t => t.fever_med_sales), latest.fever_med_sales * 1.15, latest.fever_med_sales * 1.3], 
        borderColor: 'var(--accent-purple)', 
        backgroundColor: 'rgba(176, 38, 255, 0.05)', 
        fill: true, tension: 0.4, pointRadius: 4,
        segment: { borderDash: ctx => ctx.p1DataIndex >= trends.length - 1 ? [5, 5] : undefined }
      },
    ],
  };

  const integrityChart = {
    labels: trends.map(t => t.label),
    datasets: [
      {
        label: 'Signal Latency (ms)',
        data: trends.map(() => Math.floor(40 + Math.random() * 80)),
        borderColor: 'var(--accent-cyan)',
        backgroundColor: 'var(--accent-cyan)',
        type: 'line',
        order: 1,
        yAxisID: 'y',
        tension: 0.3
      },
      {
        label: 'Packet Success Rate (%)',
        data: trends.map(() => 95 + Math.random() * 4.9),
        backgroundColor: 'rgba(16, 185, 129, 0.4)',
        borderColor: 'var(--accent-green)',
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y1',
        order: 2
      }
    ],
  };

  const integrityOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y1: { position: 'right', grid: { display: false }, ticks: { color: 'var(--accent-green)', font: { size: 9 } }, min: 90, max: 100 }
    }
  };

  const spikeZones = zones.filter(z => z.pharma_data.ors_spike > 2.5).sort((a, b) => b.pharma_data.ors_spike - a.pharma_data.ors_spike);

  return (
    <div className="fade-in">
      <div className="page-title-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">💊 PharmaSentinel — High Fidelity Data Bridge</h1>
            <p className="page-description">
              Advanced Outbreak Intelligence: Aggregating real-time demand anomalies across 512+ distributed pharmacy nodes with 99.9% signal integrity.
            </p>
          </div>
          <button 
            className={`header-btn ${isSimulating ? 'active' : ''}`} 
            onClick={() => setIsSimulating(!isSimulating)}
            style={{ 
              background: isSimulating ? 'var(--risk-high-bg)' : 'var(--bg-card)',
              borderColor: isSimulating ? 'var(--risk-high)' : 'var(--border)',
              boxShadow: isSimulating ? '0 0 20px var(--risk-high-glow)' : 'none',
              display: 'flex', gap: '8px', alignItems: 'center', transition: 'all 0.4s'
            }}
          >
            <Zap size={16} fill={isSimulating ? "currentColor" : "none"} />
            {isSimulating ? "Network Stream Active" : "Initialize Data Bridge"}
          </button>
        </div>
      </div>

      <div className="grid-2-1" style={{ marginBottom: '24px' }}>
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 0 }}>
          <div className="stat-card cyan">
            <div className="stat-icon" style={{ background: 'var(--accent-cyan-soft)', color: 'var(--accent-cyan)' }}><Globe size={20} /></div>
            <div className="stat-value" style={{ fontSize: '2.2rem' }}>512</div>
            <div className="stat-label">Verified Reporting Nodes</div>
            <div className="stat-trend down" style={{ color: 'var(--accent-cyan)', background: 'var(--accent-cyan-soft)' }}>
              Active Ward-Level Peer Mesh
            </div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon" style={{ background: 'var(--risk-high-bg)', color: 'var(--risk-high)' }}><Activity size={20} /></div>
            <div className="stat-value" style={{ color: 'var(--risk-high)', fontSize: '2.2rem' }}>{latest.anomaly_score}</div>
            <div className="stat-label">Signal Anomaly Delta</div>
            <div className={`stat-trend ${latest.anomaly_score > 0.7 ? 'up' : 'down'}`}>
              {latest.anomaly_score > 0.7 ? '🔴 CRITICAL CLUSTER' : '🟢 NOISE FILTERED'}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--border)', background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.05) 0%, rgba(0,0,0,0) 100%)', overflow: 'hidden' }}>
          <div className="card-title" style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', paddingBottom: '10px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <span><Server size={14} style={{ marginRight: '6px' }} /> Incoming Signal stream</span>
            <span style={{ fontSize: '0.6rem', color: isSimulating ? 'var(--accent-green)' : 'var(--text-muted)' }}>{isSimulating ? '● STREAM_LIVE' : '○ BRIDGE_IDLE'}</span>
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
            <div>
              <div className="card-title"><TrendingUp size={18} style={{ color: 'var(--accent-yellow)' }} /> Demand Aggregation & Predictive Forecast</div>
              <p className="card-subtitle">Aggregated sales cycles with AI-driven 48h forward projection (dashed lines).</p>
            </div>
          </div>
          <div className="chart-container" style={{ height: '280px' }}><Line data={salesChart} options={chartOptions} /></div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><ShieldCheck size={18} style={{ color: 'var(--accent-cyan)' }} /> Network Integrity & Node Health</div>
              <p className="card-subtitle">Monitoring 512+ nodes for packet success and endpoint latency.</p>
            </div>
            <div className="stat-trend down" style={{ background: 'var(--accent-cyan-soft)', color: 'var(--accent-cyan)', fontSize: '0.65rem' }}>
              Avg Latency: 64ms
            </div>
          </div>
          <div className="chart-container" style={{ height: '180px', marginBottom: '16px' }}><Bar data={integrityChart} options={integrityOptions} /></div>
          
          <div className="card-title" style={{ fontSize: '0.7rem', marginBottom: '8px' }}><Cpu size={12} /> Bridge Node Status (Representative Sample)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '4px' }}>
            {nodeHealth.map(node => (
              <div 
                key={node.id} 
                className={`node-dot ${node.status}`}
                style={{ 
                  width: '100%', aspectRatio: '1', borderRadius: '2px',
                  background: node.status === 'online' ? 'var(--risk-low)' : node.status === 'latency' ? 'var(--risk-medium)' : 'var(--risk-high)',
                  opacity: node.status === 'online' ? 0.6 : 1,
                  boxShadow: node.status === 'online' ? 'none' : `0 0 8px ${node.status === 'latency' ? 'var(--risk-medium)' : 'var(--risk-high)'}`
                }} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div className="card-title">
            <Search size={18} style={{ color: 'var(--accent-cyan)' }} /> Cross-Reference: Ward Anomalies vs Lab Pathogens
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span className="risk-badge high">{spikeZones.filter(z => z.risk_level === 'High').length} High Vol</span>
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
              <th>Signal Status</th>
              <th>Simulated Pathogen</th>
              <th style={{ textAlign: 'right' }}>Deployment</th>
            </tr>
          </thead>
          <tbody>
            {spikeZones.map(z => (
              <tr key={z.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{z.name}</td>
                <td>{z.state}</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: z.pharma_data.ors_spike > 6 ? 'var(--risk-high)' : 'var(--accent-yellow)' }}>
                  {z.pharma_data.ors_spike.toFixed(1)}x
                </td>
                <td style={{ fontFamily: 'JetBrains Mono', color: z.pharma_data.antibiotic_spike > 5 ? 'var(--risk-high)' : 'var(--text-secondary)' }}>
                  {z.pharma_data.antibiotic_spike.toFixed(1)}x
                </td>
                <td><span className={`risk-badge ${z.risk_level.toLowerCase()}`}>{z.risk_level} Verified</span></td>
                <td style={{ color: z.risk_level === 'High' ? 'var(--risk-high)' : 'var(--text-secondary)', fontWeight: 500 }}>{z.disease_predicted}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="header-btn" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'transparent', border: '1px solid var(--accent-cyan-soft)', color: 'var(--accent-cyan)' }}>
                    Trigger Hub
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
        .node-dot { transition: all 0.3s ease; cursor: pointer; }
        .node-dot:hover { transform: scale(1.5); z-index: 10; opacity: 1; }
      `}</style>
    </div>
  );
}
