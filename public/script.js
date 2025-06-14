// Login and Registration
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

if (showRegister && showLogin) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username] && users[username].password === password) {
            localStorage.setItem('loggedInUser', username);
            window.location.href = 'games.html';
        } else {
            alert('Invalid username or password');
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username]) {
            alert('Username already exists');
        } else {
            users[username] = { password, balance: 0 };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful! Please login.');
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    });
}

// Logout
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

// Access Control
function checkLogin() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}
checkLogin();

// Balance
const userBalance = document.getElementById('userBalance');
if (userBalance) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    userBalance.textContent = `$${users[loggedInUser]?.balance || 0}.00`;
}

// Deposit
const depositForm = document.getElementById('depositForm');
if (depositForm) {
    depositForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('amount').value);
        const loggedInUser = localStorage.getItem('loggedInUser');
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (amount > 0) {
            users[loggedInUser].balance += amount;
            localStorage.setItem('users', JSON.stringify(users));
            alert(`Deposited $${amount} successfully!`);
            window.location.href = 'balance.html';
        } else {
            alert('Please enter a valid amount');
        }
    });
}

// Slot Game Logic
const slotCanvas = document.getElementById('slotCanvas');
const slotCtx = slotCanvas?.getContext('2d');
const slotGameSection = document.getElementById('slot-game');
const slotResult = document.getElementById('result');
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
    slotCtx.clearRect(0, 0, slotCanvas.width, slotCanvas.height);
    const symbolHeight = slotCanvas.height / 3;
    for (let i = 0; i < reelCount; i++) {
        for (let j = 0; j < 3; j++) {
            slotCtx.font = '60px Arial';
            slotCtx.fillStyle = 'white';
            slotCtx.fillText(reels[i][j], i * 200 + 80, j * symbolHeight + 100);
        }
    }
}

function spinReels() {
    if (spinning) return;
    spinning = true;
    slotResult.textContent = 'Spinning...';

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
            checkSlotWin();
        },
        repeat: 5,
    });
}

function checkSlotWin() {
    const middleRow = [reels[0][1], reels[1][1], reels[2][1]];
    if (middleRow.every(symbol => symbol === middleRow[0])) {
        slotResult.textContent = `You Win! Matched ${middleRow[0]}`;
        gsap.to(slotResult, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
        updateBalance(100); // Contoh hadiah
    } else {
        slotResult.textContent = 'Try Again!';
    }
}

// Blackjack Game Logic
const blackjackCanvas = document.getElementById('blackjackCanvas');
const blackjackCtx = blackjackCanvas?.getContext('2d');
const blackjackGameSection = document.getElementById('blackjack-game');
const blackjackResult = document.getElementById('blackjackResult');
let playerCards = [];
let dealerCards = [];

function startBlackjack() {
    blackjackGameSection.classList.remove('hidden');
    gsap.to(blackjackGameSection, { opacity: 1, y: 0, duration: 0.5 });
    playerCards = [dealCard(), dealCard()];
    dealerCards = [dealCard(), dealCard()];
    drawBlackjack();
}

function dealCard() {
    const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return cards[Math.floor(Math.random() * cards.length)];
}

function drawBlackjack() {
    blackjackCtx.clearRect(0, 0, blackjackCanvas.width, blackjackCanvas.height);
    blackjackCtx.font = '30px Arial';
    blackjackCtx.fillStyle = 'white';
    blackjackCtx.fillText(`Player: ${playerCards.join(', ')}`, 50, 100);
    blackjackCtx.fillText(`Dealer: ${dealerCards[0]}, ?`, 50, 200);
}

function hitCard() {
    playerCards.push(dealCard());
    drawBlackjack();
    const score = calculateScore(playerCards);
    if (score > 21) {
        blackjackResult.textContent = 'Bust! You Lose!';
        gsap.to(blackjackResult, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
    }
}

function stand() {
    drawBlackjack();
    blackjackCtx.fillText(`Dealer: ${dealerCards.join(', ')}`, 50, 200);
    const playerScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);
    if (playerScore > dealerScore || dealerScore > 21) {
        blackjackResult.textContent = `You Win! Score: ${playerScore}`;
        updateBalance(50);
    } else if (playerScore < dealerScore) {
        blackjackResult.textContent = `Dealer Wins! Score: ${dealerScore}`;
    } else {
        blackjackResult.textContent = 'Push!';
    }
    gsap.to(blackjackResult, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
}

function calculateScore(cards) {
    let score = 0;
    let aces = 0;
    for (let card of cards) {
        if (card === 'A') {
            aces++;
        } else if (['K', 'Q', 'J'].includes(card)) {
            score += 10;
        } else {
            score += parseInt(card);
        }
    }
    for (let i = 0; i < aces; i++) {
        if (score + 11 <= 21) {
            score += 11;
        } else {
            score += 1;
        }
    }
    return score;
}

// Roulette Game Logic
const rouletteCanvas = document.getElementById('rouletteCanvas');
const rouletteCtx = rouletteCanvas?.getContext('2d');
const rouletteGameSection = document.getElementById('roulette-game');
const rouletteResult = document.getElementById('rouletteResult');

function startRoulette() {
    rouletteGameSection.classList.remove('hidden');
    gsap.to(rouletteGameSection, { opacity: 1, y: 0, duration: 0.5 });
    drawRoulette();
}

function drawRoulette() {
    rouletteCtx.clearRect(0, 0, rouletteCanvas.width, rouletteCanvas.height);
    rouletteCtx.font = '30px Arial';
    rouletteCtx.fillStyle = 'white';
    rouletteCtx.fillText('Roulette Wheel', 200, 200);
}

function spinRoulette() {
    const betNumber = parseInt(document.getElementById('betNumber').value);
    if (betNumber < 0 || betNumber > 36) {
        alert('Please enter a number between 0 and 36');
        return;
    }
    const winningNumber = Math.floor(Math.random() * 37);
    rouletteResult.textContent = `Result: ${winningNumber}`;
    if (betNumber === winningNumber) {
        rouletteResult.textContent += ' - You Win!';
        updateBalance(200);
    } else {
        rouletteResult.textContent += ' - Try Again!';
    }
    gsap.to(rouletteResult, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
}

// Update Balance
function updateBalance(amount) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[loggedInUser].balance += amount;
    localStorage.setItem('users', JSON.stringify(users));
    if (userBalance) {
        userBalance.textContent = `$${users[loggedInUser].balance}.00`;
    }
}

// GSAP Animations
gsap.from('h2', { opacity: 0, y: 50, duration: 1, delay: 0.5 });
gsap.from('p', { opacity: 0, y: 50, duration: 1, delay: 0.7 });
gsap.from('a', { opacity: 0, y: 50, duration: 1, delay: 0.9 });
gsap.from('button', { opacity: 0, y: 50, duration: 1, delay: 1.1 });
