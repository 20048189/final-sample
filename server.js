const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'questions.json');  // Path to store the questions

// Middleware
app.use(cors());
app.use(express.json());

// Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const questions = JSON.parse(data || '[]');
    res.json(questions);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new question
app.post('/api/questions', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    let questions = JSON.parse(data || '[]');
    questions.push(req.body);
    await fs.writeFile(DATA_FILE, JSON.stringify(questions, null, 2));
    res.status(201).json(req.body);
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a question
app.put('/api/questions/:index', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    let questions = JSON.parse(data || '[]');
    const index = parseInt(req.params.index, 10);

    if (index >= 0 && index < questions.length) {
      questions[index] = req.body;
      await fs.writeFile(DATA_FILE, JSON.stringify(questions, null, 2));
      res.json(req.body);
    } else {
      res.status(404).send('Question not found');
    }
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a question
app.delete('/api/questions/:index', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    let questions = JSON.parse(data || '[]');
    const index = parseInt(req.params.index, 10);

    if (index >= 0 && index < questions.length) {
      const deleted = questions.splice(index, 1);
      await fs.writeFile(DATA_FILE, JSON.stringify(questions, null, 2));
      res.json(deleted);
    } else {
      res.status(404).send('Question not found');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
