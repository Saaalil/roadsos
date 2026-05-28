import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

import SOSButton from "./components/SOSButton";
import VoiceAssistant from "./components/VoiceAssistant";
import EmergencyPanel from "./components/EmergencyPanel";
import NearestHospital from "./components/NearestHospital";
import EmergencyShare from "./components/EmergencyShare";
import AIRecommendation from "./components/AIRecommendation";
import CrashDetectionSystem from "./components/CrashDetectionSystem";

function normalizeOverpassElement(element) {
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;

  return {
    ...element,
    lat,
    lon,
  };
}

function App() {
  const [location, setLocation] = useState({ lat: 31.082, lng: 77.176 });
  const [accuracy, setAccuracy] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [police, setPolice] = useState([]);
  const [repair, setRepair] = useState([]);
  const [emergency, setEmergency] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Request notification permission on load
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    if (!navigator.geolocation) {
      return;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000,
    };

    const onPosition = (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setLocation({ lat, lng });
      setAccuracy(position.coords.accuracy ?? null);
      setLastUpdated(new Date());
      if (!hasFetchedRef.current) {
        fetchNearbyData(lat, lng);
        hasFetchedRef.current = true;
      }
    };

    const onError = (error) => {
      console.warn("Geolocation error:", error);
    };

    navigator.geolocation.getCurrentPosition(onPosition, onError, options);
    const watchId = navigator.geolocation.watchPosition(onPosition, onError, options);
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  async function fetchNearbyData(lat, lng) {
    const query = `
[out:json];
(
  node(around:10000,${lat},${lng})["amenity"="hospital"];
  way(around:10000,${lat},${lng})["amenity"="hospital"];
  relation(around:10000,${lat},${lng})["amenity"="hospital"];

  node(around:10000,${lat},${lng})["amenity"="police"];
  way(around:10000,${lat},${lng})["amenity"="police"];
  relation(around:10000,${lat},${lng})["amenity"="police"];

  node(around:10000,${lat},${lng})["shop"="car_repair"];
  way(around:10000,${lat},${lng})["shop"="car_repair"];
  relation(around:10000,${lat},${lng})["shop"="car_repair"];
);
out center;
`;
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body: query,
    });

    if (!response.ok) {
      throw new Error(`Overpass request failed with status ${response.status}`);
    }

    const data = await response.json();
    const all = (data.elements || []).map(normalizeOverpassElement).filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lon));

    setHospitals(all.filter(item => item.tags?.amenity === "hospital"));
    setPolice(all.filter(item => item.tags?.amenity === "police"));
    setRepair(all.filter(item => item.tags?.shop === "car_repair"));
  }

  function activateSOS() {
    setEmergency(true);
  }

  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "just now";
  const coordsLabel = `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;

  const userMarker = useMemo(
    () =>
      L.divIcon({
        className: "user-marker",
        html: "<div class=\"user-marker-pulse\"></div><div class=\"user-marker-avatar\">U</div>",
        iconSize: [48, 48],
        iconAnchor: [24, 32],
        popupAnchor: [0, -30],
      }),
    []
  );

  function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
      map.setView([center.lat, center.lng], zoom, { animate: true });
    }, [map, center, zoom]);
    return null;
  }

  return (
    <div className="app-root">
      <div className="app-frame">
        <section className="map-section">
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            className="map-canvas"
            zoomControl={false}
            scrollWheelZoom={false}
          >
            <MapUpdater center={location} zoom={13} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {accuracy && (
              <Circle
                center={[location.lat, location.lng]}
                radius={Math.min(accuracy, 140)}
                pathOptions={{ color: "#5aa9ff", fillColor: "#5aa9ff", fillOpacity: 0.2 }}
              />
            )}
            <Marker position={[location.lat, location.lng]} icon={userMarker}>
              <Popup>Your Location</Popup>
            </Marker>
          </MapContainer>

          <header className="top-bar">
            <div className="user-pill">
              <div className="avatar">U</div>
              <div className="user-meta">
                <div className="user-name">Hi USER</div>
                <div className="user-id">AGR8598</div>
              </div>
            </div>
            <div className="top-actions">
              <button className="icon-btn" type="button" aria-label="Notifications">
                <i className="ti ti-bell"></i>
              </button>
              <button className="icon-btn" type="button" aria-label="Menu">
                <i className="ti ti-menu-2"></i>
              </button>
            </div>
          </header>

          <div className="left-rail">
            <div className="rail-item">
              <span className="rail-icon">
                <i className="ti ti-messages"></i>
              </span>
              <span className="rail-label">Messages</span>
            </div>
            <div className="rail-item">
              <span className="rail-icon">
                <i className="ti ti-alert-triangle"></i>
              </span>
              <span className="rail-label">Danger Alert</span>
            </div>
            <div className="rail-item">
              <span className="rail-icon">
                <i className="ti ti-shield-check"></i>
              </span>
              <span className="rail-label">Check-in</span>
            </div>
            <div className="rail-item">
              <span className="rail-icon">
                <i className="ti ti-shield"></i>
              </span>
              <span className="rail-label">Safety</span>
            </div>
            <VoiceAssistant />
          </div>

          <div className="right-rail">
            <button className="icon-btn map-btn" type="button" aria-label="Layers">
              <i className="ti ti-layers-subtract"></i>
            </button>
            <button className="icon-btn map-btn" type="button" aria-label="Navigation">
              <i className="ti ti-navigation"></i>
            </button>
          </div>

          <div className="bottom-overlay">
            <div className="tracking-card">
              <div className="tracking-pill">
                <span className="tracking-dot"></span>
                <span>Tracking Live</span>
                <span className="tracking-meta">Updated {updatedLabel}</span>
              </div>
              <div className="tracking-body">
                <div className="tracking-title">Tracking Live</div>
                <div className="tracking-sub">Today | {updatedLabel}</div>
                <div className="tracking-coords">Coordinates: {coordsLabel}</div>
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-card">
                <div className="metric-value">0.0</div>
                <div className="metric-label">Mileage</div>
              </div>
              <div className="metric-center">
                <SOSButton activateSOS={activateSOS} />
              </div>
              <div className="metric-card">
                <div className="metric-value">0.0</div>
                <div className="metric-label">Speed</div>
              </div>
            </div>
          </div>
        </section>

        <section className="details-sheet">
          <div className="sheet-header">
            <div className="sheet-title">Live Details</div>
            <div className="sheet-sub">Sensors and emergency tools</div>
          </div>

          <div className="sheet-stack">
            <CrashDetectionSystem location={location} activateSOS={activateSOS} />

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
        </section>
      </div>
    </div>
  );
}

export default App;