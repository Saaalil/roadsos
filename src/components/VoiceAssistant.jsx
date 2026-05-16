function VoiceAssistant() {
    function speak() {
        const msg = 'Emergency mode activated. Nearby hospitals and police stations detected.';
        const speech = new SpeechSynthesisUtterance(msg);
        speech.lang = 'en-US';
        window.speechSynthesis.speak(speech);
    }
    return (
        <button onClick={speak} style={{
            background: 'white', color: '#1A5276', border: '0.5px solid #E0DDD6',
            borderRadius: '10px', padding: '18px 10px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '6px', width: '100%'
        }}>
            <i className="ti ti-microphone" style={{ fontSize: '26px' }}></i>
            <span style={{ fontSize: '11px', fontWeight: 500 }}>Voice Assistant</span>
            <span style={{ fontSize: '10px', color: '#6B6B6B' }}>Speak for help</span>
        </button>
    );
}
export default VoiceAssistant;