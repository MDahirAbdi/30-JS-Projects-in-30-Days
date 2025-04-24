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
const noFavorites = document.getElementById('noFavorites');
const body = document.body;
const categoryBtns = document.querySelectorAll('.category-btn');

// State
let currentJoke = { setup: '', punchline: '' };
let favorites = JSON.parse(localStorage.getItem('favoriteJokes')) || [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let currentCategory = 'general';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set initial dark mode
  if (isDarkMode) {
    body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  }
  
  // Set initial active category
  categoryBtns.forEach(btn => {
    if (btn.dataset.category === currentCategory) {
      btn.classList.add('active');
    }
  });
  
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

// Category button event listeners
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentCategory = btn.dataset.category;
    categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    generateJoke();
  });
});

// Functions
async function generateJoke() {
  loadingEl.style.display = 'block';
  jokeEl.style.opacity = 0;
  punchlineEl.classList.remove('show');
  
  try {
    const apiUrl = `https://official-joke-api.appspot.com/jokes/${currentCategory}/random`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    const joke = Array.isArray(data) ? data[0] : data;
    
    setTimeout(() => {
      currentJoke = {
        setup: joke.setup,
        punchline: joke.punchline
      };
      
      setupEl.textContent = joke.setup;
      punchlineEl.textContent = joke.punchline;
      loadingEl.style.display = 'none';
      jokeEl.style.opacity = 1;
      
      // Show punchline after a delay
      setTimeout(() => {
        punchlineEl.classList.add('show');
      }, 300);
    }, 600);
  } catch (error) {
    console.error('Error fetching joke:', error);
    showToast('Failed to load joke. Please try again.', 'danger');
    setupEl.textContent = 'Oops! Failed to load joke. Please try again.';
    punchlineEl.textContent = '';
    loadingEl.style.display = 'none';
    jokeEl.style.opacity = 1;
  }
}

function saveJoke() {
  if (!currentJoke.setup) {
    showToast('No joke to save! Get a joke first.', 'danger');
    return;
  }
  
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
    showToast('No joke to copy! Get a joke first.', 'danger');
    return;
  }
  
  const jokeText = `${currentJoke.setup}\n\n${currentJoke.punchline}`;
  
  navigator.clipboard.writeText(jokeText)
    .then(() => showToast('Joke copied to clipboard!'))
    .catch(() => showToast('Failed to copy joke', 'danger'));
}

function speakJoke() {
  if (!currentJoke.setup) {
    showToast('No joke to read! Get a joke first.', 'danger');
    return;
  }
  
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    
    const setupUtterance = new SpeechSynthesisUtterance(currentJoke.setup);
    setupUtterance.rate = 0.9;
    
    const punchlineUtterance = new SpeechSynthesisUtterance(currentJoke.punchline);
    punchlineUtterance.rate = 0.9;
    punchlineUtterance.pitch = 1.2;
    
    const voices = speechSynthesis.getVoices();
    if (voices.length > 1) {
      setupUtterance.voice = voices[0];
      punchlineUtterance.voice = voices[1 % voices.length];
    }
    
    speechSynthesis.speak(setupUtterance);
    
    setupUtterance.onend = function() {
      setTimeout(() => {
        speechSynthesis.speak(punchlineUtterance);
      }, 500);
    };
  } else {
    showToast('Text-to-speech not supported in your browser', 'danger');
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

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' 
    ? '<i class="fas fa-check-circle"></i>'
    : '<i class="fas fa-exclamation-circle"></i>';
  
  toast.innerHTML = `${icon} ${message}`;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}