import { useEffect, useState, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import car from "../../assets/car-top-view.png";

const Locations = () => {
  const [drivers, setDrivers] = useState([]);
  const socket = new WebSocket("ws://localhost:8000/ws/locations/");

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDrivers((prev) => {
        const existing = prev.find((d) => d.driver_id === data.driver_id);
        if (existing) {
          return prev.map((d) => (d.driver_id === data.driver_id ? data : d));
        }
        return [...prev, data];
      });
    };

    return;
  }, []);

  return <MapComponent drivers={drivers} />;
};

const MapComponent = ({ drivers }) => {
  useEffect(() => {
    const map = L.map("map").setView([14.5995, 120.9842], 12); // Center on Metro Manila

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Define a custom car icon
    const carIcon = L.icon({
      iconUrl: car, // Replace with the actual path to your car icon image
      iconSize: [32, 32], // Size of the icon
      iconAnchor: [16, 32], // Anchor point of the icon
      popupAnchor: [0, -32], // Anchor point for popup
    });

    // Create a reference to the markers so we can update their positions
    const markers = {};

    drivers.forEach((driver) => {
      const plateNumber = driver.taxi_details
        ? driver.taxi_details.plate_number
        : "Unknown Plate";
      if (!markers[driver.driver_id]) {
        // Add a new marker for new drivers with the car icon
        markers[driver.driver_id] = L.marker(
          [driver.latitude, driver.longitude],
          {
            icon: carIcon, // Use the custom car icon
          }
        )
          .addTo(map)
          .bindTooltip(plateNumber, { permanent: true, offset: [0, -20] });
      } else {
        // Update the position of existing markers
        markers[driver.driver_id].setLatLng([
          driver.latitude,
          driver.longitude,
        ]);
      }
    });

    return () => {
      map.remove(); // Cleanup the map instance on unmount
    };
  }, [drivers]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default Locations;
