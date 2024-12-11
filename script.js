let questions = JSON.parse(localStorage.getItem("questions")) || [];
async function loadQuestions() {
  const response = await fetch('https://stunning-tribble-wrgvg6vx69r525579-3000.app.github.dev/');
  questions = await response.json();
  displayQuestions();
}
async function addQuestion(newQuestion) {
  await fetch('https://stunning-tribble-wrgvg6vx69r525579-3000.app.github.dev/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newQuestion),
  });
  loadQuestions(); // Reload updated questions
}

let currentQuestionIndex = 0;
let score = 0;
let editingIndex = null;

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreContainer = document.getElementById("score-container");
const scoreElement = document.getElementById("score");
const questionForm = document.getElementById("question-form");
const questionText = document.getElementById("question-text");
const answerInputs = [
  document.getElementById("answer1"),
  document.getElementById("answer2"),
  document.getElementById("answer3"),
  document.getElementById("answer4"),
];
const correctAnswerSelect = document.getElementById("correct-answer");
const questionList = document.getElementById("question-list");
const showQuestionsButton = document.getElementById("show-questions-btn");
const startQuizButton = document.getElementById("start-quiz-btn");
const quizSection = document.getElementById("quiz-section");
const mainPage = document.getElementById("main-page");
const backToMainPageButton = document.getElementById("back-to-main-page-btn");
const backToMainPageFromShowQuestionsButton = document.getElementById(
  "back-to-main-page-from-show-questions-btn"
);

// Save questions to localStorage
function saveQuestions() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

// Load questions and display them in a structured format
function loadQuestions() {
  questionList.innerHTML = ""; // Clear the list before adding new ones
  if (questions.length === 0) {
    questionList.innerHTML = "<p>No questions available. Add some first!</p>";
    return;
  }

  questions.forEach((question, index) => {
    const questionItem = document.createElement("div");
    questionItem.classList.add("question-item");
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

// Show all questions
function showAllQuestions() {
  loadQuestions();
  questionList.style.display = "block"; // Show the question list
  showQuestionsButton.style.display = "none"; // Hide the Show All Questions button
  backToMainPageFromShowQuestionsButton.style.display = "inline-block"; // Show the Back button
}

// Go back to the main page from show all questions view
function goBackToMainPageFromShowQuestions() {
  questionList.style.display = "none"; // Hide the question list
  showQuestionsButton.style.display = "inline-block"; // Show the Show All Questions button
  backToMainPageFromShowQuestionsButton.style.display = "none"; // Hide the Back button
}

// Add or update a question
function addOrUpdateQuestion(event) {
  event.preventDefault();
  const newQuestion = {
    question: questionText.value,
    answers: answerInputs.map((input, i) => ({
      text: input.value,
      correct: i + 1 == correctAnswerSelect.value,
    })),
  };

  if (editingIndex !== null) {
    questions[editingIndex] = newQuestion; // Update the question
    editingIndex = null;
  } else {
    questions.push(newQuestion); // Add new question
  }
  saveQuestions();
  questionForm.reset();
  goBackToMainPageFromShowQuestions();
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
  questionForm.scrollIntoView({ behavior: "smooth" });
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

  mainPage.style.display = "none";
  quizSection.style.display = "block";

  currentQuestionIndex = 0;
  score = 0;
  scoreContainer.style.display = "none";
  nextButton.style.display = "inline-block";

  showQuestion();
}

// Show the current question
function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

// Reset the state (clear previous answers)
function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
  answerButtonsElement.style.display = "flex"; // Reset visibility for the next question
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
  answerButtonsElement.style.display = "none";
  nextButton.style.display = "none";
  scoreContainer.style.display = "block";
  scoreElement.innerText = `${score} / ${questions.length}`;
  backToMainPageButton.style.display = "inline-block"; // Show the Back to Main Page button
}

// Go back to the main page after the quiz
function goBackToMainPage() {
  quizSection.style.display = "none";
  mainPage.style.display = "block";

  // Reset the quiz section for the next round
  resetState();
  questionElement.innerText = "";
  scoreContainer.style.display = "none";
  backToMainPageButton.style.display = "none";
}

// Event Listeners
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  showQuestion();
});

questionForm.addEventListener("submit", addOrUpdateQuestion);
startQuizButton.addEventListener("click", startQuiz);
showQuestionsButton.addEventListener("click", showAllQuestions);
backToMainPageFromShowQuestionsButton.addEventListener(
  "click",
  goBackToMainPageFromShowQuestions
);
backToMainPageButton.addEventListener("click", goBackToMainPage);

// Initial Setup
loadQuestions();
