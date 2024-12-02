import { useContext } from "react";
import Header from "../../components/Header";
import { Box, colors, Paper } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import Grid from "@mui/material/Grid2";
import TopBox from "./TopBox";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AvailableTaxi from "./AvailableTaxi";
import CodingTaxi from "./CodingTaxi";
import TaxiOnTrip from "./TaxiOnTrip";
import TotalBoundaries from "./TotalBoundaries";
import RecordsLineChart from "./LineChart";
import DispatchmentRecords from "../../DispatcherView.jsx/DispatchmentRecords";
import GasPrice from "./GasPrice";
import Incentives from "./Incentives";
import Locations from "../locations";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <Box
      p="20px"
      display="flex"
      flexDirection="column"
      height="100vh"
      overflow="hidden"
    >
      <Box>
        <Header
          title={`Hi ${user ? user.first_name : "Admin"}!`}
          subTitle="Welcome to your dashboard"
        />
      </Box>

      <Box
        // height="100%"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        // gridTemplateRows="repeat(12, 1fr)"
        gridAutoRows="140px"
        // gridAutoRows="minmax(auto, 1fr)"
        // flexGrow={1}
        gap="20px"
      >
        <Paper
          sx={{
            gridColumn: "span 3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            // border: "2px solid black",
          }}
        >
          <AvailableTaxi />
        </Paper>

        <Paper
          sx={{
            gridColumn: "span 3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // border: "2px solid black",
          }}
        >
          <CodingTaxi />
        </Paper>

        <Paper
          sx={{
            gridColumn: "span 3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // border: "2px solid black",
          }}
        >
          <TaxiOnTrip />
        </Paper>

        <Paper
          sx={{
            gridColumn: "span 3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // border: "2px solid black",
          }}
        >
          <TotalBoundaries />
        </Paper>

        <Paper sx={{ gridColumn: "span 8", gridRow: "span 2" }}>
          <RecordsLineChart />
        </Paper>

        <Paper sx={{ gridColumn: "span 4", gridRow: "span 2" }}>
          <DispatchmentRecords onDashboard={true} />
        </Paper>

        <Paper sx={{ gridColumn: "span 4", gridRow: "span 1" }}>
          <GasPrice />
        </Paper>

        <Paper sx={{ gridColumn: "span 4", gridRow: "span 1" }}>
          <Incentives />
        </Paper>

        <Paper sx={{ gridColumn: "span 4", gridRow: "span 1" }}>
          <Locations />
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
