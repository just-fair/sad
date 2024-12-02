import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLoaderData } from "react-router-dom";
import api from "../api";
import { Box, Typography } from "@mui/material";
import Record from "./Record";

export const loader = async () => {
  try {
    const res = await api.get("/dispatchment-history/");
    if (res.status === 200) {
      console.log(res.data);
      return res.data;
    }
  } catch (error) {
    alert(error);
    console.log(error);
  }
};

const DispatchmentRecords = ({ onDashboard = false }) => {
  const [dispatchmentRecords, setDispatchmentRecords] = useState(
    useLoaderData() || []
  );

  useEffect(() => {
    const getDispatchmentRecords = async () => {
      try {
        const res = await api.get("/dispatchment-history/");
        if (res.status === 200) {
          setDispatchmentRecords(res.data);
          console.log(dispatchmentRecords);
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    };

    if (onDashboard) getDispatchmentRecords();
  }, []);

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Typography variant="h5" textAlign="center">
        Dispatchment Records
      </Typography>
      <Box height="100%" overflow="auto">
        {dispatchmentRecords.map((record) => (
          <Record record={record} key={record.dispatch_id} />
        ))}
      </Box>
    </Box>
  );
};

export default DispatchmentRecords;
