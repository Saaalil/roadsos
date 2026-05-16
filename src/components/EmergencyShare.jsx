function EmergencyShare({ location }) {
    function sendAlert() {
        const msg = `🚨 EMERGENCY ALERT\n\nI need immediate assistance.\n\nLocation: https://www.google.com/maps?q=${location.lat},${location.lng}\nLat: ${location.lat.toFixed(6)}\nLng: ${location.lng.toFixed(6)}\n\nPlease call: 108 (Ambulance) | 100 (Police)`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    }
    return (
        <button onClick={sendAlert} style={{
            background: 'white', border: '0.5px solid #E0DDD6', borderRadius: '10px',
            padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer', width: '100%', textAlign: 'left', marginTop: '4px'
        }}>
            <div style={{ width: 36, height: 36, background: '#25D366', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>📱</span>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Send Emergency Alert via WhatsApp</div>
                <div style={{ fontSize: '11px', color: '#6B6B6B', marginTop: 2 }}>Share your location with contacts instantly</div>
            </div>
            <span style={{ color: '#6B6B6B', fontSize: 18 }}>›</span>
        </button>
    );
}
export default EmergencyShare;