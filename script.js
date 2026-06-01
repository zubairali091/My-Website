/**
 * To-Do List App
 * Add, complete, delete tasks — saved in localStorage
 */

let tasks = [];
let currentFilter = "all";

const todoForm = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const taskCount = document.getElementById("taskCount");
const filterBtns = document.querySelectorAll(".filter-btn");

// Load saved tasks from browser storage
function loadTasks() {
  const saved = localStorage.getItem("codexa-tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// Save tasks to browser storage
function saveTasks() {
  localStorage.setItem("codexa-tasks", JSON.stringify(tasks));
}

function addTask(text) {
  tasks.push({
    id: Date.now(),
    text: text.trim(),
    done: false,
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(function (t) {
    if (t.id === id) t.done = !t.done;
    return t;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) {
    return t.id !== id;
  });
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter(function (t) { return !t.done; });
  if (currentFilter === "done") return tasks.filter(function (t) { return t.done; });
  return tasks;
}

function renderTasks() {
  const filtered = getFilteredTasks();
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyMsg.classList.remove("hidden");
    taskCount.textContent = "";
    return;
  }

  emptyMsg.classList.add("hidden");

  if (filtered.length === 0) {
    taskList.innerHTML = '<li style="text-align:center;color:#aaa;padding:16px;">No tasks in this filter.</li>';
  } else {
    filtered.forEach(function (task) {
      const li = document.createElement("li");
      li.className = "task-item" + (task.done ? " done" : "");
      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.done ? "checked" : ""}>
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="btn-delete" title="Delete">×</button>
      `;

      li.querySelector(".task-checkbox").addEventListener("change", function () {
        toggleTask(task.id);
      });

      li.querySelector(".btn-delete").addEventListener("click", function () {
        deleteTask(task.id);
      });

      taskList.appendChild(li);
    });
  }

  const remaining = tasks.filter(function (t) { return !t.done; }).length;
  taskCount.textContent = remaining + " task" + (remaining !== 1 ? "s" : "") + " remaining";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Form submit
todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (taskInput.value.trim()) {
    addTask(taskInput.value);
    taskInput.value = "";
    taskInput.focus();
  }
});

// Filter buttons
filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    renderTasks();
  });
});

loadTasks();
renderTasks();
