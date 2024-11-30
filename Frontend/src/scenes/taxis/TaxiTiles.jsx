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
import { useNavigate, useOutletContext } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Suggestions from "./Suggestions";

const TaxiTiles = () => {
  const { taxis } = useOutletContext();
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
      <Box>
        <Suggestions taxis={taxis} />
      </Box>
      <Box
        sx={{
          // display: "grid",
          // gridTemplateColumns: "repeat(3, 1fr)",
          // gap: "20px",
          // overflow: "auto",
          flexGrow: 1,
        }}
      >
        <Grid container spacing={3}>
          {taxis.map((taxi) => (
            <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }} key={taxi.taxi_id}>
              <Tile taxi={taxi} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TaxiTiles;
