/** @format */

"use client";

import React, { useContext, useEffect, useState } from "react";
import SideBarComponent from "../../../components/SideBar.component";
import { UserContext } from "../../../context/user.context";
import { useRouter } from "next/navigation";
import { logoBase64 } from "../../../assets/logo64";
import { rateSheetImage64 } from "../../../assets/rateSheetImage64";
import { fontNormal64 } from "../../../assets/fontNormal64";
import { fontBold64 } from "../../../assets/fontBold64";
import { storage, database } from "../../../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as dbRef, push } from "firebase/database";
import BillForm from "../../../components/BillForm.component";
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts"; // Import fonts
// Define your Base64 encoded font
pdfMake.vfs = {
  ...vfsFonts.pdfMake.vfs, // Existing fonts
  "Nikosh.ttf": fontNormal64, // Add your font here
  "Nikosh-Bold.ttf": fontBold64, // Ensure this exists if using bold
  // "Nikosh-Italic.ttf": fontItalic64, // Ensure this exists if using italic
  // "Nikosh-BoldItalic.ttf": fontBoldItalic64, // Ensure this exists if using bold italic
};

pdfMake.fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Bold.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-BoldItalic.ttf",
  },
  Nikosh: {
    normal: "Nikosh.ttf",
    bold: "Nikosh-Bold.ttf", // Ensure you have a bold version if needed
    // italics: "Nikosh-Italic.ttf", // Ensure you have an italic version if needed
    // bolditalics: "Nikosh-BoldItalic.ttf", // Ensure you have a bold italic version if needed
  },
};

