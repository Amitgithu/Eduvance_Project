import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get('https://eduvance-backend.onrender.com/courses');
        setCourses(response.data);
      }  catch (error) {
        if (error.response) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage, { toastId: 'fetchCoursesError' });
        } else {
          toast.error('Failed to fetch courses', { toastId: 'fetchCoursesError' });
        }
      }
    }

    fetchCourses();

    const token = localStorage.getItem('token');
    
    if (token) {
      async function fetchEnrolledCourses() {
        try {
          const response = await axios.get('https://eduvance-backend.onrender.com/my-courses', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEnrolledCourses(response.data.map((course) => course._id));
        } catch (error) {
          if (error.response) {
            const errorMessage = error.response.data.message;
            toast.error(errorMessage, { toastId: 'fetchCoursesError' });
          } else {
            toast.error('Failed to fetch enroll courses. Please try again later.', { toastId: 'fetchCoursesError' });
          }
        }
      }

      fetchEnrolledCourses();
    }
  }, []);

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Load Razorpay
  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => handleRazorpayLoaded();
    document.body.appendChild(script);
  };

  const handleRazorpayLoaded = () => {
    // console.log('Razorpay script loaded successfully');
  };

  const handleZeroPrice = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`https://eduvance-backend.onrender.com/razorpay/payment`, { courseId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setEnrolledCourses([...enrolledCourses, courseId]);
        toast.success('Course enrolled successfully!', { toastId: 'enrollSuccess' });
      } else {
        toast.error('Failed to enroll in the course. Please try again later.', { toastId: 'enrollError' });
      }
    } catch (error) {
      console.error('Error enrolling for free course:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, { toastId: 'enrollError' });
      } else {
        toast.error('Failed to enroll in the course. Please try again later.', { toastId: 'enrollError' });
      }
    }
  };
  

  const handleEnrollCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`https://eduvance-backend.onrender.com/razorpay/payment`, { courseId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { amount, order_id, key_id, course_name, description, contact, name, email } = response.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: 'INR',
        name: course_name,
        description: description,
        image: '/your_logo.png',
        order_id: order_id,
        handler: async function (response) {
          try {
            const paymentId = response.razorpay_payment_id;
            await axios.post(
              `https://eduvance-backend.onrender.com/razorpay/payment/success`,
              { courseId, order_id, paymentId },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setEnrolledCourses([...enrolledCourses, courseId]);
            toast.success('Course enrolled successfully!', { toastId: 'enrollSuccess' });
          } catch (error) {
            console.error('Error handling payment success:', error);
            toast.error('Failed to enroll in the course. Please try again later.', { toastId: 'enrollError' });
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: contact,
        },
        notes: {
          address: 'Your address',
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error enrolling course:', error);
      if (error.response) {
        toast.error(error.response.data.message, { toastId: 'fetchCoursesError' });
      } else {
        toast.error('Failed to enroll in the course. Please try again later.', { toastId: 'fetchCoursesError' });
      }
    }
  };

  const calculateAverageRating = (feedbacks) => {
    if (feedbacks.length === 0) return 0;

    const totalRating = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    return totalRating / feedbacks.length;
  };

  const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://eduvance-backend.onrender.com/search?q=${query}`);
                setSearchResult(response.data);
            } catch (error) {
                console.error('Error searching:', error);
                setSearchResult([]);
            }
        };

        if (query !== '') {
            fetchData();
        } else {
            setSearchResult([]);
        }
    }, [query]);

    useEffect(() => {
        if (query === '') {
            setSearchResult([]);
        }
    }, [query]);

    return (
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-md-6">
            <h2 className="mt-3 ">
              {query === '' ? (
                <h2 className="mt-3 mb-2">All Courses</h2>
              ) : searchResult.length !== 0 ? (
                <h2 className="mt-3 mb-2">Found Courses ..</h2>
              ) : ''
              }
            </h2>
          </div>

          <div className="col-md-6 mt-3">
          <div className="w-100 mb-4 form-outline" style={{ minWidth: '200px', border: '1px solid #808080', borderRadius: '0.25rem' }}>
              <input
                type="search"
                value={query}
                onChange={handleSearch}
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Search Course ..."
              />
            </div>
          </div>
        </div>
        <ToastContainer />

        {query !== '' && searchResult.length === 0 && (
  <div className='d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
    <h3 className='text-danger'>No Course Found !!</h3>
  </div>
)}


<div className="row row-cols-1 row-cols-md-3 g-4">
  {query === '' &&
    courses.map((course) => (
      <div className="col" key={course._id}>
        <div className="card h-100 shadow-lg border-0 rounded-lg overflow-hidden">
          <div className="image-container position-relative" style={{ height: '200px', overflow: 'hidden' }}>
            <img
              src={course.image}
              className="card-img-top"
              alt={course.title}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
          <div className="card-body d-flex flex-column p-4">
            <h5 className="card-title fw-bold" style={{ fontSize: '1.25rem' }}>{course.title}</h5>
            <p className="card-text text-secondary flex-grow-1" style={{ fontSize: '0.9rem' }}>{course.description}</p>
            <div className="d-flex align-items-center justify-content-between mt-auto">
              <div className="rating" style={{ fontSize: '1.2rem' }}>
                {[...Array(Math.round(calculateAverageRating(course.feedbacks)))].map((_, index) => (
                  <span key={index} style={{ color: '#fca503' }}>★</span>
                ))}
              </div>
              <div className="price-box">
                <p className="card-price mb-0">
                  <button className="btn btn-warning fw-bold" style={{ borderRadius: '20px' }}>Rs. {course.price}</button>
                </p>
              </div>
            </div>
            <div className="d-flex mt-3 justify-content-between">
              {enrolledCourses.includes(course._id) ? (
                <button className="btn btn-success me-2 w-100" onClick={() => toast.error("Course Already Enrolled !!")} style={{ borderRadius: '20px' }}>
                  Enrolled
                </button>
              ) : course.price === 0 ? (
                <button className="btn btn-info me-2 w-100" onClick={() => handleZeroPrice(course._id)} style={{ borderRadius: '20px' }}>
                  Enroll for Free
                </button>
              ) : (
                <button className="btn btn-primary me-2 w-100" onClick={() => handleEnrollCourse(course._id)} style={{ borderRadius: '20px' }}>
                  Enroll
                </button>
              )}
              <Link to={`/courses/${course._id}/feedback`} className="ms-2 w-100">
                <button className="btn btn-outline-primary w-100" style={{ borderRadius: '20px' }}>Explore</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    ))}

  {query !== '' &&
    searchResult.map((course) => (
      <div className="col" key={course._id}>
        <div className="card h-100 shadow-lg border-0 rounded-lg overflow-hidden">
          <div className="image-container position-relative" style={{ height: '200px', overflow: 'hidden' }}>
            <img
              src={course.image}
              className="card-img-top"
              alt={course.title}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
          <div className="card-body d-flex flex-column p-4">
            <h5 className="card-title fw-bold" style={{ fontSize: '1.25rem' }}>{course.title}</h5>
            <p className="card-text text-secondary flex-grow-1" style={{ fontSize: '0.9rem' }}>{course.description}</p>
            <div className="d-flex align-items-center justify-content-between mt-auto">
              <div className="rating" style={{ fontSize: '1.2rem' }}>
                {[...Array(Math.round(calculateAverageRating(course.feedbacks)))].map((_, index) => (
                  <span key={index} style={{ color: '#fca503' }}>★</span>
                ))}
              </div>
              <div className="price-box">
                <p className="card-price mb-0">
                  <button className="btn btn-warning fw-bold" style={{ borderRadius: '20px' }}>Rs. {course.price}</button>
                </p>
              </div>
            </div>
            <div className="d-flex mt-3 justify-content-between">
              {enrolledCourses.includes(course._id) ? (
                <button className="btn btn-success me-2 w-100" onClick={() => toast.error("Course Already Enrolled !!")} style={{ borderRadius: '20px' }}>
                  Enrolled
                </button>
              ) : (
                <button className="btn btn-primary me-2 w-100" onClick={() => handleEnrollCourse(course._id)} style={{ borderRadius: '20px' }}>
                  Enroll
                </button>
              )}
              <Link to={`/courses/${course._id}/feedback`} className="ms-2 w-100">
                <button className="btn btn-outline-primary w-100" style={{ borderRadius: '20px' }}>Explore</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    ))}
</div>


    </div>
  );
}

export default AllCourses;
