import {
  useLoaderData,
  useNavigate,
  Outlet,
  useLocation,
  Link,
} from "react-router-dom";
import api from "../../api";
import { Tabs, Tab, Box, useTheme } from "@mui/material";
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
  const theme = useTheme();

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
      <Box sx={{ width: "100%" }}>
        <Tabs
          sx={{
            color: theme.palette.text.primary,
            "& .MuiTabs-indicator": {
              backgroundColor: "green", // Change indicator color
              color: "green",
            },
          }}
          value={location.pathname} // Set the active tab based on the current path
          // onChange={(event, newValue) => {
          //   window.location.pathname = newValue; // Change the path on tab click
          // }}
          // indicatorColor="primary"
          // textColor="primary"
          centered
        >
          <Tab
            sx={{
              "&.Mui-selected": {
                color: "green", // Change text color when selected
              },
            }}
            label="All Drivers"
            value="/drivers"
            component={Link}
            to="/drivers"
          />
          <Tab
            sx={{
              color: "white", // Default text color
              "&.Mui-selected": {
                color: "green", // Change text color when selected
              },
            }}
            label="New Drivers"
            value="/drivers/new"
            component={Link}
            to="/drivers/new"
          />
        </Tabs>
      </Box>
      <Outlet context={{ drivers: drivers }} />
    </Box>
  );
};

export default Drivers;
