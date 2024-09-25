/** @format */
"use client";

import React, { useContext, useEffect, useState } from "react";
import SideBarComponent from "../../../components/SideBar.component";
import { UserContext } from "../../../context/user.context";
import { useRouter } from "next/navigation";

function UserProfile() {
  const { savedUser } = useContext(UserContext);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // Track whether the component is mounted

  useEffect(() => {
    setIsClient(true); // Component is mounted
  }, []);

  useEffect(() => {
    if (isClient && !savedUser) {
      router.replace("/"); // Redirect only after the component has mounted
    }
  }, [isClient, savedUser, router]);

  // Render nothing until the component has mounted on the client side
  if (!isClient || !savedUser) {
    return null;
  }

  return (
    <div
      style={{ padding: 0, margin: 0, display: "flex", flexDirection: "row" }}>
      <SideBarComponent />
      <div style={{ padding: 0, margin: 0, width: "70%" }}>
        <h1>User Profile</h1>
      </div>
    </div>
  );
}

export default UserProfile;
