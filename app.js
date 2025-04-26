import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHrbrU8BWFB4JEvIsvVquNEEU2EYf3uck",
  authDomain: "productivity-dashboard-with-ai.firebaseapp.com",
  projectId: "productivity-dashboard-with-ai",
  storageBucket: "productivity-dashboard-with-ai.firebasestorage.app",
  messagingSenderId: "10807938376",
  appId: "1:10807938376:web:efdda234b5b24821aab77d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const signIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Signed in:", result.user.displayName);
  } catch (error) {
    console.error("Sign-in error:", error);
  }
};
