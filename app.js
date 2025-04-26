// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAHrbrU8BWFB4JEvIsvVquNEEU2EYf3uck",
    authDomain: "productivity-dashboard-with-ai.firebaseapp.com",
    projectId: "productivity-dashboard-with-ai",
    storageBucket: "productivity-dashboard-with-ai.firebasestorage.app",
    messagingSenderId: "10807938376",
    appId: "1:10807938376:web:efdda234b5b24821aab77d"
};

// Initialize Firebase app
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Function to handle Google Sign-In
function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // User signed in successfully, log their info
            const user = result.user;
            console.log("Signed in as:", user.displayName);
            // Additional logic can be added here
        })
        .catch((error) => {
            // Handle errors
            console.error("Error during sign-in:", error.message);
        });
}

// Attach the signIn function to the button
document.getElementById("sign-in-button").addEventListener("click", signIn);
