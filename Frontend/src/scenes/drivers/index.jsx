import {
  useLoaderData,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import api from "../../api";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export const driversLoader = async () => {
  try {
    const res = await api.get("/drivers/");
    if (res.status === 200) {
      console.log(res);
      return res.data;
    }
  } catch (error) {
    alert(error);
    console.error();
  }
};

const Drivers = () => {
  const [drivers, setDrivers] = useState(useLoaderData());
  const location = useLocation();

  useEffect(() => {
    const refreshDrivers = async () => {
      try {
        const res = await api.get("/drivers/");
        if (res.status === 200) {
          setDrivers(res.data);
        }
      } catch (error) {
        alert(error);
        console.error("Failed to refresh drivers:", error);
      }
    };

    if (location.state?.refresh) {
      refreshDrivers(); // Fetch fresh data
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
      <Outlet context={{ drivers: drivers }} />
    </Box>
  );
};

export default Drivers;
