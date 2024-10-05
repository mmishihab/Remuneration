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
  const [courseNoP, setCourseNoP] = useState("");
  const [examHours, setExamHours] = useState("");
  const [numberOfStudents, setNumberOfStudents] = useState("");

  const [alertMessage, setAlertMessage] = useState(null); // State to handle alerts
  const [alertType, setAlertType] = useState(""); // Success or error
  // State to store multiple courses
  const [courses, setCourses] = useState([
    { courseNo: "",courseNoP: "", examHours: "", numberOfStudents: "" }
  ]);
  const [isEditing, setIsEditing] = useState(false); // To track editing state
  
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
          paperType:"Full",
        },
        {
          jobName: "Question Paper Formulation",
          subCategory: "Tutorial",
          courseNo: courseNo || "N/A",
          noOfDay:"3",
          paperType:"Half",
        },
        {
          jobName: "Test Answer Key",
          subCategory: "Theoretical Course",
          courseNo: courseNo || "N/A",
          examHours: examHours || "N/A",
          numberOfStudents: numberOfStudents || "N/A",
          subCategorySectors: "Honours/Masters",
          paperType:"Half",
        },
        {
          jobName: "Test Answer Key",
          subCategory: "Tutorial",
          courseNo: courseNo || "N/A",
          noOfDay:"3",
          paperType:"Full",
        },
        {
          jobName: "Inspector Honorarium (Per Tutorial)",
          subCategory: "FixedValue",
          numberOfStudents: numberOfStudents || "N/A",
          courseNo: courseNo || "N/A"
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
          paperType:"Full",
        },
        // Add more jobs for the chairman if needed
      ];
    }
    else if (selectedTeacher.role === "teacherP") {
      jobs = [
        {
          jobName: "Question Paper Formulation",
          subCategory: "Theoretical Course",
          courseNo: courseNo || "N/A",
          examHours: examHours || "N/A",
          numberOfStudents: numberOfStudents || "N/A",
          subCategorySectors: "Honours/Masters",
          paperType:"Full",
        },
        {
          jobName: "Question Paper Formulation",
          subCategory: "Practical Course",
          courseNo: courseNoP || "N/A",
        },
        {
          jobName: "Question Paper Formulation",
          subCategory: "Tutorial",
          courseNo: courseNo || "N/A",
          noOfDay:"3",
          paperType:"Half",
        },
        {
          jobName: "Test Answer Key",
          subCategory: "Theoretical Course",
          courseNo: courseNo || "N/A",
          examHours: examHours || "N/A",
          numberOfStudents: numberOfStudents || "N/A",
          subCategorySectors: "Honours/Masters",
          paperType:"Half",
        },
        {
          jobName: "Test Answer Key",
          subCategory: "Tutorial",
          courseNo: courseNo || "N/A",
          noOfDay:"3",
          paperType:"Full",
        },
        {
          jobName: "Inspector Honorarium (Per Tutorial)",
          subCategory: "FixedValue",
          numberOfStudents: numberOfStudents || "N/A",
          courseNo: courseNo || "N/A"
        },
        
        // Add more jobs for the teacher if needed
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
}, [selectedTeacher, setFormData, courseNo, examHours, numberOfStudents,courseNoP]);

 useEffect(() => {
    if (selectedTeacher) {
      setFullName(selectedTeacher.fullName);
      setAddress(selectedTeacher.address);
      setMobileNo(selectedTeacher.mobileNo);
      setBanglaName(selectedTeacher.banglaName);
      setRole(selectedTeacher.role);
      setTeacherId(selectedTeacher.id);
      const teacherCourses = selectedTeacher.jobs || [];
      const mappedCourses = teacherCourses.map((job) => ({
        courseNo: job.courseNo || "",
        examHours: job.examHours || "",
        numberOfStudents: job.numberOfStudents || "",
      }));
      setCourses(mappedCourses);
      const practicalJob = teacherCourses.find((job) => job.subCategory === "Practical Course");
      if (practicalJob) {
        setCourseNoP(practicalJob.courseNo || ""); // Set practical course number
      } else {
        setCourseNoP(""); // Reset if not found
      }
      setIsEditing(true); // Set editing state to true
    }
  }, [selectedTeacher]);

  // Function to handle role selection
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setSelectedTeacher(null); // Reset selected teacher when role changes
    setIsEditing(false); // Reset editing state
  };
  

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setFullName(teacher.fullName);
    setAddress(teacher.address);
    setMobileNo(teacher.mobileNo);
    setBanglaName(teacher.banglaName);
    setTeacherId(teacher.id);
    // If the teacher has associated courses, populate them
  const teacherCourses = teacher.jobs || [];
  const mappedCourses = teacherCourses.map((job) => ({
    courseNo: job.courseNo || "",
    examHours: job.examHours || "",
    numberOfStudents: job.numberOfStudents || ""
  }));
  setCourses(mappedCourses);
  };

  // Function to add or update teacher in Firebase
  // Function to add or update teacher in Firebase
