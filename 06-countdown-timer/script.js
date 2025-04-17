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


});