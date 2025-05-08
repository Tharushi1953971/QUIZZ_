document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loginScreen = document.getElementById('login-screen');
  const dashboard = document.getElementById('dashboard');
  const quizOptions = document.getElementById('quiz-options');
  const quizContainer = document.getElementById('quiz-container');
  const askQuestion = document.getElementById('ask-question');
  
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const loginError = document.getElementById('login-error');
  const userGreeting = document.getElementById('user-greeting');
  
  const showQuizBtn = document.getElementById('show-quiz-btn');
  const showAskBtn = document.getElementById('show-ask-btn');
  const backToDashboard = document.getElementById('back-to-dashboard');
  const startQuizBtn = document.getElementById('start-quiz');
  
  const level = document.getElementById('level');
  const quizType = document.getElementById('quiz-type');
  
  const currentQuestion = document.getElementById('current-question');
  const questionCount = document.getElementById('question-count');
  const score = document.getElementById('score');
  const timeLeft = document.getElementById('time-left');
  const timerProgress = document.getElementById('timer-progress');
  const userAnswer = document.getElementById('user-answer');
  const submitAnswer = document.getElementById('submit-answer');
  const endQuiz = document.getElementById('end-quiz');
  
  const userQuestion = document.getElementById('user-question');
  const answerBox = document.getElementById('answer-box');
  const answerOutput = document.getElementById('answer-output');
  const askBtn = document.getElementById('ask-btn');
  const backFromAsk = document.getElementById('back-from-ask');
  
  // Quiz state
  let quizData = {
    score: 0,
    questionCount: 0,
    currentQuestion: '',
    correctAnswer: 0,
    timer: null
  };
  
  // Create background elements
  createBackgroundElements();
  
  // Event Listeners
  loginBtn.addEventListener('click', handleLogin);
  showQuizBtn.addEventListener('click', showQuizOptionsScreen);
  showAskBtn.addEventListener('click', showAskQuestionScreen);
  document.getElementById('back-to-dashboard-from-score').addEventListener('click', goToDashboard);
  startQuizBtn.addEventListener('click', startQuiz);
  submitAnswer.addEventListener('click', handleSubmitAnswer);
  endQuiz.addEventListener('click', endQuizEarly);
  askBtn.addEventListener('click', handleAskQuestion);
  backFromAsk.addEventListener('click', goToDashboard);
  
  // Add keydown event listeners for input fields
  userAnswer.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      handleSubmitAnswer();
    }
  });
  
  userQuestion.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      handleAskQuestion();
    }
  });
  
  // Functions
  function createBackgroundElements() {
    const backgroundEl = document.querySelector('.background-elements');
    
    // Create bubbles
    for (let i = 0; i < 10; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.style.width = `${Math.random() * 100 + 50}px`;
      bubble.style.height = bubble.style.width;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.top = `${Math.random() * 100}%`;
      bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
      backgroundEl.appendChild(bubble);
    }
    
    // Create math symbols
    const symbols = ['+', '-', '×', '÷', '=', '%'];
    for (let i = 0; i < 15; i++) {
      const symbol = document.createElement('div');
      symbol.className = 'math-symbol';
      symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      symbol.style.left = `${Math.random() * 100}%`;
      symbol.style.top = `${Math.random() * 100}%`;
      symbol.style.color = `hsl(${Math.random() * 360}, 70%, 70%)`;
      symbol.style.animationDuration = `${Math.random() * 20 + 10}s`;
      backgroundEl.appendChild(symbol);
    }
  }
  
  function handleLogin() {
    if (!username.value.trim()) {
      loginError.textContent = 'Please enter a username';
      return;
    }
    
  
    userGreeting.textContent = username.value;
    showScreen(dashboard);
  }
  
  function showQuizOptionsScreen() {
    showScreen(quizOptions);
  }
  
  function showAskQuestionScreen() {
    showScreen(askQuestion);
    answerBox.style.display = 'none';
  }
  
  function goToDashboard() {
    showScreen(dashboard);
    document.getElementById('score-box').style.display = 'none';
  }
  
  
  function startQuiz() {
    // Reset quiz data
    quizData = {
      score: 0,
      questionCount: 0,
      currentQuestion: '',
      correctAnswer: 0,
      timer: null
    };
    
    // Update UI
    score.textContent = '0';
    timeLeft.textContent = '60';
    timerProgress.style.width = '100%';
    
    // Generate first question
    generateQuestion();
    
    // Start timer
    startTimer();
    
    // Show quiz container
    showScreen(quizContainer);
  }
  
  function generateQuestion() {
    const levelNum = parseInt(level.value);
    const type = quizType.value;
    let num1, num2, question, answer;
    
    // Generate numbers based on level
    const max = Math.min(levelNum * 10, 100);
    num1 = Math.floor(Math.random() * max) + 1;
    num2 = Math.floor(Math.random() * max) + 1;
    
    // Ensure division questions have clean answers
    if (type === 'division') {
      num2 = Math.max(1, num2); // Avoid division by zero
      num1 = num1 * num2; // Ensure clean division
    }
    
    // Create question and answer based on type
    switch (type) {
      case 'addition':
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
        break;
      case 'subtraction':
        // Ensure num1 > num2 for easier subtraction
        if (num1 < num2) [num1, num2] = [num2, num1];
        question = `${num1} - ${num2} = ?`;
        answer = num1 - num2;
        break;
      case 'multiplication':
        question = `${num1} × ${num2} = ?`;
        answer = num1 * num2;
        break;
      case 'division':
        question = `${num1} ÷ ${num2} = ?`;
        answer = num1 / num2;
        break;
      default:
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
    }
    
    // Update quiz data
    quizData.questionCount++;
    quizData.currentQuestion = question;
    quizData.correctAnswer = answer;
    
    // Update UI
    currentQuestion.textContent = question;
    questionCount.textContent = quizData.questionCount;
    userAnswer.value = '';
    userAnswer.focus();
  }
  
  function handleSubmitAnswer() {
    const feedback = document.getElementById('answer-feedback');
    feedback.textContent = ''; // Clear any previous feedback
  
    if (!userAnswer.value.trim()) return;
  
    const numAnswer = parseFloat(userAnswer.value);
  
    if (numAnswer === quizData.correctAnswer) {
      // Correct answer
      quizData.score++;
      score.textContent = quizData.score;
      userAnswer.classList.add('correct-answer');
  
      // Clear feedback
      feedback.textContent = '';
  
      // Show confetti
      showConfetti();
  
      // Move to next question
      setTimeout(() => {
        userAnswer.classList.remove('correct-answer');
        generateQuestion();
      }, 500);
  
    } else {
      // Incorrect answer
      userAnswer.classList.add('incorrect-answer');
      feedback.textContent = 'Oops! Wrong answer. Try again!';
  
      setTimeout(() => {
        userAnswer.classList.remove('incorrect-answer');
        userAnswer.focus(); // Keep focus
      }, 500);
    }
  }
  
  
  function startTimer() {
    let time = 600;
    
    // Clear any existing timer
    if (quizData.timer) {
      clearInterval(quizData.timer);
    }
    
    quizData.timer = setInterval(() => {
      time--;
      timeLeft.textContent = time;
      timerProgress.style.width = `${(time / 600) * 100}%`;
      
      if (time <= 0) {
        clearInterval(quizData.timer);
        endQuizEarly();
      }
    }, 1000);
  }
  
  function endQuizEarly() {
    if (quizData.timer) {
      clearInterval(quizData.timer);
    }
  
    // Set values in the score box
    document.getElementById('final-score').textContent = quizData.score;
    document.getElementById('total-questions').textContent = quizData.questionCount;
  
    // Hide quiz screen, show score box
    quizContainer.style.display = 'none';
    document.getElementById('score-box').style.display = 'block';
  }
  
  
  function handleAskQuestion() {
    if (!userQuestion.value.trim()) return;
    
    // Simple math expression evaluator
    try {
      // Remove all characters except numbers and basic operators
      const sanitizedQuestion = userQuestion.value.replace(/[^0-9+\-*/().\s]/g, '');
      
      // Check if there's a valid expression to evaluate
      if (sanitizedQuestion.match(/[0-9]+[+\-*/][0-9]+/)) {
        // Use Function constructor to evaluate the expression
        const result = new Function(`return ${sanitizedQuestion}`)();
        answerOutput.textContent = `The answer is: ${result}`;
      } else {
        answerOutput.textContent = "I can only answer simple math questions like '5 + 3' or '10 * 2'.";
      }
    } catch (error) {
      answerOutput.textContent = "Sorry, I couldn't understand that question. Try a simple math problem like '5 + 3'.";
    }
    
    // Show answer box
    answerBox.style.display = 'flex';
  }
  
  function showConfetti() {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  }
  
  function showScreen(screen) {
    // Hide all screens
    loginScreen.style.display = 'none';
    dashboard.style.display = 'none';
    quizOptions.style.display = 'none';
    quizContainer.style.display = 'none';
    askQuestion.style.display = 'none';
    
    // Show the requested screen
    screen.style.display = 'block';
  }
});
