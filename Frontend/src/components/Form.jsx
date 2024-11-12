import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  FormControl,
  Input,
  InputLabel,
  colors,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Key,
} from "@mui/icons-material";
import { useContext, useState } from "react";
import api from "../api";
import { NavLink, useNavigate } from "react-router-dom";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { UserContext } from "../context/UserContext";

const Form = ({ route, method }) => {
  const { user, saveUserData, setIsSuperUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const title = method === "register" ? "Register" : "Login";

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((previousValue) => !previousValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (method === "login") {
        const res = await api.post(route, { username, password });
        console.log(res);
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        console.log("User: " + user);

        if (res.data.is_superuser) {
          setIsSuperUser(res.data.is_superuser);
          localStorage.setItem("isSuperUser", res.data.is_superuser);
          return navigate("/");
        }

        saveUserData(res.data);

        if (res.data.user_data.role === "office staff") {
          return navigate("/");
        } else if (res.data.user_data.role === "driver") {
          return navigate("/driver");
        }
      } else if (method === "register") {
        const res = await api.post(route, {
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          employee: employeeId,
        });
        navigate("/login");
      } else useNavigate("/not_found");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      {loading && <h1>Loading...</h1>}
      <Paper elevation={3} sx={{ p: 7, mt: 10, borderRadius: 6 }}>
        <form noValidate autoComplete="off">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {title}
            </Typography>

            {method === "login" ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  <AccountCircle
                    sx={{ color: "action.active", mr: 1, my: 0.5 }}
                  />
                  <TextField
                    label="Username"
                    variant="standard"
                    sx={{ width: "100%" }}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  <Key sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                  <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <TextField
                    sx={{
                      width: "50%",
                    }}
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                  />

                  <TextField
                    label="First Name"
                    variant="outlined"
                    sx={{
                      width: "50%",
                    }}
                    margin="normal"
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <TextField
                    sx={{
                      width: "30%",
                    }}
                    label="Employee ID"
                    variant="outlined"
                    margin="normal"
                    type="text"
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />

                  <TextField
                    sx={{
                      width: "70%",
                    }}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>

                <TextField
                  label="Username"
                  variant={method === "login" ? "standard" : "outlined"}
                  fullWidth
                  margin="normal"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                  label="Password"
                  variant={method === "login" ? "standard" : "outlined"}
                  fullWidth
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  slots={{
                    startAdornment: InputAdornment,
                  }}
                />

                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </>
            )}

            <Button
              variant="contained"
              sx={{
                mt: 4,
                width: method === "login" ? "85%" : "100%",
                bgcolor: "black",
              }}
              onClick={handleSubmit}
            >
              {title}
            </Button>

            {method === "login" ? (
              <Typography
                sx={{
                  // alignSelf: "flex-start",
                  mt: 5,
                }}
              >
                New user?
                <NavLink to="/register" style={{ color: colors.green[600] }}>
                  {" "}
                  Sign up
                </NavLink>
              </Typography>
            ) : (
              <Typography
                sx={{
                  // alignSelf: "flex-start",
                  mt: 5,
                }}
              >
                Already have an account?
                <NavLink to="/login" style={{ color: colors.green[600] }}>
                  {" "}
                  Sign in
                </NavLink>
              </Typography>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Form;
