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
const stickyNotesSection = document.getElementById("sticky-notes-section");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const stickyNoteForm = document.getElementById("sticky-note-form");
const stickyNoteList = document.getElementById("sticky-note-list");

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
    stickyNotesSection.style.display = "block"; // Make sure sticky notes section is visible when logged in
    loadTasks();
    loadStickyNotes();
  } else {
    console.log("Not signed in");
    signInButton.style.display = "inline-block";
    signOutButton.style.display = "none";
    taskSection.style.display = "none";
    stickyNotesSection.style.display = "none"; // Hide sticky notes section when not signed in
    taskList.innerHTML = "";
    stickyNoteList.innerHTML = "";
  }
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const taskText = document.getElementById("task-input").value;
  if (taskText.trim() !== "") {
    await db.collection("tasks").add({
      task: taskText,
      completed: false,
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
    const taskData = doc.data();
    li.classList.add("task-item");
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskData.completed;
    checkbox.addEventListener("change", async () => {
      await db.collection("tasks").doc(doc.id).update({
        completed: checkbox.checked
      });
    });

    const taskText = document.createElement("span");
    taskText.textContent = taskData.task;
    taskText.classList.add(taskData.completed ? "completed" : "");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", async () => {
      const newTask = prompt("Edit your task", taskData.task);
      if (newTask) {
        await db.collection("tasks").doc(doc.id).update({ task: newTask });
        loadTasks();
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await db.collection("tasks").doc(doc.id).delete();
      loadTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

// Sticky Notes Section
stickyNoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const noteText = document.getElementById("sticky-note-input").value;
  if (noteText.trim() !== "") {
    await db.collection("sticky-notes").add({
      note: noteText,
      priority: "low", // Default priority
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
    const li = document.createElement("li");
    const noteData = doc.data();
    li.classList.add("sticky-note-item");

    const prioritySelect = document.createElement("select");
    const options = ["low", "medium", "high"];
    options.forEach(priority => {
      const option = document.createElement("option");
      option.value = priority;
      option.textContent = priority;
      if (noteData.priority === priority) option.selected = true;
      prioritySelect.appendChild(option);
    });
    
    prioritySelect.addEventListener("change", async () => {
      await db.collection("sticky-notes").doc(doc.id).update({
        priority: prioritySelect.value
      });
    });

    const noteText = document.createElement("span");
    noteText.textContent = noteData.note;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await db.collection("sticky-notes").doc(doc.id).delete();
      loadStickyNotes();
    });

    li.appendChild(prioritySelect);
    li.appendChild(noteText);
    li.appendChild(deleteButton);
    stickyNoteList.appendChild(li);
  });
}
