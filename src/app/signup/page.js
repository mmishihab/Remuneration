/** @format */

"use client";

import React, { useState, useContext } from "react";
import { color } from "../../../components/Color";
import { auth, database } from "../../../firebase.config"; // Update the path as necessary
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { ref, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { UserContext } from "../../../context/user.context";

function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { savedUser, setSavedUser } = useContext(UserContext);

  const router = useRouter();
  const [createUserWithEmailAndPassword, user, loading, authError] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );

      if (userCredential) {
        const roles = {
          teacher: false,
          authority: false,
          chairman: false,
        };

        if (role === "teacher") roles.teacher = true;
        if (role === "authority") roles.authority = true;
        if (role === "chairman") roles.chairman = true;

        // User information to store
        const userInfo = {
          email: userCredential.user.email,
          username: username,
          roles: roles,
        };

        // Store user information in Realtime Database
        await set(ref(database, `users/${userCredential.user.uid}`), userInfo);

        // Set the user information in the savedUser state
        setSavedUser(userInfo);

        setSuccess("Successfully signed up!");
        setError(""); // Clear any previous error messages

        resetForm();
        router.push("/Dashboard");
      }
    } catch (error) {
      setSuccess(""); // Clear any previous success messages
      setError(error.message);
    }
  };

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setRole("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSignUp();
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      style={{
        width: "100%",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <h1>Sign Up</h1>
      <p>Bill paying for Examination work for teachers</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "start",
        }}>
        <label>Email</label>
        <input
          style={{
            width: "600px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
          }}
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <label>Username</label>
        <input
          style={{
            width: "600px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
          }}
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <label>Password</label>
        <div
          style={{
            position: "relative",
          }}>
          <input
            style={{
              width: "600px",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
            }}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={toggleShowPassword}>
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <label>Role</label>
        <select
          style={{
            width: "600px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
          }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onKeyPress={handleKeyPress}>
          <option value="">Select Role</option>
          <option value="teacher">Teacher</option>
          <option value="authority">Authority</option>
          <option value="chairman">Chairman</option>
        </select>
        <button
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: color.teal,
            color: color.white,
            fontSize: "16px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
            boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
          }}
          onClick={handleSignUp}
          disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
      {error && <p style={{ color: "red", fontSize: "16px" }}>{error}</p>}
      {success && <p style={{ color: "green", fontSize: "16px" }}>{success}</p>}
      <p style={{ fontSize: "16px", marginTop: 20 }}>
        Already have a account?{" "}
        <span
          style={{
            color: color.teal,
            cursor: "pointer",
            textDecoration: "none",
          }}
          onClick={() => router.push("/")}>
          Sign in
        </span>
      </p>
    </div>
  );
}

export default SignUp;
