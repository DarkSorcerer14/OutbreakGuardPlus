import { useState, useEffect } from 'react';
import { Truck, Package, Syringe, AlertTriangle, MapPin, Clock, Warehouse } from 'lucide-react';
import { fetchVaccineChain } from '../utils/api';

export default function VaccineChain() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const d = await fetchVaccineChain();
      setData(d);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  const urgent = data.dispatches.filter(d => d.dispatch_priority === 'URGENT');
  const normal = data.dispatches.filter(d => d.dispatch_priority === 'NORMAL');

  const totalOrs = data.dispatches.reduce((s, d) => s + d.ors_packets_needed, 0);
  const totalVaccines = data.dispatches.reduce((s, d) => s + d.cholera_vaccines_needed, 0);
  const totalAntibiotics = data.dispatches.reduce((s, d) => s + d.antibiotics_needed, 0);

  return (
    <div>
      <div className="page-title-section fade-in">
        <h1 className="page-title">🚛 VaccineChain — Layer 3</h1>
        <p className="page-description">
          Predictive supply chain management. Automatically dispatches vaccines and medicines to PHCs before demand surges.
        </p>
      </div>

      <div className="stat-grid fade-in">
        <div className="stat-card red">
          <div className="stat-icon"><AlertTriangle size={20} /></div>
          <div className="stat-value">{data.urgent_count}</div>
          <div className="stat-label">Urgent Dispatches</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><Package size={20} /></div>
          <div className="stat-value">{(totalOrs / 1000).toFixed(1)}K</div>
          <div className="stat-label">ORS Packets Needed</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon"><Syringe size={20} /></div>
          <div className="stat-value">{(totalVaccines / 1000).toFixed(1)}K</div>
          <div className="stat-label">Cholera Vaccines Needed</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon"><Truck size={20} /></div>
          <div className="stat-value">{data.total_dispatches}</div>
          <div className="stat-label">Total Active Dispatches</div>
        </div>
      </div>

      {/* Urgent Dispatches */}
      {urgent.length > 0 && (
        <div className="card fade-in" style={{ marginBottom: 20, borderColor: 'rgba(239,68,68,0.25)' }}>
          <div className="card-header">
            <div className="card-title">
              <AlertTriangle size={18} style={{ color: '#ef4444' }} /> 🔴 Urgent Dispatches — Immediate Action Required
            </div>
            <span className="dispatch-priority urgent">⚠ {urgent.length} URGENT</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>State</th>
                <th>Risk</th>
                <th>ORS Needed</th>
                <th>Vaccines</th>
                <th>Antibiotics</th>
                <th>Dispatch By</th>
                <th>Warehouse</th>
              </tr>
            </thead>
            <tbody>
              {urgent.map(d => (
                <tr key={d.zone_id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={14} style={{ color: '#ef4444' }} />{d.zone}
                    </div>
                  </td>
                  <td>{d.state}</td>
                  <td><span className="risk-badge high">{d.risk_level}</span></td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{d.ors_packets_needed.toLocaleString()}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#8b5cf6' }}>{d.cholera_vaccines_needed.toLocaleString()}</td>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>{d.antibiotics_needed.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'JetBrains Mono', fontWeight: 600, color: '#ef4444' }}>
                      <Clock size={12} /> {d.estimated_dispatch_date}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                      <Warehouse size={12} style={{ color: 'var(--text-muted)' }} /> {d.nearest_warehouse}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Normal Dispatches */}
      <div className="card fade-in">
        <div className="card-header">
          <div className="card-title"><Truck size={18} style={{ color: '#3b82f6' }} /> Scheduled Dispatches</div>
          <span className="dispatch-priority normal">{normal.length} NORMAL</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>State</th>
              <th>Risk</th>
              <th>ORS Needed</th>
              <th>Antibiotics</th>
              <th>Dispatch By</th>
              <th>Warehouse</th>
            </tr>
          </thead>
          <tbody>
            {normal.map(d => (
              <tr key={d.zone_id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} style={{ color: '#f59e0b' }} />{d.zone}
                  </div>
                </td>
                <td>{d.state}</td>
                <td><span className="risk-badge medium">{d.risk_level}</span></td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{d.ors_packets_needed.toLocaleString()}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{d.antibiotics_needed.toLocaleString()}</td>
                <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>{d.estimated_dispatch_date}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                    <Warehouse size={12} style={{ color: 'var(--text-muted)' }} /> {d.nearest_warehouse}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supply Summary */}
      <div className="grid-3 fade-in" style={{ marginTop: 20 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Package size={32} style={{ color: '#f59e0b', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>{totalOrs.toLocaleString()}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>Total ORS Packets Required</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Syringe size={32} style={{ color: '#8b5cf6', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>{totalVaccines.toLocaleString()}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>Cholera Vaccines Required</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Truck size={32} style={{ color: '#3b82f6', margin: '0 auto 12px' }} />
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>{totalAntibiotics.toLocaleString()}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>Antibiotic Courses Required</div>
        </div>
      </div>
    </div>
  );
}
