import { db } from "../../../firebase.config"; // Ensure Firebase is configured
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore"; 

// Fetch all teachers from Firestore
const fetchTeachers = async () => {
  const querySnapshot = await getDocs(collection(db, "teachers"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a new teacher
const addTeacher = async (teacherData) => {
  await addDoc(collection(db, "teachers"), teacherData);
};

// Update a teacher's information
const updateTeacher = async (teacherId, updatedData) => {
  const teacherDoc = doc(db, "teachers", teacherId);
  await updateDoc(teacherDoc, updatedData);
};

// Delete a teacher
const deleteTeacher = async (teacherId) => {
  const teacherDoc = doc(db, "teachers", teacherId);
  await deleteDoc(teacherDoc);
};
