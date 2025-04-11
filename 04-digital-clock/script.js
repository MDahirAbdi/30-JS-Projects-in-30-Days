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

document.addEventListener('DOMContentLoaded', initClock);

function initClock() {
    loadPreferences();
    themeToggle.addEventListener('click', toggleTheme);
    formatRadios.forEach(radio => {
        radio.addEventListener('change', handleFormatChange);
    });
    updateClock();
    setCalendarValue();
    setInterval(updateClock, 1000);
}
