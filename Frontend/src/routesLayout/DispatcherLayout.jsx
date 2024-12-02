import { useContext } from "react";
import { Outlet, redirect } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import DispatcherView from "../DispatcherView.jsx";
import BottomNavBar from "../DispatcherView.jsx/BottomNavBar.jsx";
import { Box } from "@mui/material";

const DispatcherLayout = () => {
  const { user } = useContext(UserContext);

  return (
    <Box>
      {/* <Outlet /> */}
      {user.office_role === "dispatcher" ? (
        <Box display="flex" flexDirection="column" maxHeight="100vh">
          <DispatcherView />
          <Box flex="1" overflow="auto">
            <Outlet />
          </Box>
          <BottomNavBar />
        </Box>
      ) : (
        redirect("/login")
      )}
    </Box>
  );
};

export default DispatcherLayout;
