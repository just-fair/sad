import { Box, colors, Typography, useTheme, Button } from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridFooterContainer,
  GridPagination,
} from "@mui/x-data-grid";
import { useNavigate, useLoaderData, Outlet } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../api";
import { useState, useMemo, useEffect } from "react";
import moment from "moment";

const Employees = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "90%",
        overflow: "auto",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default Employees;
