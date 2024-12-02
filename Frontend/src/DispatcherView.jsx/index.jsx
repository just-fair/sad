import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { colors, useTheme } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";

const DispatcherView = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar
          sx={{
            bgcolor: "black",
            display: "flex",
            justifyContent: "space-between",
            pl: "40px",
            pr: "30px",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "700" }}
            color={colors.green[600]}
          >
            GPS
          </Typography>
          <IconButton onClick={() => navigate("/logout")} color="inherit">
            <LogoutOutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default DispatcherView;
