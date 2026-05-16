function SOSButton({ activateSOS }) {
    return (
        <button
            onClick={activateSOS}
            style={{
                background: '#C0392B',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '18px 10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                width: '100%',
                fontSize: '28px',
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '2px'
            }}
        >
            <i className="ti ti-sos" style={{ fontSize: '30px' }}></i>
            SOS
            <span style={{ fontSize: '10px', fontFamily: 'DM Sans, sans-serif', opacity: 0.85, letterSpacing: '0.3px' }}>
                Tap to activate
            </span>
        </button>
    );
}
export default SOSButton;