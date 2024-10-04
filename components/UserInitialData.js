/** @format */
import { useEffect, useState } from "react";
import { database } from "../firebase.config"; // Ensure this path is correct
import { ref, onValue } from "firebase/database";

const UserInitialData = ({ savedUser, setFormData }) => {
  const [role, setRole] = useState(""); // Track selected role
  const [teachers, setTeachers] = useState([]); // Track fetched teachers
  const [filteredTeachers, setFilteredTeachers] = useState([]); // Track filtered teachers based on role
  const [selectedTeacher, setSelectedTeacher] = useState(null); // Track selected teacher

  // Job definitions for different roles without accessing Firebase data directly
  const jobsByRole = {
    teacher: [
      {
        jobName: "Question Paper Formulation",
        subCategory: "Theoretical Course",
        courseNo: "", // Placeholder, will be set dynamically
        examHours: "", // Placeholder, will be set dynamically
        numberOfStudents: "", // Placeholder, will be set dynamically
        subCategorySectors: "Honours/Masters",
        paperType:"Full",
      },
      {
        jobName: "Question Paper Formulation",
        subCategory: "Tutorial",
        courseNo: "", // Placeholder, will be set dynamically
        noOfDay:"3",
        paperType:"Half",
      },
      {
        jobName: "Test Answer Key",
        subCategory: "Theoretical Course",
        courseNo: "", // Placeholder, will be set dynamically
        examHours: "", // Placeholder, will be set dynamically
        numberOfStudents: "", // Placeholder, will be set dynamically
        subCategorySectors: "Honours/Masters",
        paperType:"Half",
      },
      {
        jobName: "Test Answer Key",
        subCategory: "Tutorial",
        courseNo: "", // Placeholder, will be set dynamically
        noOfDay:"3",
        paperType:"Full",
      },
      {
        jobName: "Inspector Honorarium (Per Tutorial)",
        subCategory: "FixedValue",
        numberOfStudents: "",
        courseNo: "",
      },
    ],
    teacherP: [
      {
        jobName: "Question Paper Formulation",
        subCategory: "Theoretical Course",
        courseNo: "", // Placeholder, will be set dynamically
        examHours: "", // Placeholder, will be set dynamically
        numberOfStudents: "", // Placeholder, will be set dynamically
        subCategorySectors: "Honours/Masters",
        paperType:"Full",
      },
      {
         jobName: "Question Paper Formulation",
          subCategory: "Practical Course",
          courseNo: "", // Placeholder, will be set dynamically
      },
      {
        jobName: "Question Paper Formulation",
        subCategory: "Tutorial",
        courseNo: "", // Placeholder, will be set dynamically
        noOfDay:"3",
        paperType:"Half",
      },
      {
        jobName: "Test Answer Key",
        subCategory: "Theoretical Course",
        courseNo: "", // Placeholder, will be set dynamically
        examHours: "", // Placeholder, will be set dynamically
        numberOfStudents: "", // Placeholder, will be set dynamically
        subCategorySectors: "Honours/Masters",
        paperType:"Half",
      },
      {
        jobName: "Test Answer Key",
        subCategory: "Practical Course",
        courseNo: "", // Placeholder, will be set dynamically
      },
      {
        jobName: "Test Answer Key",
        subCategory: "Tutorial",
        courseNo: "", // Placeholder, will be set dynamically
        noOfDay:"3",
        paperType:"Full",
      },
      
      {
        jobName: "Practical Examination Honors",
        subCategory: "Practical Course",
        noOfDay:"7",
        examHours: "", // Placeholder, will be set dynamically
        courseNo: "",
      },
      {
        jobName: "Inspector Honorarium (Per Tutorial)",
        subCategory: "FixedValue",
        numberOfStudents: "",
        courseNo: "",
      },
    ],
    chairman: [
      {
        jobName: "Test Answer Key",
        subCategory: "Theoretical Course",
        courseNo: "", // Placeholder, will be set dynamically
        examHours: "", // Placeholder, will be set dynamically
        numberOfStudents: "", // Placeholder, will be set dynamically
        subCategorySectors: "Honours/Masters",
      },
    ],
    // Add more roles and their job definitions as needed
  };

  // Fetch teachers from the Realtime Database
  useEffect(() => {
    const teachersRef = ref(database, "teachers");
    onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      const teacherList = data
        ? Object.keys(data).map((key) => ({
            id: key,
            name: data[key].fullName, // Using fullName as username
            email: data[key].email || "",
            role: data[key].role || "teacher",
            nameBangla: data[key].banglaName,
            phone: data[key].mobileNo,
            address: data[key].address,
            subject: "EEE",
            examYear: "202",
            jobs: data[key].jobs || [], // Ensure jobs is defined
          }))
        : [];
      setTeachers(teacherList);
      setFilteredTeachers(teacherList); // Initialize filtered teachers
    });
  }, []);

  // Filter teachers based on selected role
  useEffect(() => {
    if (role) {
      const filtered = teachers.filter((teacher) => teacher.role === role);
      setFilteredTeachers(filtered);
      setSelectedTeacher(null); // Reset selected teacher when role changes
    } else {
      setFilteredTeachers(teachers); // Reset to all teachers if no role is selected
    }
  }, [role, teachers]);

  // Update form data based on selected teacher
  useEffect(() => {
    if (selectedTeacher) {
      // Get the jobs based on the selected role
      const jobTemplate = jobsByRole[role] || [];
      const jobs = jobTemplate.map((job) => {
        let courseNo = "";
        let examHours = "";
        let numberOfStudents = "";
  
        // Determine courseNo based on role and job subcategory
        switch (true) {
          case role === "teacherP" && job.subCategory === "Practical Course":
            courseNo = selectedTeacher.jobs && selectedTeacher.jobs.length > 0
              ? selectedTeacher.jobs[0].courseNoP || ""
              : "";
            break;
          default:
            courseNo = selectedTeacher.jobs && selectedTeacher.jobs.length > 0
              ? selectedTeacher.jobs[0].courseNo || ""
              : "";
            break;
        }
  
        // Determine examHours based on job name and subcategory
        switch (true) {
          case job.jobName === "Test Answer Key" && job.subCategory === "Practical Course":
            examHours = "6 to 8";
            break;
          default:
            examHours = selectedTeacher.jobs && selectedTeacher.jobs.length > 0
              ? selectedTeacher.jobs[0].examHours || ""
              : "";
            break;
        }
  
        // Set numberOfStudents
        numberOfStudents = selectedTeacher.jobs && selectedTeacher.jobs.length > 0
          ? selectedTeacher.jobs[0].numberOfStudents || ""
          : "";
  
        return {
          ...job,
          courseNo,
          examHours,
          numberOfStudents,
        };
      });
  
      // Update the formData with the selected teacher's details
      setFormData((prevState) => ({
        ...prevState,
        name: selectedTeacher.name,
        nameBangla: selectedTeacher.nameBangla,
        phone: selectedTeacher.phone,
        address: selectedTeacher.address,
        subject: "EEE",
        examYear: "202",
        jobs, // Fill job details as per the role
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeacher, setFormData, role]);
  

  return (
    <div>
      {/* Dropdown for selecting the role */}
      <div style={{ marginBottom: "15px" }}>
        <label>Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Role</option>
          <option value="teacher">Theory Teacher</option>
          <option value="teacherP">Theory + practical Teacher</option>
          <option value="chairman">Chairman</option>
          {/* Add more roles if needed */}
        </select>
      </div>

      {/* Dropdown for selecting the teacher based on the role */}
      {role && (
        <div style={{ marginBottom: "15px" }}>
          <label>Select Teacher:</label>
          <select
            value={selectedTeacher?.id || ""} // Change to use id for value
            onChange={(e) => {
              const selectedId = e.target.value;
              setSelectedTeacher(
                filteredTeachers.find((teacher) => teacher.id === selectedId)
              ); // Find by id
            }}
            style={inputStyle}
          >
            <option value="">Select Teacher</option>
            {filteredTeachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {/* Use id as value */}
                {teacher.name} (
                {teacher.jobs.length > 0 ? teacher.jobs[0].courseNo : "N/A"}
                {teacher.jobs.length > 0 && teacher.jobs[0].courseNoP ? `, ${teacher.jobs[0].courseNoP}` : ""})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "14px",
  boxSizing: "border-box",
};

export default UserInitialData;
