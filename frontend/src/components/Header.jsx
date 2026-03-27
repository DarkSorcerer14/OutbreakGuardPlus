import { useLocation } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

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

  return (
    <header className="top-header">
      <div className="header-left">
        <h2>{title}</h2>
        <span className="header-breadcrumb">
          OutbreakGuard+ / {title}
        </span>
      </div>
      <div className="header-right">
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
