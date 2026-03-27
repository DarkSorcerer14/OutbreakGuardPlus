import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import RiskHeatmap from './pages/RiskHeatmap';
import WaterGuard from './pages/WaterGuard';
import PharmaSentinel from './pages/PharmaSentinel';
import VaccineChain from './pages/VaccineChain';
import AlertCenter from './pages/AlertCenter';
import MLPredictor from './pages/MLPredictor';
import AccessibilityPage from './pages/AccessibilityPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/map" element={<RiskHeatmap />} />
              <Route path="/waterguard" element={<WaterGuard />} />
              <Route path="/pharmasentinel" element={<PharmaSentinel />} />
              <Route path="/vaccinechain" element={<VaccineChain />} />
              <Route path="/alerts" element={<AlertCenter />} />
              <Route path="/predict" element={<MLPredictor />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
