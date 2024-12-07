// Store questions in localStorage
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
const quizSection = document.getElementById('quiz-section');
const questionManagementSection = document.getElementById('question-management');
const showQuestionsButton = document.getElementById('show-questions-btn');
const backToMainPageButton = document.getElementById('back-to-main-page-btn');

// Save questions to localStorage
function saveQuestions() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

// Load questions and display them
function loadQuestions() {
  questionList.innerHTML = ''; // Clear the list before adding new ones
  questions.forEach((question, index) => {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-item');
    questionItem.innerText = question.question;

    // Edit Button
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.onclick = () => editQuestion(index);

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => deleteQuestion(index);

    questionItem.appendChild(editButton);
    questionItem.appendChild(deleteButton);
    questionList.appendChild(questionItem);
  });
}

// Add or update a question
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
  questionForm.reset();
  loadQuestions(); // Ensure updated questions are shown
}

// Edit an existing question
function editQuestion(index) {
  const question = questions[index];
  questionText.value = question.question;
  question.answers.forEach((answer, i) => {
    answerInputs[i].value = answer.text;
    if (answer.correct) correctAnswerSelect.value = i + 1;
  });
  editingIndex = index;
}

// Delete a question
function deleteQuestion(index) {
  questions.splice(index, 1);
  saveQuestions();
  loadQuestions();
}

// Show the quiz section
function startQuiz() {
  if (questions.length === 0) {
    alert("No questions available. Please add questions first.");
    return;
  }

  // Hide the question management section and show the quiz section
  questionManagementSection.classList.add('hidden');
  quizSection.classList.remove('hidden');

  // Hide the Start Quiz button as the quiz is starting
  startQuizButton.classList.add('hidden');

  // Initialize quiz variables
  currentQuestionIndex = 0;
  score = 0;
  scoreContainer.classList.add('hidden');
  nextButton.classList.remove('hidden');

  // Show the first question
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

// Reset the state (clear previous answers)
function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

// Handle answer selection
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

// End the quiz and display the score
function endQuiz() {
  questionElement.innerText = "Quiz Complete!";
  answerButtonsElement.classList.add('hidden');
  nextButton.classList.add('hidden');
  scoreContainer.classList.remove('hidden');
  scoreElement.innerText = `${score} / ${questions.length}`;
}

// Restart the quiz
function restartQuiz() {
  scoreContainer.classList.add('hidden');
  startQuiz();
}

// Go back to the main page (question management section)
function goBackToMainPage() {
  quizSection.classList.add('hidden');
  questionManagementSection.classList.remove('hidden');
  resetState();
  startQuizButton.classList.remove('hidden'); // Ensure the Start Quiz button is visible again
}

// Show all questions with editing and deleting options
function showAllQuestions() {
  loadQuestions(); // Ensure questions are loaded
  questionList.classList.remove('hidden');
  showQuestionsButton.classList.add('hidden'); // Hide Show All Questions button after clicking
}

// Event Listeners
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  showQuestion();
});

questionForm.addEventListener('submit', addOrUpdateQuestion);
startQuizButton.addEventListener('click', startQuiz);
backToMainPageButton.addEventListener('click', goBackToMainPage);
showQuestionsButton.addEventListener('click', showAllQuestions);

// Initialize the app by loading questions and setting up the interface
questionList.classList.add('hidden'); // Hide questions initially
showQuestionsButton.classList.remove('hidden'); // Show the button to trigger showing questions
startQuizButton.classList.remove('hidden'); // Ensure the Start Quiz button is only visible on the main page
