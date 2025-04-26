// app.js
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from './firebase-config.js';

// Handling the login button click
const loginButton = document.getElementById('login-btn');
if (loginButton) {
  loginButton.addEventListener('click', () => {
    signInWithPopup(auth, provider).then((result) => {
      console.log("User signed in:", result.user);
      // Redirect to dashboard after login
      window.location.href = "dashboard.html";  // Ensure this points to your dashboard page
    }).catch((error) => {
      console.error("Error during login:", error);
    });
  });
}

// Handling logout button click
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
      console.log("User signed out");
      // Redirect to login page after logout
      window.location.href = "index.html";  // Redirect back to login page
    }).catch((error) => {
      console.error("Error during logout:", error);
    });
  });
}

// Firebase Auth state change (handle redirects)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If user is authenticated, redirect to dashboard
    if (window.location.pathname.endsWith('index.html')) {
      window.location.href = "dashboard.html"; // This redirects to the dashboard if the user is logged in
    }
  } else {
    // If user is not authenticated, redirect to login page (if not already on login page)
    if (!window.location.pathname.endsWith('index.html')) {
      window.location.href = "index.html"; // Ensure the user is redirected back to the login page if not authenticated
    }
  }
});
