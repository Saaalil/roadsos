function AIRecommendation({
    hospitals
}) {

    if (hospitals.length === 0) {

        return null;

    }

    const recommended =
        hospitals[0];

    return (
        <div className="panel-card">
            <div className="panel-section-title">AI Recommendation</div>
            <div className="panel-title">
                {recommended.tags?.name || "Hospital"}
            </div>
            <div className="panel-list">
                <div className="panel-list-item">Closest hospital</div>
                <div className="panel-list-item">Fast emergency access</div>
                <div className="panel-list-item">Immediate assistance available</div>
            </div>
        </div>
    )

}

export default AIRecommendation;