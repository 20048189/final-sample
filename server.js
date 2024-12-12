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
    // Log the incoming request to ensure data is being sent
    console.log('Received request body:', req.body);

    // Read the current file content
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    let questions = JSON.parse(data || '[]');

    // Log the current questions array before modification
    console.log('Current questions in file:', questions);

    // Add the new question to the list
    questions.push(req.body);

    // Log the updated questions array before writing to the file
    console.log('Updated questions to write:', questions);

    // Write the updated questions array to the file
    await fs.writeFile(DATA_FILE, JSON.stringify(questions, null, 2));  
    console.log('Questions successfully saved to file.');

    res.status(201).json(req.body);  // Respond with the new question
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a question (asynchronous)
app.put('/api/questions/:index', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    let questions = JSON.parse(data || '[]');
    const index = parseInt(req.params.index, 10);

    if (index >= 0 && index < questions.length) {
      // Log the current question and the updated one
      console.log('Current question:', questions[index]);
      console.log('Updated question:', req.body);

      // Update the question at the specified index
      questions[index] = req.body;

      // Write the updated questions to the file
      await fs.writeFile(DATA_FILE, JSON.stringify(questions, null, 2));
      console.log('Question updated successfully.');

      res.json(req.body);  // Respond with the updated question
    } else {
      res.status(404).send('Question not found');
    }
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a question (asynchronous)
app.delete('/api/questions/:index', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    let questions = JSON.parse(data || '[]');
    const index = parseInt(req.params.index, 10);

    if (index >= 0 && index < questions.length) {
      // Log the question being deleted
      console.log('Deleted question:', questions[index]);

      // Remove the question from the array
      const deleted = questions.splice(index, 1);

      // Write the updated questions to the file
      await fs.writeFile(DATA_FILE, JSON.stringify(questions, null, 2));
      console.log('Question deleted successfully.');

      res.json(deleted);  // Respond with the deleted question
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
