import { Box, Paper } from "@mui/material";
import React from "react";
import Header from "../../components/Header";
import Avatar from "@mui/material/Avatar";

const DriverProfile = ({ driver }) => {
  return (
    <Box
      sx={{
        width: "100%",
        p: "20px",
      }}
    >
      <Box>
        <Header title="Driver Details" />
      </Box>

      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "50px",
          p: "20px",
        }}
      >
        <Box sx={{ alignSelf: "flex-start" }}>
          <Avatar
            alt="Drivers picture"
            src={driver.employee.image}
            sx={{ width: 56, height: 56 }}
          />
        </Box>

        <Box width="100%" display="flex" flexDirection="column">
          <h2>{`${driver.employee.last_name}, ${driver.employee.first_name} ${driver.employee.middle_name}`}</h2>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ flex: 1 }}>
              <h3>Role</h3>
              <h2>Driver</h2>
            </Box>
            <Box sx={{ flex: 1 }}>
              <h3>Phone Number</h3>
              <h2>{driver.employee.contact_number}</h2>
            </Box>
            <Box sx={{ flex: 1 }}>
              <h3>License Number</h3>
              <h2>{driver.license_number}</h2>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DriverProfile;