const addOrUpdateTeacher = () => {
  if (!teacherId) {
    // If there's no teacherId, create a new teacher
    const newTeacherId = Date.now();
    const teachersRef = ref(database, `teachers/${newTeacherId}`);
    set(teachersRef, {
      fullName,
      address,
      mobileNo,
      banglaName,
      role,
      username: fullName.toLowerCase().replace(/\s+/g, "_"),
      email: `${fullName.toLowerCase().replace(/\s+/g, "_")}@example.com`,
      jobs: courses.map((course) => ({
        jobName: "Question Paper Formulation",
        subCategory: "Theoretical Course",
        courseNo: course.courseNo || "N/A",
        courseNoP: course.courseNoP || "N/A", // Add courseNoP here for practical courses
        examHours: course.examHours || "N/A",
        numberOfStudents: course.numberOfStudents || "N/A",
        subCategorySectors: "Honours/Masters",
      })),
    })
      .then(() => {
        setAlertMessage("Teacher added successfully!");
        setAlertType("add"); // Alert type for adding
        resetForm(); // Reset form fields after adding
      })
      .catch((error) => {
        setAlertMessage("Error adding teacher.");
        setAlertType("error");
        console.error("Error adding teacher: ", error);
      });
  } else {
    // If teacherId exists, update the existing teacher
    const teachersRef = ref(database, `teachers/${teacherId}`);
    set(teachersRef, {
      fullName,
      address,
      mobileNo,
      banglaName,
      role,
      username: fullName.toLowerCase().replace(/\s+/g, "_"),
      email: `${fullName.toLowerCase().replace(/\s+/g, "_")}@example.com`,
      jobs: courses.map((course) => ({
        jobName: "Question Paper Formulation",
        subCategory: "Theoretical Course",
        courseNo: course.courseNo || "N/A",
        courseNoP: course.courseNoP || "N/A", // Add courseNoP here for practical courses
        examHours: course.examHours || "N/A",
        numberOfStudents: course.numberOfStudents || "N/A",
        subCategorySectors: "Honours/Masters",
      })),
    })
      .then(() => {
        setAlertMessage("Teacher updated successfully!");
        setAlertType("update"); // Alert type for updating
        resetForm(); // Reset form fields after updating
      })
      .catch((error) => {
        setAlertMessage("Error updating teacher.");
        setAlertType("error");
        console.error("Error updating teacher: ", error);
      });
  }
};

  // const addOrUpdateTeacher = () => {
  //   courses.forEach((course) => {
  //     const teachersRef = ref(database, `teachers/${teacherId || Date.now()}_${course.courseNo}`); // Use unique ID for each course
  //     set(teachersRef, {
  //       fullName,
  //       address,
  //       mobileNo,
  //       banglaName,
  //       role,
  //       username: fullName.toLowerCase().replace(/\s+/g, "_"),
  //       email: `${fullName.toLowerCase().replace(/\s+/g, "_")}@example.com`,
  //       jobs: [
  //         {
  //           jobName: "Question Paper Formulation",
  //           subCategory: "Theoretical Course",
  //           courseNo: course.courseNo || "N/A",
  //           courseNoP: course.courseNoP || "N/A", // Add courseNoP here for practical courses
  //           examHours: course.examHours || "N/A",
  //           numberOfStudents: course.numberOfStudents || "N/A",
  //           subCategorySectors: "Honours/Masters"
  //         }
  //       ]
  //     })
  //       .then(() => {
  //         setAlertMessage("Teacher added successfully!");
  //         setAlertType("add"); // Alert type for adding
  //         setFullName("");
  //         setAddress("");
  //         setMobileNo("");
  //         setBanglaName("");
  //         setRole("");
  //         setCourses([{ courseNo: "", examHours: "", numberOfStudents: "" }]); // Reset courses
  //       })
  //       .catch((error) => {
  //         setAlertMessage("Error updating teacher.");
  //         setAlertType("error");
  //         console.error("Error updating teacher: ", error);
  //       });
  //   });
  // };

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
// Function to reset form
const resetForm = () => {
  setFullName("");
  setAddress("");
  setMobileNo("");
  setBanglaName("");
  setRole("");
  setCourses([{ courseNo: "", examHours: "", numberOfStudents: "" }]); // Reset courses
  setSelectedTeacher(null);
  setIsEditing(false); // Reset editing state
};
   // Function to handle input change for a specific course
   const handleCourseChange = (index, field, value) => {
    const updatedCourses = courses.map((course, i) =>
      i === index ? { ...course, [field]: value } : course
    );
    setCourses(updatedCourses);
  };
  
  //  const handleCourseChange = (index, field, value) => {
  //   const updatedCourses = courses.map((course, i) =>
  //     i === index ? { ...course, [field]: value } : course
  //   );
  //   setCourses(updatedCourses);
  // };

  // Function to add a new course input set
  const addAnotherCourse = () => {
    setCourses([...courses, { courseNo: "", examHours: "", numberOfStudents: "" }]);
  };

  // Function to remove a course input set
  const removeCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  
