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

const Tile = ({ driver }) => {
  const theme = useTheme();
  const fullName = `${driver.employee.last_name}, ${driver.employee.first_name} ${driver.employee.middle_name}`;
  const { role } = driver.employee;
  const navigate = useNavigate();

  const handleViewButton = async () => {
    try {
      const res = await api.get(`/drivers/${driver.driver_id}/`);

      if (res.status === 200) {
        return navigate(`details/${driver.driver_id}`, {
          state: { driver: res.data, editable: false },
        });
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

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
          width: "120px",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
        src={
          driver.employee.image ||
          `https://i0.wp.com/therightpathok.org/wp-content/uploads/2019/05/male-silhouette-copy.jpg?fit=300%2C240&ssl=1`
        }
        alt="Driver image"
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
            {fullName}
          </Typography>
          <Typography variant="subtitle2" sx={{ marginBottom: "8px" }}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Typography>
          {driver.taxi !== null ? (
            <>
              <Typography sx={{ fontSize: "14px" }}>
                <b>Taxi:</b> {driver.taxi.brand}
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>
                <b>Model:</b> {driver.taxi.model}
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>
                <b>Year Model:</b> {driver.taxi.release_year}
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>
                <b>Plate Number:</b> {driver.taxi.plate_number}
              </Typography>
            </>
          ) : (
            <>
              <h3>Taxi not yet assigned</h3>
            </>
          )}
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
            onClick={handleViewButton}
          >
            View Details
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};

export default Tile;
