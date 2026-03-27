import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Droplets, Pill, Truck, AlertTriangle,
  BrainCircuit, Accessibility, MapPin, Bell
} from 'lucide-react';

const navItems = [
  { section: 'Overview' },
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/map', label: 'Risk Heatmap', icon: MapPin, badge: 'LIVE' },
  { section: 'Intelligence Layers' },
  { path: '/waterguard', label: 'WaterGuard', icon: Droplets },
  { path: '/pharmasentinel', label: 'PharmaSentinel', icon: Pill },
  { path: '/vaccinechain', label: 'VaccineChain', icon: Truck },
  { section: 'System' },
  { path: '/alerts', label: 'Alert Center', icon: Bell, badge: '4' },
  { path: '/predict', label: 'ML Predictor', icon: BrainCircuit },
  { path: '/accessibility', label: 'Accessibility', icon: Accessibility },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>
          <span className="logo-icon">🛡️</span>
          OutbreakGuard+
        </h1>
        <div className="logo-sub">Early Warning System</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.section) {
            return <div key={i} className="nav-section-label">{item.section}</div>;
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={item.path === '/'}
            >
              <Icon className="nav-icon" size={20} />
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot"></span>
          System Operational — All layers active
        </div>
      </div>
    </aside>
  );
}
