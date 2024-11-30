import { Box, Button, colors } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Tile from "./Tile";
import Header from "../../components/Header";
import { useOutletContext, useNavigate } from "react-router-dom";

const DriversTiles = () => {
  const { drivers } = useOutletContext();
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Header title="Drivers" subTitle="Drivers of GPS" />
        <Button
          variant="contained"
          sx={{ marginBottom: "30px", bgcolor: colors.green[600] }}
          onClick={() => {
            navigate("add");
          }}
        >
          Add
        </Button>
      </Box>
      <Box
        sx={{
          // display: "flex",
          // gap: "10px",
          flexGrow: 1,
        }}
      >
        <Grid container spacing={3}>
          {drivers.map((driver) => (
            <Grid key={driver.driver_id} size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
              <Tile driver={driver} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DriversTiles;
