const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('../public'));

// Simpan skor pemain (contoh sederhana, gunakan database di produksi)
let scores = [];

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
