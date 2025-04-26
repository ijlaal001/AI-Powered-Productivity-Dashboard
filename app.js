// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAHrbrU8BWFB4JEvIsvVquNEEU2EYf3uck",
    authDomain: "productivity-dashboard-with-ai.firebaseapp.com",
    projectId: "productivity-dashboard-with-ai",
    storageBucket: "productivity-dashboard-with-ai.firebasestorage.app",
    messagingSenderId: "10807938376",
    appId: "1:10807938376:web:efdda234b5b24821aab77d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign In Function
function signIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Signed in as:", user.displayName);
            document.getElementById("signInButton").style.display = "none";
            document.getElementById("signOutButton").style.display = "block";
            document.getElementById("task-section").style.display = "block";
            document.getElementById("notes-section").style.display = "block";
            loadTasks();
            loadNotes();
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
        });
}

// Sign Out Function
function signOut() {
    firebaseSignOut(auth)
        .then(() => {
            document.getElementById("signInButton").style.display = "block";
            document.getElementById("signOutButton").style.display = "none";
            document.getElementById("task-section").style.display = "none";
            document.getElementById("notes-section").style.display = "none";
            console.log("Signed out!");
        })
        .catch((error) => {
            console.error("Error during sign-out:", error);
        });
}

// --- Task Functions ---
function addTask() {
    const taskText = document.getElementById("taskInput").value;
    if (taskText.trim() !== "") {
        const user = auth.currentUser;
        if (user) {
            const tasksRef = collection(db, "users", user.uid, "tasks");
            addDoc(tasksRef, {
                text: taskText,
                timestamp: new Date()
            })
            .then(() => {
                console.log("Task added!");
                document.getElementById("taskInput").value = "";
                loadTasks();
            })
            .catch((error) => {
                console.error("Error adding task: ", error);
            });
        }
    }
}

function loadTasks() {
    const user = auth.currentUser;
    if (user) {
        const tasksRef = collection(db, "users", user.uid, "tasks");
        const tasksQuery = query(tasksRef, orderBy("timestamp", "desc"));
        getDocs(tasksQuery)
            .then((querySnapshot) => {
                const taskList = document.getElementById("taskList");
                taskList.innerHTML = "";
                querySnapshot.forEach((doc) => {
                    const taskItem = document.createElement("li");
                    taskItem.textContent = doc.data().text;
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.classList.add("delete-btn");
                    deleteButton.onclick = () => deleteTask(doc.id);
                    taskItem.appendChild(deleteButton);
                    taskList.appendChild(taskItem);
                });
            })
            .catch((error) => {
                console.error("Error loading tasks: ", error);
            });
    }
}

function deleteTask(taskId) {
    const user = auth.currentUser;
    if (user) {
        const taskRef = doc(db, "users", user.uid, "tasks", taskId);
        deleteDoc(taskRef)
            .then(() => {
                console.log("Task deleted!");
                loadTasks();
            })
            .catch((error) => {
                console.error("Error deleting task: ", error);
            });
    }
}

// --- Sticky Notes Functions ---
function addNote() {
    const noteText = document.getElementById("noteInput").value;
    if (noteText.trim() !== "") {
        const user = auth.currentUser;
        if (user) {
            const notesRef = collection(db, "users", user.uid, "notes");
            addDoc(notesRef, {
                text: noteText,
                timestamp: new Date()
            })
            .then(() => {
                console.log("Note added!");
                document.getElementById("noteInput").value = "";
                loadNotes();
            })
            .catch((error) => {
                console.error("Error adding note: ", error);
            });
        }
    }
}

function loadNotes() {
    const user = auth.currentUser;
    if (user) {
        const notesRef = collection(db, "users", user.uid, "notes");
        const notesQuery = query(notesRef, orderBy("timestamp", "desc"));
        getDocs(notesQuery)
            .then((querySnapshot) => {
                const noteList = document.getElementById("noteList");
                noteList.innerHTML = "";
                querySnapshot.forEach((doc) => {
                    const noteItem = document.createElement("li");
                    noteItem.textContent = doc.data().text;
                    noteList.appendChild(noteItem);
                });
            })
            .catch((error) => {
                console.error("Error loading notes: ", error);
            });
    }
}
