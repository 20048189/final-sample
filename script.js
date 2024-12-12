const API_URL = 'http://localhost:3000'; // Adjust this URL based on your server's address
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

// Fetch questions from the server
async function fetchQuestions() {
  try {
    const response = await fetch(`http://localhost:3000/api/questions`);
    questions = await response.json();
    loadQuestions();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Load questions into the UI
function loadQuestions() {
  questionList.innerHTML = '';  // Clear the existing list
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
// Function to display all questions
function showAllQuestions() {
  // Fetch all questions from the server
  fetchQuestions();
  // Toggle the UI visibility (showing questions list page)
  mainPage.classList.add('hidden');
  questionList.classList.remove('hidden');
}

// Fetch all questions from the server
async function fetchQuestions() {
  try {
    const response = await fetch(`http://localhost:3000/api/questions`);
    const questions = await response.json();
    displayQuestions(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
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

// Save or update a question
async function saveQuestion(question) {
  try {
    const response = editingIndex === null
      ? await fetch(`http://localhost:3000/api/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(question)
        })
      : await fetch(`http://localhost:3000/api/questions/${editingIndex}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(question)
        });

    if (!response.ok) throw new Error('Failed to save question');
    await fetchQuestions();  // Refresh the question list
    editingIndex = null;
  } catch (error) {
    console.error('Error saving question:', error);
  }
}

// Delete a question
async function deleteQuestion(index) {
  try {
    const response = await fetch(`http://localhost:3000/api/questions/${index}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete question');
    await fetchQuestions();  // Refresh the question list
  } catch (error) {
    console.error('Error deleting question:', error);
  }
}

// Edit a question
function editQuestion(index) {
  const question = questions[index];
  questionText.value = question.question;
  question.answers.forEach((answer, i) => {
    answerInputs[i].value = answer.text;
  });
  correctAnswerSelect.value = question.answers.findIndex(a => a.correct) + 1;
  editingIndex = index;
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
  questionForm.reset();  // Reset the form after submission
});

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


showQuestionsButton.addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/questions');
    const questions = await response.json();

    console.log('Questions:', questions);  // Log the fetched questions to check the response
    // Display the questions on the page (this depends on your HTML structure)
    displayQuestions(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
});

function displayQuestions(questions) {
  const questionsContainer = document.getElementById('questionsContainer'); // The container where questions will be displayed
  questionsContainer.innerHTML = ''; // Clear any existing content

  questions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `<p>${question.question}</p>`;
    questionsContainer.appendChild(questionElement);
  });
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
showQuestionsButton.addEventListener('click', fetchQuestions);
showQuestionsButton.addEventListener('click', showAllQuestions);


// Fetch questions initially
fetchQuestions();
