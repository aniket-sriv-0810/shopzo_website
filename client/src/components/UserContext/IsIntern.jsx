import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./userContext";

const IsIntern = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "intern") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default IsIntern;
