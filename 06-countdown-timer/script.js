document.addEventListener('DOMContentLoaded', () => {
    let timer;
    let totalSeconds = 0;
    let isRunning = false;
    let isPaused = false;

    const inputHours = document.getElementById('inputHours');
    const inputMinutes = document.getElementById('inputMinutes');
    const inputSeconds = document.getElementById('inputSeconds');
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapBtn = document.getElementById('lapBtn');
    const lapsContainer = document.getElementById('laps');
    const alarmSound = document.getElementById('alarmSound');

    startBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', recordLap);

    function toggleTimer() {
        if (!isRunning) {
            if (!isPaused) {
                const h = parseInt(inputHours.value) || 0;
                const m = parseInt(inputMinutes.value) || 0;
                const s = parseInt(inputSeconds.value) || 0;

                // Validate ranges
                if (h > 99) {
                    inputHours.value = 99;
                    return alert("⛔ Hours can't be more than 99.");
                }
                if (m > 59) {
                    inputMinutes.value = 59;
                    return alert("⛔ Minutes must be between 0–59.");
                }
                if (s > 59) {
                    inputSeconds.value = 59;
                    return alert("⛔ Seconds must be between 0–59.");
                }

                totalSeconds = h * 3600 + m * 60 + s;

                if (totalSeconds <= 0) return alert("⛔ Enter a valid countdown time.");
            }

            isRunning = true;
            isPaused = false;
            startBtn.textContent = 'Pause';
            lapBtn.style.display = 'inline-block';
            timer = setInterval(updateCountdown, 1000);
        } else {
            pauseTimer();
        }
    }

    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        isPaused = true;
        startBtn.textContent = 'Resume';
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isPaused = false;
        totalSeconds = 0;
        updateDisplay(0);
        lapsContainer.innerHTML = '';
        startBtn.textContent = 'Start';
        lapBtn.style.display = 'none';
        inputHours.value = '';
        inputMinutes.value = '';
        inputSeconds.value = '';

      
    }

    function updateCountdown() {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay(totalSeconds);
        } else {
            clearInterval(timer);
            isRunning = false;
            startBtn.textContent = "Start";
            lapBtn.style.display = "none";


            setTimeout(() => {
                alert("⏰ Time's up!");
            }, 300); // delay to ensure sound starts
        }
    }

    function updateDisplay(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        timerDisplay.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
        document.title = timerDisplay.textContent;
    }

    function pad(num) {
        return String(num).padStart(2, '0');
    }

});
