import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import App from "../AdminView";

const AdminLayout = () => {
  const { user, isSuperUser } = useContext(UserContext);

  if (!user && !isSuperUser) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {isSuperUser ? (
        <App>
          <Outlet />
        </App>
      ) : user.role === "office staff" ? (
        <App>
          <Outlet />
        </App>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default AdminLayout;
