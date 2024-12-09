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
const showQuestionsButton = document.getElementById('show-questions-btn');
const startQuizButton = document.getElementById('start-quiz-btn');
const quizSection = document.getElementById('quiz-section');
const mainPage = document.getElementById('main-page');
const backToMainPageButton = document.getElementById('back-to-main-page-btn');
const backToMainPageFromShowQuestionsButton = document.getElementById('back-to-main-page-from-show-questions-btn');

// Save questions to localStorage
function saveQuestions() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

// Load questions and display them in a structured format
function loadQuestions() {
  questionList.innerHTML = ''; // Clear the list before adding new ones
  questions.forEach((question, index) => {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-item'); // Add a class for styling
    questionItem.innerHTML = `
      <strong>${question.question}</strong><br>
      <div>Answer 1: ${question.answers[0].text}</div>
      <div>Answer 2: ${question.answers[1].text}</div>
      <div>Answer 3: ${question.answers[2].text}</div>
      <div>Answer 4: ${question.answers[3].text}</div>
      <button class="edit-btn" onclick="editQuestion(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteQuestion(${index})">Delete</button>
    `;
    questionList.appendChild(questionItem);
  });
}

// Show all questions (show the list of questions with editing and deleting)
function showAllQuestions() {
  loadQuestions(); // Ensure questions are loaded
  questionList.classList.remove('hidden'); // Show the questions list
  showQuestionsButton.classList.add('hidden'); // Hide the Show All Questions button
  backToMainPageFromShowQuestionsButton.classList.remove('hidden'); // Show the Back to Main Page button after questions list
  questionForm.classList.add('hidden'); // Hide the question form
  startQuizButton.classList.add('hidden'); // Hide the Start Quiz button
}
function showAllQuestions() {
  loadQuestions();
  questionList.classList.remove('hidden'); // Show the question list
  showQuestionsButton.classList.add('hidden'); // Hide the Show All Questions button
}

function goBackToMainPageFromShowQuestions() {
  questionList.classList.add('hidden'); // Hide the question list
  showQuestionsButton.classList.remove('hidden'); // Show the Show All Questions button
}

// Go back to the main page from show all questions view
function goBackToMainPageFromShowQuestions() {
  questionList.classList.add('hidden');
  showQuestionsButton.classList.remove('hidden'); // Show the Show All Questions button again
  backToMainPageFromShowQuestionsButton.classList.add('hidden'); // Hide the "Back to Main Page" button
  questionForm.classList.remove('hidden'); // Show the question form again
  startQuizButton.classList.remove('hidden'); // Show the Start Quiz button
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
    questions[editingIndex] = newQuestion; // Update the question
    editingIndex = null;
  } else {
    questions.push(newQuestion); // Add new question
  }
  saveQuestions();
  questionForm.reset();
  loadQuestions(); // Ensure updated questions are shown
  showQuestionsButton.classList.remove('hidden');
  questionForm.classList.add('hidden');
  backToMainPageButton.classList.add('hidden');
  startQuizButton.classList.remove('hidden');
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

  // Hide the main page and quiz section, show the question form for editing
  mainPage.classList.add('hidden');
  quizSection.classList.add('hidden');
  questionForm.classList.remove('hidden');
  backToMainPageButton.classList.remove('hidden');
  startQuizButton.classList.add('hidden');
}

// Delete a question
function deleteQuestion(index) {
  questions.splice(index, 1);
  saveQuestions();
  loadQuestions();
}

// Start the quiz
function startQuiz() {
  if (questions.length === 0) {
    alert("No questions available. Please add questions first.");
    return;
  }

  // Hide the main page and show the quiz section
  mainPage.classList.add('hidden');
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
  backToMainPageButton.classList.remove('hidden'); // Show the "Back to Main Page" button
}

// Go back to the main page
function goBackToMainPage() {
  quizSection.classList.add('hidden');
  mainPage.classList.remove('hidden');
  resetState();

  // Ensure the Start Quiz button is visible again when going back to the main page
  startQuizButton.classList.remove('hidden');
  backToMainPageButton.classList.add('hidden'); // Hide the "Back to Main Page" button
}

// Event Listeners
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  showQuestion();
});

questionForm.addEventListener('submit', addOrUpdateQuestion);
startQuizButton.addEventListener('click', startQuiz);
backToMainPageButton.addEventListener('click', goBackToMainPage);
backToMainPageFromShowQuestionsButton.addEventListener('click', goBackToMainPageFromShowQuestions);
showQuestionsButton.addEventListener('click', showAllQuestions);
// Load questions initially
loadQuestions();
