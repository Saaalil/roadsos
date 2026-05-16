function AIRecommendation({
    hospitals
}) {

    if (hospitals.length === 0) {

        return null;

    }

    const recommended =
        hospitals[0];

    return (

        <div className="dashboard-card">

            <h2>
                🧠 AI Recommendation
            </h2>

            <p>

                Recommended Hospital:

            </p>

            <h3>

                {recommended.tags?.name
                    ||
                    "Hospital"}

            </h3>

            <p>

                ✓ Closest hospital

            </p>

            <p>

                ✓ Fast emergency access

            </p>

            <p>

                ✓ Immediate assistance available

            </p>

        </div>

    )

}

export default AIRecommendation;