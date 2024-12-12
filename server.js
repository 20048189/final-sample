const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = './questions.json';

// Middleware
app.use(cors());
app.use(express.json());

// Root route to check if the server is running
app.get('/', (req, res) => {
  res.send('Quiz API is running!');
});

// Get all questions
app.get('/api/questions', (req, res) => {
  const questions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
  res.json(questions);
});

// Add a new question
app.post('/api/questions', (req, res) => {
  try {
    const questions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
    questions.push(req.body);
    fs.writeFileSync(DATA_FILE, JSON.stringify(questions, null, 2));
    res.status(201).json(req.body);
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Update a question
app.put('/api/questions/:index', (req, res) => {
  const questions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < questions.length) {
    questions[index] = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(questions, null, 2));
    res.json(req.body);
  } else {
    res.status(404).send('Question not found');
  }
});

// Delete a question
app.delete('/api/questions/:index', (req, res) => {
  const questions = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < questions.length) {
    const deleted = questions.splice(index, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(questions, null, 2));
    res.json(deleted);
  } else {
    res.status(404).send('Question not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
