# ROADSOS

Smart Emergency Road Assistance System

ROADSOS is a web application for emergency road assistance. It provides real-time location tracking, nearby emergency services discovery, navigation support, and instant alert sharing to reduce response time during accidents and roadside incidents.

## Features

- One-click SOS emergency activation
- Live GPS location tracking with map visualization
- Nearby hospitals, police stations, and repair shops via OpenStreetMap/Overpass
- Nearest hospital selection with distance and ETA estimates
- Google Maps navigation and nearby-hospital search
- WhatsApp emergency alert sharing with live coordinates
- Voice assistant prompts
- Crash detection workflow with automated call/SMS support (optional backend)

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Maps & APIs**
- React Leaflet
- OpenStreetMap tiles
- Overpass API
- Browser Geolocation API

**Additional Integrations**
- Speech Synthesis API
- WhatsApp sharing link

## Project Structure

```text
roadsos/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AIRecommendation.jsx
│   │   ├── CrashDetectionSystem.jsx
│   │   ├── EmergencyPanel.jsx
│   │   ├── EmergencyShare.jsx
│   │   ├── NearestHospital.jsx
│   │   ├── SOSButton.jsx
│   │   └── VoiceAssistant.jsx
│   ├── services/
│   │   └── overpassApi.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── roadsos-backend/
	├── package.json
	└── server.js
```

## Installation and Setup

### Frontend

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Allow location access for live tracking.

### Optional Backend (Crash Detection Call/SMS)

The backend powers automated calls and SMS through Twilio.

```bash
cd roadsos-backend
npm install
npm run dev
```

Create a `.env` file in `roadsos-backend` with:

```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## Deployment

- Frontend: any static hosting that supports Vite builds (for example, Vercel or Netlify).
- Backend: any Node.js hosting (for example, Render, Railway, or a VM).

## Roadmap

- Real-time ambulance integration
- Accident severity prediction
- Emergency contact management
- Offline emergency mode
- Traffic-aware routing and recommendations
- Multi-language support
- Mobile app integration
