async function generateQuiz() {
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    
    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`;
    if(category&&difficulty&&type){
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      if (data.results.length > 0) {
        displayQuiz(data.results);
      } else {
        throw new Error('No quiz questions found.');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      displayError('Failed to generate quiz');
    }
  }
}
  
function displayQuiz(questions) {
    const quizElement = document.getElementById('quiz');
    quizElement.innerHTML = '<h2>Generated Quiz</h2>';
  
    questions.forEach((question, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.classList.add('question');
  
      const questionHTML = `
        <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
        <form id="form-${index}">
          ${getAnswerOptions(question, index)}
          <button type="button" onclick="checkAnswer(${index}, '${question.correct_answer}')">Submit</button>
          <p id="result-${index}"></p>
        </form>
        <hr>
      `;
      questionDiv.innerHTML = questionHTML;
      quizElement.appendChild(questionDiv);
    });
  }
  
  function getAnswerOptions(question, index) {
    const options = [...question.incorrect_answers, question.correct_answer];
    return options
      .map(
        (option, i) =>
          `<input type="radio" id="option-${index}-${i}" name="question-${index}" value="${option}">
           <label for="option-${index}-${i}">${option}</label><br>`
      )
      .join('');
  }
  
  function checkAnswer(questionIndex, correctAnswer) {
    const form = document.getElementById(`form-${questionIndex}`);
    const selectedAnswer = form.querySelector(`input[name="question-${questionIndex}"]:checked`);
    const resultElement = document.getElementById(`result-${questionIndex}`);
  
    if (selectedAnswer) {
      const userAnswer = selectedAnswer.value;
      if (userAnswer === correctAnswer) {
        resultElement.textContent = 'Correct answer!';
      } else {
        resultElement.textContent = 'Wrong answer. Try again!';
      }
    } else {
      resultElement.textContent = 'Please select an answer.';
    }
  }
  
  
  function displayError(message) {
    const quizElement = document.getElementById('quiz');
    quizElement.innerHTML = `<p>${message}</p>`;
  }
  