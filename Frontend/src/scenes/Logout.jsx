import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { removeUserData, user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    removeUserData();
    navigate("/login");
  }, [removeUserData, navigate]);

  return <h1>Loading...</h1>;
};

export default Logout;
