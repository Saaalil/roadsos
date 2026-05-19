const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// ─── Track call attempts per session ───────────────────────────────────────
const callAttempts = {};

// ─── Step 1: Make auto call to emergency contact ───────────────────────────
app.post("/api/call", async (req, res) => {
    const { to, name, location, sessionId } = req.body;

    // Track how many times we've called
    callAttempts[sessionId] = (callAttempts[sessionId] || 0) + 1;

    try {
        const call = await client.calls.create({
            to: to,
            from: process.env.TWILIO_PHONE_NUMBER,
            twiml: `
        <Response>
          <Say voice="alice" language="en-IN">
            This is an automated emergency alert from ROADSOS.
            ${name} has been in a vehicle accident.
            Their last known location is latitude ${location.lat}, longitude ${location.lng}.
            Please check on them immediately and contact emergency services.
            This is call number ${callAttempts[sessionId]}.
            If you are unable to reach them, emergency services have been notified.
          </Say>
          <Pause length="2"/>
          <Say voice="alice" language="en-IN">
            Repeating. ${name} has been in an accident. Please respond immediately.
          </Say>
        </Response>
      `,
        });

        res.json({
            success: true,
            callSid: call.sid,
            attemptNumber: callAttempts[sessionId],
        });
    } catch (err) {
        console.error("Call error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ─── Step 2: Send emergency SMS ─────────────────────────────────────────────
app.post("/api/sms", async (req, res) => {
    const { to, name, location, battery, time } = req.body;

    const mapsLink = `https://maps.google.com/?q=${location.lat},${location.lng}`;

    const message =
        `🚨 EMERGENCY ALERT — ROADSOS\n\n` +
        `${name} has been in a vehicle crash and is not responding.\n\n` +
        `📍 Location: ${mapsLink}\n` +
        `🗺️ Coordinates: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}\n` +
        `🔋 Battery: ${battery}%\n` +
        `🕐 Time: ${time}\n\n` +
        `⚠️ No response after 2 automated calls.\n` +
        `Please call 108 (Ambulance) or 100 (Police) immediately.`;

    try {
        const sms = await client.messages.create({
            to: to,
            from: process.env.TWILIO_PHONE_NUMBER,
            body: message,
        });

        // Clear call attempts after SMS sent
        delete callAttempts[req.body.sessionId];

        res.json({ success: true, messageSid: sms.sid });
    } catch (err) {
        console.error("SMS error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ─── Health check ───────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "ROADSOS backend running ✅" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ROADSOS backend running on port ${PORT}`));