"use client";

import React, { useContext, useState, useEffect } from "react";
import { color } from "./Color";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/user.context";

const SideBarComponent = () => {
  const router = useRouter();
  const { savedUser, setSavedUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false); // Track loading state

  const handleLogout = () => {
    router.push("/");
    localStorage.removeItem("savedUser");
    setSavedUser("");
  };

  const handleNavigation = (path) => {
    setLoading(true); // Start loading when navigating
    router.push(path);
  };

  useEffect(() => {
    // Listen for route changes to turn off the loading state
    const handleRouteChangeComplete = () => setLoading(false);

    // This event fires when route change is complete
    router.events?.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      // Clean up the event listener when the component unmounts
      router.events?.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);

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
        }}
      >
        <li
          style={{
            marginTop: "80px",
            color: color.white,
            cursor: "pointer",
          }}
          onClick={() => handleNavigation("/Dashboard")}
        >
          Dashboard
        </li>
        <li
          style={{
            color: color.white,
            cursor: "pointer",
          }}
          onClick={() => handleNavigation("/userProfile")}
        >
          Teacher&apos;s Information
        </li>

        <li
          style={{
            color: color.white,
            cursor: "pointer",
          }}
          onClick={() => handleNavigation("/allApprovedBill")}
        >
          All Approved Bill
        </li>

        {(savedUser?.roles?.teacher || savedUser?.roles?.chairman) && (
          <li
            style={{
              color: color.white,
              cursor: "pointer",
            }}
            onClick={() => handleNavigation("/newBill")}
          >
            Enter New Bill
          </li>
        )}

        <li
          style={{
            color: color.white,
            cursor: "pointer",
          }}
          onClick={() => handleNavigation("/allBill")}
        >
          All Submitted Bill
        </li>

        <li
          style={{
            color: color.white,
            cursor: "pointer",
          }}
          onClick={() => handleNavigation("/RemunerationRateSheet")}
        >
          Remuneration Rate Sheet
        </li>

        <li
          style={{
            color: color.white,
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Logout
        </li>
      </ul>

      {/* Show loading spinner or text */}
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} /> {/* Spinner */}
          <span style={{ color: color.white }}>Loading...</span>
        </div>
      )}
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
  loadingContainer: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "10px",
  },
};

// Add inline spinner animation
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (typeof window !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}
