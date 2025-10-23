let audioAllowed = false;

// Preload audio with fallback
const audio = new Audio('/static/sounds/soothing-chime.mp3');
audio.preload = 'auto';

// Check if audio file exists or can load
audio.addEventListener('error', () => {
    console.log("Audio file error: Ensure 'soothing-chime.mp3' is in static/sounds/ at path: ", audio.src);
});

function showConfetti(index) {
    const btn = document.querySelector(`[data-task="${index}"]`);
    if (!btn) return;

    const container = btn.parentElement.parentElement;
    container.classList.add('confetti');

    console.log("Trying to play, audioAllowed:", audioAllowed);
    if (audioAllowed && audio.readyState >= 2) {
        console.log("Playing audio, duration:", audio.duration);
        audio.currentTime = 0;
        audio.play().catch(error => console.log("Play failed:", error));
    } else {
        console.log("Audio not ready or not allowed—click first!");
    }

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confetti-particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        particle.style.animationDuration = `${1.5 + Math.random() * 1}s`;
        container.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove());
    }

    setTimeout(() => container.classList.remove('confetti'), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.task;
            setTimeout(() => showConfetti(index), 100);
        });
    });

    document.addEventListener('click', () => {
        if (!audioAllowed) {
            audioAllowed = true;
            console.log("Sound enabled after click!");
        }
    }, { once: true });
});

async function freezeStreak() {
    const btn = document.getElementById('freeze-btn');
    const response = await fetch('/freeze', { method: 'POST' });
    const res = await response.json();
    alert(res.message);
    if (!res.success) btn.disabled = true;
}
