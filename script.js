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
    questionItem.innerHTML = `<strong>${question.question}</strong><br>`;
    
    // Create Answer Buttons
    question.answers.forEach(answer => {
      const answerItem = document.createElement('p');
      answerItem.innerText = answer.text;
      questionItem.appendChild(answerItem);
    });
    
    // Edit Button
    const editButton = document.createElement('button');
    editButton.classList.add('edit-btn');
    editButton.innerText = 'Edit';
    editButton.onclick = () => editQuestion(index);
    
    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
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
}

// Go back to the main page
function goBackToMainPage() {
  quizSection.classList.add('hidden');
  mainPage.classList.remove('hidden');
  resetState();

  // Ensure the Start Quiz button is visible again when going back to the main page
  startQuizButton.classList.remove('hidden');
}

// Show all questions with editing and deleting options
function showAllQuestions() {
  loadQuestions(); // Ensure questions are loaded
  questionList.classList.remove('hidden'); // Show the questions list
  showQuestionsButton.classList.add('hidden'); // Hide the Show All Questions button
  backToMainPageButton.classList.remove('hidden'); // Show the Back to Main Page button
  questionForm.classList.add('hidden'); // Hide the question form
  startQuizButton.classList.add('hidden'); // Hide the Start Quiz button
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

// Initial Setup: Hide unnecessary sections
quizSection.classList.add('hidden');
questionList.classList.add('hidden');
backToMainPageButton.classList.add('hidden'); // Hide "Back to Main Page" initially

loadQuestions(); // Load existing questions on page load
