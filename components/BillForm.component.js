/** @format */

"use client";

import React, { useState } from "react";

function BillForm({
  formData,
  handleChange,
  handleJobChange,
  handleAddJob,
  handleRemoveJob,
  handleSubCategoryChange,
  handlesubCategorySectorsChange,
  handlesubCategorySectorsHoursChange,
  handleSubmit,
  uploading,
}) {

// Track jobs that should only be selectable once
const onceSelectableJobs = ["Question Paper Writing","Question Paper Photocopy"];
// Function to get available subcategories for a specific jobName
const getAvailableSubCategories = (jobName, currentJobIndex) => {
  const selectedSubCategories = formData.jobs
    .filter((job, i) => i !== currentJobIndex && job.jobName === jobName) // Same jobName, excluding current job
    .map((job) => job.subCategory); // Get selected subCategories

  // Return only the subCategories that have not been selected yet for the same jobName
  return (options) => options.filter((option) => !selectedSubCategories.includes(option.value));
};

// Check if any of the "once selectable" jobs have been selected
const isOnceSelectableJobUsed = formData.jobs.some((job) =>
  onceSelectableJobs.includes(job.jobName)
);
 // Spinner styles
 const spinnerStyle = {
  width: '1em',
  height: '1em',
  border: '3px solid #f3f3f3', // Light grey
  borderTop: '3px solid #3498db', // Blue
  borderRadius: '50%',
  animation: uploading ? 'spin 1s linear infinite' : 'none', // Change the animation based on uploading state
  marginRight: '5px',
  display: 'inline-block',
};

  // State to track the loading status
  const [loading, setLoading] = useState(false);
  // Function to handle PDF generation and show loading spinner
  const handleGeneratePDF = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner

    // Call the submit handler to generate PDF
    await handleSubmit(e);

    // Simulate PDF download completion after a delay (you may need to handle this based on your actual PDF generation logic)
    setTimeout(() => {
      setLoading(false); // Hide loading spinner when PDF is ready
    }, 3000); // Adjust this timeout as per actual file generation time
  };

  return (
    <form
      onSubmit={handleGeneratePDF}
      style={{
        maxWidth: "100%",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "600px",
      }}
    >
      {/** Teacher Details **/}
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>পরীক্ষকের নাম(বাংলায়):</label>
        <input
          type="text"
          name="nameBangla"
          value={formData.nameBangla}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>পদবী, পূর্ণ ঠিকানা:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>মোবাইল নম্বর:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>বিষয়:</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>পরীক্ষার নাম:</label>
        <input
          type="text"
          name="examName"
          value={formData.examName}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>পরীক্ষার বৎসর:</label>
        <input
          type="text"
          name="examYear"
          value={formData.examYear}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={labelStyle}>পরীক্ষা অনুষ্ঠানের তারিখ:</label>
        <input
          type="text"
          name="examDate"
          value={formData.examDate}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      {/** Job Details Input **/}
      {formData.jobs.map((job, index) => (
        <div
          key={index}
          style={{
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            position: "relative",
          }}
        >
          <span
            onClick={() => handleRemoveJob(index)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              color: "#dc3545",
            }}
          >
            &times;
          </span>

          <h3>Job {index + 1}</h3>
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Job Name:</label>
            <select
              name="jobName"
              value={job.jobName || ""}
              onChange={(e) => handleJobChange(e, index)}
              required
              style={inputStyle}
            >
              <option value="">Select Job</option>
              <option value="Question Paper Formulation">
              প্রশ্নপত্র প্রণয়ন
              </option>
              {/* "Question Paper Writing" should only appear if it hasn't been selected */}
              {!formData.jobs.some((j) => j.jobName === "Question Paper Writing" && j.subCategory !== "" && index !== formData.jobs.indexOf(j)) && (
                <option value="Question Paper Writing">প্রশ্নপত্র লিখন</option>
              )}
                    {/* "Question Paper Writing" should only appear if it hasn't been selected */}
              {!formData.jobs.some((j) => j.jobName === "Question Paper Photocopy" && j.subCategory !== "" && index !== formData.jobs.indexOf(j)) && (
                <option value="Question Paper Photocopy">প্রশ্নপত্র ফটোকপি</option>
              )}
              <option value="Test Answer Key">উত্তরপত্র পরীক্ষণ</option>
              <option value="Oral Examination">মৌখিক পরীক্ষা</option>
              <option value="Examiner">পরীক্ষক</option>
              <option value="Practical Examination Honors">
              ব্যবহারিক পরীক্ষা সম্মানী
              </option>
              <option value="Thesis Guide/Supervision">
              থিসিস গাইড/সুপারভিশন
              </option>
              <option value="Presidents Honorary Allowance">
              সভাপতির সম্মানী ভাতা
              </option>
              <option value="Examination Committee Member Honorarium">
              পরীক্ষা কমিটির সদস্য সম্মানী
              </option>
              <option value="Inspector Honorarium (Per Tutorial)">
              পরিদর্শক সম্মানী (প্রতি টিউটোরিয়াল)
              </option>
            </select>
          </div>
          {/** Sectors under for subcategory **/}
          {job.jobName === "Question Paper Formulation" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Sub-Category:</label>
                <select
                  name="subCategory"
                  value={job.subCategory}
                  onChange={(e) => handleSubCategoryChange(e, index)}
                  required
                  style={inputStyle}
                ><option value="">Select Sub-Category</option>
                {getAvailableSubCategories(
                  "Question Paper Formulation",
                  index
                )([
                  { name: "তত্ত্বীয় কোর্স", value: "Theoretical Course" },
                  { name: "ব্যবহারিক কোর্স", value: "Practical Course" },
                  // { name: "", value: "Certificate Course" },
                  { name: "টিউটোরিয়াল", value: "Tutorial" },
                  { name: "টার্মিনাল", value: "Terminal" },
                ]).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
                </select>
              </div>

              {job.subCategory === "Theoretical Course" && (
                <>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={labelStyle}>Select the Sectors:</label>
                    <select
                      name="subCategorySectors"
                      value={job.subCategorySectors}
                      onChange={(e) => handlesubCategorySectorsChange(e, index)}
                      required
                      style={inputStyle}
                    >
                      <option value="">Select Sectors</option>
                      <option value="Honours/Masters">Honours/Masters</option>
                      <option value="M.Phill/P.H.D.">M.Phill/P.H.D.</option>
                    </select>
                  </div>

                  {job.subCategorySectors === "Honours/Masters" && (
                    <div style={{ marginBottom: "15px" }}>
                      <label style={labelStyle}>Hours:</label>
                      <select
                        name="examHours"
                        value={job.examHours}
                        onChange={(e) => handleJobChange(e, index)}
                        required
                        style={inputStyle}
                      >
                        <option value="">Select Hours</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2 to 2.5">2 to 2.5</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              {job.subCategory === "Tutorial" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>Number of Question:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Terminal" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>Total No. of Course Taken:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Certificate Course" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>Number of Question:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Practical Course" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>Total No. of Course Taken:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
            </>
          )}
          {job.jobName === "Question Paper Writing" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Sub-Category:</label>
                <select
                  name="subCategory"
                  value={job.subCategory}
                  onChange={(e) => handleSubCategoryChange(e, index)}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Sub-Category</option>
                  {getAvailableSubCategories(
                    "Question Paper Writing",
                    index
                  )([
                    "Handwritten",
                    "Computer",
                  ]).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  
                </select>
              </div>

              {job.subCategory === "Handwritten" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>How many Pages:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Computer" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>How many Pages:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
            </>
          )}
          {job.jobName === "Question Paper Photocopy" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Sub-Category:</label>
                <select
                  name="subCategory"
                  value={job.subCategory}
                  onChange={(e) => handleSubCategoryChange(e, index)}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Sub-Category</option>
                {getAvailableSubCategories(
                  "Question Paper Photocopy",
                  index
                )([
                  { name: "Handwritten", value: "Handwritten" },
                  { name: "Computer", value: "Computer" },
                ]).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}

                  
                </select>
              </div>

              {job.subCategory === "Handwritten" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>How many Pages:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Computer" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>How many Pages:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
            </>
          )}
          {job.jobName === "Test Answer Key" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Sub-Category:</label>
                <select
                  name="subCategory"
                  value={job.subCategory}
                  onChange={(e) => handleSubCategoryChange(e, index)}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Sub-Category</option>
                  {getAvailableSubCategories(
                    "Test Answer Key",
                    index
                  )([
                    { name: "তত্ত্বীয় কোর্স", value: "Theoretical Course" },
                    { name: "ব্যবহারিক কোর্স", value: "Practical Course" },
                    // { name: "", value: "Certificate Course" },
                    { name: "টিউটোরিয়াল", value: "Tutorial" },
                    { name: "টার্মিনাল", value: "Terminal" },
                    { name: "প্রেজেন্টেশন", value: "Presentation" },
                    { name: "৩য় পরীক্ষণ / স্ক্রুটিনি", value: "3rd Examination / Scrutiny" },
                  ]).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {job.subCategory === "Theoretical Course" && (
                <>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={labelStyle}>Select the Sectors:</label>
                    <select
                      name="subCategorySectors"
                      value={job.subCategorySectors}
                      onChange={(e) => handlesubCategorySectorsChange(e, index)}
                      required
                      style={inputStyle}
                    >
                      <option value="">Select Sectors</option>
                      <option value="Honours/Masters">Honours/Masters</option>
                      <option value="M.Phill/P.H.D.">M.Phill/P.H.D.</option>
                    </select>
                  </div>

                  {job.subCategorySectors === "Honours/Masters" && (
                    <div style={{ marginBottom: "15px" }}>
                      <label style={labelStyle}>Hours:</label>
                      <select
                        name="examHours"
                        value={job.examHours}
                        onChange={(e) => handleJobChange(e, index)}
                        required
                        style={inputStyle}
                      >
                        <option value="">Hours</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2 to 2.5">2 to 2.5</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              {job.subCategory === "Tutorial" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>Number of Question:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Terminal" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>Total No. of Course Taken:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Certificate Course" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>Number of Question:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Practical Course" && (
                <>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={labelStyle}>Hours:</label>
                    <select
                      name="examHours"
                      value={job.examHours}
                      onChange={(e) => handleJobChange(e, index)}
                      required
                      style={inputStyle}
                    >
                      <option value="">Hours</option>
                      <option value="6 to 8">6 to 8</option>
                      <option value="3 to 4">3 to 4</option>
                    </select>
                  </div>
                </>
              )}
              {job.subCategory === "Presentation" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>Number of Presentation:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
            </>
          )}
          {job.jobName === "Oral Examination" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Sub-Category:</label>
                <select
                  name="subCategory"
                  value={job.subCategory}
                  onChange={(e) => handleSubCategoryChange(e, index)}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Sub-Category</option>
                  <option value="Honours/Masters">
                    Honours/Masters(General)
                  </option>
                  <option value="Masters">Masters(Project/Thesis)</option>
                  <option value="M.Phill">M.Phill</option>
                  <option value="P.H.D.">P.H.D.</option>
                </select>
              </div>

              {job.subCategory === "Honours/Masters" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Masters" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "M.Phill" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "P.H.D." && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
            </>
          )}
          {job.jobName === "Examiner" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Sub-Category:</label>
                <select
                  name="subCategory"
                  value={job.subCategory}
                  onChange={(e) => handleSubCategoryChange(e, index)}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Sub-Category</option>
                  {getAvailableSubCategories(
                    "Examiner",
                    index
                  )([
                    { name: "ফিল্ড ওয়ার্ক/ইনডাস্ট্রিয়াল ট্যুর", value: "Field Work/Industrial Tour" },
                    { name: "ব্যবহারিক নোট বুক", value: "Practical Note Book" },
                    { name: "সংগৃহীত নমুনা পরীক্ষণ", value: "Testing of Collected Samples" },
                    { name: "প্রজেক্ট/ টার্ম পেপার/ইন্টার্নশিপ রিপোর্ট", value: "Project/Term Paper/Internship Report" },
                    { name: "থিসিস", value: "Thesis" }
                  ]).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {job.subCategory === "Field Work/Industrial Tour" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Practical Note Book" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Testing of Collected Samples" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Project/Term Paper/Internship Report" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "Thesis" && (
                <>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={labelStyle}>Select the Sectors:</label>
                    <select
                      name="subCategorySectors"
                      value={job.subCategorySectors}
                      onChange={(e) => handlesubCategorySectorsChange(e, index)}
                      required
                      style={inputStyle}
                    >
                      <option value="">Select Sectors</option>
                      <option value="Masters Thesis">Masters Thesis</option>
                      <option value="M.Phill Thesis">M.Phill Thesis</option>
                      <option value="P.H.D. Thesis">P.H.D. Thesis</option>
                    </select>
                  </div>

                  {job.subCategorySectors === "Masters Thesis" && (
                    <div style={{ marginBottom: "15px" }}>
                      <label style={labelStyle}>No. of Students:</label>
                      <input
                        type="number"
                        name="numberOfStudents"
                        value={job.numberOfStudents}
                        onChange={(e) => handleJobChange(e, index)}
                        required
                        style={inputStyle}
                      />
                      {/* Add other fields specific to this job */}
                    </div>
                  )}
                  {job.subCategorySectors === "M.Phill Thesis" && (
                    <div style={{ marginBottom: "15px" }}>
                      <label style={labelStyle}>No. of Students:</label>
                      <input
                        type="number"
                        name="numberOfStudents"
                        value={job.numberOfStudents}
                        onChange={(e) => handleJobChange(e, index)}
                        required
                        style={inputStyle}
                      />
                      {/* Add other fields specific to this job */}
                    </div>
                  )}
                  {job.subCategorySectors === "P.H.D. Thesis" && (
                    <div style={{ marginBottom: "15px" }}>
                      <label style={labelStyle}>No. of Students:</label>
                      <input
                        type="number"
                        name="numberOfStudents"
                        value={job.numberOfStudents}
                        onChange={(e) => handleJobChange(e, index)}
                        required
                        style={inputStyle}
                      />
                      {/* Add other fields specific to this job */}
                    </div>
                  )}
                </>
              )}
            </>
          )}
          {job.jobName === "Practical Examination Honors" && (
            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Exam Hours:</label>
              <input
                type="number"
                name="examHours"
                value={job.examHours}
                onChange={(e) => handleJobChange(e, index)}
                required
                style={inputStyle}
              />
              {/* Add other fields specific to this job */}
            </div>
          )}
        {job.jobName === "Thesis Guide/Supervision" && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Sub-Category:</label>
                <select
                  name="subCategory"
                  value={job.subCategory}
                  onChange={(e) => handleSubCategoryChange(e, index)}
                  required
                  style={inputStyle}
                >
                  <option value="">Select Sub-Category</option>
                  <option value="Masters">
                  Masters
                  </option>
                  <option value="M.Phill">
                    M.Phill
                  </option>
                  <option value="P.H.D.">
                    P.H.D.
                  </option>
                </select>
              </div>

              {job.subCategory === "Masters" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "M.Phill" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              {job.subCategory === "P.H.D." && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>No. of Students:</label>
                  <input
                    type="number"
                    name="numberOfStudents"
                    value={job.numberOfStudents}
                    onChange={(e) => handleJobChange(e, index)}
                    required
                    style={inputStyle}
                  />
                  {/* Add other fields specific to this job */}
                </div>
              )}
              
            </>
          )}
          {job.jobName === "Presidents Honorary Allowance" && (
            <div style={{ marginBottom: "15px" }}>
              {/* Add other fields specific to this job */}
            </div>
          )}
          {job.jobName === "Examination Committee Member Honorarium" && (
            <div style={{ marginBottom: "15px" }}>
              {/* Add other fields specific to this job */}
            </div>
          )}
          {/** Dynamic Input Fields Based on Sub-Category **/}
          {[
            "Question Paper Formulation",
            "Question Paper Writing",
            "Question Paper Photocopy",
            "Test Answer Key",
            "Examiner",
            "Practical Examination Honors",
          ].includes(job.jobName) &&
            job.subCategory && (
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Course No:</label>
                <input
                  type="text"
                  name="courseNo"
                  value={job.courseNo}
                  onChange={(e) => handleJobChange(e, index)}
                  required
                  style={inputStyle}
                />
                {/* Add other fields specific to this sub-category */}
              </div>
            )}

          {/** Inputs for jobs without subcategories **/}
          {job.jobName === "Script Evaluation" && (
            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Number of Scripts:</label>
              <input
                type="number"
                name="numberOfStudents"
                value={job.numberOfStudents}
                onChange={(e) => handleJobChange(e, index)}
                required
                style={inputStyle}
              />
              {/* Add other fields specific to this job */}
            </div>
          )}
        {job.jobName === "Inspector Honorarium (Per Tutorial)" && (
            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Number of Scripts:</label>
              <input
                type="number"
                name="numberOfStudents"
                value={job.numberOfStudents}
                onChange={(e) => handleJobChange(e, index)}
                required
                style={inputStyle}
              />
              {/* Add other fields specific to this job */}
            </div>
          )}
          {job.jobName === "Viva Voce Examination" && (
            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Exam Hours:</label>
              <input
                type="number"
                name="examHours"
                value={job.examHours}
                onChange={(e) => handleJobChange(e, index)}
                required
                style={inputStyle}
              />
              {/* Add other fields specific to this job */}
            </div>
          )}

          <button
            type="button"
            onClick={() => handleRemoveJob(index)}
            style={buttonRemoveStyle}
          >
            Remove Job
          </button>
        </div>
      ))}

      <div style={{ marginBottom: "15px", textAlign: "center" }}>
        <button type="button" onClick={handleAddJob} style={buttonStyle}>
          + Add Another Job
        </button>
      </div>

      <div style={{ marginBottom: "80px", textAlign: "center" }}>
        <button type="submit" disabled={loading || uploading} style={buttonStyle}>
          {loading ? (
            <div style={spinnerStyle}></div>
          ) : uploading ? "Uploading..." : "Generate PDF"}
        </button>
      </div>
    </form>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  color: "#555",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "14px",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "10px 20px",
  borderRadius: "5px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
};

const buttonRemoveStyle = {
  padding: "5px 10px",
  borderRadius: "5px",
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
};

export default BillForm;
