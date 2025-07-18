import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

const USER_API =
  import.meta.env.VITE_USER_API ||
  "https://b527b2fd039e.ngrok-free.app/0fd1fc77-f7ed-4a1e-9409-4966db5d9dd8/ims/v1/57a307be-44be-46b5-ae57-7543c01d3acc";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(USER_API, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        });
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
