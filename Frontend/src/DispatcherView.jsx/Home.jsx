import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import "../styles/dispatcherHome.css";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import api from "../api";

export const loader = async () => {
  try {
    const res = await api.get("/taxis/");

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

const Home = () => {
  const navigate = useNavigate();
  const taxis = useLoaderData();

  const handleGoClick = (taxi) => {
    navigate(`log/${taxi.taxi_id}`, { state: { taxi, mode: "dispatch" } });
  };

  const handleParkClick = (taxi) => {
    navigate(`park/${taxi.taxi_id}`, { state: { taxi, mode: "park" } });
  };

  return (
    <Box component="div" className="home-container">
      {/* className="plate-container" */}
      <Grid container spacing={6}>
        <Grid size={12}>
          <h1 className="home-header">GPS Taxi Company</h1>
        </Grid>

        {/* <div > */}
        {taxis.map((taxi, index) => (
          <Grid size={6} key={index} className="plate-box">
            {/* <div className="plate-box" key={index}> */}
            <img
              src="https://thesantiagoairport.com/wp-content/uploads/2024/02/Santiago-Airport-Taxi.jpg"
              alt="Taxi"
              className="plate-image"
            />
            <span className="plate-number">{taxi.plate_number}</span>

            {/* STATUS */}
            <p className="taxi-status">{taxi.condition}</p>

            {/* BUTTONS */}
            <div className="button-container">
              <button
                disabled={taxi.condition === "deployed"}
                className="button go"
                onClick={() => handleGoClick(taxi)} // send plate no when click
              >
                Go
              </button>
              <button
                disabled={taxi.condition === "parked"}
                className="button park"
                onClick={() => handleParkClick(taxi)} // send plate no when click
              >
                Park
              </button>
            </div>
            {/* </div> */}
          </Grid>
        ))}
        {/* </div> */}
      </Grid>
    </Box>
  );
};

export default Home;
