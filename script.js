const API_URL = 'http://localhost:3000'; // Change this URL if your server runs on a different address
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let editingIndex = null;

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const questionForm = document.getElementById('question-form');
const questionText = document.getElementById('question-text');
const answerInputs = [
  document.getElementById('answer1'),
  document.getElementById('answer2'),
  document.getElementById('answer3'),
  document.getElementById('answer4')
];
const correctAnswerSelect = document.getElementById('correct-answer');
const questionList = document.getElementById('question-list');
const showQuestionsButton = document.getElementById('show-questions-btn');
const startQuizButton = document.getElementById('start-quiz-btn');
const quizSection = document.getElementById('quiz-section');
const mainPage = document.getElementById('main-page');
const backToMainPageButton = document.getElementById('back-to-main-page-btn');
const backToMainPageFromShowQuestionsButton = document.getElementById('back-to-main-page-from-show-questions-btn');



// Function to add a new question


// Function to add a new question
async function addQuestion(newQuestion) {
  try {
    console.log("New Question:", newQuestion);  // Log the new question

    // Send POST request to add the new question
    const response = await fetch(`http://localhost:3000/api/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion),
    });

    if (!response.ok) {
      throw new Error('Failed to add question');
    }

    // Fetch the updated list of questions after adding
    const updatedQuestions = await response.json();
    console.log('Updated Questions:', updatedQuestions);

    // Now update the UI with the updated list of questions
    displayQuestions(updatedQuestions);
  } catch (error) {
    console.error('Error adding question:', error);
  }
}

// Display all questions in the UI
function displayQuestions(questions) {
  const questionList = document.getElementById('question-list');
  questionList.innerHTML = '';  // Clear the existing list

  questions.forEach((question, index) => {
    const questionItem = document.createElement('div');
    questionItem.innerHTML = `
      <strong>${index + 1}. ${question.question}</strong>
      ${question.answers.map((answer, i) => `<div>Answer ${i + 1}: ${answer.text} ${answer.correct ? '(Correct)' : ''}</div>`).join('')}
    `;
    questionList.appendChild(questionItem);
  });
}

// Event listener for form submission
document.getElementById('question-form').addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Get the question and answers from the form
  const newQuestion = {
    question: document.getElementById('question-text').value,
    answers: [
      { text: document.getElementById('answer1').value, correct: document.getElementById('correct-answer').value === '1' },
      { text: document.getElementById('answer2').value, correct: document.getElementById('correct-answer').value === '2' },
      { text: document.getElementById('answer3').value, correct: document.getElementById('correct-answer').value === '3' },
      { text: document.getElementById('answer4').value, correct: document.getElementById('correct-answer').value === '4' },
    ],
  };
  
  // Add the new question
  addQuestion(newQuestion);
});

// Fetch and display all questions when the page loads
async function fetchQuestions() {
  try {
    const response = await fetch(`http://localhost:3000/api/questions`);
    const questions = await response.json();
    displayQuestions(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Call fetchQuestions when the page loads to show existing questions
fetchQuestions();


// Fetch all questions from the server
async function fetchQuestions() {
  try {
    const response = await fetch(`http://localhost:3000/api/questions`);
    questions = await response.json();
    loadQuestions();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Save question to server
async function saveQuestion(question) {
  try {
    const response = await fetch(`http://localhost:3000/api/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    });

    if (!response.ok) {
      throw new Error('Failed to save question');
    }

    const result = await response.json();
    console.log('Question saved:', result);
    fetchQuestions(); // Refresh the question list
  } catch (error) {
    console.error('Error saving question:', error);
  }
}

// Delete a question
async function deleteQuestion(index) {
  try {
    const response = await fetch(`http://localhost:3000/api/questions`, { method: 'DELETE' });
    if (response.ok) {
      fetchQuestions(); // Refresh the question list after deletion
    } else {
      console.error('Failed to delete question');
    }
  } catch (error) {
    console.error('Error deleting question:', error);
  }
}

// Load questions into the UI
function loadQuestions() {
  questionList.innerHTML = '';
  questions.forEach((question, index) => {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-item');
    questionItem.innerHTML = `
      <strong>${question.question}</strong><br>
      ${question.answers.map((a, i) => `<div>Answer ${i + 1}: ${a.text}</div>`).join('')}
      <button class="edit-btn" onclick="editQuestion(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteQuestion(${index})">Delete</button>
    `;
    questionList.appendChild(questionItem);
  });
}

// Add or update a question
questionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newQuestion = {
    question: questionText.value,
    answers: answerInputs.map((input, i) => ({
      text: input.value,
      correct: i + 1 == correctAnswerSelect.value
    }))
  };
  saveQuestion(newQuestion);
  questionForm.reset(); // Reset the form after submission
});

// Edit a question
function editQuestion(index) {
  const question = questions[index];
  questionText.value = question.question;
  question.answers.forEach((answer, i) => {
    answerInputs[i].value = answer.text;
    if (answer.correct) correctAnswerSelect.value = i + 1;
  });
  editingIndex = index;
}

// Start the quiz
function startQuiz() {
  if (questions.length === 0) {
    alert('No questions available. Please add questions first.');
    return;
  }
  mainPage.classList.add('hidden');
  quizSection.classList.remove('hidden');
  currentQuestionIndex = 0;
  score = 0;
  scoreContainer.classList.add('hidden');
  nextButton.classList.remove('hidden');
  showQuestion();
}

// Show the current question
function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

// Reset the state
function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

// Select an answer
function selectAnswer(e) {
  const selectedButton = e.target;
  const isCorrect = selectedButton.dataset.correct === 'true';
  if (isCorrect) {
    score++;
  }
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    endQuiz();
  }
}

// End the quiz
function endQuiz() {
  questionElement.innerText = 'Quiz Complete!';
  answerButtonsElement.classList.add('hidden');
  nextButton.classList.add('hidden');
  scoreContainer.classList.remove('hidden');
  scoreElement.innerText = `${score} / ${questions.length}`;
  backToMainPageButton.classList.remove('hidden');
}

// Go back to the main page
function goBackToMainPage() {
  quizSection.classList.add('hidden');
  mainPage.classList.remove('hidden');
  resetState();
  startQuizButton.classList.remove('hidden');
  backToMainPageButton.classList.add('hidden');
}

// Event listeners
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  showQuestion();
});

startQuizButton.addEventListener('click', startQuiz);
backToMainPageButton.addEventListener('click', goBackToMainPage);
backToMainPageFromShowQuestionsButton.addEventListener('click', goBackToMainPageFromShowQuestions);
showQuestionsButton.addEventListener('click', showAllQuestions);

// Fetch questions initially
fetchQuestions();
