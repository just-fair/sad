import {
  Box,
  colors,
  Typography,
  useTheme,
  Button,
  Paper,
} from "@mui/material";
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

export const employeesLoader = async () => {
  try {
    const res = await api.get("/office-employees/");
    if (res.status !== 200) throw new Error("Failed to retrieve data");
    console.log(res);

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

const EmployeesTable = () => {
  const theme = useTheme();
  const employees = useLoaderData();
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  // useEffect(() => {
  //   console.log(employees.data);

  //   setRows(employees.data);
  // }, [employees.data]);

  useEffect(() => {
    const processedData = employees.data.map((item) => ({
      ...item.employee, // Spread the nested employee object
      office_role: item.office_role, // Top-level property
      office_staff_id: item.office_staff_id, // Top-level property
    }));

    console.log(processedData); // Check the flattened data structure
    setRows(processedData);
  }, [employees.data]);

  const columns = [
    {
      field: "employee_id",
      headerName: "Employee ID",
      flex: 1,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "middle_name",
      headerName: "Middle Name",
      flex: 1,
    },
    {
      field: "birthday",
      headerName: "Birthday",
      flex: 1,
      type: "date",
      valueGetter: (params) => {
        const date = moment(params, "YYYY-MM-DD").toDate();
        return date;
      },
    },
    {
      field: "gender",
      headerName: "Gender",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contact_number",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "is_active",
      type: "boolean",
      headerName: "Active",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date_started",
      headerName: "Started since",
      type: "date",
      valueGetter: (params) => {
        const date = moment(params, "YYYY-MM-DD").toDate();
        return date;
      },
    },
    {
      field: "office_role",
      headerName: "Role",
      flex: 1,
    },
  ];

  // const handleSelectionModelChange = (ids) => {
  //   setSelectedRows(ids);
  // };

  const handleSelectionModelChange = (newSelection) => {
    // This will give you the ids of the selected rows
    setSelectedRows(newSelection);
  };

  const handleAdd = () => {
    console.log("Add button clicked");
    return navigate("add");
  };

  const handleDelete = async () => {
    try {
      console.log(selectedRows);

      console.log("Delete button clicked", selectedRows);
      const res = await api.post("/office-employees/delete-multiple/", {
        ids: selectedRows,
      });

      if (res.status !== 200) {
        throw new Error(res.data.message);
      }

      alert(res.data.message);

      const updatedRows = rows.filter(
        (row) => !selectedRows.includes(row.office_staff_id)
      );
      setRows(updatedRows);
      setSelectedRows([]);
    } catch (error) {
      return new Response(error.message);
    }
  };

  const handleUpdate = () => {
    navigate(`edit/${selectedRows[0]}`);
  };

  return (
    <Paper
      sx={{ position: "relative", borderRadius: "20px", p: "20px", m: "30px" }}
    >
      <Header
        title="Employees"
        subTitle="Managing The Employees of GPS"
      ></Header>
      <Box
        m="30px 0 0 0"
        width="100%"
        height="90vh"
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
          rowSelectionModel={selectedRows}
          getRowId={(employee) => employee.office_staff_id}
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
    </Paper>
  );
};

export default EmployeesTable;
