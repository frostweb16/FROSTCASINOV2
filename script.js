// Slot Game Logic
const canvas = document.getElementById('slotCanvas');
const ctx = canvas.getContext('2d');
const slotGameSection = document.getElementById('slot-game');
const resultText = document.getElementById('result');

const symbols = ['🍒', '🍋', '🍊', '💎', '7'];
const reels = [[], [], []];
const reelCount = 3;
const symbolCount = 5;
let spinning = false;

function startSlotGame() {
    slotGameSection.classList.remove('hidden');
    gsap.to(slotGameSection, { opacity: 1, y: 0, duration: 0.5 });
    initReels();
    drawReels();
}

function initReels() {
    for (let i = 0; i < reelCount; i++) {
        reels[i] = [];
        for (let j = 0; j < symbolCount; j++) {
            reels[i].push(symbols[Math.floor(Math.random() * symbols.length)]);
        }
    }
}

function drawReels() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const symbolHeight = canvas.height / 3;
    for (let i = 0; i < reelCount; i++) {
        for (let j = 0; j < 3; j++) {
            ctx.font = '60px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(reels[i][j], i * 200 + 80, j * symbolHeight + 100);
        }
    }
}

function spinReels() {
    if (spinning) return;
    spinning = true;
    resultText.textContent = 'Spinning...';

    gsap.to(reels, {
        duration: 1,
        onUpdate: () => {
            for (let i = 0; i < reelCount; i++) {
                reels[i].unshift(symbols[Math.floor(Math.random() * symbols.length)]);
                reels[i].pop();
                drawReels();
            }
        },
        onComplete: () => {
            spinning = false;
            checkWin();
        },
        repeat: 5,
    });
}

function checkWin() {
    const middleRow = [reels[0][1], reels[1][1], reels[2][1]];
    if (middleRow.every(symbol => symbol === middleRow[0])) {
        resultText.textContent = `You Win! Matched ${middleRow[0]}`;
        gsap.to(resultText, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
    } else {
        resultText.textContent = 'Try Again!';
    }
}

// GSAP Animations for Hero Section
gsap.from('h2', { opacity: 0, y: 50, duration: 1, delay: 0.5 });
gsap.from('p', { opacity: 0, y: 50, duration: 1, delay: 0.7 });
gsap.from('a', { opacity: 0, y: 50, duration: 1, delay: 0.9 });
