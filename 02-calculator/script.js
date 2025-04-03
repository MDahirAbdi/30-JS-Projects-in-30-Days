const display = document.querySelector(".input");
const buttons = document.querySelectorAll("button");
let output = "0"; // initial display value

// Set initial value of display
display.value = output;

// Update display function
function updateDisplay() {
  display.value = output;
  if (output.length > 12) {
    display.style.fontSize = "24px";
  } else {
    display.style.fontSize = "36px";
  }
}

// Button click event
buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnValue = e.target.dataset.value;
      if (btnValue === "=") {
        calculate(btnValue);
      } else if (btnValue === "AC" || btnValue === "DEL") {
        calculate(btnValue);
      } else {
        output += btnValue;
        updateDisplay();
      }
    });
  });
  