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
  
  function calculate(btnValue) {
    if (btnValue === "=") {
      try {
        output = String(new Function(`return ${output.replace("%", "/100")}`)());
        updateDisplay();
      } catch (error) {
        output = "Error";
        updateDisplay();
        setTimeout(() => {
          output = "0";
          updateDisplay();
        }, 1000);
      }
    } else if (btnValue === "AC") {
      output = "0";
      updateDisplay();
    } else if (btnValue === "DEL") {
      output = output.slice(0, -1) || "0";
      updateDisplay();
    }
  }

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
      output += key;
      updateDisplay();
    }
  };
  
  document.addEventListener("keydown", handleKeyboardInput);
  
  