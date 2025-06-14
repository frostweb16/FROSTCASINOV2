const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('../public'));

let users = {};
let scores = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    users[username] = { password, balance: 0 };
    res.status(201).json({ message: 'Registration successful' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        res.json({ message: 'Login successful', username });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.get('/scores', (req, res) => {
    res.json(scores);
});

app.post('/scores', (req, res) => {
    const { player, score } = req.body;
    scores.push({ player, score, timestamp: new Date() });
    res.status(201).json({ message: 'Score saved' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
