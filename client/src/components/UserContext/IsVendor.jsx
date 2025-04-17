import React from "react";
import { useUser } from "./userContext";

const IsVendor = ({ children }) => {
  const { user } = useUser();

  // Check if user is not logged in or not a vendor
  if (!user || user.role !== "vendor") {
    return <p>Page Not Found!</p>; // You can replace with a real 404 component or redirect if needed
  }

  return children;
};

export default IsVendor;
