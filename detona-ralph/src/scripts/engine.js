const state = {
    view:{
        squares: document.querySelectorAll('.square'),
        enemy: document.querySelector('.enemy'),
        timeLeft: document.querySelector('#time-left'),
        score: document.querySelector('#score'),
        lives: document.querySelector('#lives'),
        startScreen: document.querySelector('#start-screen'),
        gameOverScreen: document.querySelector('#game-over-screen'),
        gameContainer: document.querySelector('#game-container'),
        startButton: document.querySelector('#start-button'),
        restartButton: document.querySelector('#restart-button'),
        finalScore: document.querySelector('#final-score'),
    },
    values:{
        timerId: null,
        countDownId: null,
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
        gameStarted: false,
    },
}

function addListenerHitBoz(){
    state.view.squares.forEach((square) => {
        square.addEventListener('mousedown', () => {
            if(!state.values.gameStarted || state.values.lives <= 0 || state.values.currentTime <= 0){
                return;
            }
            
            if(state.values.hitPosition && square.id === String(state.values.hitPosition)){
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
            } else if(state.values.hitPosition !== null) {
                state.values.lives--;
                state.view.lives.textContent = `x${state.values.lives}`;
                
                if(state.values.lives <= 0){
                    gameOver();
                }
            }
        });
    });
}

function moveEnemy(){
  state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

function randomSquare(){
    state.view.squares.forEach((square) => {
        square.classList.remove('enemy');
    });
    let randomNumber = Math.floor(Math.random() * 9);
    let square = state.view.squares[randomNumber];
    square.classList.add('enemy');
    state.values.hitPosition = square.id;
}

function countDown(){
    state.values.countDownId = setInterval(() => {
        state.values.currentTime--;
        state.view.timeLeft.textContent = state.values.currentTime;
        
        if(state.values.currentTime <= 0){
            clearInterval(state.values.countDownId);
            clearInterval(state.values.timerId);
            showFinalScore();
        }
    }, 1000);
}

function resetGame(){
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.lives = 3;
    state.values.hitPosition = null;
    state.values.gameStarted = false;
    
    if(state.values.timerId){
        clearInterval(state.values.timerId);
    }
    if(state.values.countDownId){
        clearInterval(state.values.countDownId);
    }
    
    state.view.squares.forEach((square) => {
        square.classList.remove('enemy');
    });
    
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.result;
    state.view.lives.textContent = `x${state.values.lives}`;
}

function startGame(){
    resetGame();
    
    state.values.gameStarted = true;
    state.view.startScreen.style.display = 'none';
    state.view.gameContainer.style.display = 'flex';
    state.view.gameOverScreen.style.display = 'none';
    
    randomSquare();
    moveEnemy();
    countDown();
}

function gameOver(){
    state.values.gameStarted = false;
    clearInterval(state.values.timerId);
    clearInterval(state.values.countDownId);
    
    state.view.finalScore.textContent = `Pontuação: ${state.values.result}`;
    state.view.gameContainer.style.display = 'none';
    state.view.gameOverScreen.style.display = 'flex';
}

function showFinalScore(){
    state.values.gameStarted = false;
    clearInterval(state.values.timerId);
    clearInterval(state.values.countDownId);
    
    state.view.finalScore.textContent = `Pontuação: ${state.values.result}`;
    state.view.gameContainer.style.display = 'none';
    state.view.gameOverScreen.style.display = 'flex';
}

function init(){
    state.view.startButton.addEventListener('click', startGame);
    state.view.restartButton.addEventListener('click', startGame);
    addListenerHitBoz();
}

init();