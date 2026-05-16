function VoiceAssistant() {

    function speak() {

        const message =
            "Emergency mode activated. Nearby hospitals and police stations detected.";

        const speech =
            new SpeechSynthesisUtterance(message);

        speech.lang = "en-US";

        window.speechSynthesis.speak(speech);

    }

    return (

        <button
            onClick={speak}

            style={{
                padding: "12px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                margin: "20px"
            }}
        >

            🎤 Voice Assistant

        </button>

    )

}

export default VoiceAssistant;