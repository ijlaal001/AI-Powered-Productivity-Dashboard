// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHrbrU8BWFB4JEvIsvVquNEEU2EYf3uck",
    authDomain: "productivity-dashboard-with-ai.firebaseapp.com",
    projectId: "productivity-dashboard-with-ai",
    storageBucket: "productivity-dashboard-with-ai.appspot.com",
    messagingSenderId: "10807938376",
    appId: "1:10807938376:web:efdda234b5b24821aab77d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

// Sign in with Google function
function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log("Signed in as:", user.displayName);
        })
        .catch((error) => {
            console.error("Error signing in:", error.message);
        });
}

// Attach signIn to button
document.getElementById("sign-in-button").addEventListener("click", signIn);
