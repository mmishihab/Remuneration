import { useEffect } from "react";

const UserInitialData = ({ savedUser, setFormData }) => {
  // Define a mapping of user data with both username and email
  const userData = [
    {
      username: "abu jahed",
      email: "abujahed@gmail.com",
      nameBangla: "আবু জাহেদ",
      phone: "012345678",
      address: "Assistant Professor",
      jobs: [
        {
          jobName: "Question Paper Formulation",
          subCategory: "Theoretical Course",
          courseNo: "EEE-811",
          // numberOfStudents: "10",
          examHours: "4",
          subCategorySectors: "Honours/Masters",
        },
        {
          jobName: "Test Answer Key",
          subCategory: "Theoretical Course",
          courseNo: "EEE-812",
          // numberOfStudents: "15",
          examHours: "3",
          subCategorySectors: "Honours/Masters",
        },
      ],
    },
    {
      username: "john doe",
      email: "johndoe@gmail.com",
      nameBangla: "জন ডো",
      phone: "987654321",
      address: "Lecturer",
      jobs: [
        {
          jobName: "Exam Paper Grading",
          subCategory: "Practical Course",
          courseNo: "CS-101",
          numberOfStudents: "30",
          examHours: "2",
          subCategorySectors: "Undergraduate",
        },
      ],
    },
    // Add more users here as needed
  ];

  useEffect(() => {
    // Normalize the username and email to lowercase for matching
    const normalizedUsername = savedUser?.username?.toLowerCase();
    const normalizedEmail = savedUser?.email?.toLowerCase();

    // Check if there's a matching user with both username and email
    const matchedUser = userData.find(
      (user) =>
        user.username.toLowerCase() === normalizedUsername &&
        user.email.toLowerCase() === normalizedEmail
    );

    if (matchedUser) {
      // Update the formData with the matched user's details
      setFormData((prevState) => ({
        ...prevState,
        nameBangla: matchedUser.nameBangla,
        phone: matchedUser.phone,
        address: matchedUser.address,
        jobs: matchedUser.jobs,
      }));
    }
  }, [savedUser, setFormData]);

  return null; // This component doesn't render anything.
};

export default UserInitialData;
