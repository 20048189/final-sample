let questions = JSON.parse(localStorage.getItem("questions")) || [];
let currentQuestionIndex = 0;
let score = 0;
let editingIndex = null;

const startQuizBtn = document.getElementById('start-quiz-btn');
const showAllQuestionsBtn = document.getElementById('show-all-questions-btn');
const backToMainPageBtns = document.querySelectorAll('#back-to-main-page-btn, #go-back-main-page-btn');
const nextBtn = document.getElementById('next-btn');
const questionText = document.getElementById('question-text');
const answer1 = document.getElementById('answer1');
const answer2 = document.getElementById('answer2');
const answer3 = document.getElementById('answer3');
const answer4 = document.getElementById('answer4');
const correctAnswer = document.getElementById('correct-answer');
const questionForm = document.getElementById('question-form');
const questionList = document.getElementById('questions-list');
const quizQuestion = document.getElementById('quiz-question');
const answerButtons = document.getElementById('answer-buttons');
const scoreElement = document.getElementById('score');
const scorePage = document.getElementById('score-page');
const manageQuestionsPage = document.getElementById('manage-questions-page');
const quizPage = document.getElementById('quiz-page');
const welcomePage = document.getElementById('welcome-page');

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  page.style.display = 'block';
}

startQuizBtn.addEventListener('click', () => {
  currentQuestionIndex = 0;
  score = 0;
  showPage(quizPage);
  loadNextQuestion();
});

showAllQuestionsBtn.addEventListener('click', () => {
  showPage(manageQuestionsPage);
  displayQuestions();
});

backToMainPageBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    showPage(welcomePage);
  });
});

questionForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newQuestion = {
    question: questionText.value,
    answers: [answer1.value, answer2.value, answer3.value, answer4.value],
    correctAnswer: parseInt(correctAnswer.value),
  };

  if (editingIndex !== null) {
    questions[editingIndex] = newQuestion;
  } else {
    questions.push(newQuestion);
  }

  localStorage.setItem("questions", JSON.stringify(questions));
  displayQuestions();
  questionForm.reset();
  editingIndex = null;
});

nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  loadNextQuestion();
});

function loadNextQuestion() {
  if (currentQuestionIndex >= questions.length) {
    showPage(scorePage);
    scoreElement.textContent = `${score} / ${questions.length}`;
  } else {
    const question = questions[currentQuestionIndex];
    quizQuestion.textContent = question.question;
    answerButtons.innerHTML = '';
    question.answers.forEach((answer, index) => {
      const btn = document.createElement('button');
      btn.textContent = answer;
      btn.classList.add('btn');
      btn.addEventListener('click', () => {
        if (index === question.correctAnswer - 1) {
          score++;
        }
        nextBtn.disabled = false;
      });
      answerButtons.appendChild(btn);
    });
  }
}

function displayQuestions() {
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

function editQuestion(index) {
  const question = questions[index];
  questionText.value = question.question;
  [answer1, answer2, answer3, answer4].forEach((input, i) => {
    input.value = question.answers[i];
  });
  correctAnswer.value = question.correctAnswer;
  editingIndex = index;
}

function deleteQuestion(index) {
  questions.splice(index, 1);
  localStorage.setItem("questions", JSON.stringify(questions));
  displayQuestions();
}
