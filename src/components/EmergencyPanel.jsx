function EmergencyPanel({ hospitals, police, repair, location }) {
    return (
        <div className="panel-card">
            <div className="panel-banner">Emergency Mode Active - Stay calm</div>
            <div className="panel-stats">
                <div className="panel-stat">
                    <div className="panel-stat-value">{hospitals.length}</div>
                    <div className="panel-stat-label">Hospitals</div>
                </div>
                <div className="panel-stat">
                    <div className="panel-stat-value">{police.length}</div>
                    <div className="panel-stat-label">Police</div>
                </div>
                <div className="panel-stat">
                    <div className="panel-stat-value">{repair.length}</div>
                    <div className="panel-stat-label">Repair</div>
                </div>
            </div>
            <div className="panel-section">
                <div className="panel-section-title">Emergency Numbers</div>
                <div className="panel-list-row">
                    <span>Ambulance</span>
                    <strong className="panel-accent">108</strong>
                </div>
                <div className="panel-list-row">
                    <span>Police</span>
                    <strong className="panel-accent alt">100</strong>
                </div>
                <div className="panel-list-row">
                    <span>Fire</span>
                    <strong className="panel-accent warn">101</strong>
                </div>
            </div>
            <div className="panel-foot">Coordinates: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</div>
        </div>
    );
}
export default EmergencyPanel;