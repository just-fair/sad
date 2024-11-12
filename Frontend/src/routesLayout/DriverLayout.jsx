import { useContext } from "react";
import { Outlet, redirect } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import DriverView from "../DriverView";

const DriverLayout = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <>
        {user.role === "driver" ? (
          <DriverView>
            <Outlet />
          </DriverView>
        ) : (
          redirect("/login")
        )}
      </>
    </>
  );
};

export default DriverLayout;
