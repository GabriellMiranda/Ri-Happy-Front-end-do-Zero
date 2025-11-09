// Mobile Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

const handleMenuOpen = () => {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('flex');
    setTimeout(() => mobileMenu.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
};

const handleMenuClose = () => {
    mobileMenu.classList.remove('active');
    setTimeout(() => {
        mobileMenu.classList.remove('flex');
        mobileMenu.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
};

menuBtn.addEventListener('click', handleMenuOpen);
closeMenu.addEventListener('click', handleMenuClose);

mobileLinks.forEach(link => {
    link.addEventListener('click', handleMenuClose);
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
const nav = document.querySelector('nav');
let lastScroll = 0;

const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.classList.add('bg-black/95');
        nav.classList.remove('bg-black/80');
    } else {
        nav.classList.add('bg-black/80');
        nav.classList.remove('bg-black/95');
    }
    
    lastScroll = currentScroll;
};

window.addEventListener('scroll', handleScroll);

// Counter Animation
const counters = document.querySelectorAll('.counter');
let counterAnimated = false;

const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target + (target === 1000 ? '+' : '');
        }
    };
    
    updateCounter();
};

const checkCounters = () => {
    if (counterAnimated) return;
    
    const statsSection = document.querySelector('.stat-card')?.parentElement?.parentElement;
    if (!statsSection) return;
    
    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight * 0.8) {
        counterAnimated = true;
        counters.forEach(counter => animateCounter(counter));
    }
};

window.addEventListener('scroll', checkCounters);

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all cards and sections
const elementsToAnimate = document.querySelectorAll('.spider-card, .power-card, .gallery-item, .villain-card');
elementsToAnimate.forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
});

// Parallax Effect on Hero Section
const hero = document.querySelector('#home');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = hero.querySelector('.hero-content');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            parallax.style.opacity = 1 - (scrolled / 600);
        }
    });
}

// Dynamic Web Animation
const createWebLine = () => {
    const webBg = document.querySelector('.web-bg');
    if (!webBg) return;
    
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = '2px';
    line.style.height = '0';
    line.style.background = 'linear-gradient(180deg, transparent, rgba(239, 68, 68, 0.5), transparent)';
    line.style.left = Math.random() * 100 + '%';
    line.style.top = '-10%';
    line.style.animation = 'webFall 3s linear';
    
    webBg.appendChild(line);
    
    setTimeout(() => line.remove(), 3000);
};

// Create web lines periodically
setInterval(createWebLine, 2000);

// Add CSS animation for web fall
const style = document.createElement('style');
style.textContent = `
    @keyframes webFall {
        0% {
            top: -10%;
            height: 0;
        }
        50% {
            height: 200px;
        }
        100% {
            top: 110%;
            height: 0;
        }
    }
`;
document.head.appendChild(style);

// Card Tilt Effect
const cards = document.querySelectorAll('.power-card, .gallery-item, .villain-card');

cards.forEach(card => {
    card.addEventListener('mousemove', handleCardTilt);
    card.addEventListener('mouseleave', handleCardReset);
});

const handleCardTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
};

const handleCardReset = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
};

// Easter Egg: Spider-Man Quote Generator
const quotes = [
    "Com grandes poderes vêm grandes responsabilidades",
    "Qualquer um pode usar a máscara",
    "Não é sobre os poderes, é sobre as escolhas",
    "O que faz de você um herói não são seus poderes, mas como você os usa",
    "Um herói pode ser qualquer pessoa",
    "Sempre levante-se, sempre"
];

let quoteIndex = 0;
const heroSection = document.querySelector('#home p:nth-of-type(2)');

if (heroSection) {
    setInterval(() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        heroSection.style.opacity = '0';
        
        setTimeout(() => {
            heroSection.textContent = `"${quotes[quoteIndex]}"`;
            heroSection.style.opacity = '1';
        }, 500);
    }, 8000);
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        handleMenuClose();
    }
});

// Spider-Man Logo Animation on Click
const spiderLogo = document.querySelector('nav .text-3xl');
if (spiderLogo) {
    spiderLogo.addEventListener('click', () => {
        spiderLogo.style.transform = 'rotate(360deg) scale(1.5)';
        spiderLogo.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            spiderLogo.style.transform = 'rotate(0deg) scale(1)';
        }, 500);
    });
}

// Performance: Debounce scroll events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Apply debounce to scroll handlers
window.addEventListener('scroll', debounce(handleScroll, 10));
window.addEventListener('scroll', debounce(checkCounters, 100));

// Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Console Easter Egg
console.log('%c🕷️ Spider-Man Fan Site 🕷️', 'color: #dc2626; font-size: 24px; font-weight: bold;');
console.log('%cCom grandes poderes vêm grandes responsabilidades!', 'color: #2563eb; font-size: 16px;');
console.log('%cFeito com ❤️ por um fã do Amigão da Vizinhança', 'color: #ffffff; font-size: 12px;');

