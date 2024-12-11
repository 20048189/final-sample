const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File path for storing questions
const DATA_FILE = './questions.json';

// Utility function to read/write JSON file
const readQuestions = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeQuestions = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// API Endpoints

// Get all questions
app.get('/api/questions', (req, res) => {
  const questions = readQuestions();
  res.json(questions);
});

// Add a question
app.post('/api/questions', (req, res) => {
  const questions = readQuestions();
  const newQuestion = req.body;
  questions.push(newQuestion);
  writeQuestions(questions);
  res.status(201).json(newQuestion);
});

// Update a question
app.put('/api/questions/:index', (req, res) => {
  const questions = readQuestions();
  const { index } = req.params;
  questions[index] = req.body;
  writeQuestions(questions);
  res.json(questions[index]);
});

// Delete a question
app.delete('/api/questions/:index', (req, res) => {
  const questions = readQuestions();
  const { index } = req.params;
  const deletedQuestion = questions.splice(index, 1);
  writeQuestions(questions);
  res.json(deletedQuestion);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000/api/questions`);
});
