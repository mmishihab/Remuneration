import React, { useEffect, useState } from "react";

const AlertComponent = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose(); // Close the alert after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;
  const getBackgroundColor = (alertType) => {
    switch (alertType) {
      case "delete":
        return "#f44336"; // Red for deleted alert
      case "add":
        return "#008000"; // Green for add new teacher
      case "update":
        return "#FFFF00"; // Yellowish for updating teacher
      case "error":
        return "#f44336"; // Yellowish for updating teacher
      default:
        return "#333"; // Default gray if type doesn't match
    }
  };

  const alertStyle = {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    padding: "10px 20px",
    backgroundColor: getBackgroundColor(type),
    // backgroundColor: type === "success" ? "#4CAF50" : "#f44336", // Success = green, error = red
    color: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "250px",
    zIndex: 9999,
  };

  const closeButtonStyle = {
    marginLeft: "10px",
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "16px",
  };

  return (
    <div style={alertStyle}>
      <span>{message}</span>
      <button onClick={() => setVisible(false)} style={closeButtonStyle}>
        &times;
      </button>
    </div>
  );
};

export default AlertComponent;
