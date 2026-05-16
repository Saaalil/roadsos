function NearestHospital({ hospitals, location }) {
    if (hospitals.length === 0) return <p style={{ color: '#6B6B6B', fontSize: '13px' }}>Searching for hospitals nearby…</p>;

    let nearest = hospitals[0];
    let minDistance = Infinity;
    hospitals.forEach(h => {
        const d = Math.sqrt(Math.pow(h.lat - location.lat, 2) + Math.pow(h.lon - location.lng, 2));
        if (d < minDistance) { minDistance = d; nearest = h; }
    });
    const distanceKm = (minDistance * 111).toFixed(2);
    const eta = Math.ceil((distanceKm / 40) * 60);

    return (
        <div className="dashboard-card">
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>🏥 Nearest Hospital</p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', marginBottom: '8px' }}>
                {nearest.tags?.name || 'Nearest Hospital'}
            </h2>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#6B6B6B' }}>📏 {distanceKm} km</span>
                <span style={{ fontSize: '12px', color: '#6B6B6B' }}>⏱ {eta} min ETA</span>
            </div>
            <a href={`https://www.google.com/maps?q=${nearest.lat},${nearest.lon}`} target="_blank" rel="noreferrer">
                <button style={{ background: '#1E8449', color: 'white', border: 'none', borderRadius: '7px', padding: '9px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, width: '100%' }}>
                    🧭 Navigate to Hospital
                </button>
            </a>
        </div>
    );
}
export default NearestHospital;