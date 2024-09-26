/** @format */
"use client";

import React, { useContext, useEffect, useState } from "react";
import SideBarComponent from "../../../components/SideBar.component";
import { UserContext } from "../../../context/user.context";
import { useRouter } from "next/navigation";
import { ref as dbRef, onValue } from "firebase/database";
import { database } from "../../../firebase.config";

function AllApprovedBill() {
  const { savedUser } = useContext(UserContext);
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [approvedBills, setApprovedBills] = useState([]); // Holds approved bill data

  // Set isClient to true after the component has mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !savedUser) {
      router.replace("/");
    }
  }, [isClient, savedUser, router]);

  // Fetch real-time approved bill data from Firebase
  useEffect(() => {
    if (isClient && savedUser) {
      const dbRefPath = dbRef(database, "formSubmissions/");

      // Listening for changes in real-time
      const unsubscribe = onValue(dbRefPath, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const approvedBillsArray = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((bill) => bill.ChairmanApproved || bill.AuthorityApproved); // Filter only approved bills

           // Filtering logic based on the role
          if (savedUser.roles.teacher) {
            // Teachers can only see their own bills that are approved
            const teacherBills = approvedBillsArray.filter(
              (bill) => bill.email === savedUser.email // Filter by teacher's email
            );
            setApprovedBills(teacherBills);
          } else {
            // Chairman and authority can see all approved bills
            setApprovedBills(approvedBillsArray);
          }
        } else {
          setApprovedBills([]); // If no data exists, set approvedBills to an empty array
        }
      });

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [isClient, savedUser]);

  // Render nothing until the component has mounted on the client side
  if (!isClient || !savedUser) {
    return null;
  }

  return (
    <div
      style={{ padding: 0, margin: 0, display: "flex", flexDirection: "row",height:"100vh"  }}>
      <SideBarComponent />
      <div style={{ padding: 20, margin: 0, width: "70%", overflowY: "auto", maxHeight: "100vh"}}>
        <h1>All Approved Bill</h1>
        {approvedBills.length > 0 ? (
          <div style={{ overflowY: "auto", maxHeight: "80vh" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
              overflowY: "auto", maxHeight: "80vh"
            }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  No
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Date
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Time
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  PDF View
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Approval Status
                </th>
              </tr>
            </thead>
            <tbody>
              {approvedBills.map((bill, index) => (
                <tr key={bill.id}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {index + 1}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {bill.date}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    {bill.time}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    <a
                      href={bill.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "5px",
                        textDecoration: "none",
                        display: "inline-block",
                      }}>
                      View PDF
                    </a>
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>
                    <div>
                      <span
                        style={{
                          padding: "3px",
                          display: "inline-block",
                        }}>
                        {bill.ChairmanApproved ? (
                          <>
                            {" "}
                            <i className="fas fa-check" /> ✅ Chairman Approved{" "}
                          </>
                        ) : (
                          <>
                            {" "}
                            <i className="fas fa-times" /> ❌ Chairman Approved{" "}
                          </>
                        )}
                      </span>
                      <span
                        style={{
                          padding: "3px",
                          display: "inline-block",
                        }}>
                        {bill.AuthorityApproved ? (
                          <>
                            {" "}
                            <i className="fas fa-check" /> ✅ Authority Approved{" "}
                          </>
                        ) : (
                          <>
                            {" "}
                            <i className="fas fa-times" /> ❌ Authority Approved{" "}
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>) : (
          <p>There has no approved PDF to view.</p> // Message when no approved bills exist
        )}
      </div>
    </div>
  );
}

export default AllApprovedBill;
