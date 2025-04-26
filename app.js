// app.js
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from './firebase-config.js';

// Login Button
const loginButton = document.getElementById('login-btn');
if (loginButton) {
  loginButton.addEventListener('click', () => {
    signInWithPopup(auth, provider);
  });
}

// Logout Button
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    signOut(auth);
  });
}

// User Authentication Checker
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (window.location.pathname.endsWith('index.html')) {
      window.location.href = "dashboard.html";
    }
  } else {
    if (!window.location.pathname.endsWith('index.html')) {
      window.location.href = "index.html";
    }
  }
});
