// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAHrbrU8BWFB4JEvIsvVquNEEU2EYf3uck",
    authDomain: "productivity-dashboard-with-ai.firebaseapp.com",
    projectId: "productivity-dashboard-with-ai",
    storageBucket: "productivity-dashboard-with-ai.appspot.com",
    messagingSenderId: "10807938376",
    appId: "1:10807938376:web:efdda234b5b24821aab77d"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

let taskInput = document.getElementById("taskInput");
let taskList = document.getElementById("taskList");
let addTaskBtn = document.getElementById("addTaskBtn");
let loginBtn = document.getElementById("loginBtn");
let logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;

auth.onAuthStateChanged(async function(user) {
    if (user) {
        currentUser = user;
        await loadTasks();
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
    } else {
        currentUser = null;
        taskList.innerHTML = "";
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
    }
});

async function loadTasks() {
    taskList.innerHTML = "";

    if (!currentUser) {
        return;
    }

    let querySnapshot = await db.collection("tasks").where("uid", "==", currentUser.uid).get();
    let tasks = [];

    querySnapshot.forEach(function(doc) {
        let data = doc.data();
        tasks.push({
            id: doc.id,
            text: data.text,
            priority: data.priority || "Low"
        });
    });

    tasks.sort(comparePriority);

    tasks.forEach(function(task) {
        addTaskToUI(task.id, task.text, task.priority);
    });
}

function comparePriority(a, b) {
    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
}

function addTaskToUI(id, text, priority) {
    let li = document.createElement("li");
    li.className = "task-item";
    li.setAttribute("data-id", id);

    let span = document.createElement("span");
    span.innerText = text;

    let select = document.createElement("select");
    select.innerHTML = `
        <option value="High" ${priority === "High" ? "selected" : ""}>High</option>
        <option value="Medium" ${priority === "Medium" ? "selected" : ""}>Medium</option>
        <option value="Low" ${priority === "Low" ? "selected" : ""}>Low</option>
    `;
    select.addEventListener("change", function() {
        updatePriority(id, select.value);
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", function() {
        deleteTask(id);
    });

    li.appendChild(span);
    li.appendChild(select);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

async function addTask() {
    if (!currentUser || taskInput.value.trim() === "") {
        return;
    }

    let docRef = await db.collection("tasks").add({
        uid: currentUser.uid,
        text: taskInput.value.trim(),
        priority: "Low"
    });

    addTaskToUI(docRef.id, taskInput.value.trim(), "Low");
    taskInput.value = "";
}

async function updatePriority(id, newPriority) {
    if (!currentUser) {
        return;
    }

    await db.collection("tasks").doc(id).update({
        priority: newPriority
    });

    await loadTasks();
}

async function deleteTask(id) {
    if (!currentUser) {
        return;
    }

    await db.collection("tasks").doc(id).delete();
    await loadTasks();
}

function login() {
    let provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
}

function logout() {
    auth.signOut();
}

addTaskBtn.addEventListener("click", addTask);
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
