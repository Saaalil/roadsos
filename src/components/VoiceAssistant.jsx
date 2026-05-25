function VoiceAssistant() {
    function speak() {
        const msg = 'Emergency mode activated. Nearby hospitals and police stations detected.';
        const speech = new SpeechSynthesisUtterance(msg);
        speech.lang = 'en-US';
        window.speechSynthesis.speak(speech);
    }
    return (
        <button onClick={speak} className="rail-item rail-action" type="button">
            <span className="rail-icon">
                <i className="ti ti-microphone"></i>
            </span>
            <span className="rail-label">Voice</span>
        </button>
    );
}
export default VoiceAssistant;