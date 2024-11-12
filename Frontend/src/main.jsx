import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./AdminView.jsx";
import DriverView from "./DriverView.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/protectedRoutes.jsx";
import NotFound from "./scenes/NotFound.jsx";
import Login from "./scenes/Login.jsx";
import Logout from "./scenes/Logout.jsx";
import Register from "./scenes/Register.jsx";
import Dashboard from "./scenes/dashboard/index.jsx";
import OfficeEmployees from "./scenes/OfficeEmployees.jsx";
import Employees, { employeesLoader } from "./scenes/employees/index.jsx";
import AddEmployee from "./scenes/employees/AddEmployee.jsx";
import Drivers from "./scenes/Drivers.jsx";
import Taxis from "./scenes/Taxis.jsx";
import Locations from "./scenes/Locations.jsx";
import AdminLayout from "./routesLayout/AdminLayout.jsx";
import DriverLayout from "./routesLayout/DriverLayout.jsx";
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
        loader: employeesLoader,
        children: [{ path: "add", element: <AddEmployee /> }],
      },
      { path: "drivers", element: <Drivers /> },
      { path: "taxis", element: <Taxis /> },
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
