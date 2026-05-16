function EmergencyPanel({
    hospitals,
    police,
    repair,
    location
}) {

    return (

        <div>

            <div className="emergency-banner">

                🚨 Emergency Mode Active

            </div>

            <div className="stats">

                <div className="stat-box">

                    <h3>🏥</h3>

                    <p>{hospitals.length}</p>

                    <p>Hospitals</p>

                </div>

                <div className="stat-box">

                    <h3>👮</h3>

                    <p>{police.length}</p>

                    <p>Police</p>

                </div>

                <div className="stat-box">

                    <h3>🔧</h3>

                    <p>{repair.length}</p>

                    <p>Repair</p>

                </div>

            </div>

            <div className="dashboard-card">

                <h3>Emergency Numbers</h3>

                <p>🚑 Ambulance: 108</p>

                <p>👮 Police: 100</p>

                <p>🔥 Fire: 101</p>

                <hr />

                <h3>Your Location</h3>

                <p>Latitude: {location.lat}</p>

                <p>Longitude: {location.lng}</p>

            </div>

        </div>

    )

}

export default EmergencyPanel;