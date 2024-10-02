/** @format */
"use client";
import React, { useContext, useEffect, useState } from "react";
import SideBarComponent from "../../../components/SideBar.component";
import { UserContext } from "../../../context/user.context";
import { useRouter } from "next/navigation";
import { ref as dbRef, get, update, remove } from "firebase/database";
import { database } from "../../../firebase.config";

function AllBill() {
  const { savedUser } = useContext(UserContext);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [billsData, setBillsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !savedUser) {
      router.replace("/");
    }
  }, [isMounted, savedUser, router]);

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
          // Log fetched bills
      console.log("Fetched Bills: ", billsArray);
      if (savedUser.roles.teacher === true) {
        const teacherBills = billsArray.filter(
          (bill) => bill.email === savedUser.email
        );
        console.log("Filtered Teacher Bills: ", teacherBills);
        setBillsData(teacherBills);
      } else {
        // For chairman and authority, show all bills
        setBillsData(billsArray);
      }
    } else {
      console.log("No data available");
    }

      } catch (error) {
        console.error("Error fetching bills data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isMounted && savedUser) {
      fetchBillsData();
    }
  }, [isMounted, savedUser]);

  const handleApproval = async (id) => {
    // Check if user is not a teacher before allowing approval
    if (savedUser.roles.teacher !== true) {
      if (savedUser.roles.chairman === true) {
        try {
          const dbRefPath = dbRef(database, `formSubmissions/${id}`);
          const currentChairmanApproved = billsData.find(
            (bill) => bill.id === id
          ).ChairmanApproved;
          await update(dbRefPath, {
            ChairmanApproved: !currentChairmanApproved,
          });
          setBillsData((prevBills) =>
            prevBills.map((bill) =>
              bill.id === id
                ? { ...bill, ChairmanApproved: !currentChairmanApproved }
                : bill
            )
          );
        } catch (error) {
          console.error("Error updating Chairman approval status:", error);
        }
      } else if (savedUser.roles.authority === true) {
        try {
          const dbRefPath = dbRef(database, `formSubmissions/${id}`);
          const currentAuthorityApproved = billsData.find(
            (bill) => bill.id === id
          ).AuthorityApproved;
          await update(dbRefPath, {
            AuthorityApproved: !currentAuthorityApproved,
          });
          setBillsData((prevBills) =>
            prevBills.map((bill) =>
              bill.id === id
                ? { ...bill, AuthorityApproved: !currentAuthorityApproved }
                : bill
            )
          );
        } catch (error) {
          console.error("Error updating Authority approval status:", error);
        }
      } else {
        setShowModal(true); // Show modal when user clicks the button
      }
    } else {
      setShowModal(true); // Show modal when teacher clicks the button
    }
  };

  const handleDelete = async (id) => {
    try {
      const dbRefPath = dbRef(database, `formSubmissions/${id}`);
      await remove(dbRefPath);
      setBillsData((prevBills) => prevBills.filter((bill) => bill.id !== id));
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (!isMounted || !savedUser) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{ padding: 0, margin: 0, display: "flex", flexDirection: "row",height:"100vh" }}>
      <SideBarComponent />
      <div style={{ padding: 20, margin: 0, width: "70%", overflowY: "auto", maxHeight: "100vh" }}>
        <h1>All Bills</h1>
        {billsData.length === 0 ? (
          <p>No bills available</p>
        ) : (
          <div style={{ overflowY: "auto", maxHeight: "80vh"  }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
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
                    Account
                  </th>
                 
                  <th style={{ border: "1px solid black", padding: "8px" }}>
                    PDF View
                  </th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>
                    Approval
                  </th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {billsData.map((bill, index) => (
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
                      {bill.name}
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
                      {savedUser.roles.teacher !== true ? (
                        <button
                          onClick={() => handleApproval(bill.id)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "5px",
                            backgroundColor:
                              bill.ChairmanApproved || bill.AuthorityApproved
                                ? "green"
                                : "red",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                          }}
                          aria-label={`Toggle approval for bill ${index + 1}`}>
                          {bill.ChairmanApproved || bill.AuthorityApproved
                            ? "Approved"
                            : "Approve"}
                        </button>
                      ) : (
                        <button
                          style={{
                            padding: "8px 16px",
                            borderRadius: "5px",
                            backgroundColor: "grey",
                            color: "white",
                            border: "none",
                            cursor: "not-allowed",
                          }}
                          onClick={() => setShowModal(true)}>
                          Not Allowed
                        </button>
                      )}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "5px",
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                        aria-label={`Delete bill ${index + 1}`}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for teachers */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px 50px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}>
          <h2>You are not allowed to approve this bill</h2>
          <button
            onClick={closeModal}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "grey",
              color: "white",
              borderRadius: "5px",
              border: "none",
            }}>
            Close
          </button>
        </div>
      )}

      {/* Overlay for modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={closeModal}
        />
      )}
    </div>
  );
}

export default AllBill;