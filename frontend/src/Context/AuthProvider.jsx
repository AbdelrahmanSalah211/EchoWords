import React from 'react'
import { createContext, useState, useEffect } from 'react'

const AuthContext = createContext({});

export function AuthProvider({children}) {
  const [auth, setAuth] = useState({});

  const refreshTokenFunction = async () => {
    try {
      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

      const response = await fetch(`${API_ENDPOINT}/users/refresh`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.status !== 200) {
        return
      }

      const data = await response.json();
      if (data.accessToken && data.user) {
        setAuth({
          token: data.accessToken,
          user: data.user
        });
      }
    } catch (error) {
      console.error("Failed to refresh token on initial load:", error);
    }
  };

  useEffect(() => {
    refreshTokenFunction();
  }, []);

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;