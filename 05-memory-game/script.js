// Game state variables
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let totalPairs = 8;
let cardType = 'numbers';

// Card data sets
const cardSets = {
    numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    colors: ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41'],
    shapes: ['▲', '●', '■', '★', '◆', '♥', '♣', '♠', '⚫', '⚪', '⬡', '⬢'],
    emojis: ['😀', '😎', '🤩', '😍', '🤪', '😜', '🧐', '🤓', '😇', '🥳', '😋', '🤠'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯', '🦄', '🐮']
};

// Difficulty settings
const difficultySettings = {
    easy: { pairs: 4, columns: 4 },
    medium: { pairs: 8, columns: 4 },
    hard: { pairs: 12, columns: 6 }
};

// DOM elements
const memoryWrapper = document.getElementById('memory-wrapper');
const memoryGame = document.getElementById('memory-game');
const cardTypeSelect = document.getElementById('card-type');
const difficultySelect = document.getElementById('difficulty');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const winMessage = document.getElementById('win-message');
const gameOptions = document.querySelector('.game-options');


// Initialize game
startBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', resetGame);

function initGame() {
    // Get selected options
    cardType = cardTypeSelect.value;
    const difficulty = difficultySelect.value;
    totalPairs = difficultySettings[difficulty].pairs;
    
    // Reset game state
    matchedPairs = 0;
    hasFlippedCard = false;
    lockBoard = false;
    [firstCard, secondCard] = [null, null];
    
    // Setup game board
    memoryGame.innerHTML = '';
    memoryGame.style.gridTemplateColumns = `repeat(${difficultySettings[difficulty].columns}, 1fr)`;
    memoryWrapper.classList.remove('hidden');
    gameOptions.classList.add('hidden');
    winMessage.style.display = 'none';
    
    // Create cards
    const values = cardSets[cardType].slice(0, totalPairs);
    const cardValues = [...values, ...values];
    shuffleArray(cardValues);
    
    cardValues.forEach((value) => {
        const card = createCard(value);
        memoryGame.appendChild(card);
    });
}

function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    


    if (cardType !== 'numbers') card.classList.add(`${cardType}-card`);
    
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-face', 'card-front');
    
    // Special styling for color cards
    if (cardType === 'colors') {
        cardFront.style.backgroundColor = value;
        cardFront.style.color = getContrastColor(value);
    } else {
        cardFront.textContent = value;
    }
    
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-face', 'card-back');
    cardBack.textContent = '❔';
    
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    card.addEventListener('click', flipCard);
    return card;
}

function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'black' : 'white';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('matched')) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkMatch();
}


function getCardValue(card) {
    return cardType === 'colors' 
        ? card.querySelector('.card-front').style.backgroundColor
        : card.querySelector('.card-front').textContent;
}

function checkMatch() {
    const isMatch = getCardValue(firstCard) === getCardValue(secondCard);
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    
    // Add celebration effect
    if (matchedPairs === totalPairs) {
        firstCard.style.animation = 'pulse 0.5s';
        secondCard.style.animation = 'pulse 0.5s';
    }
    
    resetBoard();
    checkWin();
}

function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function checkWin() {
    if (matchedPairs === totalPairs) {
        setTimeout(() => {
            showWinMessage();
        }, 500);
    }
}

function showWinMessage() {
    winMessage.style.display = 'flex';
}

function resetGame() {
    winMessage.style.display = 'none';
    gameOptions.classList.remove('hidden');
}