"use client";
import { useAuth } from "@clerk/nextjs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { get } from "http";

const firebaseConfig = {
    apiKey: "AIzaSyCPW3CKXJDc_5XadYW9zNsvQ2IiHDSY-zs",
    authDomain: "errorcraft-f0d72.firebaseapp.com",
    projectId: "errorcraft-f0d72",
    storageBucket: "errorcraft-f0d72.appspot.com",
    messagingSenderId: "307701554089",
    appId: "1:307701554089:web:3d6fdf3210dd6b545882b8",
    measurementId: "G-MPZP7KH95J"
  };

// Connect to your Firebase app
const app = initializeApp(firebaseConfig);
// Connect to your Firestore database
const db = getFirestore(app);
// Connect to Firebase auth
const auth = getAuth(app);

const analytics = getAnalytics(app);

// Remove this if you do not have Firestore set up
// for your Firebase app
const getFirestoreData = async () => {
  const docRef = doc(db, "example", "example-document");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

export default function FirebaseUI() {
  const { getToken } = useAuth();
  const signInWithClerk = async () => {
    console.log("Sign in with clerk");
    const token = await getToken({ template: "integration_firebase" });
    const userCredentials = await signInWithCustomToken(auth, token || "");
     // The userCredentials.user object can call the methods of
     // the Firebase platform as an authenticated user.
    console.log("User:", userCredentials.user);
  };

  return (
    <main style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
      <button onClick={signInWithClerk}>Sign in</button>
      <button onClick={getFirestoreData}>Get document</button>
    </main>
  );
}