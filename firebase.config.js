/** @format */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCGNh4mFUWONnZ7RzLeMfj01iABRK2BjrE",
  authDomain: "renumeration-2b70f.firebaseapp.com",
  projectId: "renumeration-2b70f",
  storageBucket: "renumeration-2b70f.appspot.com",
  messagingSenderId: "736919430183",
  appId: "1:736919430183:web:9c028a65502d956ce69a02",
  databaseURL:
    "https://renumeration-2b70f-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