// Conditionally render input fields based on the selected role
const renderInputFields = () => {
  return (
    <>
      {/* Common input fields */}
      {(role === "teacher" || role === "teacherP" || role === "chairman") && (
        <>
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
        </>
      )}

      {/* Input fields for 'teacherP' */}
      {role === "teacherP" && (
          <>
            {courses.map((course, index) => (
              <div key={index} style={styles.courseGroup}>
                {/* Course inputs in a row */}
                <div style={styles.inputRow}>
                  <input
                    type="text"
                    placeholder="Course Number"
                    value={course.courseNo}
                    onChange={(e) => handleCourseChange(index, "courseNo", e.target.value)}
                    style={styles.courseInput}
                  />
                  <select
                    value={course.examHours}
                    onChange={(e) => handleCourseChange(index, "examHours", e.target.value)}
                    style={styles.courseInput}
                  >
                    <option value="">Select Exam Hours</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2 to 2.5">2 to 2.5</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Number of Students"
                    value={course.numberOfStudents}
                    onChange={(e) => handleCourseChange(index, "numberOfStudents", e.target.value)}
                    style={styles.courseInput}
                  />
                  <input
                    type="text"
                    placeholder="Practical Course No. (Theory + Practical Teacher)"
                    value={course.courseNoP}
                    onChange={(e) => handleCourseChange(index, "courseNoP", e.target.value)}
                    style={styles.input}
                  />
                  {/* Remove button for each course */}
                  <button onClick={() => removeCourse(index)} style={styles.removeButton}>
                    Remove Course
                  </button>
                </div>
              </div>
            ))}
            {/* Add button at the bottom */}
            <button onClick={addAnotherCourse} style={styles.addButton}>
              Add Another Course
            </button>
          </>
        )}

      {/* Input fields for 'teacher' */}
      {role === "teacher" && (
          <>
            {courses.map((course, index) => (
              <div key={index} style={styles.courseGroup}>
                {/* Course inputs in a row */}
                <div style={styles.inputRow}>
                  <input
                    type="text"
                    placeholder="Course Number"
                    value={course.courseNo}
                    onChange={(e) => handleCourseChange(index, "courseNo", e.target.value)}
                    style={styles.courseInput}
                  />
                  <select
                    value={course.examHours}
                    onChange={(e) => handleCourseChange(index, "examHours", e.target.value)}
                    style={styles.courseInput}
                  >
                    <option value="">Select Exam Hours</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2 to 2.5">2 to 2.5</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Number of Students"
                    value={course.numberOfStudents}
                    onChange={(e) => handleCourseChange(index, "numberOfStudents", e.target.value)}
                    style={styles.courseInput}
                  />
                  {/* Remove button for each course */}
                  <button onClick={() => removeCourse(index)} style={styles.removeButton}>
                    Remove Course
                  </button>
                </div>
              </div>
            ))}
            {/* Add button at the bottom */}
            <button onClick={addAnotherCourse} style={styles.addButton}>
              Add Another Course
            </button>
          </>
        )}


      {/* Input fields for 'chairman' */}
      {role === "chairman" && (
          <>
            {courses.map((course, index) => (
              <div key={index} style={styles.courseGroup}>
                {/* Course inputs in a row */}
                <div style={styles.inputRow}>
                  <input
                    type="text"
                    placeholder="Course Number"
                    value={course.courseNo}
                    onChange={(e) => handleCourseChange(index, "courseNo", e.target.value)}
                    style={styles.courseInput}
                  />
                  <select
                    value={course.examHours}
                    onChange={(e) => handleCourseChange(index, "examHours", e.target.value)}
                    style={styles.courseInput}
                  >
                    <option value="">Select Exam Hours</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2 to 2.5">2 to 2.5</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Number of Students"
                    value={course.numberOfStudents}
                    onChange={(e) => handleCourseChange(index, "numberOfStudents", e.target.value)}
                    style={styles.courseInput}
                  />
                  {/* Remove button for each course */}
                  <button onClick={() => removeCourse(index)} style={styles.removeButton}>
                    Remove Course
                  </button>
                </div>
              </div>
            ))}
            {/* Add button at the bottom */}
            <button onClick={addAnotherCourse} style={styles.addButton}>
              Add Another Course
            </button>
          </>
        )}
    </>
  );
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

    <select value={role} onChange={handleRoleChange} style={styles.select}>
      <option value="">Select Role</option>
      <option value="teacher">Only Theory Teacher</option>
      <option value="teacherP">Theory + Practical Teacher</option>
      <option value="chairman">Chairman</option>
    </select>
{/* Conditionally rendered input fields based on selected role */}
{renderInputFields()}
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
  courseGroup: {
    marginBottom: "15px",
  },
  inputRow: {
    display: "flex",
    gap: "10px", // Add some space between the input boxes
  },
  courseInput: {
    flex: 1, // Make each course input smaller
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    border: "none",
    padding: "8px 10px",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
  },
  addButton: {
    backgroundColor: "#4caf50",
    border: "none",
    padding: "10px 15px",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
    marginTop: "15px",
  },
};


export default UserProfile;
