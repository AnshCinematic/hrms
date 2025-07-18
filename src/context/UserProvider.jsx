import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

const USER_API = import.meta.env.VITE_USER_API;

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      if (!USER_API) {
        setError("VITE_USER_API is not set in your .env file");
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${USER_API}/0fd1fc77-f7ed-4a1e-9409-4966db5d9dd8/ims/v1/e2f1a7d0-3e9c-4b32-b6a7-153a22c86b80`,
          {
            headers: {
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}
