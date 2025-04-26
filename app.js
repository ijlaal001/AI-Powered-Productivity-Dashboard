// Your Firebase configuration
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

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Elements
const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('signOutButton');
const userInfo = document.getElementById('userInfo');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

let user = null;

// Sign in
signInButton.onclick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
};

// Sign out
signOutButton.onclick = () => {
    auth.signOut();
};

// Auth state
auth.onAuthStateChanged((u) => {
    if (u) {
        user = u;
        userInfo.innerText = `Signed in as: ${u.displayName}`;
        signInButton.style.display = "none";
        signOutButton.style.display = "inline";
        loadTasks();
    } else {
        user = null;
        userInfo.innerText = "Not signed in";
        signInButton.style.display = "inline";
        signOutButton.style.display = "none";
        taskList.innerHTML = "";
    }
});

// Add task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = taskInput.value.trim();
    if (task && user) {
        db.collection('users').doc(user.uid).collection('tasks').add({
            text: task,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            taskInput.value = '';
            loadTasks();
        }).catch((error) => {
            console.error("Error adding task: ", error);
        });
    }
});

// Load tasks
function loadTasks() {
    if (user) {
        db.collection('users').doc(user.uid).collection('tasks').orderBy('createdAt', 'desc').get()
        .then(snapshot => {
            taskList.innerHTML = "";
            snapshot.forEach(doc => {
                const li = document.createElement('li');
                li.textContent = doc.data().text;
                taskList.appendChild(li);
            });
        });
    }
}
