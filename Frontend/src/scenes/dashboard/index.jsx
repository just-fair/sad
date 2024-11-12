import { useContext } from "react";
import Header from "../../components/Header";
import { Box } from "@mui/material";
import { UserContext } from "../../context/UserContext";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title={user ? user.first_name : "Welcome"}
          subTitle="Welcome to your dashboard"
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
