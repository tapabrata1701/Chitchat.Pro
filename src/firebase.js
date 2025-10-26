// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";   // 👈 import auth
import { doc, getFirestore, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCljyiFq9caUXqias24lDVY53oRlRPWZXg",
  authDomain: "chitchat-de6db.firebaseapp.com",
  projectId: "chitchat-de6db",
  storageBucket: "chitchat-de6db.firebasestorage.app",
  messagingSenderId: "582360800020",
  appId: "1:582360800020:web:d54ceb8e4d9c9be905c001",
  measurementId: "G-9GKRC0WZZN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const signup = async (email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid),{
      id:user.uid,
      email,
      lastSeen:Date.now()
    })
    await setDoc(doc(db,"chats", user.uid),{
      chatData:[]
    })
  } catch (error) {
    console.error(error)
    toast.error(error.code)
  }
}

const login = async (email, password) =>{
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code);
  }
}

// Utility function to ensure user documents exist
const ensureUserDocuments = async (user) => {
  try {
    console.log("Creating documents for user:", user.uid, user.email);
    
    // Check if user document exists, create if not
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log("Creating user document...");
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
        lastSeen: Date.now()
      });
      console.log("User document created successfully");
    } else {
      console.log("User document already exists");
    }
    
    // Check if chat document exists, create if not
    const chatDocRef = doc(db, "chats", user.uid);
    const chatDoc = await getDoc(chatDocRef);
    
    if (!chatDoc.exists()) {
      console.log("Creating chat document...");
      await setDoc(chatDocRef, {
        chatData: []
      });
      console.log("Chat document created successfully");
    } else {
      console.log("Chat document already exists");
    }
  } catch (error) {
    console.error("Error ensuring user documents:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    throw error;
  }
}





// Logout function
const logout = async () => {
  try {
    await signOut(auth);
    sessionStorage.removeItem('isAuthenticated');
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error);
    toast.error("Error logging out. Please try again.");
  }
};

// ✅ Initialize Auth and export it
export const auth = getAuth(app);
export { db };
export default app;
export {signup, login, ensureUserDocuments, logout}
