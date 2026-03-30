<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>appa's bday</title>
  <style>
    body {
      background-color: black;
      color: white;
      font-family: 'Courier New', monospace;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }

    .container {
      text-align: center;
      max-width: 800px;
      width: 100%;
    }

    .typing-text {
      font-size: 24px;
      min-height: 30px;
      margin-bottom: 30px;
    }

    .cursor {
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .quiz-container {
      display: none;
      margin-top: 30px;
    }

    .question {
      font-size: 20px;
      margin-bottom: 30px;
      line-height: 1.5;
    }

    .answers {
      display: flex;
      flex-direction: column;
      gap: 15px;
      align-items: center;
    }

    .answer-btn {
      background-color: transparent;
      color: white;
      border: 2px solid white;
      padding: 15px 30px;
      font-size: 16px;
      font-family: 'Courier New', monospace;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 300px;
    }

    .answer-btn:hover {
      background-color: white;
      color: black;
    }

    .correct {
      color: green !important;
      border-color: green !important;
      background-color: transparent !important;
    }

    .incorrect {
      color: red !important;
      border-color: red !important;
      background-color: transparent !important;
    }

    .success-message,
    .failure-message,
    .identity-confirmed {
      font-size: 24px;
      margin-top: 30px;
      display: none;
    }

    .success-message {
      color: green;
    }

    .failure-message {
      color: red;
    }

    .identity-confirmed {
      color: white;
      font-size: 36px;
      animation: fadeIn 1s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .reveal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: black;
      display: none;
      z-index: 1000;
    }
    
    .expanding-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  object-fit: cover;
  transition: all 3s ease-out;
  opacity: 1;
  z-index: 1001;
}

.expanding-image.expand {
  width: 100vw;
  height: 100vh;
  border-radius: 0; /* or keep 50% if you want a full-screen circle */
}

    }
  </style>
</head>
<body>
  <div class="container">
    <div class="typing-text" id="typingText"></div>
    
    <div class="quiz-container" id="quizContainer">
      <div class="question" id="question"></div>
      <div class="answers" id="answers"></div>
      <div class="success-message" id="successMessage">access gain!</div>
      <div class="failure-message" id="failureMessage">access denied.</div>
      <div class="identity-confirmed" id="identityConfirmed">identity confirmed!</div>
    </div>
  </div>

  <div class="reveal-container" id="revealContainer">
    <img src="appa.png" alt="Appa" class="expanding-image" id="expandingImage">
  </div>

  <script>
    const sentences = [
      "hello there",
      "this is super secret website",
      "to gain access, we need to confirm your identity",
      "to do this, you must answer a couple of questions..."
    ];

    const questions = [
      {
        question: "what is the correct answer?",
        answers: ["heroic hyunsuk, lionhearted lana, jubilant joel", "hilarious hyunsuk, laughing lana, jolly joel", "hopping hyunsuk, leaping lana, jogger joel"],
        correct: 2
      },
      {
        question: "what pokemon resonates with you the most?",
        answers: ["ditto", "meowth", "bulbasaur"],
        correct: 1
      },
      {
        question: "why are you the best dad?",
        answers: ["you often use your daughter's tooth brush accidentally", "you fart and blame it on your daughter", "you have sometimes good dad jokes and always show up and support your family"],
        correct: 2
      }
    ];

    let currentSentence = 0;
    let currentChar = 0;
    let isDeleting = false;
    let currentQuestion = 0;
    let quizStarted = false;

    const typingText = document.getElementById('typingText');
    const quizContainer = document.getElementById('quizContainer');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const successMessage = document.getElementById('successMessage');
    const failureMessage = document.getElementById('failureMessage');
    const identityConfirmed = document.getElementById('identityConfirmed');
    const revealContainer = document.getElementById('revealContainer');
    const expandingImage = document.getElementById('expandingImage');

    function typeText() {
      if (quizStarted) return;

      const current = sentences[currentSentence];
      
      if (!isDeleting) {
        typingText.innerHTML = current.substring(0, currentChar) + '<span class="cursor">|</span>';
        currentChar++;
        if (currentChar > current.length) {
          isDeleting = true;
          setTimeout(typeText, 2000);
          return;
        }
      } else {
        typingText.innerHTML = current.substring(0, currentChar) + '<span class="cursor">|</span>';
        currentChar--;
        if (currentChar < 0) {
          isDeleting = false;
          currentSentence++;
          if (currentSentence >= sentences.length) {
            typingText.innerHTML = '';
            startQuiz();
            return;
          }
        }
      }
      setTimeout(typeText, isDeleting ? 50 : 100);
    }

    function startQuiz() {
      quizStarted = true;
      quizContainer.style.display = 'block';
      showQuestion();
    }

    function showQuestion() {
      if (currentQuestion >= questions.length) {
        questionElement.style.display = 'none';
        answersElement.style.display = 'none';
        successMessage.style.display = 'none';
        identityConfirmed.style.display = 'block';
        setTimeout(startReveal, 2000);
        return;
      }

      const q = questions[currentQuestion];
      questionElement.textContent = q.question;
      answersElement.innerHTML = '';

      q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.addEventListener('click', () => checkAnswer(index, btn));
        answersElement.appendChild(btn);
      });
    }

    function checkAnswer(selectedIndex, button) {
      const correct = questions[currentQuestion].correct;
      if (selectedIndex === correct) {
        button.classList.add('correct');
        setTimeout(() => {
          currentQuestion++;
          showQuestion();
        }, 1500);
      } else {
        button.classList.add('incorrect');
        setTimeout(() => {
          questionElement.style.display = 'none';
          answersElement.style.display = 'none';
          failureMessage.style.display = 'block';
        }, 1500);
      }
    }

    function startReveal() {
      document.querySelector('.container').style.display = 'none';
      revealContainer.style.display = 'block';

      // Trigger CSS animation only
      setTimeout(() => {
        expandingImage.classList.add('expand');
      }, 500);
    }

    typeText();
  </script>
</body>
</html>

