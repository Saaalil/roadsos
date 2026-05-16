function SOSButton({ activateSOS }) {
    return (
        <button
            onClick={activateSOS}
            style={{
                background: "red",
                color: "white",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                border: "none",
                fontSize: "30px",
                cursor: "pointer",
                marginBottom: "20px"
            }}
        >
            SOS
        </button>
    );
}

export default SOSButton;