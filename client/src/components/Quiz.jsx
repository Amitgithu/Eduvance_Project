import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Timer from './Timer';
import QuizCompletion from './QuizCompletion';
import 'bootstrap/dist/css/bootstrap.min.css';

const Quiz = () => {
  const { courseId, courseName } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timerKey, setTimerKey] = useState(0); // Used to reset the timer

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = {
            "prompt": `Provide 10 different ${courseName} Quiz Questions and Answer in this provided format: const dummyQuizzes = [ { "questions": [ { "question": "What is the result of 3 + 2?", "options": ["5", "6", "7", "8"], "correctAnswer": 0, "timeLimit": 30 } ] } ];`
        }
        const response = await axios.post(`https://eduvance-backend.onrender.com/generateQuiz`, data);
         // Parse the response to extract quiz questions
         const rawText = response.data.candidates[0].content.parts[0].text;
        //  console.log("Raw Text : ", rawText);
         

         // Extract the JavaScript code string from the text and parse it
         const startIndex = rawText.indexOf('['); // Starting of the array
         const endIndex = rawText.lastIndexOf(']') + 1; // Ending of the array
         const jsonText = rawText.slice(startIndex, endIndex); // Extract JSON part

         console.log("JSON Text : ", jsonText);
         
         const parsedQuizData = JSON.parse(jsonText); // Parse into a valid JSON object

        console.log("Parsed Quiz Data : ", parsedQuizData);
        console.log("Parsed Questions Quiz Data : ", parsedQuizData[0]);
 
         setQuiz(parsedQuizData[0]); // Set only questions in state
      } catch (err) {
        console.error('Error fetching quiz:', err);
      }
    };

    fetchQuiz();
  }, []);

  const handleAnswer = (selectedAnswerIndex) => {
    if (quiz && quiz.questions) {
      const correctAnswer = quiz.questions[currentQuestionIndex].correctAnswer;

      if (selectedAnswerIndex === correctAnswer) {
        setScore(score + 1); // Increment score for correct answer
      }

      // Move to the next question or mark the quiz as complete
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setTimerKey(prevKey => prevKey + 1); // Reset timer
      } else {
        setIsQuizComplete(true);
      }
    }
  };

  const handleRetry = () => {
    setIsQuizComplete(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimerKey(timerKey + 1); // Reset timer by changing key
  };

  if (!quiz) {
    return (
      <div className="text-center d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  if (isQuizComplete) {
    return <QuizCompletion score={score} totalQuestions={quiz.questions.length} onRetry={handleRetry} courseId={courseId}/>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-3 w-75 p-4">
        {/* Timer Section */}
        <div className="position-absolute top-0 end-0 mt-2">
          <Timer
            key={timerKey} // The key will force the component to re-render, effectively resetting the timer
            timeLimit={currentQuestion.timeLimit}
            onTimeUp={() => {
              if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setTimerKey(prevKey => prevKey + 1); // Increment timerKey to reset the timer
              } else {
                setIsQuizComplete(true);
              }
            }}
          />
        </div>


        <div className="card-header bg-primary text-white text-center rounded-3 py-3">
          <h2 className="card-title mb-0">{courseName}</h2>
        </div>
        <div className="card-body">
          {/* Progress Indicator */}
          <div className="text-center mb-3">
            <p className="text-muted">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>

          {/* Question Display */}
          <div className="mb-4">
            <h4 className="text-secondary">{currentQuestion.question}</h4>
          </div>

          {/* Answer Options - Each on a new line */}
          <div className="mt-3">
            {currentQuestion.options.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="btn btn-outline-primary btn-lg btn-block text-left mb-3 py-3 rounded-3 transition-all duration-300 ease-in-out transform hover:scale-105 w-100"
                style={{
                  fontSize: '18px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{answer}</span>
                  <i className="bi bi-check-circle" style={{ visibility: 'hidden' }}></i>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
