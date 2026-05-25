import { useEffect, useRef, useState } from "react";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const BACKEND_URL = "http://localhost:3001"; // Change to Render URL after deploy

// Your emergency contact details — update these
const EMERGENCY_CONTACT = {
    name: "Your Name",               // Person in the car
    phone: "+91XXXXXXXXXX",          // Emergency contact phone (with country code)
    contactName: "Emergency Contact" // Who gets the call/SMS
};

// Speed thresholds
const CRASH_SPEED_THRESHOLD_HIGH = 30; // km/h (was going fast)
const CRASH_SPEED_THRESHOLD_LOW = 5;   // km/h (suddenly near zero)
const CONFIRM_WAIT_MS = 10000;         // 10 sec to confirm crash
const RESPONSE_WAIT_MS = 60000;        // 60 sec to respond to notification
const CALL_RETRY_WAIT_MS = 30000;      // 30 sec between calls
const MAX_CALLS = 2;                   // calls before SMS

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
function CrashDetectionSystem({ location, activateSOS }) {
    const [phase, setPhase] = useState("MONITORING");
    // MONITORING → CRASH_SUSPECTED → AWAITING_RESPONSE → CALLING → SMS_SENT

    const [countdown, setCountdown] = useState(0);
    const [callCount, setCallCount] = useState(0);
    const [battery, setBattery] = useState(null);
    const [speed, setSpeed] = useState(0);
    const [gyro, setGyro] = useState({ alpha: 0, beta: 0, gamma: 0 });
    const [phoneCondition, setPhoneCondition] = useState("STABLE");
    const [sessionId] = useState(() => Date.now().toString());

    const speedHistory = useRef([]);
    const crashTimeout = useRef(null);
    const countdownInterval = useRef(null);
    const callTimeout = useRef(null);
    const prevGyro = useRef({ alpha: 0, beta: 0, gamma: 0 });
    const phaseRef = useRef("MONITORING");

    // Keep phaseRef in sync
    useEffect(() => { phaseRef.current = phase; }, [phase]);

    // ─── Battery ─────────────────────────────────────────────────────────────
    useEffect(() => {
        navigator.getBattery?.().then(b => {
            setBattery(Math.round(b.level * 100));
            b.addEventListener("levelchange", () => setBattery(Math.round(b.level * 100)));
        });
    }, []);

    // ─── GPS Speed Monitor ───────────────────────────────────────────────────
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const kmh = (pos.coords.speed || 0) * 3.6;
                setSpeed(Math.round(kmh));
                speedHistory.current.push({ speed: kmh, time: Date.now() });
                // Keep last 20 readings only
                if (speedHistory.current.length > 20) speedHistory.current.shift();
                checkForCrash(kmh);
            },
            null,
            { enableHighAccuracy: true, maximumAge: 1000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // ─── Gyroscope Monitor ───────────────────────────────────────────────────
    useEffect(() => {
        function handleOrientation(e) {
            const alpha = e.alpha || 0;
            const beta = e.beta || 0;
            const gamma = e.gamma || 0;

            const deltaAlpha = Math.abs(alpha - prevGyro.current.alpha);
            const deltaBeta = Math.abs(beta - prevGyro.current.beta);
            const deltaGamma = Math.abs(gamma - prevGyro.current.gamma);
            const totalChange = deltaAlpha + deltaBeta + deltaGamma;

            setGyro({ alpha: alpha.toFixed(1), beta: beta.toFixed(1), gamma: gamma.toFixed(1) });

            // Determine phone condition
            if (totalChange > 200) setPhoneCondition("THROWN");
            else if (totalChange > 100) setPhoneCondition("IMPACT");
            else if (totalChange > 40) setPhoneCondition("MOVING");
            else if (beta > 150 || beta < -150) setPhoneCondition("FLIPPED");
            else setPhoneCondition("STABLE");

            prevGyro.current = { alpha, beta, gamma };
        }
        window.addEventListener("deviceorientation", handleOrientation);
        return () => window.removeEventListener("deviceorientation", handleOrientation);
    }, []);

    // ─── Crash Detection Logic ───────────────────────────────────────────────
    function checkForCrash(currentSpeed) {
        if (phaseRef.current !== "MONITORING") return;

        const recent = speedHistory.current.slice(-10);
        if (recent.length < 3) return;

        const maxRecent = Math.max(...recent.map(r => r.speed));
        const wasGoingFast = maxRecent > CRASH_SPEED_THRESHOLD_HIGH;
        const nowStopped = currentSpeed < CRASH_SPEED_THRESHOLD_LOW;

        if (wasGoingFast && nowStopped) {
            // Wait 10 seconds to confirm it's a crash, not just braking at a light
            crashTimeout.current = setTimeout(() => {
                if (speedHistory.current.slice(-3).every(r => r.speed < CRASH_SPEED_THRESHOLD_LOW)) {
                    triggerCrashDetected();
                }
            }, CONFIRM_WAIT_MS);
        }
    }

    // ─── Phase 1: Crash Confirmed ─────────────────────────────────────────────
    function triggerCrashDetected() {
        setPhase("AWAITING_RESPONSE");
        activateSOS();

        // Request notification permission and show popup
        if (Notification.permission === "granted") {
            new Notification("🚨 ROADSOS — Are you okay?", {
                body: "A crash was detected. Tap YES if you are fine. Emergency services will be alerted in 60 seconds.",
                requireInteraction: true,
                icon: "/favicon.svg"
            });
        } else {
            Notification.requestPermission().then(perm => {
                if (perm === "granted") {
                    new Notification("🚨 ROADSOS — Are you okay?", {
                        body: "A crash was detected. Tap YES if you are fine. Emergency will be alerted in 60 seconds.",
                        requireInteraction: true
                    });
                }
            });
        }

        // Start 60-second countdown
        let remaining = 60;
        setCountdown(remaining);
        countdownInterval.current = setInterval(() => {
            remaining -= 1;
            setCountdown(remaining);
            if (remaining <= 0) {
                clearInterval(countdownInterval.current);
                startCallingSequence();
            }
        }, 1000);
    }

    // ─── User says they are OKAY ──────────────────────────────────────────────
    function handleImOkay() {
        clearInterval(countdownInterval.current);
        clearTimeout(callTimeout.current);
        setPhase("MONITORING");
        setCountdown(0);
        setCallCount(0);
        speedHistory.current = [];
    }

    // ─── Phase 2: No response — start calling ────────────────────────────────
    async function startCallingSequence() {
        setPhase("CALLING");
        await makeCall(1);
    }

    async function makeCall(attempt) {
        setCallCount(attempt);
        try {
            await fetch(`${BACKEND_URL}/api/call`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: EMERGENCY_CONTACT.phone,
                    name: EMERGENCY_CONTACT.name,
                    location,
                    sessionId
                })
            });
        } catch (err) {
            console.error("Call failed:", err);
        }

        if (attempt < MAX_CALLS) {
            // Wait 30 seconds, then call again
            callTimeout.current = setTimeout(() => makeCall(attempt + 1), CALL_RETRY_WAIT_MS);
        } else {
            // After 2 calls with no answer — send SMS
            callTimeout.current = setTimeout(() => sendEmergencySMS(), CALL_RETRY_WAIT_MS);
        }
    }

    // ─── Phase 3: Send SMS ───────────────────────────────────────────────────
    async function sendEmergencySMS() {
        setPhase("SMS_SENT");
        const now = new Date();
        const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

        try {
            await fetch(`${BACKEND_URL}/api/sms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: EMERGENCY_CONTACT.phone,
                    name: EMERGENCY_CONTACT.name,
                    location,
                    battery: battery || "Unknown",
                    time,
                    sessionId
                })
            });
        } catch (err) {
            console.error("SMS failed:", err);
        }
    }

    // ─── Cleanup ─────────────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            clearTimeout(crashTimeout.current);
            clearTimeout(callTimeout.current);
            clearInterval(countdownInterval.current);
        };
    }, []);

    // ─── Phone condition config ───────────────────────────────────────────────
    const conditionConfig = {
        STABLE: { color: "#1E8449", icon: "✅", label: "Stable" },
        MOVING: { color: "#D4AC0D", icon: "📱", label: "Moving" },
        IMPACT: { color: "#C0392B", icon: "💥", label: "Impact!" },
        THROWN: { color: "#96281B", icon: "🚨", label: "Thrown!" },
        FLIPPED: { color: "#C0392B", icon: "🔃", label: "Flipped!" },
    };
    const cond = conditionConfig[phoneCondition] || conditionConfig.STABLE;
    const batteryLabel = battery == null ? "--" : `${battery}%`;
    const batteryColor = battery == null ? "var(--text)" : battery < 20 ? "#c0392b" : "#1e8449";

    return (
        <div className="sensor-root">

            {/* ── Gyroscope + Speed Monitor Card ── */}
            <div className="panel-card sensor-card">
                <div className="sensor-header">
                    <div className="sensor-title">
                        <span className="sensor-title-icon">🌀</span>
                        Live Sensors
                    </div>
                    <div className="sensor-status" style={{ background: cond.color }}>
                        <span className="sensor-status-icon">{cond.icon}</span>
                        {cond.label}
                    </div>
                </div>

                <div className="sensor-grid sensor-grid-2">
                    <div className="sensor-tile">
                        <div className="sensor-value">{speed}</div>
                        <div className="sensor-label">km/h</div>
                        <div className="sensor-sub">GPS Speed</div>
                    </div>
                    <div className="sensor-tile">
                        <div className="sensor-value" style={{ color: batteryColor }}>{batteryLabel}</div>
                        <div className="sensor-label">Battery</div>
                        <div className="sensor-sub">Device power</div>
                    </div>
                </div>

                <div className="sensor-grid sensor-grid-3">
                    {[
                        { axis: "Alpha (Z)", value: gyro.alpha, desc: "Compass" },
                        { axis: "Beta (X)", value: gyro.beta, desc: "Tilt F/B" },
                        { axis: "Gamma (Y)", value: gyro.gamma, desc: "Tilt L/R" }
                    ].map(r => (
                        <div key={r.axis} className="sensor-tile small">
                            <div className="sensor-value compact" style={{ color: cond.color }}>{r.value}°</div>
                            <div className="sensor-label">{r.axis}</div>
                            <div className="sensor-sub">{r.desc}</div>
                        </div>
                    ))}
                </div>

                <div className="sensor-condition">
                    <div className="sensor-condition-title">📊 Phone Condition</div>
                    <div className="condition-list">
                        {[
                            { label: "Screen Intact", ok: phoneCondition !== "THROWN" },
                            { label: "Sensor Active", ok: true },
                            { label: "Vehicle Upright", ok: phoneCondition !== "FLIPPED" },
                            { label: "No Heavy Impact", ok: !["IMPACT", "THROWN"].includes(phoneCondition) },
                        ].map(item => (
                            <div key={item.label} className="condition-row">
                                <span className="condition-label">{item.label}</span>
                                <span className={`condition-pill ${item.ok ? "ok" : "alert"}`}>
                                    {item.ok ? "OK" : "ALERT"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Phase: Awaiting Response ── */}
            {phase === "AWAITING_RESPONSE" && (
                <div style={{
                    background: "#C0392B", borderRadius: "12px", padding: "20px",
                    textAlign: "center", color: "white", marginBottom: "12px",
                    animation: "pulse 1s infinite"
                }}>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>🚨</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", letterSpacing: "1px", marginBottom: "6px" }}>
                        CRASH DETECTED
                    </div>
                    <div style={{ fontSize: "13px", opacity: 0.9, marginBottom: "16px" }}>
                        Are you okay? Emergency contacts will be alerted in
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "56px", lineHeight: 1, marginBottom: "16px" }}>
                        {countdown}
                    </div>
                    <div style={{ fontSize: "11px", opacity: 0.75, marginBottom: "16px" }}>seconds</div>
                    <button
                        onClick={handleImOkay}
                        style={{
                            background: "white", color: "#C0392B", border: "none",
                            borderRadius: "8px", padding: "12px 32px", fontSize: "15px",
                            fontWeight: 700, cursor: "pointer", width: "100%", letterSpacing: "0.5px"
                        }}
                    >
                        ✅ I AM OKAY
                    </button>
                    <div style={{ fontSize: "10px", opacity: 0.6, marginTop: "8px" }}>
                        Tap above if you are safe — this will cancel the alert
                    </div>
                </div>
            )}

            {/* ── Phase: Calling ── */}
            {phase === "CALLING" && (
                <div style={{
                    background: "#1A1A1A", borderRadius: "12px", padding: "20px",
                    textAlign: "center", color: "white", marginBottom: "12px"
                }}>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>📞</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "1px", marginBottom: "6px" }}>
                        CALLING EMERGENCY CONTACT
                    </div>
                    <div style={{ fontSize: "13px", opacity: 0.75, marginBottom: "12px" }}>
                        Call {callCount} of {MAX_CALLS} — {EMERGENCY_CONTACT.contactName}
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px", fontSize: "12px", opacity: 0.85 }}>
                        "This is ROADSOS. {EMERGENCY_CONTACT.name} has been in a vehicle accident. Please check immediately."
                    </div>
                    {callCount < MAX_CALLS && (
                        <div style={{ fontSize: "11px", opacity: 0.5, marginTop: "8px" }}>
                            Will retry in 30 seconds if no answer...
                        </div>
                    )}
                </div>
            )}

            {/* ── Phase: SMS Sent ── */}
            {phase === "SMS_SENT" && (
                <div style={{
                    background: "#1E8449", borderRadius: "12px", padding: "20px",
                    textAlign: "center", color: "white", marginBottom: "12px"
                }}>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>📩</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "1px", marginBottom: "6px" }}>
                        EMERGENCY SMS SENT
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "12px" }}>
                        {EMERGENCY_CONTACT.contactName} has been messaged with your location
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "12px", textAlign: "left", fontSize: "11px" }}>
                        <div>🚨 EMERGENCY ALERT — ROADSOS</div>
                        <div style={{ marginTop: "6px", opacity: 0.85 }}>
                            {EMERGENCY_CONTACT.name} has been in a crash and is not responding.
                        </div>
                        <div style={{ marginTop: "4px" }}>📍 GPS location sent</div>
                        <div>🔋 Battery: {battery ?? "—"}%</div>
                        <div>⚠️ Please call 108 immediately</div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default CrashDetectionSystem;