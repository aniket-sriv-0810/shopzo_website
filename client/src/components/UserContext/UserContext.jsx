import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/auth`,
        { withCredentials: true }
      );

      console.log("🔍 Auth response:", response.data);

      if (response.data.isAuthenticated && response.data.user) {
        const userData = response.data.user;
        console.log("🔍 User data from server:", userData);
        console.log("🔍 User ID type:", typeof userData._id);
        console.log("🔍 User ID value:", userData._id);
        
        // Ensure _id is a string for consistent comparison
        const processedUser = {
          ...userData,
          _id: userData._id.toString()
        };
        
        console.log("🔍 Processed user data:", processedUser);
        
        setUser(processedUser);
        localStorage.setItem("user", JSON.stringify(processedUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    fetchAuthStatus();
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, fetchAuthStatus }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
