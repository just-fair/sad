import { Box, Button, colors } from "@mui/material";
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
          display: "flex",
          gap: "10px",
        }}
      >
        {drivers.map((driver) => (
          <Tile driver={driver} key={driver.driver_id} />
        ))}
      </Box>
    </Box>
  );
};

export default DriversTiles;
