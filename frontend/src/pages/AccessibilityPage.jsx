import { MessageSquare, Phone, Users, Store, Heart, Globe, Shield, Smartphone } from 'lucide-react';

export default function AccessibilityPage() {
  const channels = [
    {
      icon: <MessageSquare size={24} />,
      iconClass: 'sms',
      title: 'SMS Alerts',
      description: 'Simple text messages in local languages sent to registered phone numbers. Works on any basic mobile phone — no smartphone or internet needed.',
      stats: [
        { label: 'Languages', value: '3+' },
        { label: 'Avg Delivery', value: '98.2%' },
        { label: 'Reach Time', value: '<30 sec' },
      ],
      example: '"⚠️ आपके क्षेत्र में पानी दूषित है। पानी उबालकर पिएं। लक्षण दिखें तो नज़दीकी स्वास्थ्य केंद्र जाएं।"',
      exampleLang: 'Hindi SMS Example',
    },
    {
      icon: <Phone size={24} />,
      iconClass: 'voice',
      title: 'Automated Voice Calls',
      description: 'Pre-recorded voice alerts in regional languages for illiterate and elderly users. The system calls registered numbers and plays a clear warning message.',
      stats: [
        { label: 'Languages', value: '3+' },
        { label: 'Answer Rate', value: '85%' },
        { label: 'Call Length', value: '~45 sec' },
      ],
      example: '"Namaste, aapke area mein paani kharab hai. Paani ubaalkar peeyein. Bukhar ya dast hone par turant swasthya kendra jaayein."',
      exampleLang: 'Hindi Voice Script',
    },
    {
      icon: <Users size={24} />,
      iconClass: 'asha',
      title: 'ASHA Worker Notifications',
      description: 'Community health workers (Accredited Social Health Activists) receive instant alerts on their phones. They then conduct door-to-door visits in high-risk areas.',
      stats: [
        { label: 'Active Workers', value: '900K+' },
        { label: 'Coverage', value: 'Rural India' },
        { label: 'Response', value: '<2 hours' },
      ],
      example: 'ASHA workers receive zone-specific briefings with: affected area, risk level, symptoms to watch for, and nearest resource center.',
      exampleLang: 'Notification Content',
    },
    {
      icon: <Store size={24} />,
      iconClass: 'pharmacy',
      title: 'Pharmacy Notices',
      description: 'Automated notices sent to local pharmacies when disease surveillance detects spikes. Pharmacists are trained to advise customers on preventive measures.',
      stats: [
        { label: 'Pharmacies', value: '600K+' },
        { label: 'Network', value: 'Pan India' },
        { label: 'Alert Type', value: 'Digital' },
      ],
      example: 'Pharmacy receives: "Alert: Cholera risk elevated in your area. Stock ORS, Zinc tablets, and Ciprofloxacin. Advise customers on water boiling."',
      exampleLang: 'Pharmacy Alert Example',
    },
  ];

  return (
    <div>
      <div className="page-title-section fade-in">
        <h1 className="page-title">♿ Accessibility Layer</h1>
        <p className="page-description">
          Designed for India's most vulnerable — elderly, illiterate, and rural populations who lack smartphones
          but face the highest risk from waterborne disease outbreaks.
        </p>
      </div>

      {/* Key Principles */}
      <div className="stat-grid fade-in">
        <div className="stat-card green">
          <div className="stat-icon"><Smartphone size={20} /></div>
          <div className="stat-value">Zero</div>
          <div className="stat-label">Smartphone Requirement</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon"><Globe size={20} /></div>
          <div className="stat-value">6+</div>
          <div className="stat-label">Languages Supported</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon"><Shield size={20} /></div>
          <div className="stat-value">4</div>
          <div className="stat-label">Alert Channels</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon"><Heart size={20} /></div>
          <div className="stat-value">100%</div>
          <div className="stat-label">Inclusive Design</div>
        </div>
      </div>

      {/* Channel Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
        {channels.map((ch, i) => (
          <div className="card" key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div className={`access-icon ${ch.iconClass}`}>{ch.icon}</div>
                <div>
                  <div className="access-title">{ch.title}</div>
                </div>
              </div>
              <p className="access-desc">{ch.description}</p>
              <div className="access-stats" style={{ marginTop: 16 }}>
                {ch.stats.map((s, j) => (
                  <div className="access-stat" key={j}>
                    <strong>{s.value}</strong> {s.label}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: 'var(--radius-md)', padding: 16, border: '1px solid rgba(99,115,171,0.1)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                {ch.exampleLang}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                {ch.example}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data Flow */}
      <div className="card fade-in" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div className="card-title">📊 How Alerts Reach People — Data Flow</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, textAlign: 'center' }}>
          {[
            { step: '1', label: 'Water Contaminated', icon: '💧', color: '#3b82f6' },
            { step: '2', label: 'WaterGuard Detects', icon: '🔍', color: '#06b6d4' },
            { step: '3', label: 'PharmaSentinel Confirms', icon: '💊', color: '#f59e0b' },
            { step: '4', label: 'ML Model Predicts', icon: '🧠', color: '#8b5cf6' },
            { step: '5', label: 'Alerts Dispatched', icon: '📢', color: '#10b981' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: `${s.color}20`, border: `2px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: '1.3rem' }}>
                {s.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.72rem', color: s.color, marginBottom: 2 }}>DAY {s.step}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{s.label}</div>
              {i < 4 && (
                <div style={{ position: 'absolute', top: 25, right: -8, color: 'var(--text-dim)', fontSize: '1.2rem' }}>→</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--accent-green)' }}>Result:</strong> Outbreak contained before peak — 5-7 days earlier than traditional detection
        </div>
      </div>
    </div>
  );
}
