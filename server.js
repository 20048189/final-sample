const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = './questions.json';

app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Quiz API');
});

// Get all questions
app.get('/api/questions', (req, res) => {
  const questions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  res.json(questions);
});

// Add a question
app.post('/api/questions', (req, res) => {
  const questions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  questions.push(req.body);
  fs.writeFileSync(DATA_FILE, JSON.stringify(questions, null, 2));
  res.status(201).json(req.body);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on https://stunning-tribble-wrgvg6vx69r525579-3000.app.github.dev/`);
});
