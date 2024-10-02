/** @format */

"use client";

import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [savedUser, setSavedUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("savedUser");
      return storedUser ? JSON.parse(storedUser) : "";
    }
    return "";
  });
  const [formData, setFormData] = useState({}); 
  // Save user to localStorage whenever savedUser changes
  useEffect(() => {
    if (savedUser) {
      localStorage.setItem("savedUser", JSON.stringify(savedUser));
    }
  }, [savedUser]);

  return (
    <UserContext.Provider value={{savedUser, setSavedUser, formData, setFormData}}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
