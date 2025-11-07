// Estado da aplicação
const state = {
    audioContext: null,
    isPlaying: false,
    currentWorld: null,
};

// Função para inicializar o contexto de áudio
function initAudioContext() {
    if (!state.audioContext) {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Função para criar o tema de Stranger Things (simplificado)
function playStrangerThingsTheme() {
    initAudioContext();
    
    const audioContext = state.audioContext;
    const now = audioContext.currentTime;
    
    // Notas da melodia principal (simplificada)
    const notes = [
        { freq: 196.00, time: 0.0, duration: 0.3 },    // G3
        { freq: 220.00, time: 0.3, duration: 0.3 },    // A3
        { freq: 246.94, time: 0.6, duration: 0.3 },    // B3
        { freq: 196.00, time: 0.9, duration: 0.6 },    // G3
        { freq: 146.83, time: 1.5, duration: 0.3 },    // D3
        { freq: 164.81, time: 1.8, duration: 0.3 },    // E3
        { freq: 196.00, time: 2.1, duration: 0.6 },    // G3
    ];
    
    notes.forEach(note => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note.freq, now + note.time);
        
        gainNode.gain.setValueAtTime(0, now + note.time);
        gainNode.gain.linearRampToValueAtTime(0.3, now + note.time + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(now + note.time);
        oscillator.stop(now + note.time + note.duration);
    });
}

// Função para alternar o áudio
function toggleAudio() {
    const audioBtn = document.getElementById('theme-music');
    
    if (!state.isPlaying) {
        playStrangerThingsTheme();
        state.isPlaying = true;
        audioBtn.classList.add('playing');
        audioBtn.textContent = '🎵 Tocando...';
        
        setTimeout(() => {
            state.isPlaying = false;
            audioBtn.classList.remove('playing');
            audioBtn.textContent = '🎵 Tocar Tema de Stranger Things';
        }, 3000);
    }
}

// Função para mostrar alerta ao explorar mundos
function exploreWorld(worldType) {
    const messages = {
        normal: `
🏡 Bem-vindo a Hawkins!
        
Você está explorando o mundo normal, onde tudo parece calmo e tranquilo...
Ou será que há algo escondido nas sombras?
        
Características:
• Céu azul e dias ensolarados
• Crianças brincando nas ruas
• Laboratório Hawkins misterioso
• O ArcadeMax com jogos clássicos
        `,
        invertido: `
👹 Você entrou no Mundo Invertido!
        
Cuidado! Esta é uma dimensão paralela sombria e perigosa.
Partículas tóxicas flutuam no ar e criaturas aterrorizantes espreitam...
        
Características:
• Céu escuro e tempestuoso
• Vegetação morta e decadente
• Demogorgons e outras criaturas
• Atmosfera sufocante e fria
• Tempo distorcido
        `
    };
    
    alert(messages[worldType]);
    
    // Adiciona efeito visual ao card
    const card = document.getElementById(worldType === 'normal' ? 'mundo-normal' : 'mundo-invertido');
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = '';
    }, 200);
}

// Função para lidar com o envio do formulário
function handleSubscription(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const worldPreference = formData.get('world-preference');
    
    const preferences = {
        'normal': 'Mundo Normal',
        'invertido': 'Mundo Invertido',
        'both': 'Ambos os Mundos'
    };
    
    // Simula envio do formulário
    const submitBtn = event.target.querySelector('.btn-submit');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert(`
🎉 Bem-vindo ao Clube Hellfire, ${name}!

Você escolheu: ${preferences[worldPreference]}

Um email de confirmação será enviado para:
${email}

Prepare-se para receber conteúdos exclusivos sobre Stranger Things!
        `);
        
        // Reseta o formulário
        event.target.reset();
        submitBtn.textContent = 'Juntar-se ao Clube';
        submitBtn.disabled = false;
        
        // Adiciona efeito de sucesso
        const subscriptionSection = document.querySelector('.subscription-section');
        subscriptionSection.style.borderColor = '#4CAF50';
        setTimeout(() => {
            subscriptionSection.style.borderColor = '';
        }, 2000);
    }, 1500);
}

// Função para criar partículas flutuantes (efeito de poeira do Mundo Invertido)
function createFloatingParticles() {
    const container = document.body;
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(215, 21, 21, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            z-index: 1;
            animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
    
    // Adiciona a animação ao CSS
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Função para adicionar efeito de scroll suave
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para animar elementos ao entrar na viewport
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    const animatedElements = document.querySelectorAll('.world-card, .character-card, .subscription-section, .audio-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Função para adicionar efeito de digitação no título
function typeWriterEffect() {
    const title = document.querySelector('.main-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.opacity = '1';
    
    let index = 0;
    const speed = 150;
    
    function type() {
        if (index < text.length) {
            title.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    setTimeout(type, 500);
}

// Função para adicionar listeners aos botões de explorar
function addExploreListeners() {
    const exploreButtons = document.querySelectorAll('.btn-explore');
    exploreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const world = button.getAttribute('data-world');
            exploreWorld(world);
        });
    });
}

// Função para adicionar listener ao botão de áudio
function addAudioListener() {
    const audioBtn = document.getElementById('theme-music');
    if (audioBtn) {
        audioBtn.addEventListener('click', toggleAudio);
    }
}

// Função para adicionar listener ao formulário
function addFormListener() {
    const form = document.getElementById('subscription-form');
    if (form) {
        form.addEventListener('submit', handleSubscription);
    }
}

// Função de inicialização
function init() {
    console.log('🔮 Iniciando Mundo Invertido...');
    
    // Adiciona todos os listeners
    addExploreListeners();
    addAudioListener();
    addFormListener();
    
    // Adiciona efeitos visuais
    createFloatingParticles();
    animateOnScroll();
    
    // Efeito de digitação no título (opcional, comentado por padrão)
    // typeWriterEffect();
    
    console.log('✅ Mundo Invertido inicializado!');
}

// Inicializa quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

