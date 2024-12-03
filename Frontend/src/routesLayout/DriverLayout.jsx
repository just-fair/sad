import { useContext, useEffect } from "react";
import { Outlet, redirect } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import DriverView from "../DriverView";

const DriverLayout = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log(user.role);
  }, []);

  return (
    <>
      <>
        {user.employee.role === "driver" ? (
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
