// No import or export here now

// Handling the login button click
const loginButton = document.getElementById('login-btn');
if (loginButton) {
  loginButton.addEventListener('click', () => {
    auth.signInWithPopup(provider).then((result) => {
      console.log("User signed in:", result.user);
      window.location.href = "dashboard.html";
    }).catch((error) => {
      console.error("Error during login:", error);
    });
  });
}

// Handling logout button click
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
      console.log("User signed out");
      window.location.href = "index.html";
    }).catch((error) => {
      console.error("Error during logout:", error);
    });
  });
}

// Firebase Auth state change
auth.onAuthStateChanged((user) => {
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
