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
const stickyNoteSection = document.getElementById("sticky-note-section");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
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
    stickyNoteSection.style.display = "block";
    loadTasks();
    loadStickyNotes();
  } else {
    console.log("Not signed in");
    signInButton.style.display = "inline-block";
    signOutButton.style.display = "none";
    taskSection.style.display = "none";
    stickyNoteSection.style.display = "none";
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
    li.classList.add("task-item");
    const taskData = doc.data();
    const taskText = document.createElement("span");
    taskText.textContent = taskData.task;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskData.completed;
    checkbox.onclick = async () => {
      await db.collection("tasks").doc(doc.id).update({
        completed: checkbox.checked
      });
    };
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = async () => {
      await db.collection("tasks").doc(doc.id).delete();
      loadTasks();
    };
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => {
      const newTaskText = prompt("Edit task:", taskData.task);
      if (newTaskText !== null && newTaskText.trim() !== "") {
        db.collection("tasks").doc(doc.id).update({
          task: newTaskText
        });
        loadTasks();
      }
    };
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

// Sticky Notes

const stickyNoteForm = document.getElementById("sticky-note-form");
const stickyNoteInput = document.getElementById("sticky-note-input");

stickyNoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const stickyNoteText = stickyNoteInput.value;
  if (stickyNoteText.trim() !== "") {
    await db.collection("stickyNotes").add({
      content: stickyNoteText,
      priority: "medium",  // Default priority
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    stickyNoteForm.reset();
    loadStickyNotes();
  }
});

async function loadStickyNotes() {
  stickyNoteList.innerHTML = "";
  const snapshot = await db.collection("stickyNotes").orderBy("timestamp", "desc").get();
  snapshot.forEach(doc => {
    const noteData = doc.data();
    const stickyNote = document.createElement("div");
    stickyNote.classList.add("sticky-note");
    stickyNote.setAttribute("data-priority", noteData.priority);

    const textarea = document.createElement("textarea");
    textarea.textContent = noteData.content;
    stickyNote.appendChild(textarea);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = async () => {
      await db.collection("stickyNotes").doc(doc.id).delete();
      loadStickyNotes();
    };

    const priorityButton = document.createElement("button");
    priorityButton.textContent = "Change Priority";
    priorityButton.onclick = async () => {
      const newPriority = prompt("Enter priority (high, medium, low):", noteData.priority);
      if (newPriority === "high" || newPriority === "medium" || newPriority === "low") {
        await db.collection("stickyNotes").doc(doc.id).update({
          priority: newPriority
        });
        loadStickyNotes();
      }
    };

    stickyNote.appendChild(deleteButton);
    stickyNote.appendChild(priorityButton);
    stickyNoteList.appendChild(stickyNote);
  });
}
