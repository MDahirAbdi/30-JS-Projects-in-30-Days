// DOM Elements
const hourEl = document.querySelector('.hour');
const minutesEl = document.querySelector('.minutes');
const secondsEl = document.querySelector('.seconds');
const periodEl = document.querySelector('.period');
const monthsEl = document.querySelector('.month-name');
const daysEl = document.querySelector('.day-name');
const dayNumbersEl = document.querySelector('.day-number');
const yearsEl = document.querySelector('.year');
const themeToggle = document.getElementById('themeToggle');
const formatRadios = document.querySelectorAll('input[name="timeFormat"]');

// Constants
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// State
let lastHour = null;
let lastMinute = null;
let lastSecond = null;
let lastPeriod = null;
let timeFormat = '12';

// Initialize clock
function initClock() {
    // Load saved preferences
    loadPreferences();
    
    // Set up event listeners
    themeToggle.addEventListener('click', toggleTheme);
    formatRadios.forEach(radio => {
        radio.addEventListener('change', handleFormatChange);
    });
    
    // Start the clock
    updateClock();
    setCalendarValue();
    setInterval(updateClock, 1000);
}

// Update clock display
function updateClock() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    
    let displayHour, currentPeriod;
    
    if (timeFormat === '12') {
        currentPeriod = setTimePeriod(hour);
        displayHour = period(hour);
        periodEl.style.display = 'block';
    } else {
        displayHour = hour;
        periodEl.style.display = 'none';
    }

    // Only update DOM if values changed
    if (lastHour !== displayHour) {
        hourEl.textContent = addZero(displayHour);
        lastHour = displayHour;
    }
    
    if (lastMinute !== minute) {
        minutesEl.textContent = addZero(minute);
        lastMinute = minute;
    }
    
    if (lastSecond !== second) {
        secondsEl.textContent = addZero(second);
        lastSecond = second;
    }
    
    if (timeFormat === '12' && lastPeriod !== currentPeriod) {
        periodEl.textContent = currentPeriod;
        lastPeriod = currentPeriod;
    }
}

// Calendar functions
function setCalendarValue() {
    const today = new Date();
    yearsEl.textContent = today.getFullYear();
    dayNumbersEl.textContent = today.getDate();
    daysEl.textContent = DAYS[today.getDay()];
    monthsEl.textContent = MONTHS[today.getMonth()];
}

// Helper functions
function setTimePeriod(time) {
    return time < 12 ? 'AM' : 'PM';
}

function period(time) {
    return time > 12 ? time - 12 : time === 0 ? 12 : time;
}

function addZero(time) {
    return time < 10 ? `0${time}` : time;
}



function handleFormatChange(e) {
    timeFormat = e.target.value;
    localStorage.setItem('timeFormat', timeFormat);
    updateClock(); // Force immediate update
}

function loadPreferences() {
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
    
    // Load time format
    const savedFormat = localStorage.getItem('timeFormat');
    if (savedFormat) {
        timeFormat = savedFormat;
        document.querySelector(`input[value="${savedFormat}"]`).checked = true;
    }
}

// Initialize the clock
document.addEventListener('DOMContentLoaded', initClock);