import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "./userContext";

const PrivateRoute = ({ children }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redirect to login with the intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export  default PrivateRoute;
