import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

const DriverTracker = () => {
  const { user } = useContext(UserContext);
  const [socket, setSocket] = useState(null);

  const startTracking = () => {
    const socket = new WebSocket("ws://localhost:8000/ws/locations/");
    setSocket(socket);

    socket.onopen = () => {
      console.log("WebSocket connection established.");

      // const driverDetails = JSON.parse(localStorage.getItem("user"));
      // const driverId = driverDetails?.driver_id || "default_id";

      if ("geolocation" in navigator) {
        // Enable high accuracy for better geolocation results
        navigator.geolocation.watchPosition(
          (position) => {
            console.log(position);

            const { latitude, longitude } = position.coords;
            socket.send(
              JSON.stringify({
                driver_id: user.driver_id, // Replace with dynamic driver ID if necessary
                latitude,
                longitude,
              })
            );
          },
          (error) => {
            console.error(
              "Geolocation error code:",
              error.code,
              "Message:",
              error.message
            );
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };
  };

  useEffect(() => {
    // Start tracking immediately when the component mounts
    startTracking();

    return () => {
      if (socket) socket.close();
    };
  }, []); // Empty dependency array means this effect runs once, on mount

  return (
    <div>
      <div>Tracking...</div>
    </div>
  );
};

export default DriverTracker;
