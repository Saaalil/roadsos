function SOSButton({ activateSOS }) {
    return (
        <button
            onClick={activateSOS}
            className="sos-button"
            type="button"
            aria-label="Activate SOS"
        >
            <span className="sos-icon">
                <i className="ti ti-bell-ringing"></i>
            </span>
            <span className="sos-text">SOS</span>
            <span className="sos-subtext">Tap to activate</span>
        </button>
    );
}
export default SOSButton;