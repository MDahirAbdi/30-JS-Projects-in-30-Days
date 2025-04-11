document.addEventListener("DOMContentLoaded", () => {
  const qrText = document.getElementById("qrText"),
    generateBtn = document.getElementById("generateBtn"),
    clearBtn = document.getElementById("clearBtn"),
    qrBox = document.getElementById("qrBox"),
    qrCode = document.getElementById("qrCode"),
    downloadBtn = document.getElementById("downloadBtn"),
    status = document.getElementById("status");

  async function generateQR() {
    const inputValue = qrText.value.trim();
    if (!inputValue) {
      showError("Please enter a value to generate a QR code.");
      return;
    }

    if (inputValue.length > 500) {
      showError("Input value is too long. Please enter a shorter value.");
      return;
    }

    try {
      generateBtn.disabled = true;
      generateBtn.textContent = "Generating QR code ....";
      status.textContent = "Generating QR code...";

      const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        inputValue
      )}`;

      await new Promise((resolve, reject) => {
        qrCode.onload = resolve;
        qrCode.onerror = reject;
        qrCode.src = qrCodeURL;
      });
      qrBox.classList.add("show-qrCode");
      downloadBtn.style.display = "block";
      status.textContent = "QR code generated successfully!";
    } catch (error) {
      showError("Failed to generate QR code. Please try again.");
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
    downloadBtn.style.display = "none";
    qrCode.src = "";
    status.textContent = "";
  }

  function showError(message) {
    status.textContent = message;
    status.classList.add("error");
    qrText.classList.add("error");
    setTimeout(() => {
      status.classList.remove("error");
      qrText.classList.remove("error");
    }, 3000);
  }

  function downloadQR() {
    const link = document.createElement("a");
    link.href = qrCode.src;
    link.download = `QRCode_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Event listeners
  generateBtn.addEventListener("click", generateQR);
  clearBtn.addEventListener("click", clearInput);
  downloadBtn.addEventListener("click", downloadQR);
  qrText.addEventListener("keypress", (e) => {
    if (e.key === "Enter") generateQR();
  });

  qrText.focus();
});
