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