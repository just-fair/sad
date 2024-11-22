import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  useLoaderData,
  Outlet,
} from "react-router-dom";
import api from "../../api";

export const loader = async () => {
  try {
    const res = await api.get("/taxis/");

    if (res.status === 200) {
      console.log(res);
      return res.data;
    }
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

const Taxis = () => {
  const taxis = useLoaderData();
  const location = useLocation();

  useEffect(() => {
    const refreshTaxi = async () => {
      try {
        const res = await api.get("/taxis/");

        if (res.status === 200) {
          console.log(res);
          return res.data;
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };

    if (location.state?.refresh) {
      refreshTaxi();
    }
  }, [location.state]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "90%",
        overflow: "auto",
        padding: "20px",
      }}
    >
      <Outlet context={{ taxis }} />
    </Box>
  );
};

export default Taxis;
