document.addEventListener("DOMContentLoaded",  () => {
const qrText = document.getElementById("qrText");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const qrBox = document.getElementById("qrBox");
const qrCode =  document.getElementById("qrCode");
const  status = document.getElementById("status")

async function generateQR() {
const inputValue = qrText.value.trim();
if (!inputValue) {
    showError("Please enter a value to generate a QR code.");
    return
}

if(inputValue.length > 500) {
    showError("Input value is too long. Please enter a shorter value.");
    return
}

try {
    generateBtn.disabled = true;
    generateBtn.textContent = "Generating QR code ...."
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inputValue)}`;
  
    await new Promise((resolve, reject) => {
        qrCode.onload = resolve;
        qrCode.onerror = reject;
        qrCode.src = qrCodeURL;
    })
    qrBox.classList.add("show-qrCode")
} catch (error) {
    console.error("QR generation error:", error);
} finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate QR Code";
}
}

function clearInput() {
    qrText.value = "";
    qrText.focus();
    qrBox.classList.remove("show-qrCode");
    qrCode.src = "";
    status.textContent = "";
}

  // Event listeners
  generateBtn.addEventListener("click", generateQR);
  clearBtn.addEventListener("click", clearInput);

});