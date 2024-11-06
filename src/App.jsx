import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(50); // Maximum score
  const [gameOver, setGameOver] = useState(false); // Flag to check if game is over

  const apiKey = '690463d4'; // Your API key here

  // Fetch movies function
  const fetchMovies = () => {
    axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&s=movie&page=${Math.floor(Math.random() * 10) + 1}`) // Randomize page number
      .then(response => {
        const randomMovies = response.data.Search.slice(0, 10); // Fetch 10 movies each time
        const questionData = randomMovies.map(movie => ({
          question: `Which movie is this?`,
          image: movie.Poster, // You can replace this with actual movie scene images if available
          options: generateOptions(movie.Title),
          correctAnswer: movie.Title
        }));
        setQuestions(questionData); // Set the new list of questions
        setCurrentQuestion(0); // Reset to the first question
        setScore(0); // Reset the score
        setGameOver(false); // Game is not over
      });
  };

  // Generate options for each question
  const generateOptions = (correctAnswer) => {
    const options = [correctAnswer];
    const wrongAnswers = ['The Godfather', 'Avengers', 'Inception', 'Titanic']; // Add more wrong answers here
    while (options.length < 4) {
      const randomWrongAnswer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
      if (!options.includes(randomWrongAnswer)) {
        options.push(randomWrongAnswer);
      }
    }
    return shuffle(options);
  };

  // Shuffle the options randomly
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Handle the user's answer
  const handleAnswer = (answer) => {
    const currentQ = questions[currentQuestion];
    if (answer === currentQ.correctAnswer) {
      setScore(prevScore => {
        const newScore = prevScore + 10;
        if (newScore >= maxScore) {
          setGameOver(true); // Game over when score reaches max score
          return maxScore;
        } else {
          setCurrentQuestion(prev => (prev + 1) % questions.length);
          return newScore;
        }
      });
    } else {
      setGameOver(true); // Game over when the answer is wrong
    }
  };

  // Restart the game with new movies
  const restartGame = () => {
    fetchMovies(); // Fetch new movies when the game restarts
  };

  useEffect(() => {
    fetchMovies(); // Fetch initial movies when the page loads
  }, []); // Empty dependency array to only run on initial load

  return (
    <div className="container">
      {!gameOver ? (
        <>
          <div className="question-box">
            <h2>{questions[currentQuestion] && questions[currentQuestion].question}</h2>
            <img src={questions[currentQuestion]?.image} alt="Movie Scene" className="movie-img" />
            <div className="options">
              {questions[currentQuestion]?.options.map((option, index) => (
                <button key={index} onClick={() => handleAnswer(option)} className="option-btn">
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="score-box">
            <h4>Xallar: {score}</h4>
          </div>
        </>
      ) : (
        <div className="game-over">
          <h2 className={score === maxScore ? "success-message" : "failure-message"}>
            {score === maxScore ? 'Təbriklər, qalib oldunuz!' : 'Zəifsiniz!'}
          </h2>
          <p>Xallarınız: {score}</p>
          <button onClick={restartGame} className="restart-btn">Yenidən Oynamaq</button>
        </div>
      )}
    </div>
  );
};

export default App;