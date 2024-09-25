/** @format */

"use client";

import React, { useState, useContext } from "react";
import { color } from "../../components/Color";
import { auth, database } from "../../firebase.config";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { ref, set, get } from "firebase/database";
import { UserContext } from "../../context/user.context";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { savedUser, setSavedUser } = useContext(UserContext);

  const router = useRouter();
  const [signInWithEmailAndPassword, user, loading, authError] =
    useSignInWithEmailAndPassword(auth);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(email, password);
      if (userCredential) {
        setError("");
        const uid = userCredential.user.uid;
        console.log("UID:", uid); // Debugging: Log the UID

        // Retrieve the user data from the database using the user's UID
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log("User Data:", userData); // Debugging: Log the user data
          const existingUserRef = ref(database, `users/${uid}`);
          const existingUserSnapshot = await get(existingUserRef);

          if (existingUserSnapshot.exists()) {
            setSavedUser(existingUserSnapshot.val());
            router.push("/Dashboard");
            console.log("Existing User Data:", existingUserSnapshot.val()); // Debugging: Log the existing user data
          } else {
            setError("User not found in the database.");
          }
        } else {
          setError("User not found in the database.");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSignIn();
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
      <h1>Sign In</h1>
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
          onClick={handleSignIn} // Updated to remove unnecessary parameters
          disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>
      <p style={{ fontSize: 16 }}>
        Don't have an account?{" "}
        <span
          style={{
            color: color.teal,
            cursor: "pointer",
            textDecoration: "none",
          }}
          onClick={() => router.push("/signup")}>
          Sign Up
        </span>
      </p>
      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
      {authError && (
        <p style={{ color: "red", marginTop: "20px" }}>{authError.message}</p>
      )}
    </div>
  );
}

export default SignIn;
