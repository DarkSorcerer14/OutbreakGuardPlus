import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchZones } from '../utils/api';

const riskColors = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
};

const riskRadius = {
  High: 18,
  Medium: 13,
  Low: 9,
};

export default function RiskHeatmap() {
  const [zones, setZones] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const z = await fetchZones();
      setZones(z);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = filter === 'all' ? zones : zones.filter(z => z.risk_level.toLowerCase() === filter);

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="page-title-section fade-in">
        <h1 className="page-title">📍 Live Risk Heatmap</h1>
        <p className="page-description">
          Real-time visualization of outbreak risk across monitored zones. Circle size and color indicate risk severity.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="layer-tabs fade-in" style={{ marginBottom: 16 }}>
        {[
          { key: 'all', label: 'All Zones', count: zones.length },
          { key: 'high', label: 'High Risk', count: zones.filter(z => z.risk_level === 'High').length },
          { key: 'medium', label: 'Medium Risk', count: zones.filter(z => z.risk_level === 'Medium').length },
          { key: 'low', label: 'Low Risk', count: zones.filter(z => z.risk_level === 'Low').length },
        ].map(f => (
          <button
            key={f.key}
            className={`layer-tab ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.key !== 'all' && <span className={`tab-dot`} style={{ background: riskColors[f.key.charAt(0).toUpperCase() + f.key.slice(1)] || '#3b82f6' }}></span>}
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="card fade-in" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="map-container" style={{ height: 550 }}>
          <MapContainer
            center={[23.5, 80]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {filtered.map(zone => (
              <CircleMarker
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={riskRadius[zone.risk_level]}
                pathOptions={{
                  color: riskColors[zone.risk_level],
                  fillColor: riskColors[zone.risk_level],
                  fillOpacity: 0.35,
                  weight: 2,
                  opacity: 0.8,
                }}
              >
                <Popup>
                  <div style={{ minWidth: 220 }}>
                    <div className="popup-title">{zone.name}</div>
                    <div style={{ marginBottom: 8 }}>
                      <span className={`risk-badge ${zone.risk_level.toLowerCase()}`}>
                        <span className={`risk-dot ${zone.risk_level.toLowerCase()}`}></span>
                        {zone.risk_level} Risk
                      </span>
                    </div>
                    <div className="popup-row">
                      <span className="popup-label">Disease</span>
                      <span className="popup-value">{zone.disease_predicted}</span>
                    </div>
                    <div className="popup-row">
                      <span className="popup-label">Days to Peak</span>
                      <span className="popup-value">{zone.days_to_peak}</span>
                    </div>
                    <div className="popup-row">
                      <span className="popup-label">Confidence</span>
                      <span className="popup-value">{zone.confidence}%</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid rgba(99,115,171,0.15)', margin: '8px 0' }} />
                    <div className="popup-row">
                      <span className="popup-label">Water pH</span>
                      <span className="popup-value">{zone.water_data.ph}</span>
                    </div>
                    <div className="popup-row">
                      <span className="popup-label">Turbidity</span>
                      <span className="popup-value">{zone.water_data.turbidity} NTU</span>
                    </div>
                    <div className="popup-row">
                      <span className="popup-label">ORS Spike</span>
                      <span className="popup-value">{zone.pharma_data.ors_spike}x</span>
                    </div>
                    <div className="popup-row">
                      <span className="popup-label">Population</span>
                      <span className="popup-value">{(zone.population / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Zone List Table below map */}
      <div className="card fade-in" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div className="card-title">All Monitored Zones</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>State</th>
              <th>Risk</th>
              <th>Disease</th>
              <th>pH</th>
              <th>Turbidity</th>
              <th>ORS Spike</th>
              <th>Days to Peak</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {zones.sort((a, b) => b.risk_score - a.risk_score).map(z => (
              <tr key={z.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{z.name}</td>
                <td>{z.state}</td>
                <td><span className={`risk-badge ${z.risk_level.toLowerCase()}`}>
                  <span className={`risk-dot ${z.risk_level.toLowerCase()}`}></span>{z.risk_level}
                </span></td>
                <td>{z.disease_predicted}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{z.water_data.ph}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{z.water_data.turbidity}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{z.pharma_data.ors_spike}x</td>
                <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{z.days_to_peak}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{z.confidence}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
