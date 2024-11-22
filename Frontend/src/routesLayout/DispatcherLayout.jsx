import { useContext } from "react";
import { Outlet, redirect } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import DispatcherView from "../DispatcherView.jsx";

const DispatcherLayout = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <>
        <Outlet />
        {/* {user.role === "admin" ? (
          <DispatherView>
            <Outlet />
          </DispatherView>
        ) : (
          redirect("/login")
        )} */}
      </>
    </>
  );
};

export default DispatcherLayout;
