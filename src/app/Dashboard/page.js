/** @format */
"use client";

import React, { useEffect, useState, useContext } from "react";
import SideBarComponent from "../../../components/SideBar.component";
import { UserContext } from "../../../context/user.context";
import { ref as dbRef, get } from "firebase/database";
import { database } from "../../../firebase.config";
import TypingEffect from "../../../components/TypingEffect"; 



const quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
  },
  {
    text: "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
  },
  {
    text: "Opportunities don't happen, you create them.",
    author: "Chris Grosser",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    author: "Zig Ziglar",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "The only place where success comes before work is in the dictionary.",
    author: "Vidal Sassoon",
  },
];

const Dashboard = () => {
  const { savedUser } = useContext(UserContext);
  const [billsData, setBillsData] = useState([]); // All bill data
  const [teacherSummary, setTeacherSummary] = useState([]); // Summary of bills by teacher
  const [recentActivity, setRecentActivity] = useState([]); // Recent activity feed
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [totalBills, setTotalBills] = useState(0); // Total number of bills
  const [pendingBills, setPendingBills] = useState(0); // Bills pending for approval
  const [randomQuote, setRandomQuote] = useState({ text: "", author: "" }); // Selected random quote

  useEffect(() => {
    // Select a random quote from the array
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    setRandomQuote(quotes[quoteIndex]);
  }, []);

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

          setBillsData(billsArray);
          generateTeacherSummary(billsArray); // Generate summary after fetching data

          if (savedUser.roles.teacher === true) {
            const teacherBills = billsArray.filter(
              (bill) => bill.email === savedUser.email
            );

            setTotalBills(teacherBills.length); // Set total number of submitted bills

            const approvedBills = teacherBills.filter(
              (bill) => bill.ChairmanApproved || bill.AuthorityApproved
            );
            const pendingBills = teacherBills.filter(
              (bill) => !bill.ChairmanApproved && !bill.AuthorityApproved
            );

            setPendingBills(pendingBills.length); // Set the count for pending bills
          } else {
            setTotalBills(billsArray.length);

            const pendingBills = billsArray.filter(
              (bill) => !bill.ChairmanApproved && !bill.AuthorityApproved
            );
            setPendingBills(pendingBills.length);
          }
        } else {
          console.log("No bill data available");
        }
      } catch (error) {
        console.error("Error fetching bills data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillsData();
  }, [savedUser]);

  const generateTeacherSummary = (bills) => {
    const summary = bills.reduce((acc, bill) => {
      const teacherName = bill.name;
      if (acc[teacherName]) {
        acc[teacherName]++;
      } else {
        acc[teacherName] = 1;
      }
      return acc;
    }, {});

    const summaryArray = Object.keys(summary).map((teacherName) => ({
      teacherName,
      billCount: summary[teacherName],
    }));

    // Sort the summary array by billCount in descending order
    summaryArray.sort((a, b) => b.billCount - a.billCount);

    setTeacherSummary(summaryArray);
};


  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const dbRefPath = dbRef(database, "formSubmissions/");
        const snapshot = await get(dbRefPath);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const billsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          const sortedActivity = billsArray.sort((a, b) => {
            const convertTo24Hour = (time) => {
              const [timeString, modifier] = time.split(" ");
              let [hours, minutes, seconds] = timeString.split(":").map(Number);
              if (modifier === "PM" && hours < 12) {
                hours += 12;
              } else if (modifier === "AM" && hours === 12) {
                hours = 0;
              }
              return [hours, minutes, seconds];
            };
            const [aHours, aMinutes, aSeconds] = convertTo24Hour(a.time);
            const [bHours, bMinutes, bSeconds] = convertTo24Hour(b.time);
            const aTimestamp = new Date(
              `20${a.date.split("/")[2]}`,
              a.date.split("/")[0] - 1,
              a.date.split("/")[1],
              aHours,
              aMinutes,
              aSeconds
            ).getTime();
            const bTimestamp = new Date(
              `20${b.date.split("/")[2]}`,
              b.date.split("/")[0] - 1,
              b.date.split("/")[1],
              bHours,
              bMinutes,
              bSeconds
            ).getTime();
            return bTimestamp - aTimestamp; // Sort in descending order
          });
          setRecentActivity(sortedActivity);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  
  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div style={{ display: "flex", flexDirection: "row", height: "98vh" }}>
      <SideBarComponent />
      <div style={{ padding: 20, width: "80%", overflowY: "auto" }}>
        <h1>Welcome</h1>
      {/* Typing animation for the message */}
      <div style={{height:"50px"}}><TypingEffect /></div>
        {/* Statistics cards */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={cardStyle}>
            <p style={labelStyle}>Total Submitted Bills:</p>
            <h2 style={amountStyle}>{totalBills} bill</h2>
          </div>
          <div style={cardStyle}>
            <p style={labelStyle}>Pending Bills:</p>
            <h2 style={amountStyle}>{pendingBills} bill</h2>
          </div>
        </div>

        {/* Motivational Quote */}
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <h2 style={{ fontStyle: "italic", color: "#555" }}>
            "{randomQuote.text}"
          </h2>
          <p style={{ fontWeight: "bold" }}>– {randomQuote.author}</p>
        </div>

        {/* Flex container for Summary and Recent Activity sections */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap:"20px"}}>
          {/* Summary table for bills */}
          <div style={{ width: "48%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Bill Summary by Teacher</h2>
            <table style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Teacher Name</th>
                  <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Submitted Bills</th>
                </tr>
              </thead>
              <tbody>
                {teacherSummary.length === 0 ? (
                  <tr>
                    <td colSpan="2" style={{ padding: "8px", textAlign: "center" }}>No bill summary available</td>
                  </tr>
                ) : (
                  teacherSummary.map((teacher) => (
                    <tr key={teacher.teacherName}>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>{teacher.teacherName}</td>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>{teacher.billCount} bill</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Recent Activity section */}
          <div style={{ width: "48%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Recent Activity</h2>
            <ul style={{ listStyleType: "none", padding: "0" }}>
              {recentActivity.length === 0 ? (
                <li style={{ padding: "8px", textAlign: "center" }}>No recent activity available</li>
              ) : (
                recentActivity.map((activity) => (
                  <li key={activity.id} style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>
                    {activity.name} submitted a bill on {activity.date} at {activity.time}.
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles for cards
const cardStyle = {
  backgroundColor: "#4CAF50",
  color: "#fff",
  padding: "20px",
  borderRadius: "8px",
  margin: "0 10px",
  width: "30%",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
};

const labelStyle = {
  fontSize: "1rem",
  marginBottom: "5px"
};

const amountStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold"
};
export default Dashboard;