function NewBill() {
  const { savedUser } = useContext(UserContext);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: savedUser.email,
    phone: "",
    address: "",
    jobs: [
      {
        jobName: "",
        subCategory: "",
        courseNo: "",
        numberOfStudents: "",
        examHours: "",
      },
    ],
  });

  const [pdfUrl, setPdfUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !savedUser) {
      router.replace("/");
    }
  }, [isClient, savedUser, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleJobChange = (e, index) => {
    const { name, value } = e.target;
    const updatedJobs = [...formData.jobs];
    updatedJobs[index][name] = value;
    setFormData((prevState) => ({
      ...prevState,
      jobs: updatedJobs,
    }));
  };

  const handleSubCategoryChange = (e, index) => {
    const { value } = e.target;
    const updatedJobs = [...formData.jobs];
    updatedJobs[index].subCategory = value;
    updatedJobs[index].subCategorySectors = ""; // Reset sector
    updatedJobs[index].subCategorySectorsHours = ""; // Reset hours
    setFormData((prevState) => ({
      ...prevState,
      jobs: updatedJobs,
    }));
  };

  const handlesubCategorySectorsChange = (e, index) => {
    const { value } = e.target;
    const updatedJobs = [...formData.jobs];
    updatedJobs[index].subCategorySectors = value; // Correct field
    updatedJobs[index].subCategorySectorsHours = ""; // Reset hours
    setFormData((prevState) => ({
      ...prevState,
      jobs: updatedJobs,
    }));
  };
  const handlesubCategorySectorsHoursChange = (e, index) => {
    const { value } = e.target;
    const updatedJobs = [...formData.jobs];
    updatedJobs[index].subCategorySectorsHours = value; // Correct field
    setFormData((prevState) => ({
      ...prevState,
      jobs: updatedJobs,
    }));
  };

  const handleAddJob = () => {
    setFormData((prevState) => ({
      ...prevState,
      jobs: [
        ...prevState.jobs,
        {
          jobName: "",
          subCategory: "",
          courseNo: "",
          numberOfStudents: "",
          examHours: "",
        },
      ],
    }));
  };

  const handleRemoveJob = (index) => {
    const updatedJobs = [...formData.jobs];
    updatedJobs.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      jobs: updatedJobs,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Generate PDF with pdfMake
      const docDefinition = generatePDF(formData);
      // Generate and download the PDF
      pdfMake.createPdf(docDefinition).download("remuneration_sheet.pdf");

      // Create the PDF and get its Blob
      pdfMake.createPdf(docDefinition).getBlob(async (pdfBlob) => {
        // Upload the Blob to Firebase Storage
        const storageRef = ref(storage, `bills/${Date.now()}.pdf`);
        await uploadBytes(storageRef, pdfBlob);

        // Get the download URL of the uploaded PDF
        const downloadUrl = await getDownloadURL(storageRef);

        // Set the PDF URL to be displayed in the UI
        setPdfUrl(downloadUrl);

        // Prepare data to be saved in Firebase Realtime Database
        const submissionData = {
          ...formData,
          pdfUrl: downloadUrl,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          approved: false,
          
        };

        // Push the data to the "formSubmissions" node in the database
        await push(dbRef(database, "formSubmissions"), submissionData);
      });
    } catch (error) {
      console.error("Error generating or uploading PDF:", error);
    } finally {
      setUploading(false);
    }
  };

  // const calculateAmountPerStudent = (rate, students) => rate * parseInt(students, 10);

  // const calculateRemuneration = (jobData) => {
  //   let totalAmount = 0;
  
  //   const rates = {
  //     "Question Paper Formulation": {
  //       "Theoretical Course": {
  //         "Honours/Masters": { "4": 1800, "3": 1500, "2 to 2.5": 1250 },
  //         "M.Phill/P.H.D.": 2000,
  //       },
  //       Tutorial: (students) => calculateAmountPerStudent(200, students),
  //       Terminal: (students) => calculateAmountPerStudent(200, students),
  //       "Certificate Course": (students) => calculateAmountPerStudent(750, students),
  //       "Practical Course": (students) => calculateAmountPerStudent(300, students),
  //     },
  //     "Question Paper Writing": {
  //       Handwritten: (students) => calculateAmountPerStudent(70, students),
  //       Computer: (students) => calculateAmountPerStudent(200, students),
  //     },
  //     "Question Paper Photocopy": {
  //       Handwritten: 150,
  //       Computer: 375,
  //     },
  //     "Test Answer Key": {
  //       "Theoretical Course": {
  //         "Honours/Masters": { "4": 1800, "3": 1500, "2 to 2.5": 1250 },
  //         "M.Phill/P.H.D.": 650,
  //       },
  //       Tutorial: (students) => calculateAmountPerStudent(20, students),
  //       Terminal: (students) => calculateAmountPerStudent(15, students),
  //       "Certificate Course": (students) => calculateAmountPerStudent(750, students),
  //       "3rd Examination / Scrutiny": 450,
  //       "Practical Course": {
  //         "6 to 8": 70,
  //         "3 to 4": 50,
  //       },
  //     },
  //     "Oral Examination": {
  //       Honours: (students) => calculateAmountPerStudent(60, students),
  //       Masters: (students) => calculateAmountPerStudent(85, students),
  //       M.Phill: (students) => calculateAmountPerStudent(650, students),
  //       "P.H.D.": (students) => calculateAmountPerStudent(700, students),
  //     },
  //     Examiner: {
  //       "Field Work/Industrial Tour": (students) => calculateAmountPerStudent(75, students),
  //       "Practical Note Book": (students) => calculateAmountPerStudent(20, students),
  //       "Testing of Collected Samples": (students) => calculateAmountPerStudent(20, students),
  //       "Project/Term Paper/Internship Report": (students) => calculateAmountPerStudent(400, students),
  //       Thesis: {
  //         "Masters Thesis": (students) => calculateAmountPerStudent(1000, students),
  //         "M.Phill Thesis": (students) => calculateAmountPerStudent(2500, students),
  //         "P.H.D. Thesis": (students) => calculateAmountPerStudent(4000, students),
  //       },
  //     },
  //     "Practical Examination Honors": (hours) => calculateAmountPerStudent(250, hours),
  //     "Script Evaluation": (students) => calculateAmountPerStudent(40, students),
  //     "Viva Voce Examination": (hours) => calculateAmountPerStudent(200, hours),
  //   };
  
  //   const jobRates = rates[jobData.jobName];
  //   if (jobRates) {
  //     const subCategoryRates = jobRates[jobData.subCategory];
  //     if (typeof subCategoryRates === "function") {
  //       totalAmount = subCategoryRates(jobData.numberOfStudents || jobData.examHours);
  //     } else if (typeof subCategoryRates === "object" && jobData.subCategorySectors) {
  //       totalAmount = subCategoryRates[jobData.subCategorySectors][jobData.examHours] || subCategoryRates[jobData.subCategorySectors];
  //     } else {
  //       totalAmount = subCategoryRates;
  //     }
  //   }
  
  //   return totalAmount || 0;
  // };
  
  
  const calculateRemuneration = (jobData) => {
    let totalAmount = 0;
    console.log("JobData:", jobData);
    // Define rates based on job type
    switch (jobData.jobName) {
      case "Question Paper Formulation":
        if (
          jobData.subCategory === "Theoretical Course" &&
          jobData.subCategorySectors === "Honours/Masters"
        ) {
          switch (jobData.examHours) {
            case "4":
              totalAmount = 1800;
              break;
            case "3":
              totalAmount = 1500;
              break;
            case "2 to 2.5":
              totalAmount = 1250;
              break;
          }
        } else if (
          jobData.subCategory === "Theoretical Course" &&
          jobData.subCategorySectors === "M.Phill/P.H.D."
        ) {
          jobData.examHours = "4";
          totalAmount = 2000;
        } else if (jobData.subCategory === "Tutorial") {
          const ratePerQuestion = 200;
          totalAmount +=
            ratePerQuestion * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "Terminal") {
          const ratePerCourse = 200;
          totalAmount += ratePerCourse * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "Certificate Course") {
          const ratePerQuestion = 750;
          totalAmount +=
            ratePerQuestion * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "Practical Course") {
          const ratePerCourse = 300;
          totalAmount += ratePerCourse * parseInt(jobData.numberOfStudents, 10);
        }
        break;
      case "Question Paper Writing":
        if (jobData.subCategory === "Handwritten") {
          const ratePerPage = 70;
          totalAmount += ratePerPage * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "Computer") {
          const ratePerPage = 200;
          totalAmount += ratePerPage * parseInt(jobData.numberOfStudents, 10);
        }
        break;
      case "Question Paper Photocopy":
        if (jobData.subCategory === "Handwritten") {
          totalAmount = 150;
        } else if (jobData.subCategory === "Computer") {
          totalAmount = 375;
        }
        break;
      case "Test Answer Key":
        if (
          jobData.subCategory === "Theoretical Course" &&
          jobData.subCategorySectors === "Honours/Masters"
        ) {
          switch (jobData.examHours) {
            case "4":
              totalAmount = 1800;
              break;
            case "3":
              totalAmount = 1500;
              break;
            case "2 to 2.5":
              totalAmount = 1250;
              break;
            default:
              jobData.examHours = "";
              totalAmount = 0;
          }
        } else if (
          jobData.subCategory === "Theoretical Course" &&
          jobData.subCategorySectors === "M.Phill/P.H.D."
        ) {
          jobData.examHours = "4";
          totalAmount = 650;
        } else if (jobData.subCategory === "Tutorial") {
          const ratePerQuestion = 20;
          totalAmount +=
            ratePerQuestion * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "Terminal") {
          const ratePerCourse = 15;
          totalAmount += ratePerCourse * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "Certificate Course") {
          const ratePerQuestion = 750;
          totalAmount +=
            ratePerQuestion * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "3rd Examination / Scrutiny") {
          totalAmount = 450;
        } else if (jobData.subCategory === "Practical Course") {
          switch (jobData.examHours) {
            case "6 to 8":
              jobData.examHours = "6 to 8";
              totalAmount = 70;
              break;
            case "3 to 4":
              jobData.examHours = "3 to 4";
              totalAmount = 50;
              break;
            default:
              jobData.examHours = "";
              totalAmount = 0;
          }
        }
        break;
      case "Oral Examination":
        if (jobData.subCategory === "Honours/Masters") {
          const ratePerStudent = 60;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "Masters") {
          const ratePerStudent = 85;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "M.Phill") {
          const ratePerStudent = 650;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "P.H.D.") {
          const ratePerStudent = 700;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        }
        break;
      case "Examiner":
        if (jobData.subCategory === "Field Work/Industrial Tour") {
          const ratePerStudent = 75;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "Practical Note Book") {
          const ratePerStudent = 20;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "Testing of Collected Samples") {
          const ratePerStudent = 20;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (
          jobData.subCategory === "Project/Term Paper/Internship Report"
        ) {
          const ratePerStudent = 400;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (
          jobData.subCategory === "Thesis" &&
          jobData.subCategorySectors === "Masters Thesis"
        ) {
          const ratePerStudent = 1000;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (
          jobData.subCategory === "Thesis" &&
          jobData.subCategorySectors === "M.Phill Thesis"
        ) {
          const ratePerStudent = 2500;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (
          jobData.subCategory === "Thesis" &&
          jobData.subCategorySectors === "P.H.D. Thesis"
        ) {
          const ratePerStudent = 4000;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        }
        break;
      case "Practical Examination Honors":
        {
          const ratePerHour = 250; // Example rate
          totalAmount += ratePerHour * parseInt(jobData.examHours, 10);
        }
        break;
        case "Thesis Guide/Supervision":
        if (jobData.subCategory === "Masters") {
          const ratePerStudent = 3000;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "M.Phill") {
          const ratePerStudent = 12500;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        } else if (jobData.subCategory === "P.H.D.") {
          const ratePerStudent = 25000;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        }  
        break;
        case "President's Honorary Allowance":
          totalAmount += 3500;
        break;
        case "Examination Committee Member Honorarium":
          totalAmount += 1000;
        break;
        case "Inspector Honorarium (Per Tutorial)":
          const ratePerStudent = 200;
          totalAmount +=
            ratePerStudent * parseInt(jobData.numberOfStudents, 10);
        break;
      case "Script Evaluation":
        const ratePerScript = 40; // Example rate
        totalAmount += ratePerScript * parseInt(jobData.numberOfStudents, 10);
        break;
      case "Viva Voce Examination":
        {
          const ratePerHour = 200; // Example rate
          totalAmount += ratePerHour * parseInt(jobData.examHours, 10);
        }
        break;
      default:
        break;
    }
    return totalAmount;
  };
  const calculateTotalAmount = (jobs) => {
    return jobs.reduce((sum, job) => sum + calculateRemuneration(job), 0);
  };
  const findRowIndex = (jobName, subCategory, templateRows) => {
    const lowerJobName = jobName.trim().toLowerCase();
    const lowerSubCategory = subCategory.trim().toLowerCase();

    // List of jobs where subCategory is irrelevant
    const jobsWithoutSubCategory = [
      "question paper writing",
      "question paper photocopy",
      "thesis guide/supervision",

    ];

    let lastJobNameMatch = false; // Track the last valid job name match

    for (let i = 0; i < templateRows.length; i++) {
      const row = templateRows[i];
      const rowJobName = row[1].trim().toLowerCase();
      const rowSubCategory = row[2].trim().toLowerCase();

      // Check if the current job is one of those that doesn't require a subcategory match
      if (jobsWithoutSubCategory.includes(lowerJobName)) {
        if (rowJobName === lowerJobName) {
          console.log(`Match found at row ${i} (ignoring subcategory)`);
          return i; // Return the index based only on job name
        }
      } else {
        // For all other jobs, match both jobName and subCategory
        if (rowJobName) {
          lastJobNameMatch = rowJobName === lowerJobName;
        }

        if (lastJobNameMatch && rowSubCategory === lowerSubCategory) {
          console.log(`Match found at row ${i}`);
          return i; // Return the index of the matched row
        }
      }
    }

    console.log("No match found");
    return -1; // Return -1 if no match is found
  };
  const jobTranslation = {
    "Question Paper Formulation": "প্রশ্নপত্র প্রণয়ন",
    "Question Paper Writing": "প্রশ্নপত্র লিখন",
    "Question Paper Photocopy": "প্রশ্নপত্র ফটোকপি",
    "Theoretical Course": "তত্ত্বীয় কোর্স",
    "Practical Course": "ব্যবহারিক কোর্স",
    Handwritten: "হাতে লেখা",
    Computer: "কম্পিউটার",
    "Question Paper Review (Moderation)": "প্রশ্নপত্র সমীক্ষণ (মডারেশন)",
    "Question Paper Translation": "প্রশ্নপত্র অনুবাদ",
    "Test Answer Key": "উত্তরপত্র পরীক্ষণ",
    Tutorial: "টিউটোরিয়াল",
    Terminal: "টার্মিনাল",
    Presentation: "প্রেজেন্টেশন",
    "3rd Examination / Scrutiny": "৩য় পরীক্ষণ / স্ক্রুটিনি",
    "Oral Examination": "মৌখিক পরীক্ষা",
    Examiner: "পরীক্ষক",
    "Field Work/Industrial Tour": "ফিল্ড ওয়ার্ক/ইনডাস্ট্রিয়াল ট্যুর",
    "Practical Note Book": "ব্যবহারিক নোট বুক",
    "Testing of Collected Samples": "সংগৃহীত নমুনা পরীক্ষণ",
    "Project/Term Paper/Internship Report":
      "প্রজেক্ট/ টার্ম পেপার/ইন্টার্নশিপ রিপোর্ট",
    Thesis: "থিসিস",
    "Practical Examination Honors": "ব্যবহারিক পরীক্ষা সম্মানী",
    Tabulation: "ট্যাবুলেশন",
    "Gradesheet Writing": "গ্রেডশীট লিখন",
    "Gradesheet Verification": "গ্রেডশীট যাচাইকরণ",
    "Thesis Guide/Supervision": "থিসিস গাইড/সুপারভিশন",
    "President's Honorary Allowance": "সভাপতির সম্মানী ভাতা",
    "Examination Committee Member Honorarium": "পরীক্ষা কমিটির সদস্য সম্মানী",
    "Inspector Honorarium (Per Tutorial)":
      "পরিদর্শক সম্মানী (প্রতি টিউটোরিয়াল)",
    "Incidental Charges (Enclosed Voucher No-)":
      "ইনসিডেন্টাল চার্জ (সংযুক্ত ভাউচার নং-)",
  };

  const generateTemplateRows = (jobs) => {
    const templateRows = [
      // Sample template rows, adjust as needed
      [
        "1",
        "Question Paper Formulation",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      ["", "", "Theoretical Course", "", "", "", "", "", ""],
      ["", "", "Practical Course", "", "", "", "", "", ""],
      ["", "", "Tutorial", "", "", "", "", "", ""],
      ["", "", "Terminal", "", "", "", "", "", ""],
      ["2", "Question Paper Review (Moderation)", "", "", "", "", "", "", ""],
      ["3", "Question Paper Translation", "", "", "", "", "", "", ""],
      ["4", "Question Paper Writing", "", "", "", "", "", "", ""],
      ["5", "Question Paper Photocopy", "", "", "", "", "", "", ""],
      ["6", "Test Answer Key", "Theoretical Course", "", "", "", "", "", ""],
      ["", "", "Practical Course", "", "", "", "", "", ""],
      ["", "", "Tutorial", "", "", "", "", "", ""],
      ["", "", "Terminal", "", "", "", "", "", ""],
      ["", "", "Presentation", "", "", "", "", "", ""],
      ["", "", "3rd Examination / Scrutiny", "", "", "", "", "", ""],
      ["7", "Oral Examination", "", "", "", "", "", "", ""],
      ["8", "Examiner", "Field Work/Industrial Tour", "", "", "", "", "", ""],
      ["", "", "Practical Note Book", "", "", "", "", "", ""],
      ["", "", "Testing of Collected Samples", "", "", "", "", "", ""],
      ["", "", "Project/Term Paper/Internship Report", "", "", "", "", "", ""],
      ["", "", "Thesis", "", "", "", "", "", ""],
      ["9", "Practical Examination Honors", "", "", "", "", "", "", ""],
      ["10", "Tabulation", "", "", "", "", "", "", ""],
      ["11", "Gradesheet Writing", "", "", "", "", "", "", ""],
      ["12", "Gradesheet Verification", "", "", "", "", "", "", ""],
      ["13", "Thesis Guide/Supervision", "", "", "", "", "", "", ""],
      ["14", "President's Honorary Allowance", "", "", "", "", "", "", ""],
      [
        "15",
        "Examination Committee Member Honorarium",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      ["16", "Inspector Honorarium (Per Tutorial)", "", "", "", "", "", "", ""],
      [
        "17",
        "Incidental Charges (Enclosed Voucher No-)",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
    ];

    let totalAmount = 0;

    jobs.forEach((job) => {
      const rowIndex = findRowIndex(job.jobName, job.subCategory, templateRows);

      if (rowIndex !== -1) {
        // Update the existing row if found
        templateRows[rowIndex][3] = job.courseNo || templateRows[rowIndex][3];
        templateRows[rowIndex][4] =
          job.numberOfStudents || templateRows[rowIndex][4];
        templateRows[rowIndex][5] = job.examHours || templateRows[rowIndex][5];
        templateRows[rowIndex][8] = calculateRemuneration(job).toFixed(2);
        totalAmount += calculateRemuneration(job);
      } else {
        // Row not found: log this and insert a new row (but we should not get here if rows exist)
        console.error(
          `Error: No matching row found for ${job.jobName} - ${job.subCategory}`
        );
        templateRows.push([
          "",
          job.jobName,
          job.subCategory || "",
          job.courseNo || "",
          job.numberOfStudents || "",
          job.examHours || "",
          "",
          job.paperType || "",
          calculateRemuneration(job).toFixed(2),
        ]);
        totalAmount += calculateRemuneration(job);
      }
    });
    // After matching and updating, translate for display
    templateRows.forEach((row) => {
      row[1] = jobTranslation[row[1]] || row[1]; // Translate the job name
      row[2] = jobTranslation[row[2]] || row[2]; // Translate the subcategory
    });
    return templateRows;
  };

  const generatePDF = (formData) => {
    const docDefinition = {
      pageSize: { width: 250 * 2.83464567, height: 356 * 2.83464567 }, // Set page size to Legal
      pageMargins: [20, 20, 20, 20], // Add margins
      defaultStyle: {
        font: "Nikosh", // Set Roboto as the default font
      },
      content: [
        {
          image: logoBase64,
          width: 30,
          alignment: "center",
        },
        {
          text: "পরীক্ষা সংক্রান্ত কাজের পারিতোষিক বিল ফরম",
          style: "header",
          alignment: "center",
        },
        {
          text: "(বিল সংশ্লিষ্ট পরীক্ষা কমিটির চেয়ারম্যানের মাধ্যমে পরীক্ষা অনুষ্ঠিত হওয়ার এক বছরের মধ্যে পরীক্ষা নিয়ন্ত্রণ দপ্তরে দাখিল করতে হবে। প্রতি পরীক্ষার জন্য পৃথকভাবে বিল দাখিল করতে হবে।)",
          style: "subInfoText",
        },
        {
          table: {
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Examinee Name(Bangla):', bold: true },
                { text: formData.name || 'N/A', colSpan: 2 },
                {},
                { text: 'Subject:', bold: true },
                { text: formData.name || 'N/A' },
              ],
              [
                { text: 'English(In capital letter):', bold: true },
                { text: formData.nameEnglish || 'N/A', colSpan: 2 },
                {},
                { text: 'Exam Name:', bold: true },
                { text: formData.examName || 'N/A' },
              ],
              [
                { text: 'Designation:', bold: true },
                { text: formData.address || 'N/A', colSpan: 2 },
                {},
                { text: 'Exam year:', bold: true },
                { text: formData.examYear || 'N/A' },
              ],
              [
                { text: 'Mobile No:', bold: true },
                { text: formData.phone || 'N/A', colSpan: 2 },
                {},
                { text: 'Exam held date:', bold: true },
                { text: formData.examDate || 'N/A' },
              ]
            ]
          },
          
          style: 'infoText'
        },
       
        {
          table: {
            headerRows: 1,
            widths: [
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
            ],
            body: [
              [
                "ক্রমিক নং",
                "কাজের নাম",
                "Sub Category",
                "কোর্স নং",
                "খাতা/ছাত্রের সংখ্যা",
                "কত ঘন্টার পরীক্ষা",
                "মোট দিন/সদস্য সংখ্যা",
                "অর্ধ/পূর্ণ পত্র",
                "টাকার পরিমাণ",
              ],
              ...generateTemplateRows(formData.jobs),
              [
                { text: "মোট টাকা", colSpan: 8 },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                calculateTotalAmount(formData.jobs).toFixed(2),
              ],
            ],
          },
          style: "table", // Apply font size to the entire table
        },
        {
          columns: [
            {
              // Column for the first signature
              width: '50%',
              style:"Signature",
              stack: [
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 5,
                      x2: 230, y2: 5, // Adjust line width based on the desired length
                      lineWidth: 1.5
                    }
                  ]
                },
                {
                  text: 'Signature',
                  alignment: 'right',
                  margin: [0, 5, 0, 0]
                }
              ]
            },
            {
              // Column for the second signature
              width: '50%',
              stack: [
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 5,
                      x2: 230, y2: 5, // Adjust line width based on the desired length
                      lineWidth: 1.5,
                    }
                  ]
                },
                {
                  text: 'Signature',
                  alignment: 'right',
                  margin: [0, 5, 0, 0]
                }
              ]
            }
          ]
        },

        { text: "", pageBreak: "after" }, // Add a page break after the table
        {
          text: "বিভিন্ন পরীক্ষা সংক্রান্ত কাজের পারিতোষিক হার",
          style: "subheader",
          font: "Nikosh",
        },
        {
          text: "চট্টগ্রাম বিশ্ববিদ্যালয় সিন্ডিকেটের ৫৩০ তম সভার ৫২ নং সিদ্ধান্ত অনুযায়ী ২০১৯ সালের পরীক্ষা হতে কার্যকর হবে।",
          style: "infoText",
          font: "Nikosh",
        },
        {
          image: rateSheetImage64,
          width: 650,
          height: 900,
          alignment: "center",
        },
      ],

      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 20],
        },
        infoText: {
          fontSize: 10,
          margin: [0, 0, 0, 10],
        },
        subInfoText: {
          fontSize: 10,
          margin: [0, 0, 0, 10],
        },

        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 5, 0, 5],
        },
        table: {
          fontSize: 10, // Set font size for the table
        },
        tableCell: {
          fontSize: 10, // Apply font size to individual cells if needed
        },
        Signature: {
          fontSize: 12,
          margin: [30, 0, 0, 10],
        }
      },
    };

    console.log("Generated PDF Definition:", docDefinition);
    return docDefinition;
    // Save the PDF
    docDefinition.save("remuneration_sheet.pdf");
  };

  return (
    <div
      style={{ padding: 0, margin: 0, display: "flex", flexDirection: "row" }}
    >
      <SideBarComponent />
      <div style={{ padding: 20, margin: 0, width: "70%", height: "100%" }}>
        <h1>Enter New Bill</h1>
        <BillForm
          formData={formData}
          handleChange={handleChange}
          handleJobChange={handleJobChange}
          handleSubCategoryChange={handleSubCategoryChange}
          handlesubCategorySectorsChange={handlesubCategorySectorsChange} // Correct prop name
          handleAddJob={handleAddJob}
          handleRemoveJob={handleRemoveJob}
          handleSubmit={handleSubmit}
          uploading={uploading}
          handlesubCategorySectorsHoursChange={
            handlesubCategorySectorsHoursChange
          }
        />
        {pdfUrl && (
          <>
            <a
              href={pdfUrl}
              download="form-submission.pdf"
              style={{
                display: "block",
                marginTop: "10px",
                color: "blue",
                textDecoration: "underline",
              }}
            >
              Click here to download the PDF
            </a>
            <button
              onClick={() => window.open(pdfUrl)}
              style={{
                display: "block",
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "lightblue",
                border: "none",
                cursor: "pointer",
              }}
            >
              Preview PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default NewBill;
