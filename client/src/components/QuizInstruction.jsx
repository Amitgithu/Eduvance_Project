import React from 'react';
import { Link, useParams } from 'react-router-dom';

const QuizInstruction = () => {
  const {courseId, courseName} = useParams();
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-lg border-0 rounded overflow-hidden">
            <div className="card-header bg-primary text-white text-center py-4">
              <h1>Welcome to the Quiz!</h1>
              <p className="lead">Are you ready to test your knowledge?</p>
            </div>
            <div className="card-body bg-light">
              <div className="row">
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                  <img
                    src="https://thumbs.dreamstime.com/z/student-chooses-correct-answer-test-online-quiz-e-learning-distance-education-concept-horizontal-copy-space-vector-illustration-286072323.jpg"
                    alt="Quiz Illustration"
                    className="img-fluid rounded"
                  />
                </div>
                <div className="col-md-6">
                  <p className="text-muted mt-3">
                    Take part in this exciting quiz to challenge yourself and enhance your learning experience. Answer questions, earn points, and see how much you know!
                  </p>

                  <ul className="list-group list-group-flush my-4">
                    {/* <li className="list-group-item">📚 <strong>Topics Covered:</strong> Various subjects related to your course</li> */}
                    <li className="list-group-item">⏳ <strong>Time Limit:</strong> 10 minutes</li>
                    <li className="list-group-item">✨ <strong>Scoring:</strong> Earn points for correct answers</li>
                    <li className="list-group-item">❌ <strong>Negative Marking:</strong> None</li>
                  </ul>

                  <p className="text-warning mt-3">
                    Ensure you're ready before you start. Once the quiz begins, the timer won't stop!
                  </p>

                  <div className="d-grid gap-2 mt-3">
                    <Link to={`/certificate/${courseId}/${courseName}`} className="btn btn-success">
                      Start Quiz
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer text-center bg-primary text-white py-3">
              <p className="mb-0">Good Luck! 🍀</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInstruction;
