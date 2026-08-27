"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
        {
          withCredentials: true,
        }
      );

      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);


  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        checkAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);