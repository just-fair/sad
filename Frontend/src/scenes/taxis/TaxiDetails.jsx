import { Box, IconButton, useTheme } from "@mui/material";
import TaxiForm from "./TaxiForm";
import api from "../../api";
import Header from "../../components/Header";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLoaderData, useLocation } from "react-router-dom";

export const loader = async ({ params }) => {
  const { id } = params;
  try {
    const res = await api.get(`/taxis/${id}`);

    if (res.status === 200) {
      console.log(res);
      return res.data;
    }
  } catch (error) {
    alert(error);
    console.log(error.response.data);
  }
};

const TaxiDetails = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const editable = location.state ? location.state.editable : true;
  const taxiDetails = useLoaderData();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        <Header
          title="Taxi Detailed View"
          subTitle="Detailed infomartion of a taxi"
        />
        <IconButton
          sx={{ width: "70px", mb: "30px" }}
          onClick={() => {
            navigate("/taxis", { state: { refresh: Date.now() } });
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      </Box>
      <TaxiForm taxi={taxiDetails} editable={editable} action="updateDelete" />
    </Box>
  );
};

export default TaxiDetails;
