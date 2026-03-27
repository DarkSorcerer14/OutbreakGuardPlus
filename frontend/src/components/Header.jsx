import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCw, Zap, Globe } from 'lucide-react';
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

  const getCookieLang = () => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    return match ? match[1] : 'en';
  };

  const handleLangChange = (e) => {
    const lang = e.target.value;
    // Set cookie for both domain and path to guarantee it writes
    document.cookie = `googtrans=/en/${lang}; path=/`;
    document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
    window.location.reload();
  };

  // Ask for browser notification permissions initially
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleSimulate = async () => {
    try {
      if (confirm('Simulate a critical outbreak in Dharavi to test alerts?')) {
        await axios.post('http://localhost:5000/api/system/simulate-outbreak', { zone_id: 'z1' });
        
        // Trigger native browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('CRITICAL: Cholera Alert 🚨', {
            body: 'OutbreakGuard ML has detected a high-risk outbreak in Dharavi. Dispatching medical aid now.',
            icon: '/favicon.ico'
          });
        }
        
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
        <select 
          className="header-btn" 
          value={getCookieLang()}
          onChange={handleLangChange}
          style={{ appearance: 'none', cursor: 'pointer', paddingRight: 30, backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '12px' }}
        >
          <option value="en">🌐 English (EN)</option>
          <option value="hi">🌐 Hindi (HI)</option>
          <option value="ta">🌐 Tamil (TA)</option>
        </select>
        <button 
          className="header-btn btn-simulate" 
          onClick={handleSimulate}
        >
          <Zap size={14} className="simulate-icon" />
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
