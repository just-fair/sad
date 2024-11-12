import { useContext, useEffect } from "react";
import Form from "../components/Form";
import { UserContext } from "../context/UserContext";

const Register = () => {
  const { user, removeUserData } = useContext(UserContext);

  return (
    <>
      <Form route="/accounts/" method="register"></Form>
    </>
  );
};

export default Register;
