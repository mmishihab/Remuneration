/** @format */
"use client";

import React, { useContext, useEffect, useState } from "react";
import SideBarComponent from "../../../components/SideBar.component";
import { UserContext } from "../../../context/user.context";
import { useRouter } from "next/navigation";
import { database } from "../../../firebase.config"; // Ensure this path is correct
import { ref, set, onValue, remove } from "firebase/database";
import AlertComponent from "../../../components/AlertComponent";

function UserProfile() {
  const { savedUser, setFormData } = useContext(UserContext);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [banglaName, setBanglaName] = useState("");
  const [role, setRole] = useState("");
  const [teacherId, setTeacherId] = useState(null); // For updating
  const [selectedTeacher, setSelectedTeacher] = useState(null); // For selected teacher
  const [courseNo, setCourseNo] = useState("");
  const [examHours, setExamHours] = useState("");
  const [numberOfStudents, setNumberOfStudents] = useState("");

  const [alertMessage, setAlertMessage] = useState(null); // State to handle alerts
  const [alertType, setAlertType] = useState(""); // Success or error
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !savedUser) {
      router.replace("/");
    }
  }, [isClient, savedUser, router]);

  // Fetch teachers from the Realtime Database
  useEffect(() => {
    const teachersRef = ref(database, "teachers");
    onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      const teacherList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setTeachers(teacherList);
    });
  }, []);

  // Update formData based on selected teacher
 // Update formData based on selected teacher and role
