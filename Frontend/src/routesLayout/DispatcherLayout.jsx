import { useContext } from "react";
import { Outlet, redirect } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import DispatcherView from "../DispatcherView.jsx";
import BottomNavBar from "../DispatcherView.jsx/BottomNavBar.jsx";

const DispatcherLayout = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <>
        {/* <Outlet /> */}
        {user.office_role === "dispatcher" ? (
          <>
            <DispatcherView />
            <Outlet />
            <BottomNavBar />
          </>
        ) : (
          redirect("/login")
        )}
      </>
    </>
  );
};

export default DispatcherLayout;
