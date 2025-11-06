const state = {
    view: {
        panel: document.querySelector('#panel'),
        time: document.querySelector('#time'),
        moves: document.querySelector('#moves'),
        startScreen: document.querySelector('#start-screen'),
        gameOverScreen: document.querySelector('#game-over-screen'),
        gameContainer: document.querySelector('#game-container'),
        startButton: document.querySelector('#start-button'),
        restartButton: document.querySelector('#restart-button'),
        finalTime: document.querySelector('#final-time'),
        finalMoves: document.querySelector('#final-moves'),
    },
    values: {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        totalPairs: 8,
        moves: 0,
        time: 0,
        timerId: null,
        gameStarted: false,
        canFlip: true,
    },
}

const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎤'];

function createCard(symbol, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.symbol = symbol;
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = '❓';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.textContent = symbol;
    
    card.appendChild(cardBack);
    card.appendChild(cardFront);
    
    return card;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function createBoard() {
    state.view.panel.innerHTML = '';
    
    const cardSymbols = [...symbols, ...symbols];
    const shuffledSymbols = shuffleArray(cardSymbols);
    
    state.values.cards = [];
    
    shuffledSymbols.forEach((symbol, index) => {
        const card = createCard(symbol, index);
        state.view.panel.appendChild(card);
        state.values.cards.push(card);
        
        card.addEventListener('click', () => handleCardClick(card));
    });
}

function handleCardClick(card) {
    if (!state.values.gameStarted || !state.values.canFlip) {
        return;
    }
    
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    if (state.values.flippedCards.length >= 2) {
        return;
    }
    
    card.classList.add('flipped');
    state.values.flippedCards.push(card);
    
    if (state.values.flippedCards.length === 2) {
        state.values.canFlip = false;
        state.values.moves++;
        state.view.moves.textContent = state.values.moves;
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = state.values.flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        state.values.matchedPairs++;
        
        if (state.values.matchedPairs === state.values.totalPairs) {
            setTimeout(() => {
                gameWin();
            }, 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    
    state.values.flippedCards = [];
    state.values.canFlip = true;
}

function startTimer() {
    state.values.timerId = setInterval(() => {
        state.values.time++;
        state.view.time.textContent = state.values.time;
    }, 1000);
}

function stopTimer() {
    if (state.values.timerId) {
        clearInterval(state.values.timerId);
        state.values.timerId = null;
    }
}

function resetGame() {
    state.values.matchedPairs = 0;
    state.values.moves = 0;
    state.values.time = 0;
    state.values.flippedCards = [];
    state.values.gameStarted = false;
    state.values.canFlip = true;
    
    stopTimer();
    
    state.view.time.textContent = state.values.time;
    state.view.moves.textContent = state.values.moves;
}

function startGame() {
    resetGame();
    
    state.values.gameStarted = true;
    state.view.startScreen.style.display = 'none';
    state.view.gameContainer.style.display = 'flex';
    state.view.gameOverScreen.style.display = 'none';
    
    createBoard();
    startTimer();
}

function gameWin() {
    state.values.gameStarted = false;
    stopTimer();
    
    state.view.finalTime.textContent = `Tempo: ${state.values.time}s`;
    state.view.finalMoves.textContent = `Movimentos: ${state.values.moves}`;
    state.view.gameContainer.style.display = 'none';
    state.view.gameOverScreen.style.display = 'flex';
}

function init() {
    state.view.startButton.addEventListener('click', startGame);
    state.view.restartButton.addEventListener('click', startGame);
}

init();

