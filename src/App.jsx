import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import SOSButton from "./components/SOSButton";
import VoiceAssistant from "./components/VoiceAssistant";
import EmergencyPanel from "./components/EmergencyPanel";
import NearestHospital from "./components/NearestHospital";
import EmergencyShare from "./components/EmergencyShare";
import AIRecommendation from "./components/AIRecommendation";
import CrashDetectionSystem from "./components/CrashDetectionSystem";

function App() {
  const [location, setLocation] = useState({ lat: 31.082, lng: 77.176 });
  const [hospitals, setHospitals] = useState([]);
  const [police, setPolice] = useState([]);
  const [repair, setRepair] = useState([]);
  const [emergency, setEmergency] = useState(false);

  useEffect(() => {
    // Request notification permission on load
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setLocation({ lat, lng });
      fetchNearbyData(lat, lng);
    });
  }, []);

  async function fetchNearbyData(lat, lng) {
    const query = `
[out:json];
(
node(around:10000,${lat},${lng})["amenity"];
node(around:10000,${lat},${lng})["shop"];
);
out;
`;
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });
    const data = await response.json();
    const all = data.elements || [];
    setHospitals(all.filter(item => item.tags?.amenity === "hospital"));
    setPolice(all.filter(item => item.tags?.amenity === "police"));
    setRepair(all.filter(item => item.tags?.shop === "car_repair"));
  }

  function activateSOS() {
    setEmergency(true);
  }

  return (
    <div className="container">
      <div className="navbar">
        <h1>🚑 ROADSOS</h1>
        <h3>Emergency Assistance Platform</h3>
      </div>

      <div className="button-row">
        <SOSButton activateSOS={activateSOS} />
        <VoiceAssistant />
        {/* CrashDetectionSystem replaces old AccidentDetector */}
      </div>

      {/* ── Crash Detection System (always running) ── */}
      <CrashDetectionSystem
        location={location}
        activateSOS={activateSOS}
      />

      <div className="main-grid">
        <div className="left-panel">
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            style={{ height: "600px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.lat, location.lng]}>
              <Popup>📍 Your Location</Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="right-panel">
          {emergency && (
            <>
              <EmergencyPanel
                hospitals={hospitals}
                police={police}
                repair={repair}
                location={location}
              />
              <AIRecommendation hospitals={hospitals} />
              <NearestHospital hospitals={hospitals} location={location} />
              <EmergencyShare location={location} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;