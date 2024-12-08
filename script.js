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
const mainPage = document.getElementById('main-page');
const quizSection = document.getElementById('quiz-section');
const questionManagement = document.getElementById('question-management');
const backToMainPageBtn = document.getElementById('back-to-main-page-btn');
const showQuestionsBtn = document.getElementById('show-questions-btn');
const startQuizBtn = document.getElementById('start-quiz-btn');

function saveQuestions() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

function loadQuestions() {
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

function addOrUpdateQuestion(event) {
  event.preventDefault();
  const newQuestion = {
    question: questionText.value,
    answers: answerInputs.map((input, i) => ({
      text: input.value,
      correct: i + 1 == correctAnswerSelect.value
    }))
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
}

function editQuestion(index) {
  const question = questions[index];
  questionText.value = question.question;
  question.answers.forEach((answer, i) => {
    answerInputs[i].value = answer.text;
    if (answer.correct) correctAnswerSelect.value = i + 1;
  });
  editingIndex = index;
  questionManagement.classList.remove('hidden');
  mainPage.classList.add('hidden');
}

function deleteQuestion(index) {
  questions.splice(index, 1);
  saveQuestions();
  loadQuestions();
}

function startQuiz() {
  if (questions.length === 0) {
    alert("No questions available. Please add questions first.");
    return;
  }
  currentQuestionIndex = 0;
  score = 0;
  scoreContainer.classList.add('hidden');
  nextButton.classList.remove('hidden');
  showQuestion();
  mainPage.classList.add('hidden');
  quizSection.classList.remove('hidden');
}

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

function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const isCorrect = selectedButton.dataset.correct;
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

function endQuiz() {
  questionElement.innerText = "Quiz Complete!";
  answerButtonsElement.classList.add('hidden');
  nextButton.classList.add('hidden');
  scoreContainer.classList.remove('hidden');
  scoreElement.innerText = `${score} / ${questions.length}`;  // Display obtained score out of total questions
}


function goBackToMainPage() {
  quizSection.classList.add('hidden');
  mainPage.classList.remove('hidden');
  questionManagement.classList.add('hidden');
}
startQuizBtn.addEventListener('click', startQuiz);
showQuestionsBtn.addEventListener('click', () => {
  loadQuestions();
  questionManagement.classList.remove('hidden');
  mainPage.classList.add('hidden');
});
questionForm.addEventListener('submit', addOrUpdateQuestion);
backToMainPageBtn.addEventListener('click', goBackToMainPage);
