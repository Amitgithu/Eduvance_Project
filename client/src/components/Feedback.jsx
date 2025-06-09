import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Feedback.css'; // Import your CSS file

function Feedback() {
  const { courseId } = useParams();
  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userFeedbacks, setUserFeedbacks] = useState([]); 
  
  // Fetching course and feedback data
  async function fetchData() {
    try {
      const courseResponse = await axios.get(`https://eduvance-backend.onrender.com/single-course/${courseId}`);
      setCourse(courseResponse.data);

      const feedbackResponse = await axios.get(`https://eduvance-backend.onrender.com/courses/${courseId}/feedback`);
      const sortedFeedbacks = feedbackResponse.data.feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserFeedbacks(sortedFeedbacks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data. Please try again later.', { toastId: 'fetchError' });
    }
  }

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`https://eduvance-backend.onrender.com/my-courses/${courseId}/feedback`, { rating, feedback }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Feedback submitted successfully!', { toastId: 'feedbackSuccess' });
      setRating(1);
      setFeedback('');
      fetchData();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again later.', { toastId: 'feedbackError' });
    }
  };

  return (
    <div className="container py-5">
  <ToastContainer />
  <div className="row">
    {/* Course Details Section */}
    <div className="col-md-6">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <p className="loading text-muted">Loading...</p>
        </div>
      ) : (
        <div className="card shadow-sm border-light rounded">
          <div className="card-body">
            <h3 className="card-title mb-3">Course Details</h3>
            <h4 className="mb-3">{course.title}</h4>
            <div className="image-container mb-3">
              <img src={course.image} alt={course.title} className="img-fluid rounded" />
            </div>
            <p><strong>Description:</strong> {course.description}</p>
            <p><strong>Mentor:</strong> {course.mentor}</p>
            <p><strong>Total Lectures:</strong> {course.lectureIds.length}</p>

            {/* Feedbacks Section */}
            <div className="feedbacks mt-4">
              <hr />
              <h5>Feedbacks</h5>
              <ul className="list-unstyled">
                {userFeedbacks.map((feed, index) => (
                  <li key={index} className="mb-4 p-3 bg-light rounded shadow-sm">
                    <p><strong>User:</strong> {feed.user.username}</p>
                    <p><strong>Time:</strong> {new Date(feed.createdAt).toLocaleString()}</p>
                    <p><strong>Rating:</strong> {[...Array(Math.round(feed.rating))].map((_, idx) => (
                      <span key={idx} className="text-warning">&#9733;</span>
                    ))}</p>
                    <p><strong>Comment:</strong> {feed.feedback}</p>
                  </li>
                ))}
              </ul>
            </div>

            <p><strong>Created At:</strong> {new Date(course.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated At:</strong> {new Date(course.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>

    {/* Feedback Form Section */}
    <div className="col-md-6">
      <div className="card shadow-sm border-light rounded">
        <div className="card-body">
          <h3 className="card-title mb-3">Rate and Provide Feedback</h3>
          <div className="mb-3">
            <label htmlFor="rating" className="form-label">Rating:</label>
            <select id="rating" className="form-select" value={rating} onChange={handleRatingChange}>
              <option value="1">★</option>
              <option value="2">★★</option>
              <option value="3">★★★</option>
              <option value="4">★★★★</option>
              <option value="5">★★★★★</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="feedback" className="form-label">Feedback:</label>
            <textarea id="feedback" className="form-control" value={feedback} onChange={handleFeedbackChange} rows="5"></textarea>
          </div>
          <button className="btn btn-primary w-100" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default Feedback;
