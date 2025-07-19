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
    let demoData = {
      id: "e2f1a7d0-3e9c-4b32-b6a7-153a22c86b80",
      org_id: "0fd1fc77-f7ed-4a1e-9409-4966db5d9dd8",
      name: "Kushal Chakraborty",
      email: "rahul.sharma@example.com",
      phone_number: "9876543210",
      date_of_birth: "1990-05-15",
      gender: "Male",
      address: "123 MG Road, Bengaluru, Karnataka",
      nationality: "Indian",
      department: "Engineering",
      designation: "Senior Software Engineer",
      date_of_joining: "2021-01-10",
      employment_type: "Full-time",
      work_location: "Bengaluru",
      base_salary: "1800000",
      role: ["EMPLOYEE"],
      // role: ["ADMIN", "HR_ADMIN", "ACCOUNTANT"],
      // role: ["ADMIN", "HR_ADMIN"],
      account: {
        id: "c7b2f739-2cbf-4437-9b0b-d36c8adf683a",
        account_holder_name: "Kushal Chakraborty",
        bank_account_number: "123456789012",
        ifsc_code: "SBIN0001234",
        pan_number: "ABCDE1234F",
        pf_account_number: "DL/12345/67890",
      },
    };
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
        setUser(demoData);
      } catch (err) {
        setError(err.message);
        setUser(demoData);
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
