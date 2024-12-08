let questions = JSON.parse(localStorage.getItem("questions")) || [];
let currentQuestionIndex = 0;
let score = 0;
let editingIndex = null;

const startQuizBtn = document.getElementById('start-quiz-btn');
const showAllQuestionsBtn = document.getElementById('show-all-questions-btn');
const nextBtn = document.getElementById('next-btn');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');
const goBackBtn = document.getElementById('go-back-btn');
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
const goBackToMainBtn = document.getElementById('go-back-to-main-btn');

// Show specific page
function showPage(pageId) {
  const pages = ['main-page', 'quiz-page', 'score-page', 'manage-questions-page'];
  pages.forEach(page => document.getElementById(page).classList.add('hidden'));
  document.getElementById(pageId).classList.remove('hidden');
}

// Show Questions Management Page
function showManageQuestionsPage() {
  showPage('manage-questions-page');
  loadQuestions();
}

// Save questions to localStorage
function saveQuestions() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

// Load questions and display them
function loadQuestions() {
  questionList.innerHTML = '';
  questions.forEach((question, index) => {
    const div = document.createElement('div');
    div.classList.add('question-item');
    div.innerHTML = `
      <p>${question.question}</p>
      <button class="edit-btn" onclick="editQuestion(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteQuestion(${index})">Delete</button>
    `;
    questionList.appendChild(div);
  });
}

// Add or update question
function addOrUpdateQuestion(event) {
  event.preventDefault();
  const newQuestion = {
    question: questionText.value,
    answers: answerInputs.map(input => input.value),
    correctAnswer: correctAnswerSelect.value
  };
  if (editingIndex !== null) {
    questions[editingIndex] = newQuestion;
    editingIndex = null;
  } else {
    questions.push(newQuestion);
  }
  saveQuestions();
  loadQuestions();
  questionForm.reset();
  showManageQuestionsPage();
}

// Edit question
function editQuestion(index) {
  const question = questions[index];
  questionText.value = question.question;
  answerInputs.forEach((input, i) => {
    input.value = question.answers[i];
  });
  correctAnswerSelect.value = question.correctAnswer;
  editingIndex = index;
}

// Delete question
function deleteQuestion(index) {
  questions.splice(index, 1);
  saveQuestions();
  loadQuestions();
}

// Start Quiz
function startQuiz() {
  if (questions.length === 0) {
    alert("Please add some questions first.");
    return;
  }
  currentQuestionIndex = 0;
  score = 0;
  showPage('quiz-page');
  showQuestion();
}

// Show question and answers
function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  currentQuestion.answers.forEach((answer, i) => {
    const button = document.createElement('button');
    button.innerText = answer;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(i));
    answerButtonsElement.appendChild(button);
  });
}

// Reset state
function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

// Select answer
function selectAnswer(index) {
  const currentQuestion = questions[currentQuestionIndex];
  if (currentQuestion.correctAnswer == index + 1) {
    score++;
  }
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    endQuiz();
  }
}

// End quiz and show score
function endQuiz() {
  showPage('score-page');
  scoreElement.innerText = `${score} / ${questions.length}`;
}

// Restart quiz
function restartQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  showPage('quiz-page');
  showQuestion();
}

// Go back to main page
function goBackToMainPage() {
  showPage('main-page');
}

// Event listeners
startQuizBtn.addEventListener('click', startQuiz);
showAllQuestionsBtn.addEventListener('click', showManageQuestionsPage);
goBackBtn.addEventListener('click', goBackToMainPage);
goBackToMainBtn.addEventListener('click', goBackToMainPage);
questionForm.addEventListener('submit', addOrUpdateQuestion);

// Initialize
showPage('main-page');
