function EmergencyShare({ location }) {

    function sendEmergencyAlert() {

        const message = `🚨 Emergency Alert

I may need immediate assistance.

My current location:

Latitude: ${location.lat}
Longitude: ${location.lng}

Please contact emergency services immediately.
`;

        const whatsappURL =
            `https://wa.me/?text=${encodeURIComponent(message)}`;

        window.open(
            whatsappURL,
            "_blank"
        );

    }

    return (

        <div
            style={{
                margin: "20px"
            }}
        >

            <button
                onClick={sendEmergencyAlert}
                style={{
                    padding: "14px",
                    background: "#25D366",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "16px"
                }}
            >

                📱 Send Emergency Alert

            </button>

        </div>

    )

}

export default EmergencyShare;