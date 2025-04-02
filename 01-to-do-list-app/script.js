const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const deleteAllBtn = document.getElementById("delete-all");


// Add new task
function addTask() {
    if (inputBox.value.trim() === "") {
      alert("Please enter a task");
      return;
    }
}  