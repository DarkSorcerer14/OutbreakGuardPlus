import { useState, useEffect } from 'react';
import { Bell, Send, Phone, Users, Store, CheckCircle, Clock, XCircle } from 'lucide-react';
import { fetchAlerts } from '../utils/api';

export default function AlertCenter() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const a = await fetchAlerts();
      setAlerts(a);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);

  const totalRecipients = alerts.reduce((s, a) => s + a.recipients, 0);
  const totalDelivered = alerts.reduce((s, a) => s + a.delivered, 0);
  const deliveryRate = ((totalDelivered / totalRecipients) * 100).toFixed(1);

  const typeStats = {
    SMS: alerts.filter(a => a.type === 'SMS').length,
    'Voice Call': alerts.filter(a => a.type === 'Voice Call').length,
    'ASHA Worker': alerts.filter(a => a.type === 'ASHA Worker').length,
    'Pharmacy Notice': alerts.filter(a => a.type === 'Pharmacy Notice').length,
  };

  const alertIcon = (type) => {
    switch (type) {
      case 'SMS': return <div className="alert-type-icon sms"><Send size={16} /></div>;
      case 'Voice Call': return <div className="alert-type-icon voice"><Phone size={16} /></div>;
      case 'ASHA Worker': return <div className="alert-type-icon asha"><Users size={16} /></div>;
      default: return <div className="alert-type-icon pharmacy"><Store size={16} /></div>;
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={12} />;
      case 'pending': return <Clock size={12} />;
      case 'failed': return <XCircle size={12} />;
      default: return null;
    }
  };

  return (
    <div>
      <div className="page-title-section fade-in">
        <h1 className="page-title">🔔 Alert Center</h1>
        <p className="page-description">
          Multi-channel alert management — SMS, voice calls, ASHA worker notifications, and pharmacy notices reaching 
          vulnerable populations without smartphones.
        </p>
      </div>

      <div className="stat-grid fade-in">
        <div className="stat-card blue">
          <div className="stat-icon"><Bell size={20} /></div>
          <div className="stat-value">{alerts.length}</div>
          <div className="stat-label">Active Alerts</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><Send size={20} /></div>
          <div className="stat-value">{totalRecipients.toLocaleString()}</div>
          <div className="stat-label">Total Recipients</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon"><CheckCircle size={20} /></div>
          <div className="stat-value">{deliveryRate}%</div>
          <div className="stat-label">Delivery Rate</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon"><Phone size={20} /></div>
          <div className="stat-value">{typeStats['Voice Call']}</div>
          <div className="stat-label">Voice Call Alerts</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="layer-tabs fade-in" style={{ marginBottom: 16 }}>
        {['all', 'SMS', 'Voice Call', 'ASHA Worker', 'Pharmacy Notice'].map(f => (
          <button key={f} className={`layer-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Alerts' : f} ({f === 'all' ? alerts.length : alerts.filter(a => a.type === f).length})
          </button>
        ))}
      </div>

      {/* Alert Log */}
      <div className="card fade-in">
        <div className="alert-list" style={{ maxHeight: 600 }}>
          {filtered.map(a => (
            <div className="alert-item" key={a.id}>
              {alertIcon(a.type)}
              <div className="alert-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="alert-zone">{a.zone}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', padding: '1px 6px', background: 'rgba(99,115,171,0.1)', borderRadius: 'var(--radius-full)' }}>{a.state}</span>
                </div>
                <div className="alert-message" style={{ whiteSpace: 'normal' }}>{a.message}</div>
                <div className="alert-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{a.type}</span>
                  <span>🌐 {a.language}</span>
                  <span>👥 {a.delivered.toLocaleString()}/{a.recipients.toLocaleString()}</span>
                  <span className={`alert-status ${a.status}`} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {statusIcon(a.status)} {a.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
