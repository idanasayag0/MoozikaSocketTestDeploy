import { message } from "antd";
import axios from "axios";
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useToken } from "../../hooks/useToken";
import { usePost } from "../../hooks/usePost";
import { USERS } from "../../constants";

const PrivateRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);

  const fetchUser = async () => {
    if (!localStorage.getItem("moozikaToken")) {
      message.error("You must be logged in before accessing this page");
      return setIsLoggedIn(false);
    }

    try {
      const response = await usePost(`${USERS}/user-details`, {
        token: useToken(),
      });
      if (response.status !== 200) {
        message.error("You must be logged in before accessing this page");
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);
    } catch (error) {
      message.error("You must be logged in before accessing this page");
      setIsLoggedIn(false);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
