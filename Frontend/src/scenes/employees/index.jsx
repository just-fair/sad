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

export const employeesLoader = async () => {
  try {
    const res = await api.get("/employees/");
    if (res.status !== 200) throw new Error("Failed to retrieve data");
    return res;
  } catch (err) {
    console.log(err);
    throw new Response("Error fetching data", { status: 500 });
  }
};

const CustomFooterWithButtons = ({
  selectedRows,
  handleAdd,
  handleDelete,
  handleUpdate,
}) => {
  return (
    <GridFooterContainer
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
      }}
    >
      {/* Left side buttons */}
      <Box>
        <Button
          onClick={handleAdd}
          variant="contained"
          sx={{ bgcolor: "black" }}
        >
          Add
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          disabled={selectedRows.length === 0} // Enable if one or more rows are selected
          sx={{ marginLeft: "8px", bgcolor: "black" }}
        >
          Delete
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          color="secondary"
          disabled={selectedRows.length !== 1} // Enable only if exactly one row is selected
          sx={{ marginLeft: "8px", bgcolor: "black", flexShrink: 6 }}
        >
          Update
        </Button>
      </Box>

      {/* Right side pagination */}
      <GridPagination sx={{ overflow: "hidden" }} />
    </GridFooterContainer>
  );
};

const Employees = () => {
  const theme = useTheme();
  const employees = useLoaderData();
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const [rows, setRows] = useState(employees.data || []);

  useEffect(() => {
    setRows(employees.data);
  }, [employees.data]);

  const columns = [
    { field: "employee_id", headerName: "Employee ID", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "middle_name", headerName: "Middle Name", flex: 1 },
    { field: "birthday", headerName: "Birthday", flex: 1 },
    {
      field: "gender",
      headerName: "Gender",
      align: "center",
      headerAlign: "center",
    },
    { field: "contact_number", headerName: "Phone Number", flex: 1.5 },
    {
      field: "is_active",
      type: "boolean",
      headerName: "Is Active",
      headerAlign: "center",
      align: "center",
    },
    { field: "date_started", headerName: "Joined on" },
    { field: "image", headerName: "Image" },
    { field: "role", headerName: "Role" },
  ];

  const handleSelectionModelChange = (ids) => {
    setSelectedRows(ids);
  };

  const handleAdd = () => {
    console.log("Add button clicked");
    return navigate("add");
  };

  const handleDelete = async () => {
    try {
      console.log("Delete button clicked", selectedRows);
      const res = await api.post("/employees/delete-multiple/", {
        ids: selectedRows,
      });

      if (res.status !== 200) {
        throw new Error(res.data.message);
      }
      alert(res.data.message);
      const updatedRows = rows.filter(
        (row) => !selectedRows.includes(row.employee_id)
      );
      setRows(updatedRows);
      setSelectedRows([]);
    } catch (error) {
      return new Response(error.message);
    }
  };

  const handleUpdate = () => {
    console.log("Update button clicked", selectedRows);
  };

  return (
    <Box m="20px" sx={{ position: "relative" }}>
      {console.log(employees.data)}

      <Box
        sx={{
          m: 0,
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <Outlet />
      </Box>

      <Header
        title="Employees"
        subTitle="Managing The Employees of GPS"
      ></Header>
      <Box
        m="30px 0 0 0"
        width="100%"
        height="68vh"
        sx={{
          overflow: "hidden",
          "& .MuiDataGrid-root": {
            flexShrink: 1,
            overflow: "hidden",
            border: "none",
          },
          "& .MuiDataGrid-columnHeader": {
            borderBottom: "none",
            background: colors.green[600],
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {},
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.green[600],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.green[900]} !important`,
          },
          "& .MuiButtonBase-root": {
            color: `${colors.green[400]} !important`,
          },
          "& .MuiDataGrid-scrollbar": {
            zIndex: 0,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          onRowSelectionModelChange={handleSelectionModelChange}
          getRowId={(employee) => employee.employee_id}
          rowBuffer={3}
          slots={{
            toolbar: GridToolbar,
            footer: () => (
              <CustomFooterWithButtons
                selectedRows={selectedRows}
                handleAdd={handleAdd}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default Employees;
