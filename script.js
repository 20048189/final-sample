let questions = JSON.parse(localStorage.getItem("questions")) || [];
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
const startQuizButton = document.getElementById('start-quiz-btn');
const showAllQuestionsButton = document.getElementById('show-all-questions-btn');
const backToMainPageButton = document.getElementById('back-to-main-page-btn');

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
}

// Start Quiz
startQuizButton.addEventListener('click', () => {
  showPage('quiz-section');
  loadNextQuestion();
});

// Show All Questions
showAllQuestionsButton.addEventListener('click', () => {
  showPage('manage-questions');
  displayQuestions();
});

// Back to Main Page
backToMainPageButton.addEventListener('click', () => {
  showPage('welcome-page');
});

// Load Next Question
nextButton.addEventListener('click', () => {
  if (editingIndex !== null) {
    updateQuestion();
  } else {
    loadNextQuestion();
  }
});

// Add or Update Question
questionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (editingIndex !== null) {
    updateQuestion();
  } else {
    addNewQuestion();
  }
});

function loadNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    answerButtonsElement.innerHTML = '';
    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.textContent = answer;
      button.classList.add('btn');
      button.addEventListener('click', () => checkAnswer(index));
      answerButtonsElement.appendChild(button);
    });
    nextButton.disabled = false;
  } else {
    showScore();
  }
}

function checkAnswer(index) {
  const currentQuestion = questions[currentQuestionIndex];
  if (index + 1 === currentQuestion.correctAnswer) {
    score++;
  }
  currentQuestionIndex++;
  nextButton.disabled = true;
  loadNextQuestion();
}

function showScore() {
  showPage('score-section');
  scoreElement.textContent = `${score} / ${questions.length}`;
}

function addNewQuestion() {
  const newQuestion = {
    question: questionText.value,
    answers: answerInputs.map(input => input.value),
    correctAnswer: parseInt(correctAnswerSelect.value)
  };
  questions.push(newQuestion);
  localStorage.setItem("questions", JSON.stringify(questions));
  displayQuestions();
  questionForm.reset();
}

function updateQuestion() {
  const updatedQuestion = {
    question: questionText.value,
    answers: answerInputs.map(input => input.value),
    correctAnswer: parseInt(correctAnswerSelect.value)
  };
  questions[editingIndex] = updatedQuestion;
  localStorage.setItem("questions", JSON.stringify(questions));
  displayQuestions();
  questionForm.reset();
  editingIndex = null;
}

function displayQuestions() {
  questionList.innerHTML = '';
  questions.forEach((question, index) => {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-item');
    questionItem.innerHTML = `
      <p>${question.question}</p>
      <button class="edit-btn" onclick="editQuestion(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteQuestion(${index})">Delete</button>
    `;
    questionList.appendChild(questionItem);
  });
}

function editQuestion(index) {
  const question = questions[index];
  questionText.value = question.question;
  answerInputs.forEach((input, i) => input.value = question.answers[i]);
  correctAnswerSelect.value = question.correctAnswer;
  editingIndex = index;
}

function deleteQuestion(index) {
  questions.splice(index, 1);
  localStorage.setItem("questions", JSON.stringify(questions));
  displayQuestions();
}
