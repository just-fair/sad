import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  Button,
  colors,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import taxiImage from "../../../src/assets/Taxi-Milano.png";

const Tile = ({ taxi }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // const handleViewButton = async () => {
  //   try {
  //     const res = await api.get(`/taxis/${taxi.taxi_id}/`);

  //     if (res.status === 200) {
  //       return navigate(`details/${driver.driver_id}`, {
  //         state: { driver: res.data, editable: false },
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     alert(error);
  //   }
  // };

  const cardBackgroundColor =
    theme.palette.mode === "dark" ? "#424242" : "#f9f9f9";

  return (
    <Card
      sx={{
        width: "100%",
        height: "200px",
        display: "flex",
        alignItems: "center",
        backgroundColor: cardBackgroundColor,
        borderRadius: "10px",
        border: "1px solid trasparent",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: "30%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
        }}
        src={taxiImage}
        alt="Taxi image"
      />
      <Box sx={{ flex: 1, padding: "16px" }}>
        <CardContent sx={{ padding: "0" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: "4px",
              textTransform: "uppercase",
            }}
          >
            {taxi.plate_number}
          </Typography>
          {/* <Typography variant="subtitle2" sx={{ marginBottom: "8px" }}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Typography> */}
          <Typography sx={{ fontSize: "14px" }}>
            <b>Taxi:</b> {taxi.brand}
          </Typography>
          <Typography sx={{ fontSize: "14px" }}>
            <b>Model:</b> {taxi.model}
          </Typography>
          <Typography sx={{ fontSize: "14px" }}>
            <b>Year Model:</b> {taxi.release_year}
          </Typography>
          {/* <Typography sx={{ fontSize: "14px" }}>
              <b>Plate Number:</b> {driver.taxi.plate_number}
            </Typography> */}
        </CardContent>
        <CardActions sx={{ marginTop: "8px", padding: "0" }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              marginLeft: "auto",
              bgcolor: colors.green[600],
              textTransform: "none",
            }}
            onClick={() => {
              navigate(`details/${taxi.taxi_id}`, {
                state: { editable: false },
              });
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};

export default Tile;
