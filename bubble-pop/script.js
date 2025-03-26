// Configuration
const BUBBLE_INTERVAL = 1000;
const SOUNDS = [
    'https://assets.mixkit.co/active_storage/sfx/2731/2731-preview.mp3',
    'https://assets.mixkit.co/active_storage/sfx/2732/2732-preview.mp3',
    'https://assets.mixkit.co/active_storage/sfx/2733/2733-preview.mp3'
];

let poppedCount = 0;
let musicPlaying = false;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Audio functions
async function playSound(url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    } catch (error) {
        console.log('Audio playback error:', error);
    }
}

// Bubble creation
function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = 50 + Math.random() * 70;
    const hue = Math.random() * 360;
    const xPos = Math.random() * (window.innerWidth - size);
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${xPos}px`;
    bubble.style.setProperty('--primary', `hsl(${hue}, 70%, 60%)`);

    bubble.addEventListener('click', () => {
        if (!bubble.classList.contains('pop')) {
            bubble.classList.add('pop');
            triggerConfetti(hue);
            playSound(SOUNDS[Math.floor(Math.random() * SOUNDS.length)]);
            poppedCount++;
            document.getElementById('count').textContent = poppedCount;
            setTimeout(() => bubble.remove(), 400);
        }
    });

    document.body.appendChild(bubble);
    setTimeout(() => bubble.remove(), 5000);
}

// Confetti effect
function triggerConfetti(hue) {
    const end = Date.now() + 300;
    const config = {
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: [`hsl(${hue}, 100%, 50%)`],
        gravity: 0.8,
        scalar: 0.8
    };

    (function frame() {
        confetti({
            ...config,
            angle: 60,
            particleCount: 15,
            origin: { x: 0.3 }
        });
        confetti({
            ...config,
            angle: 120,
            particleCount: 15,
            origin: { x: 0.7 }
        });

        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

// Game controls
function resetCounter() {
    poppedCount = 0;
    document.getElementById('count').textContent = '0';
}

function initMusic() {
    if (!musicPlaying) {
        document.getElementById('bg-music').play();
        musicPlaying = true;
    }
}

// Initialize game
document.addEventListener('click', initMusic, { once: true });
document.addEventListener('touchstart', initMusic, { once: true });
setInterval(createBubble, BUBBLE_INTERVAL);

window.addEventListener('resize', () => {
    document.body.style.height = `${window.innerHeight}px`;
});
document.body.style.height = `${window.innerHeight}px`;
