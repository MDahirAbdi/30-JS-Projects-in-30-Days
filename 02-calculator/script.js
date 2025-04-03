const display = document.querySelector(".input");
const buttons = document.querySelectorAll("button");
const historyDisplay = document.querySelector(".history");
const specialChars = ["%", "*", "/", "-", "+", "="];
let output = "0";
let history = "";
const MAX_LENGTH = 15;

// Initialize display
display.value = output;

// Update display
function updateDisplay() {
  display.value = output;
  if (output.length > 12) {
    display.style.fontSize = "24px";
  } else {
    display.style.fontSize = "36px";
  }
}

// Check if input is valid
function isValidInput(btnValue) {
  // Prevent multiple decimal points in a number
  if (btnValue === ".") {
    const parts = output.split(/[\+\-\*\/]/);
    if (parts[parts.length - 1].includes(".")) {
      return false;
    }
  }

  // Prevent multiple operators in sequence
  if (
    specialChars.includes(btnValue) &&
    specialChars.includes(output.slice(-1))
  ) {
    return false;
  }

  return true;
}

// Calculate result
function calculate(btnValue) {
  try {
    if (btnValue === "=" && output !== "") {
      // Store current expression in history
      history = output;
      historyDisplay.textContent = history + " =";

      // Replace % with /100 before evaluation
      const expression = output.replace("%", "/100");

      // Use Function constructor instead of eval for better security
      output = String(new Function(`return ${expression}`)());

      // Round long decimal numbers
      if (output.includes(".") && output.split(".")[1].length > 4) {
        output = parseFloat(output).toFixed(4);
      }
    } else if (btnValue === "AC") {
      output = "0";
      history = "";
      historyDisplay.textContent = "";
    } else if (btnValue === "DEL") {
      output = output.toString().slice(0, -1) || "0";
    } else {
      if (!isValidInput(btnValue)) return;

      if (output === "0" && !specialChars.includes(btnValue)) {
        output = btnValue;
      } else {
        if (output.length >= MAX_LENGTH) return;
        output += btnValue;
      }
    }

    updateDisplay();
  } catch (error) {
    output = "Error";
    updateDisplay();
    setTimeout(() => {
      output = "0";
      updateDisplay();
    }, 1000);
  }
}

// Button click event
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    calculate(e.target.dataset.value);
  });
});

// Keyboard support
const handleKeyboardInput = (event) => {
  const keyMap = {
    Enter: "=",
    Backspace: "DEL",
    Escape: "AC",
    "*": "*",
    "+": "+",
    "-": "-",
    "/": "/",
    "%": "%",
    ".": ".",
  };

  const key = event.key;

  if (keyMap[key]) {
    event.preventDefault();
    calculate(keyMap[key]);
  } else if (!isNaN(parseInt(key))) {
    event.preventDefault();
    calculate(key);
  }
};

document.addEventListener("keydown", handleKeyboardInput);

// Prevent context menu on buttons
document.addEventListener("contextmenu", (e) => {
  if (e.target.tagName === "BUTTON") {
    e.preventDefault();
  }
});
