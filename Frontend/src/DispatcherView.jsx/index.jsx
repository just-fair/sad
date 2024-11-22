import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dispatcherHome.css";

const DispatcherView = () => {
  const navigate = useNavigate();

  const handleGoClick = (plateNumber) => {
    console.log(plateNumber);

    navigate("log", { state: { plateNumber: plateNumber } }); // send the plateNumber onduty.jsx
  };

  const handleParkClick = (plateNumber) => {
    navigate("park", { state: { plateNumber } }); // send plateNumber to Park.jsx
  };

  const taxiData = [{ plateNumber: "BSIT-1234", status: "On Duty" }];

  return (
    <div className="home-container">
      <h1 className="home-header">GPS Taxi Company</h1>
      <div className="plate-container">
        {taxiData.map((taxi, index) => (
          <div className="plate-box" key={index}>
            <img
              src="https://thesantiagoairport.com/wp-content/uploads/2024/02/Santiago-Airport-Taxi.jpg"
              alt="Taxi"
              className="plate-image"
            />
            <span className="plate-number">{taxi.plateNumber}</span>

            {/* STATUS */}
            <p className="taxi-status">{taxi.status}</p>

            {/* BUTTONS */}
            <div className="button-container">
              <button
                className="button go"
                onClick={() => handleGoClick(taxi.plateNumber)} // send plate no when click
              >
                Go
              </button>
              <button
                className="button park"
                onClick={() => handleParkClick(taxi.plateNumber)} // send plate no when click
              >
                Park
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DispatcherView;
