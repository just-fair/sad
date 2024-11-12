import { Box, IconButton, useTheme, InputBase } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, token } from "../../theme";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const themeStyle = useTheme();
  const colors = token(themeStyle.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const sample = () => {
    console.log(colorMode);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      bgcolor={colors.gray[800]}
    >
      <Box
        display="flex"
        borderRadius="3px"
        border={"2px solid " + colors.gray[100]}
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchOutlinedIcon />
        </IconButton>
      </Box>

      <Box display="flex">
        <IconButton type="button" onClick={colorMode.toggleColorMode}>
          {themeStyle.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={() => navigate("/logout")}>
          <LogoutOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
