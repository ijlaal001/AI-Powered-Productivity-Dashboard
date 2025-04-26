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
const stickyNotesSection = document.getElementById("sticky-notes-section");
const stickyNoteForm = document.getElementById("sticky-note-form");
const stickyNotesList = document.getElementById("sticky-notes-list");

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
    stickyNotesSection.style.display = "block";
    loadTasks();
    loadStickyNotes();
  } else {
    console.log("Not signed in");
    signInButton.style.display = "inline-block";
    signOutButton.style.display = "none";
    taskSection.style.display = "none";
    stickyNotesSection.style.display = "none";
    taskList.innerHTML = "";
    stickyNotesList.innerHTML = "";
  }
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const taskText = document.getElementById("task-input").value;
  if (taskText.trim() !== "") {
    const docRef = await db.collection("tasks").add({
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
    const taskText = doc.data().task;
    li.textContent = taskText;

    // Create delete button for each task
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = async () => {
      await db.collection("tasks").doc(doc.id).delete();
      loadTasks();
    };

    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

stickyNoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const noteText = document.getElementById("sticky-note-input").value;
  if (noteText.trim() !== "") {
    const docRef = await db.collection("stickyNotes").add({
      note: noteText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    stickyNoteForm.reset();
    loadStickyNotes();
  }
});

async function loadStickyNotes() {
  stickyNotesList.innerHTML = "";
  const snapshot = await db.collection("stickyNotes").orderBy("timestamp", "desc").get();
  snapshot.forEach(doc => {
    const note = doc.data().note;
    const div = document.createElement("div");
    div.classList.add("sticky-note");
    div.textContent = note;

    // Create delete button for each sticky note
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = async () => {
      await db.collection("stickyNotes").doc(doc.id).delete();
      loadStickyNotes();
    };

    div.appendChild(deleteButton);
    stickyNotesList.appendChild(div);
  });
}
