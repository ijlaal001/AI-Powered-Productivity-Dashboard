// Import Firebase setup
import { auth, provider } from './firebase-config.js';

// Login button
const loginButton = document.getElementById('login-btn');
if (loginButton) {
  loginButton.addEventListener('click', () => {
    auth.signInWithPopup(provider).then((result) => {
      console.log("User signed in:", result.user);
      window.location.href = "dashboard.html";
    }).catch((error) => {
      console.error("Login Error:", error);
    });
  });
}

// Logout button
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
      console.log("User signed out");
      window.location.href = "index.html";
    }).catch((error) => {
      console.error("Logout Error:", error);
    });
  });
}

// Auth state change
auth.onAuthStateChanged((user) => {
  const isLoginPage = window.location.pathname.endsWith('index.html');
  if (user && isLoginPage) {
    window.location.href = "dashboard.html";
  } else if (!user && !isLoginPage) {
    window.location.href = "index.html";
  }
});
