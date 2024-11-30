import Header from "../../components/Header";
import { Box, useTheme, IconButton } from "@mui/material";
import TaxiForm from "./TaxiForm";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const AddTaxi = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "70%",
        m: "50px auto",
        borderRadius: "20px",
        p: "20px",
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        <Header title="New Taxi" subTitle="Adding new Taxi" />
        <IconButton
          sx={{ width: "70px", mb: "30px" }}
          onClick={() => {
            navigate("/taxis", { state: { refresh: Date.now() } });
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      </Box>
      <TaxiForm />
    </Box>
  );
};

export default AddTaxi;
