import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, tokenManager, userManager } from "../../utils/auth";

// Create context
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return userManager.getUser();
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authResult = await auth.checkAuth();

      if (authResult.isAuthenticated && authResult.user) {
        const userData = authResult.user;
        console.log("🔍 User data from server:", userData);
        
        // Ensure _id is a string for consistent comparison
        const processedUser = {
          ...userData,
          _id: userData._id.toString()
        };
        
        console.log("🔍 Processed user data:", processedUser);
        
        setUser(processedUser);
        userManager.setUser(processedUser);
      } else {
        setUser(null);
        userManager.removeUser();
        tokenManager.removeToken();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      userManager.removeUser();
      tokenManager.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      setUser(null);
      userManager.removeUser();
      tokenManager.removeToken();
      return { success: false, error };
    }
  };

  // Check authentication on mount
  useEffect(() => {
    fetchAuthStatus();
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      userManager.setUser(user);
    } else {
      userManager.removeUser();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, fetchAuthStatus, logout }}>
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
