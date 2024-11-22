import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardMedia,
  colors,
  Button,
} from "@mui/material";
import Header from "../../components/Header";
import Tile from "./Tile";
import { useOutletContext } from "react-router-dom";

const TaxiTiles = () => {
  const { taxis } = useOutletContext();
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Header title="Taxi" subTitle="Mga taxil" />
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
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          overflow: "auto",
          //   justifyContent: "center",
          //   alignItems: "center",
          //   gap: "10px",
          //   flexWrap: "wrap",
        }}
      >
        {taxis.map((taxi) => (
          <Tile taxi={taxi} key={taxi.taxi_id} />
        ))}
      </Box>
    </Box>
  );
};

export default TaxiTiles;
