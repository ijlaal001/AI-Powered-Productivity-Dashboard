// Using compat version for Firebase 9
import firebase from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHrbrU8BWFB4JEvIsvVquNEEU2EYf3uck",
  authDomain: "productivity-dashboard-with-ai.firebaseapp.com",
  projectId: "productivity-dashboard-with-ai",
  storageBucket: "productivity-dashboard-with-ai.appspot.com",
  messagingSenderId: "10807938376",
  appId: "1:10807938376:web:efdda234b5b24821aab77d"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
