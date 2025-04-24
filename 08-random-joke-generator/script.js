// DOM Elements
const jokeEl = document.getElementById('joke');
const setupEl = jokeEl.querySelector('.setup');
const punchlineEl = jokeEl.querySelector('.punchline');
const jokeBtn = document.getElementById('jokeBtn');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const speakBtn = document.getElementById('speakBtn');
const favoritesList = document.getElementById('favoritesList');
const loadingEl = document.getElementById('loading');
const themeToggle = document.getElementById('themeToggle');
const jokeCategory = document.getElementById('jokeCategory');
const noFavorites = document.getElementById('noFavorites');
const body = document.body;

// State
let currentJoke = { setup: '', punchline: '' };
let favorites = JSON.parse(localStorage.getItem('favoriteJokes')) || [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set initial dark mode
  if (isDarkMode) {
    body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  }
  
  // Load saved jokes
  updateFavorites();
});

// Event Listeners
jokeBtn.addEventListener('click', generateJoke);
saveBtn.addEventListener('click', saveJoke);
clearBtn.addEventListener('click', clearFavorites);
copyBtn.addEventListener('click', copyToClipboard);
speakBtn.addEventListener('click', speakJoke);
themeToggle.addEventListener('click', toggleThemeHandler);

// Functions
async function generateJoke() {
  loadingEl.style.display = 'block';
  jokeEl.style.opacity = 0;
  punchlineEl.classList.remove('show');
  
  try {
    let apiUrl = 'https://official-joke-api.appspot.com/random_joke';
    const category = jokeCategory.value;
    
    if (category !== 'any') {
      apiUrl = `https://official-joke-api.appspot.com/jokes/${category}/random`;
    }
    
    const res = await fetch(apiUrl);
    let data = await res.json();
    
    // Handle array response for category jokes
    if (Array.isArray(data)) {
      data = data[0];
    }
    
    setTimeout(() => {
      currentJoke = {
        setup: data.setup,
        punchline: data.punchline
      };
      
      setupEl.textContent = data.setup;
      punchlineEl.textContent = data.punchline;
      loadingEl.style.display = 'none';
      jokeEl.style.opacity = 1;
      
      // Show punchline after a delay
      setTimeout(() => {
        punchlineEl.classList.add('show');
      }, 300);
    }, 600);
  } catch (error) {
    console.error('Error fetching joke:', error);
    showError();
  }
}

function saveJoke() {
  if (!currentJoke.setup) {
    showToast('No joke to save! Get a joke first.');
    return;
  }
  
  const jokeString = `${currentJoke.setup}\n\n${currentJoke.punchline}`;
  
  if (favorites.some(joke => joke.setup === currentJoke.setup)) {
    showToast('This joke is already saved!');
    return;
  }
  
  favorites.push(currentJoke);
  updateFavorites();
  saveFavoritesToStorage();
  
  // Visual feedback
  saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
  setTimeout(() => {
    saveBtn.innerHTML = '<i class="far fa-heart"></i> Save';
  }, 2000);
  
  showToast('Joke saved to favorites!');
}

// Update the favorites list item creation in updateFavorites()
function updateFavorites() {
  favoritesList.innerHTML = '';
  
  if (favorites.length === 0) {
    noFavorites.style.display = 'flex';
    return;
  }
  
  noFavorites.style.display = 'none';
  
  favorites.forEach((joke, index) => {
    const li = document.createElement('li');
    
    li.innerHTML = `
      <div class="joke-content">
        <div class="setup">${joke.setup}</div>
        <div class="punchline">${joke.punchline}</div>
      </div>
      <button class="delete-btn" aria-label="Delete joke">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      favorites.splice(index, 1);
      updateFavorites();
      saveFavoritesToStorage();
      showToast('Joke removed', 'danger');
    });
    
    // Add click to copy functionality
    li.addEventListener('click', () => {
      navigator.clipboard.writeText(`${joke.setup}\n\n${joke.punchline}`)
        .then(() => showToast('Joke copied to clipboard!'))
        .catch(() => showToast('Failed to copy', 'danger'));
    });
    
    favoritesList.appendChild(li);
  });
}
function clearFavorites() {
  if (favorites.length === 0) {
    showToast('No saved jokes to clear');
    return;
  }
  
  if (confirm('Are you sure you want to clear all saved jokes?')) {
    favorites = [];
    updateFavorites();
    saveFavoritesToStorage();
    showToast('All saved jokes cleared');
  }
}

function copyToClipboard() {
  if (!currentJoke.setup) {
    showToast('No joke to copy! Get a joke first.');
    return;
  }
  
  const jokeText = `${currentJoke.setup}\n\n${currentJoke.punchline}`;
  
  navigator.clipboard.writeText(jokeText)
    .then(() => showToast('Joke copied to clipboard!'))
    .catch(err => {
      console.error('Failed to copy:', err);
      showToast('Failed to copy joke');
    });
}

function speakJoke() {
  if (!currentJoke.setup) {
    showToast('No joke to read! Get a joke first.');
    return;
  }
  
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    // Create utterance for setup
    const setupUtterance = new SpeechSynthesisUtterance(currentJoke.setup);
    setupUtterance.rate = 0.9;
    
    // Create utterance for punchline with different voice and pause
    const punchlineUtterance = new SpeechSynthesisUtterance(currentJoke.punchline);
    punchlineUtterance.rate = 0.9;
    punchlineUtterance.pitch = 1.2;
    
    // Get voices and try to find different ones
    const voices = speechSynthesis.getVoices();
    if (voices.length > 1) {
      setupUtterance.voice = voices[0];
      punchlineUtterance.voice = voices[1 % voices.length];
    }
    
    // Speak setup first
    speechSynthesis.speak(setupUtterance);
    
    // Speak punchline after a delay
    setupUtterance.onend = function() {
      setTimeout(() => {
        speechSynthesis.speak(punchlineUtterance);
      }, 500);
    };
  } else {
    showToast('Text-to-speech not supported in your browser');
  }
}

function toggleThemeHandler() {
  body.classList.toggle('dark');
  isDarkMode = body.classList.contains('dark');
  
  if (isDarkMode) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  }
  
  localStorage.setItem('darkMode', isDarkMode);
}

function saveFavoritesToStorage() {
  localStorage.setItem('favoriteJokes', JSON.stringify(favorites));
}

function showError() {
  setupEl.textContent = 'Oops! Failed to load joke. Please try again.';
  punchlineEl.textContent = '';
  loadingEl.style.display = 'none';
  jokeEl.style.opacity = 1;
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' 
    ? '<i class="fas fa-check-circle"></i>'
    : '<i class="fas fa-exclamation-circle"></i>';
  
  toast.innerHTML = `${icon} ${message}`;
  document.body.appendChild(toast);
  
  // Add the show class with a slight delay
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Load voices when they become available
if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = function() {
    // Voices are loaded
  };
}