useEffect(() => {
  if (selectedTeacher) {
    // Define job information based on the selected role
    let jobs = [];
    
    if (selectedTeacher.role === "teacher") {
      jobs = [
        {
          jobName: "Question Paper Formulation",
          subCategory: "Theoretical Course",
          courseNo: courseNo || "N/A",
          examHours: examHours || "N/A",
          numberOfStudents: numberOfStudents || "N/A",
          subCategorySectors: "Honours/Masters",
        },
        {
          jobName: "Question Paper Writing",
          subCategory: "Handwritten",
          courseNo: courseNo || "N/A",
          examHours: examHours || "N/A",
          numberOfStudents: numberOfStudents || "N/A",
          // subCategorySectors: "Honours/Masters",
        },
        // Add more jobs for the teacher if needed
      ];
    } else if (selectedTeacher.role === "chairman") {
      jobs = [
        {
          jobName: "Test Answer Key",
          subCategory: "Theoretical Course",
          courseNo: courseNo || "N/A",
          examHours: examHours || "N/A",
          numberOfStudents: numberOfStudents || "N/A",
          subCategorySectors: "Honours/Masters",
        },
        // Add more jobs for the chairman if needed
      ];
    }

    const dynamicUserData = {
      name: selectedTeacher.username,
      email: selectedTeacher.email,
      role: selectedTeacher.role,
      nameBangla: selectedTeacher.banglaName,
      phone: selectedTeacher.mobileNo,
      address: selectedTeacher.address,
      subject: "EEE",
      examYear: "202",
      jobs: jobs, // Use the jobs array based on the role
    };

    setFormData(dynamicUserData);
  }
}, [selectedTeacher, setFormData, courseNo, examHours, numberOfStudents]);



  // Function to handle role selection
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setSelectedTeacher(null); // Reset selected teacher when role changes
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setFullName(teacher.fullName);
    setAddress(teacher.address);
    setMobileNo(teacher.mobileNo);
    setBanglaName(teacher.banglaName);
    setTeacherId(teacher.id);
    if (teacher.jobs && teacher.jobs.length > 0) {
      const job = teacher.jobs[0]; // Assuming you're interested in the first job
      setCourseNo(job.courseNo || "");
      setExamHours(job.examHours || "");
      setNumberOfStudents(job.numberOfStudents || "");
    } else {
      // Reset to empty if no job exists
      setCourseNo("");
      setExamHours("");
      setNumberOfStudents("");
    }
  };

  // Function to add or update teacher in Firebase
  const addOrUpdateTeacher = () => {
    const teachersRef = ref(database, `teachers/${teacherId || Date.now()}`);
    set(teachersRef, {
      fullName,
      address,
      mobileNo,
      banglaName,
      role,
      username: fullName.toLowerCase().replace(/\s+/g, "_"),
      email: `${fullName.toLowerCase().replace(/\s+/g, "_")}@example.com`,
      jobs: [
        {
          jobName: "Question Paper Formulation",
          subCategory: "Theoretical Course",
          courseNo: courseNo || "N/A",
          examHours: examHours || "N/A",
          numberOfStudents: numberOfStudents || "N/A",
          subCategorySectors: "Honours/Masters",
        },
      ],
    })
      .then(() => {
        if (teacherId) {
          setAlertMessage("Teacher updated successfully!");
          setAlertType("update"); // Alert type for updating
        } else {
          setAlertMessage("Teacher added successfully!");
          setAlertType("add"); // Alert type for adding
        }
        // alert(teacherId ? "Teacher updated successfully!" : "Teacher added successfully!");
        setTeacherId(null);
        setFullName("");
        setAddress("");
        setMobileNo("");
        setBanglaName("");
        setRole("");
        setCourseNo(""); // Reset input fields
        setExamHours(""); 
        setNumberOfStudents(""); 
      })
      .catch((error) => {
        setAlertMessage("Error updating teacher.");
        setAlertType("error");
        console.error("Error updating teacher: ", error);
      });
  };

  // Function to delete a teacher from Firebase
  const deleteTeacher = (id) => {
    const teachersRef = ref(database, `teachers/${id}`);
    remove(teachersRef)
      .then(() => {
        // alert("Teacher deleted successfully!");
        setAlertMessage("Teacher deleted successfully!");
        setAlertType("delete");
      })
      .catch((error) => {
        setAlertMessage("Error deleting teacher.");
        setAlertType("error");
        console.error("Error deleting teacher: ", error);
      });
  };

  if (!isClient || !savedUser) {
    return null;
  }

  return (
    <div style={styles.container}>
      <SideBarComponent />
      <div style={styles.profileContainer}>
  <h1 style={styles.title}>Teacher&apos;s Information</h1>
  <div style={styles.formContainer}>
    <input
      type="text"
      placeholder="Teacher's Full Name"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      style={styles.input}
    />
    <input
      type="text"
      placeholder="Name in Bangla"
      value={banglaName}
      onChange={(e) => setBanglaName(e.target.value)}
      style={styles.input}
    />
    <input
      type="text"
      placeholder="Teacher's Address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      style={styles.input}
    />
    <input
      type="tel"
      placeholder="Teacher's Mobile No."
      value={mobileNo}
      onChange={(e) => setMobileNo(e.target.value)}
      style={styles.input}
    />
    <input
      type="text"
      placeholder="Course Number"
      value={courseNo}
      onChange={(e) => setCourseNo(e.target.value)}
      style={styles.input}
    />
    <select
      value={examHours}
      onChange={(e) => setExamHours(e.target.value)}
      style={styles.select}
    >
      <option value="">Select Exam Hours</option>
      <option value="4">4</option>
      <option value="3">3</option>
      <option value="2 to 2.5">2 to 2.5</option>
    </select>
    <input
      type="number"
      placeholder="Number of Students"
      value={numberOfStudents}
      onChange={(e) => setNumberOfStudents(e.target.value)}
      style={styles.input}
    />
    <select value={role} onChange={handleRoleChange} style={styles.select}>
      <option value="">Select Role</option>
      <option value="teacher">Teacher</option>
      <option value="chairman">Chairman</option>
    </select>

    <button onClick={addOrUpdateTeacher} style={styles.button}>
      {teacherId ? "Update Teacher" : "Add Teacher"}
    </button>
  </div>
  <h2 style={styles.title}>List of Teachers</h2>
<div style={styles.tableContainer}>
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.tableHeader}>Sl. No.</th>
        <th style={styles.tableHeader}>Teacher&apos;s Name</th>
        <th style={styles.tableHeader}>Course No</th>
        <th style={styles.tableHeader}>Address</th>
        <th style={styles.tableHeader}>Mobile No</th>
        <th style={styles.tableHeader}>Role</th>
        <th style={styles.tableHeader}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {teachers.map((teacher, index) => (
        <tr key={teacher.id} style={styles.tableRow}>
          <td style={styles.tableCell}>{index + 1}</td>
          <td style={styles.tableCell}>{teacher.fullName}</td>
          <td style={styles.tableCell}>{teacher.jobs && teacher.jobs.length > 0 && teacher.jobs[0].courseNo ? teacher.jobs[0].courseNo : "No Course"}</td>
          <td style={styles.tableCell}>{teacher.address}</td>
          <td style={styles.tableCell}>{teacher.mobileNo}</td>
          <td style={styles.tableCell}>{teacher.role}</td>
          <td style={styles.tableCell}>
            <div style={styles.actionButtons}>
              <button onClick={() => handleTeacherSelect(teacher)} style={{ ...styles.actionButton, backgroundColor: "#4CAF50", color: "white" }}>Edit</button>
              <button onClick={() => deleteTeacher(teacher.id)} style={{ ...styles.actionButton, backgroundColor: "#f44336", color: "white" }}>Delete</button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
 {/* Alert System */}
 {alertMessage && (
          <AlertComponent
            message={alertMessage}
            type={alertType}
            onClose={() => setAlertMessage(null)}
          />
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "row",
    height: "95vh", // Ensure it takes full height
  },
  profileContainer: {
    padding: "20px",
    margin: 0,
    width: "70%",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    flexGrow: 1, // Allow it to grow and fill space
    overflowY: "auto", // Enable vertical scrolling
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  formContainer: {
    marginBottom: "20px",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
  listTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  teacherList: {
    listStyleType: "none",
    padding: 0,
  },
  teacherItem: {
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "4px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    marginLeft: "10px",
    padding: "5px 10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "#fff",
    fontSize: "12px",
    cursor: "pointer",
  },
  tableContainer: {
    overflowX: "auto", // Allows horizontal scrolling if the table is too wide
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff", // White background for the table
  },
  tableHeader: {
    borderBottom: "2px solid #ddd",
    padding: "10px",
    backgroundColor: "#e898f5", // Header background color
    color: "#fff", // Header text color
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
    transition: "background-color 0.2s", // Smooth transition for hover effect
  },
  tableRowHover: {
    backgroundColor: "#f1f1f1", // Light gray background on hover
  },
  tableCell: {
    padding: "10px",
    textAlign: "left",
    fontSize: "14px", // Adjust font size
  },
  actionButtons: {
    display: "flex",
    gap: "10px", // Space between action buttons
  },
  actionButton: {
    padding: "5px 10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "12px",
    cursor: "pointer",
  }, 
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333", // Dark text color for title
    marginBottom: "15px",
    textAlign: "center",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px", // Space between input fields
  },
  input: {
    padding: "12px 15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  select: {
    padding: "12px 15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "12px 15px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff", // Button color
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3", // Darker shade on hover
  },
};


export default UserProfile;
