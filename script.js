const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const counter = document.getElementById("counter");
const form = document.getElementById("todo-form");

let tasks = [];

// ========== UTILITIES ==========
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem("tasks");
  tasks = stored ? JSON.parse(stored) : [];
}

function updateCounter() {
  const active = tasks.filter(t => !t.completed).length;
  counter.textContent =
    tasks.length === 0
      ? "No tasks yet!"
      : `${active} task${active !== 1 ? "s" : ""} left`;
}

// ========== RENDER ==========
function renderTasks() {
  listContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("checked");
    li.dataset.index = index;

    // Close button
    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);
  });
  updateCounter();
}

// ========== ACTIONS ==========
function addTask(text) {
  if (!text.trim()) return;
  tasks.push({ text: text.trim(), completed: false });
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// ========== EVENT LISTENERS ==========
form.addEventListener("submit", e => {
  e.preventDefault();
  addTask(inputBox.value);
  inputBox.value = "";
  inputBox.focus();
});

listContainer.addEventListener("click", e => {
  const li = e.target.closest("li");
  if (!li) return;
  const index = li.dataset.index;

  if (e.target.tagName === "SPAN") {
    deleteTask(index);
  } else {
    toggleTask(index);
  }
});

listContainer.addEventListener("dblclick", e => {
  const li = e.target.closest("li");
  if (!li || e.target.tagName === "SPAN") return;
  editTask(li.dataset.index);
});

// ========== INIT ==========
loadTasks();
renderTasks();
inputBox.focus();
