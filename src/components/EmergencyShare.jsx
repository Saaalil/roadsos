function EmergencyShare({ location }) {
    const msg = `🚨 EMERGENCY ALERT\n\nI need immediate assistance.\n\nLocation: https://www.google.com/maps?q=${location.lat},${location.lng}\nLat: ${location.lat.toFixed(6)}\nLng: ${location.lng.toFixed(6)}\n\nPlease call: 108 (Ambulance) | 100 (Police)`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;

    return (
        <a className="panel-action" href={shareUrl} target="_blank" rel="noreferrer">
            <span className="panel-action-icon">
                <i className="ti ti-brand-whatsapp"></i>
            </span>
            <span className="panel-action-content">
                <span className="panel-action-title">Send Emergency Alert via WhatsApp</span>
                <span className="panel-action-sub">Share your location with contacts instantly</span>
            </span>
            <span className="panel-action-arrow">
                <i className="ti ti-chevron-right"></i>
            </span>
        </a>
    );
}
export default EmergencyShare;