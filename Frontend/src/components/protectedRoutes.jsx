import { Navigate, redirect } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

function ProtectedRoute({ children, role }) {
  const { user, isSuperUser } = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch((err) => {
      setIsAuthorized(false);
    });
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    const decodedToken = jwtDecode(refreshToken);
    const tokenExpiration = decodedToken.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      localStorage.clear();
      setIsAuthorized(false);
      return;
    }

    try {
      const res = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decodedToken = jwtDecode(token);
    const tokenExpiration = decodedToken.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  // if (!user && !isSuperUser) {
  //   return <Navigate to="/logout" />;
  // }

  console.log(isAuthorized);

  return isAuthorized ? children : <Navigate to="/login" />;

  // if (isAuthorized && user.role === "driver") {
  //   return redirect(`/${user.role}`);
  //   // return redirect("/driver");
  // } else if (isAuthorized && user.role === role) {
  //   return children;
  // } else {
  //   return <Navigate to="/login" />;
  // }
}

export default ProtectedRoute;
