function NearestHospital({ hospitals, location, nearbyError, hospitalSearchUrl }) {
    if (hospitals.length === 0) {
        return (
            <div className="panel-card">
                <div className="panel-section-title">Nearest Hospital</div>
                <div className="panel-muted">
                    {nearbyError || "Searching for hospitals nearby..."}
                </div>
                <a href={hospitalSearchUrl} target="_blank" rel="noreferrer">
                    <button className="panel-button" type="button">
                        Open Nearby Hospitals
                    </button>
                </a>
            </div>
        );
    }

    let nearest = hospitals[0];
    let minDistance = Infinity;
    hospitals.forEach(h => {
        const d = Math.sqrt(Math.pow(h.lat - location.lat, 2) + Math.pow(h.lon - location.lng, 2));
        if (d < minDistance) { minDistance = d; nearest = h; }
    });
    const distanceKm = (minDistance * 111).toFixed(2);
    const eta = Math.ceil((distanceKm / 40) * 60);

    return (
        <div className="panel-card">
            <div className="panel-section-title">Nearest Hospital</div>
            <div className="panel-title">
                {nearest.tags?.name || 'Nearest Hospital'}
            </div>
            <div className="panel-meta">
                <span>{distanceKm} km</span>
                <span>{eta} min ETA</span>
            </div>
            <a
                href={`https://www.google.com/maps/search/hospital/@${nearest.lat},${nearest.lon},14z`}
                target="_blank"
                rel="noreferrer"
            >
                <button className="panel-button" type="button">
                    Open Nearby Hospitals
                </button>
            </a>
        </div>
    );
}
export default NearestHospital;