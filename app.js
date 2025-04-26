// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAHrbrU8BWFB4JEvIsvVquNEEU2EYf3uck",
    authDomain: "productivity-dashboard-with-ai.firebaseapp.com",
    projectId: "productivity-dashboard-with-ai",
    storageBucket: "productivity-dashboard-with-ai.firebasestorage.app",
    messagingSenderId: "10807938376",
    appId: "1:10807938376:web:efdda234b5b24821aab77d"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Sign In Function
function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
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
    auth.signOut().then(() => {
        document.getElementById("signInButton").style.display = "block";
        document.getElementById("signOutButton").style.display = "none";
        document.getElementById("task-section").style.display = "none";
        document.getElementById("notes-section").style.display = "none";
        console.log("Signed out!");
    });
}

// --- Task Functions ---
function addTask() {
    const taskText = document.getElementById("taskInput").value;
    if (taskText.trim() !== "") {
        const user = auth.currentUser;
        if (user) {
            const tasksRef = db.collection("users").doc(user.uid).collection("tasks");
            tasksRef.add({
                text: taskText,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
        const tasksRef = db.collection("users").doc(user.uid).collection("tasks").orderBy("timestamp", "desc");
        tasksRef.get().then((querySnapshot) => {
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
        });
    }
}

function deleteTask(taskId) {
    const user = auth.currentUser;
    if (user) {
        const taskRef = db.collection("users").doc(user.uid).collection("tasks").doc(taskId);
        taskRef.delete()
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
            const notesRef = db.collection("users").doc(user.uid).collection("notes");
            notesRef.add({
                text: noteText,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
        const notesRef = db.collection("users").doc(user.uid).collection("notes").orderBy("timestamp", "desc");
        notesRef.get().then((querySnapshot) => {
            const noteList = document.getElementById("noteList");
            noteList.innerHTML = "";
            querySnapshot.forEach((doc) => {
                const noteItem = document.createElement("li");
                noteItem.textContent = doc.data().text;

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("delete-btn");
                deleteButton.onclick = () => deleteNote(doc.id);

                noteItem.appendChild(deleteButton);
                noteList.appendChild(noteItem);
            });
        });
    }
}

function deleteNote(noteId) {
    const user = auth.currentUser;
    if (user) {
        const noteRef = db.collection("users").doc(user.uid).collection("notes").doc(noteId);
        noteRef.delete()
            .then(() => {
                console.log("Note deleted!");
                loadNotes();
            })
            .catch((error) => {
                console.error("Error deleting note: ", error);
            });
    }
}
