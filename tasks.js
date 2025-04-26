const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks-list');

addTaskButton.addEventListener('click', () => {
  const task = taskInput.value.trim();
  if (task) {
    const li = document.createElement('li');
    li.className = 'p-2 bg-gray-700 rounded-xl shadow mb-2';
    li.textContent = task;
    tasksList.appendChild(li);
    taskInput.value = '';
  }
});

// Logout
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    window.location.href = "index.html";
  });
}
