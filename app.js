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
const stickyNoteForm = document.getElementById("sticky-note-form");
const stickyNoteList = document.getElementById("sticky-note-list");
const priorityModal = document.getElementById("priority-modal");
const closeModal = document.querySelector(".close");
const prioritySelect = document.getElementById("priority-select");
const savePriorityButton = document.getElementById("save-priority");
let currentStickyNoteId = null;

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
    stickyNoteForm.style.display = "block";
    loadTasks();
    loadStickyNotes();
  } else {
    console.log("Not signed in");
    signInButton.style.display = "inline-block";
    signOutButton.style.display = "none";
    taskSection.style.display = "none";
    stickyNoteForm.style.display = "none";
    stickyNoteList.innerHTML = "";
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
    li.classList.add("task-item");
    li.textContent = doc.data().task;

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
    await db.collection("sticky-notes").add({
      note: noteText,
      priority: "low",
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    stickyNoteForm.reset();
    loadStickyNotes();
  }
});

async function loadStickyNotes() {
  stickyNoteList.innerHTML = "";
  const snapshot = await db.collection("sticky-notes").orderBy("timestamp", "desc").get();
  snapshot.forEach(doc => {
    const div = document.createElement("div");
    div.classList.add("sticky-note");
    div.setAttribute("data-id", doc.id);
    div.setAttribute("data-priority", doc.data().priority);
    div.textContent = doc.data().note;

    div.addEventListener("click", () => {
      currentStickyNoteId = doc.id;
      priorityModal.style.display = "block";
    });

    stickyNoteList.appendChild(div);
  });
}

closeModal.addEventListener("click", () => {
  priorityModal.style.display = "none";
});

savePriorityButton.addEventListener("click", async () => {
  const priority = prioritySelect.value;
  await db.collection("sticky-notes").doc(currentStickyNoteId).update({ priority });
  priorityModal.style.display = "none";
  loadStickyNotes();
});
