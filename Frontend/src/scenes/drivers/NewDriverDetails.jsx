import React from "react";
import { Box } from "@mui/material";
import DriverProfile from "./DriverProfile";
import api from "../../api";
import { useLoaderData } from "react-router-dom";

export const loader = async ({ params }) => {
  const { id } = params;
  try {
    const res = await api.get(`/drivers/${id}`);
    if (res.status === 200) {
      console.log(res.data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
    alert(error);
  }
};

const NewDriverDetails = () => {
  const driver = useLoaderData();
  return (
    <Box width="100%">
      <DriverProfile driver={driver} />
    </Box>
  );
};

export default NewDriverDetails;
