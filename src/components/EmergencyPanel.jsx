function EmergencyPanel({ hospitals, police, repair, location }) {
    return (
        <div>
            <div className="emergency-banner">🚨 Emergency Mode Active — Stay Calm</div>
            <div className="stats">
                <div className="stat-box">
                    <h3>🏥</h3>
                    <p style={{ fontSize: '22px', fontFamily: "'Bebas Neue', sans-serif", color: '#1A1A1A' }}>{hospitals.length}</p>
                    <p>Hospitals</p>
                </div>
                <div className="stat-box">
                    <h3>👮</h3>
                    <p style={{ fontSize: '22px', fontFamily: "'Bebas Neue', sans-serif", color: '#1A1A1A' }}>{police.length}</p>
                    <p>Police</p>
                </div>
                <div className="stat-box">
                    <h3>🔧</h3>
                    <p style={{ fontSize: '22px', fontFamily: "'Bebas Neue', sans-serif", color: '#1A1A1A' }}>{repair.length}</p>
                    <p>Repair</p>
                </div>
            </div>
            <div className="dashboard-card">
                <h3 style={{ marginBottom: '10px', fontSize: '12px', fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Emergency Numbers</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid #E0DDD6' }}>
                    <span>🚑 Ambulance</span><strong style={{ color: '#C0392B', fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px' }}>108</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '0.5px solid #E0DDD6' }}>
                    <span>👮 Police</span><strong style={{ color: '#1A5276', fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px' }}>100</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                    <span>🔥 Fire</span><strong style={{ color: '#D4AC0D', fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px' }}>101</strong>
                </div>
                <hr style={{ margin: '10px 0', border: 'none', borderTop: '0.5px solid #E0DDD6' }} />
                <p style={{ fontSize: '11px', color: '#6B6B6B' }}>📍 {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
            </div>
        </div>
    );
}
export default EmergencyPanel;