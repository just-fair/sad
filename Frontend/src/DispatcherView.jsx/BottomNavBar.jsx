import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RouteIcon from "@mui/icons-material/Route";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavBar = () => {
  const [value, setValue] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Map the current path to the corresponding BottomNavigationAction index
    switch (location.pathname) {
      case "/dispatcher":
        setValue(0);
        break;
      case "/dispatcher/records":
        setValue(1);
        break;
      default:
        setValue(0); // Default to the first tab if route is unknown
    }
  }, [location.pathname]);

  const handleNavigation = (newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/dispatcher");
        break;
      case 1:
        navigate("records");
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => handleNavigation(newValue)}
      >
        <BottomNavigationAction label="Taxis" icon={<LocalTaxiIcon />} />
        <BottomNavigationAction label="History" icon={<RouteIcon />} />
      </BottomNavigation>
    </Box>
  );
};

export default BottomNavBar;
