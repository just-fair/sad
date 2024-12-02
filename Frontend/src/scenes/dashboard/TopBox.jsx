import React from "react";
import { Paper, Box, Typography, colors } from "@mui/material";

const TopBox = ({ icon, value, title }) => {
  return (
    <Box sx={{ width: "100%", m: "0 30px" }}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          {icon}
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box mt="15px">
          <Typography
            variant="h5"
            fontStyle="italic"
            sx={{ textAlign: "center" }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TopBox;
