import { useContext, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  Box,
  Paper,
  IconButton,
  Typography,
  useTheme,
  colors,
} from "@mui/material";
import { token } from "../../theme";
import { NavLink } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocalTaxiOutlinedIcon from "@mui/icons-material/LocalTaxiOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { UserContext } from "../../context/UserContext";

const Item = ({ title, destination, icon, selected, setSelected }) => {
  return (
    <MenuItem
      component={<NavLink to={destination} />}
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
      sx={{
        color: "inherit", // Inherit color from the theme
        "&.active": {
          color: "#fff", // or any theme color you'd like for the active state
        },
        textDecoration: "none",
        "&.visited": {
          color: "inherit",
        },
      }}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const SideBar = () => {
  const theme = useTheme();
  // const colors= tokens(theme.palette.mode);

  const backgroundColor = theme.palette.background.default;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useContext(UserContext);

  const [selected, setSelected] = useState("");

  return (
    <Paper
      sx={{
        "& .ps-menu-button:hover": {
          color: `${colors.green[600]} !important`,
        },

        m: 0,
        p: 0,
        "& .ps-menu-root": {
          minHeight: "100vh",
        },
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed} backgroundColor={backgroundColor}>
        <Menu
          menuItemStyles={{
            button: {
              [`&.active`]: {
                color: colors.green[300],
              },
              [`&:hover`]: {
                backgroundColor: "transparent",
              },
            },
          }}
        >
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography
                  variant="h3"
                  color={colors.green[600]}
                  fontStyle="italic"
                  fontWeight="900"
                  fontSize="2rem"
                >
                  GPS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <ArrowBackIosNewOutlinedIcon
                    sx={{
                      "&:hover": {
                        color: colors.green[600],
                      },
                    }}
                  />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  // src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user.first_name}
                </Typography>
                <Typography variant="h5">Administrator</Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              destination="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[500]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Employees
            </Typography>
            <Item
              title="Office Employees"
              destination="/office-employees"
              icon={<BadgeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Drivers"
              destination="/drivers"
              icon={<AssignmentIndOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[500]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Vehicles
            </Typography>
            <Item
              title="Taxis"
              destination="/taxis"
              icon={<LocalTaxiOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Locations"
              destination="/locations"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>

          {/* <MenuItem>
            <NavLink to="/">Home</NavLink>
          </MenuItem>
          <SubMenu label="Employees">
            <MenuItem>Drivers</MenuItem>
            <MenuItem>Office Staffs</MenuItem>
          </SubMenu>
          <MenuItem>Taxis</MenuItem>
          <MenuItem>Locations</MenuItem> */}
        </Menu>
      </Sidebar>
    </Paper>
  );
};

export default SideBar;
