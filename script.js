const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const undoBtn = document.getElementById("undoBtn");
const clearBtn = document.getElementById("clearBtn");

let lastDeleted = null;

// Load tasks from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => createTaskElement(task.text, task.completed));
});

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.querySelector("span").classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Create task element
function createTaskElement(taskText, completed = false) {
  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between align-items-center";
  li.innerHTML = `
    <span class="${completed ? 'completed' : ''}">${taskText}</span>
    <div>
      <button type="button" class="btn btn-sm btn-outline-success me-2 completeBtn">
        <i class="bi bi-check-lg"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-danger deleteBtn">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  `;
  taskList.appendChild(li);

  // Complete task toggle
  li.querySelector(".completeBtn").addEventListener("click", () => {
    li.querySelector("span").classList.toggle("completed");
    saveTasks();
  });

  // Delete task
  li.querySelector(".deleteBtn").addEventListener("click", () => {
    lastDeleted = {
      text: li.querySelector("span").textContent,
      completed: li.querySelector("span").classList.contains("completed")
    };
    li.remove();
    undoBtn.disabled = false;
    saveTasks();
  });

  saveTasks();
}

// Add new task
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  createTaskElement(taskText);
  taskInput.value = "";
});

// Undo last delete
undoBtn.addEventListener("click", () => {
  if (lastDeleted) {
    createTaskElement(lastDeleted.text, lastDeleted.completed);
    lastDeleted = null;
    undoBtn.disabled = true;
  }
});

// Clear all tasks
clearBtn.addEventListener("click", () => {
  taskList.innerHTML = "";
  localStorage.removeItem("tasks");
  lastDeleted = null;
  undoBtn.disabled = true;
});

const toggleBtn = document.getElementById("toggleBtn");
const body = document.body;

// Load saved mode
if (localStorage.getItem("mode") === "dark") {
  body.classList.add("dark");
  toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>'; // sun icon
} else {
  toggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>'; // moon icon
}

// Toggle dark mode
toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>'; // switch to sun
    localStorage.setItem("mode", "dark");
  } else {
    toggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>'; // switch to moon
    localStorage.setItem("mode", "light");
  }
});
