const express = require('express');
const fs = require('fs').promises;  // Using fs.promises for asynchronous file operations
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

// Get all questions (asynchronous)
app.get('/api/questions', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');  // Asynchronously read file
    const questions = JSON.parse(data || '[]');
    res.json(questions);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new question (asynchronous)
app.post('/api/questions', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const questions = JSON.parse(data || '[]');
    questions.push(req.body);
    
    console.log('Updated questions:', questions); // Log the updated list of questions

    await fs.writeFile(DATA_FILE, JSON.stringify(questions, null, 2));
    res.status(201).json(req.body);
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Update a question (asynchronous)
app.put('/api/questions/:index', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');  // Asynchronously read file
    const questions = JSON.parse(data || '[]');
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < questions.length) {
      questions[index] = req.body;
      await fs.writeFile(DATA_FILE, JSON.stringify(questions, null, 2));  // Asynchronously write to file
      res.json(req.body);
    } else {
      res.status(404).send('Question not found');
    }
  } catch (error) {
    console.error('Error reading or writing file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a question (asynchronous)
app.delete('/api/questions/:index', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');  // Asynchronously read file
    const questions = JSON.parse(data || '[]');
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < questions.length) {
      const deleted = questions.splice(index, 1);
      await fs.writeFile(DATA_FILE, JSON.stringify(questions, null, 2));  // Asynchronously write to file
      res.json(deleted);
    } else {
      res.status(404).send('Question not found');
    }
  } catch (error) {
    console.error('Error reading or writing file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
