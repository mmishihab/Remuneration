/** @format */
"use client";

import React, { useContext, useEffect, useState } from "react";
import SideBarComponent from "../../../components/SideBar.component";
import { UserContext } from "../../../context/user.context";
import { useRouter } from "next/navigation";
import { ref as dbRef, get } from "firebase/database";
import { database } from "../../../firebase.config";
import styles from "./Dashboard.module.css"
import { color } from "../../../components/Color";

const Dashboard = () => {
  const { savedUser } = useContext(UserContext);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [totalBills, setTotalBills] = useState(0);  // Total number of bills
  const [pendingBills, setPendingBills] = useState(0);  // Bills pending for approval
  const [totalEarnings, setTotalEarnings] = useState(0);  // Total earnings from approved bills

  // Set isClient to true after the component has mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !savedUser) {
      router.replace("/");
    }
  }, [isClient, savedUser, router]);
  useEffect(() => {
    const fetchBillsData = async () => {
      try {
        const dbRefPath = dbRef(database, "formSubmissions/");
        const snapshot = await get(dbRefPath);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const billsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          if (savedUser.roles.teacher === true) {
            const teacherBills = billsArray.filter(
              (bill) => bill.email === savedUser.email
            );

            setTotalBills(teacherBills.length);  // Set total number of submitted bills

            const approvedBills = teacherBills.filter(
              (bill) => bill.ChairmanApproved || bill.AuthorityApproved
            );
            const pendingBills = teacherBills.filter(
              (bill) => !bill.ChairmanApproved && !bill.AuthorityApproved
            );

            setPendingBills(pendingBills.length);  // Set the count for pending bills

            // Assuming each bill has an `amount` field for total earnings calculation
            const earnings = approvedBills.reduce(
              (sum, bill) => sum + (bill.amount || 0),
              0
            );
            setTotalEarnings(earnings);  // Set the total earnings from approved bills
          } else {
            // If the user is not a teacher, count all bills
            setTotalBills(billsArray.length);

            const pendingBills = billsArray.filter(
              (bill) => !bill.ChairmanApproved && !bill.AuthorityApproved
            );
            setPendingBills(pendingBills.length);

            const approvedBills = billsArray.filter(
              (bill) => bill.ChairmanApproved || bill.AuthorityApproved
            );

            const earnings = approvedBills.reduce(
              (sum, bill) => sum + (bill.totalAmount || 0),
              0
            );
            setTotalEarnings(earnings);
          }
        }
      } catch (error) {
        console.error("Error fetching bills data:", error);
      }
    };

    if (isClient && savedUser) {
      fetchBillsData();
    }
  }, [isClient, savedUser]);

  // Render nothing until the component has mounted on the client side
  if (!isClient || !savedUser) {
    return null;
  }

  console.log(savedUser);

  return (
    <div style={{ display: "flex" }}>
      <SideBarComponent />
      <div style={{ padding: "20px", width: "100%", boxSizing: "border-box" }}>
        <h1 style={{ marginBottom: "10px" }}>Welcome, <strong>{savedUser.username}</strong></h1>
        <p style={{ marginBottom: "20px", fontSize: "16px" }}>
          Email: <strong>{savedUser.email}</strong>
        </p>
        <p style={{ marginBottom: "40px", fontSize: "16px" }}>
          Role: <strong>{savedUser.roles.teacher ? "Teacher" : savedUser.roles.chairman ? "Chairman" : "Authority"}</strong>
        </p>

        {/* User Information Section */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ ...cardStyle, marginRight: "10px" }}>
            <p style={labelStyle}>Total Submitted Bills:</p>
            <h2 style={amountStyle}>{totalBills} bill</h2>
          </div>
          <div style={cardStyle}>
            <p style={labelStyle}>Pending Bills:</p>
            <h2 style={amountStyle}>{pendingBills} bill</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles for card-like components
const cardStyle = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  padding: '15px',
  width: '30%',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center',
};

const labelStyle = {
  fontSize: '20px',
  color: '#555',
};

const amountStyle = {
  fontSize: '30px',
  fontWeight: 'bold',
  margin: '5px 0 0 0',
  color:  '#336',

};

export default Dashboard;