// Import the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHrbrU8BWFB4JEvIsvVquNEEU2EYf3uck",
    authDomain: "productivity-dashboard-with-ai.firebaseapp.com",
    projectId: "productivity-dashboard-with-ai",
    storageBucket: "productivity-dashboard-with-ai.firebasestorage.app",
    messagingSenderId: "10807938376",
    appId: "1:10807938376:web:efdda234b5b24821aab77d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to handle Google Sign-In
function signIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // User signed in successfully, log their info
            const user = result.user;
            console.log("Signed in as:", user.displayName);
            // Here you can handle additional logic, like storing user data in Firestore or redirecting
        })
        .catch((error) => {
            // Handle any errors that occur during sign-in
            console.error("Error during sign-in:", error.message);
        });
}

// Attach the signIn function to the button's click event
document.getElementById("sign-in-button").addEventListener("click", signIn);
