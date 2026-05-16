function NearestHospital({ hospitals, location }) {

    if (hospitals.length === 0) {
        return <p>No hospitals nearby</p>;
    }

    let nearest = hospitals[0];
    let minDistance = Infinity;

    hospitals.forEach((hospital) => {

        const latDiff =
            hospital.lat - location.lat;

        const lngDiff =
            hospital.lon - location.lng;

        const distance =
            Math.sqrt(
                latDiff * latDiff +
                lngDiff * lngDiff
            );

        if (distance < minDistance) {

            minDistance = distance;
            nearest = hospital;

        }

    });

    // Convert approximate degree distance → km
    const distanceKm =
        (minDistance * 111).toFixed(2);

    // Assuming average speed = 40 km/h
    const eta =
        Math.ceil(
            (distanceKm / 40) * 60
        );

    const mapLink =
        `https://www.google.com/maps?q=${nearest.lat},${nearest.lon}`;

    return (

        <div
            className="dashboard-card"
        >

            <h3>
                🏥 Nearest Hospital
            </h3>

            <h2>
                {nearest.tags?.name ||
                    "Nearest Hospital"}
            </h2>

            <p>
                📏 Distance:
                {distanceKm} km
            </p>

            <p>
                ⏱ ETA:
                {eta} min
            </p>

            <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
            >

                <button
                    style={{
                        padding: "10px",
                        background: "#16a34a",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer"
                    }}
                >

                    🧭 Navigate

                </button>

            </a>

        </div>

    )

}

export default NearestHospital;