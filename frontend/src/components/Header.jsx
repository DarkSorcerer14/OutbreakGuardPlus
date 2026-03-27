import { useLocation } from 'react-router-dom';
import { RefreshCw, Zap } from 'lucide-react';
import axios from 'axios';

const pageTitles = {
  '/': 'Command Center',
  '/map': 'Risk Heatmap',
  '/waterguard': 'WaterGuard — Layer 1',
  '/pharmasentinel': 'PharmaSentinel — Layer 2',
  '/vaccinechain': 'VaccineChain — Layer 3',
  '/alerts': 'Alert Center',
  '/predict': 'ML Risk Predictor',
  '/accessibility': 'Accessibility Layer',
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  const handleSimulate = async () => {
    try {
      if (confirm('Simulate a critical outbreak in Dharavi to test alerts?')) {
        await axios.post('http://localhost:5000/api/system/simulate-outbreak', { zone_id: 'z1' });
        alert('Simulation triggered! Check Terminal for alerts.');
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert('Simulation failed. Is backend running?');
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <h2>{title}</h2>
        <span className="header-breadcrumb">
          OutbreakGuard+ / {title}
        </span>
      </div>
      <div className="header-right">
        <button 
          className="header-btn" 
          onClick={handleSimulate}
          style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
        >
          <Zap size={14} />
          Simulate Outbreak
        </button>
        <div className="live-indicator">
          <span className="live-dot"></span>
          LIVE MONITORING
        </div>
        <button className="header-btn" onClick={() => window.location.reload()}>
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
    </header>
  );
}
