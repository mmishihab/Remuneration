/** @format */

"use client";

import React, { useContext } from "react";
import { color } from "./Color";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/user.context";

const SideBarComponent = () => {
  const router = useRouter();
  const { savedUser, setSavedUser } = useContext(UserContext);

  const handleLogout = () => {
    router.push("/");
    localStorage.removeItem("savedUser");
    setSavedUser("");
  };

  return (
    <div style={styles.sidebar}>
      <ul
        style={{
          listStyle: "none",
          color: color.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "start",
          gap: "20px",
          height: "100%",
          fontSize: 20,
          fontWeight: 400,
          paddingLeft: "15%",
        }}>
        <li
          style={{
            marginTop: "80px",
            color: color.white,
            cursor: "pointer",
          }}
          onClick={() => router.push("/Dashboard")}>
          Dashboard
        </li>
        <li
          style={{
            color: color.white,
            cursor: "pointer",
          }}
          onClick={() => router.push("/userProfile")}>
          User Profile
        </li>

        <li
          style={{
            color: color.white,
            cursor: "pointer",
          }}
          onClick={() => router.push("/allApprovedBill")}>
          All Approved Bill
        </li>

        {(savedUser?.roles?.teacher || savedUser?.roles?.chairman) && (
  <li
    style={{
      color: color.white,
      cursor: "pointer",
    }}
    onClick={() => router.push("/newBill")}
  >
    Enter New Bill
  </li>
)}

        <li
          style={{
            color: color.white,
            cursor: "pointer",
          }}
          onClick={() => router.push("/allBill")}>
          ALl Submitted Bill
        </li>

        <li
          style={{
            color: color.white,
            cursor: "pointer",
          }}
          onClick={() => router.push("/RemunerationRateSheet")}>
          Remuneration Rate Sheet
        </li>
        <li
          style={{
            color: color.white,
            cursor: "pointer",
          }}
          onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default SideBarComponent;

const styles = {
  sidebar: {
    backgroundColor: color.brown,
    height: "100vh",
    width: "30%",
    overflowY: "hidden",
  },
};
