// Firebase config
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
const auth = firebase.auth();
const db = firebase.firestore();

const signInButton = document.querySelector("#auth-section button:nth-child(1)");
const signOutButton = document.querySelector("#auth-section button:nth-child(2)");
const taskSection = document.getElementById("task-section");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

function signOut() {
  auth.signOut();
}

auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Signed in as:", user.displayName);
    signInButton.style.display = "none";
    signOutButton.style.display = "inline-block";
    taskSection.style.display = "block";
    loadTasks();
  } else {
    console.log("Not signed in");
    signInButton.style.display = "inline-block";
    signOutButton.style.display = "none";
    taskSection.style.display = "none";
    taskList.innerHTML = "";
  }
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const taskText = document.getElementById("task-input").value;
  if (taskText.trim() !== "") {
    await db.collection("tasks").add({
      task: taskText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    taskForm.reset();
    loadTasks();
  }
});

async function loadTasks() {
  taskList.innerHTML = "";
  const snapshot = await db.collection("tasks").orderBy("timestamp", "desc").get();
  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().task;
    taskList.appendChild(li);
  });
}
