const API_URL = 'https://stunning-tribble-wrgvg6vx69r525579-3000.app.github.dev/'; // Change this URL if your server runs on a different address
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

// Fetch all questions from the server
async function fetchQuestions() {
  try {
    const response = await fetch('https://stunning-tribble-wrgvg6vx69r525579-3000.app.github.dev/');
    questions = await response.json();
    loadQuestions();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Save question to server
async function saveQuestion(questions) {
  try {
    const response = await fetch('https://stunning-tribble-wrgvg6vx69r525579-3000.app.github.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questions),
    });

    if (!response.ok) {
      throw new Error(`Failed to save question: ${response.statusText}`);
    }

    const savedQuestion = await response.json();
    console.log('Question saved successfully:', savedQuestion);
    fetchQuestions(); // Refresh questions after saving
  } catch (error) {
    console.error('Error saving question:', error);
  }
}

// Fetch and display questions
async function fetchQuestions() {
  try {
    const response = await fetch('https://stunning-tribble-wrgvg6vx69r525579-3000.app.github.dev/');
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }
    questions = await response.json();
    displayQuestions();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}


 

// Delete a question
async function deleteQuestion(index) {
  try {
    await fetch('https://stunning-tribble-wrgvg6vx69r525579-3000.app.github.dev/', { method: 'DELETE' });
    fetchQuestions();
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

// Show all questions
function showAllQuestions() {
  questionList.classList.remove('hidden');
  showQuestionsButton.classList.add('hidden');
  backToMainPageFromShowQuestionsButton.classList.remove('hidden');
  questionForm.classList.add('hidden');
  startQuizButton.classList.add('hidden');
}

// Go back to the main page from Show Questions
function goBackToMainPageFromShowQuestions() {
  questionList.classList.add('hidden');
  showQuestionsButton.classList.remove('hidden');
  backToMainPageFromShowQuestionsButton.classList.add('hidden');
  questionForm.classList.remove('hidden');
  startQuizButton.classList.remove('hidden');
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
  saveQuestion(newQuestion, editingIndex);
  editingIndex = null;
  questionForm.reset();
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
