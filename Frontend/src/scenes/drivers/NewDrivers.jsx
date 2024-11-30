import React, { useEffect, useState } from "react";
import api from "../../api";
import { Box } from "@mui/material";
import { useLoaderData } from "react-router-dom";
import Tile from "./Tile";
import Grid from "@mui/material/Grid2";

export const loader = async () => {
  try {
    const res = await api.get("/drivers/?new_driver=true");
    if (res.status === 200) {
      console.log(res.data);

      return res.data;
    }
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

const NewDrivers = () => {
  const [drivers, setDrivers] = useState(useLoaderData());

  return (
    <Box
      sx={{
        mt: "20px",
        flexGrow: 1,
      }}
    >
      {drivers.length === 0 && <h3>No New Drivers</h3>}
      <Grid container spacing={3}>
        {drivers.map((driver) => (
          <Grid key={driver.driver_id} size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
            <Tile driver={driver} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NewDrivers;
