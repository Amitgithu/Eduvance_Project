import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuizCompletion = ({ score, totalQuestions, onRetry, courseId }) => {

    const [userName, setUserName] = useState("Amit Kumar");

  
    // useEffect(() => {
    //     // Check if user is logged in by checking localStorage
    //     const user = localStorage.getItem('user');
    //     console.log("UserName in Quiz : ", user);
        
    //     if (user) {
    //         const firstName = JSON.parse(user);
    //         console.log(firstName);
            
    //         setUserName(firstName); // Assuming user object contains firstName
    //     }
    // }, []);


  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg border-0 rounded-3 w-75 p-4">
        <div className="card-header bg-primary text-white text-center rounded-3 py-3">
          <h2 className="card-title mb-0">Quiz Completed! 🎉</h2>
        </div>
        <div className="card-body">
          {/* User Info */}
          <div className="mb-4">
            <h4 className="text-center">User Information</h4>
            <div className="text-center">
              <p><strong>Name:</strong> {userName}</p>
              <p><strong>Joined On:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Score Section */}
          <div className="text-center mb-4">
            <h4 className="text-success">Your Score: {score} / {totalQuestions}</h4>
            <p className="text-muted">Great job! Keep practicing to improve even more.</p>
            {(score < 5) ? <button className="btn btn-primary" onClick={onRetry}>Retry Quiz</button> : 
            <Link to={`/certificate/${courseId}`} className="btn btn-primary">Get Your Certificate</Link>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuizCompletion;
