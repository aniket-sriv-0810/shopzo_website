import React from "react";
import { useUser } from "./userContext";
import PageNotFound from "../../pages/Loaders/PageNotFound";


const IsAdmin = ({ children }) => {
  const { user } = useUser();

  // Check if user is not logged in or not an admin
  if (!user || user.role !== "admin") {
    return <div>
      <PageNotFound/>
    </div>  // Redirect to 404 page
  }

  return children;
};

export default IsAdmin;
