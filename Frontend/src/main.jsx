import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoutes.jsx";
import NotFound from "./scenes/NotFound.jsx";
import Login from "./scenes/Login.jsx";
import Logout from "./scenes/Logout.jsx";
import Register from "./scenes/Register.jsx";
import Dashboard from "./scenes/dashboard/index.jsx";

import Employees from "./scenes/employees/index.jsx";
import EmployeesTable, {
  employeesLoader,
} from "./scenes/employees/EmployeeTable.jsx";
import AddEmployee from "./scenes/employees/AddEmployee.jsx";
import EditEmployee, {
  employeeLoader,
} from "./scenes/employees/EditEmployee.jsx";

import Drivers, { driversLoader } from "./scenes/drivers/index.jsx";
import DriversTiles from "./scenes/drivers/DriversTiles.jsx";
import DriverDetails, {
  driverInfoLoader,
} from "./scenes/drivers/DriverDetails.jsx";
import AddDriver, {
  loader as availableTaxiLoader,
} from "./scenes/drivers/AddDriver.jsx";

import Taxis, { loader as taxisLoader } from "./scenes/taxis/index.jsx";
import TaxiTiles from "./scenes/taxis/TaxiTiles.jsx";
import AddTaxi from "./scenes/taxis/AddTaxi.jsx";
import TaxiDetails, {
  loader as taxiDetailsLoader,
} from "./scenes/taxis/TaxiDetails.jsx";

import Home, { loader as allTaxiLoader } from "./DispatcherView.jsx/Home.jsx";
import LogForm, {
  dispatchTaxiLoader,
  currentDriverLoader,
} from "./DispatcherView.jsx/LogForm.jsx";
import ParkForm from "./DispatcherView.jsx/ParkForm.jsx";
import DispatchmentRecords, {
  loader as dispatchmentRecordsLoader,
} from "./DispatcherView.jsx/DispatchmentRecords.jsx";

import Locations from "./scenes/locations/index.jsx";
import AdminLayout from "./routesLayout/AdminLayout.jsx";
import DriverLayout from "./routesLayout/DriverLayout.jsx";

import DispatcherLayout from "./routesLayout/DispatcherLayout.jsx";
import { UserProvider } from "./context/UserContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Dashboard /> },
      {
        path: "office-employees",
        element: <Employees />,
        children: [
          { path: "", element: <EmployeesTable />, loader: employeesLoader },
          { path: "add", element: <AddEmployee /> },
          {
            path: "edit/:id",
            element: <EditEmployee />,
            loader: employeeLoader,
          },
        ],
      },
      {
        path: "drivers",
        element: <Drivers />,
        loader: driversLoader,
        children: [
          {
            path: "",
            element: <DriversTiles />,
          },
          {
            path: "details/:id",
            element: <AddDriver />,
            loader: availableTaxiLoader,
            // loader: driverInfoLoader,
          },
          {
            path: "add",
            element: <AddDriver />,
            loader: availableTaxiLoader,
          },
        ],
      },
      {
        path: "taxis",
        element: <Taxis />,
        loader: taxisLoader,
        children: [
          { path: "", element: <TaxiTiles /> },
          { path: "add", element: <AddTaxi /> },
          {
            path: "details/:id",
            element: <TaxiDetails />,
            loader: taxiDetailsLoader,
          },
        ],
      },
      { path: "locations", element: <Locations /> },
    ],
  },
  {
    path: "/driver",
    element: (
      <ProtectedRoute role="driver">
        <DriverLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [],
  },
  {
    path: "/dispatcher",
    element: (
      <ProtectedRoute>
        <DispatcherLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Home />, loader: allTaxiLoader },
      { path: "log/:id", element: <LogForm />, loader: dispatchTaxiLoader },
      { path: "park/:id", element: <LogForm />, loader: currentDriverLoader },
      {
        path: "records",
        element: <DispatchmentRecords />,
        loader: dispatchmentRecordsLoader,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
