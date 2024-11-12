import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    const storedIsSuperUser = JSON.parse(localStorage.getItem("isSuperUser"));

    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }

    if (storedIsSuperUser === true) {
      setIsSuperUser(true);
    }
  }, []);

  const saveUserData = (user) => {
    setUser(user.user_data);
    setIsSuperUser(user.isSuperUser);
    localStorage.setItem("user", JSON.stringify(user.user_data));
  };

  const removeUserData = () => {
    localStorage.clear();
    setUser(null);
    setIsSuperUser(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        saveUserData,
        removeUserData,
        isSuperUser,
        setIsSuperUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
