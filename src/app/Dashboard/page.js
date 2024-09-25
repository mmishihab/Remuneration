/** @format */
"use client";

import React, { useContext, useEffect, useState } from "react";
import SideBarComponent from "../../../components/SideBar.component";
import { UserContext } from "../../../context/user.context";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { savedUser } = useContext(UserContext);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after the component has mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !savedUser) {
      router.replace("/");
    }
  }, [isClient, savedUser, router]);

  // Render nothing until the component has mounted on the client side
  if (!isClient || !savedUser) {
    return null;
  }

  console.log(savedUser);

  return (
    <div
      style={{ padding: 0, margin: 0, display: "flex", flexDirection: "row" }}>
      <SideBarComponent />
      <div style={{ padding: 0, margin: 0, width: "70%" }}>
        <h1>Dashboard</h1>
        <p>Welcome {savedUser?.username}, Thank you for logging in</p>
        <p>Welcome {savedUser?.email}</p>
      </div>
    </div>
  );
};

export default Dashboard;
