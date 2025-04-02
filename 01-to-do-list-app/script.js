const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const deleteAllBtn = document.getElementById("delete-all");

// Add new task
function addTask() {
  if (inputBox.value.trim() === "") {
    alert("Please enter a task");
    return;
  }

  const li = document.createElement("li");
  li.textContent = inputBox.value.trim();

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "images/delete.png";
  deleteIcon.className = "delete-icon";
  deleteIcon.alt = "Delete task";

  li.appendChild(deleteIcon);
  listContainer.appendChild(li);
  inputBox.value = "";

  saveData();
  updateDeleteAllVisibility();
}

// Handle list interactions (check/uncheck and delete)
listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.classList.contains("delete-icon")) {
    e.target.parentElement.remove();
    saveData();
    updateDeleteAllVisibility();
  }
});

// Delete all tasks
deleteAllBtn.addEventListener("click", function () {
  if (listContainer.children.length === 0) return;

  if (confirm("Are you sure you want to delete ALL tasks?")) {
    listContainer.innerHTML = "";
    saveData();
    updateDeleteAllVisibility();
  }
});

// Save data to localStorage
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

// Load tasks from localStorage
function showTask() {
  listContainer.innerHTML = localStorage.getItem("data") || "";
  updateDeleteAllVisibility();
}

// Show/hide Delete All button based on tasks
function updateDeleteAllVisibility() {
  deleteAllBtn.style.display =
    listContainer.children.length > 0 ? "block" : "none";
}

// Initialize app
initTheme();
showTask();

// Add task on Enter key press
inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});
