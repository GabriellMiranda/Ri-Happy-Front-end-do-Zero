const state = {
    view: {
        keys: document.querySelectorAll('.piano-key'),
        startScreen: document.querySelector('#start-screen'),
        gameContainer: document.querySelector('#game-container'),
        startButton: document.querySelector('#start-button'),
        showKeysButton: document.querySelector('#show-keys-button'),
        volumeButton: document.querySelector('#volume-button'),
    },
    values: {
        showKeys: true,
        volume: 1.0,
        audioContext: null,
        oscillators: {},
    },
    notes: {
        'C': 261.63,
        'C#': 277.18,
        'D': 293.66,
        'D#': 311.13,
        'E': 329.63,
        'F': 349.23,
        'F#': 369.99,
        'G': 392.00,
        'G#': 415.30,
        'A': 440.00,
        'A#': 466.16,
        'B': 493.88,
        'C2': 523.25,
    },
};

// Função para criar contexto de áudio
function initAudioContext() {
    if (!state.values.audioContext) {
        state.values.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Função para tocar uma nota usando Web Audio API
function playNote(note) {
    initAudioContext();
    
    const audioContext = state.values.audioContext;
    const frequency = state.notes[note];
    
    // Cria um oscilador para a nota
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine'; // Tipo de onda
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Configuração do volume com envelope ADSR simplificado
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(state.values.volume * 0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    // Conecta o oscilador ao ganho e ao destino
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Inicia e para o oscilador
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Limpa após o uso
    oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
    };
}

// Função para ativar animação da tecla
function activateKey(key) {
    key.classList.add('active');
    const note = key.dataset.note;
    playNote(note);
    
    setTimeout(() => {
        key.classList.remove('active');
    }, 200);
}

// Função para adicionar listeners de clique
function addClickListeners() {
    state.view.keys.forEach((key) => {
        key.addEventListener('click', () => {
            activateKey(key);
        });
    });
}

// Função para adicionar listeners de teclado
function addKeyboardListeners() {
    const keyMap = {};
    
    state.view.keys.forEach((key) => {
        const keyboardKey = key.dataset.key.toLowerCase();
        keyMap[keyboardKey] = key;
    });
    
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (keyMap[key] && !keyMap[key].classList.contains('active')) {
            activateKey(keyMap[key]);
        }
    });
}

// Função para alternar visibilidade das teclas
function toggleShowKeys() {
    state.values.showKeys = !state.values.showKeys;
    
    const labels = document.querySelectorAll('.key-label, .note-label');
    labels.forEach(label => {
        label.style.display = state.values.showKeys ? 'block' : 'none';
    });
    
    state.view.showKeysButton.textContent = state.values.showKeys ? 'Ocultar Teclas' : 'Mostrar Teclas';
}

// Função para alternar volume
function toggleVolume() {
    const volumes = [1.0, 0.7, 0.4, 0.0];
    const currentIndex = volumes.indexOf(state.values.volume);
    const nextIndex = (currentIndex + 1) % volumes.length;
    state.values.volume = volumes[nextIndex];
    
    const volumePercent = Math.round(state.values.volume * 100);
    state.view.volumeButton.textContent = `Volume: ${volumePercent}%`;
}

// Função para iniciar o piano
function startPiano() {
    state.view.startScreen.style.display = 'none';
    state.view.gameContainer.style.display = 'flex';
    initAudioContext();
}

// Função de inicialização
function init() {
    state.view.startButton.addEventListener('click', startPiano);
    state.view.showKeysButton.addEventListener('click', toggleShowKeys);
    state.view.volumeButton.addEventListener('click', toggleVolume);
    addClickListeners();
    addKeyboardListeners();
}

init();

