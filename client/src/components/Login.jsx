import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = { email, password };
      const response = await axios.post('https://eduvance-backend.onrender.com/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Logged in successfully!', { toastId: 'loginSuccess' });
        setTimeout(() => navigate('/'), 800);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage, { toastId: 'loginError' });
      } else {
        toast.error('Invalid email or password. Please try again.', { toastId: 'loginError' });
      }
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="row w-100">
        {/* Left Side */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="p-5 shadow rounded bg-white" style={{ minWidth: '400px', maxWidth: '500px' }}>
            <h1 className="h4 mb-4 text-center text-primary">Welcome Back!</h1>
            <p className="text-muted text-center mb-4">Login to your account to continue</p>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="w-100 btn btn-primary mb-3" onClick={handleLogin}>
              Login
            </button>
            <div className="text-center">
              <p className="mb-1">
                Don't have an account? <Link to="/signup" className="text-primary text-decoration-none">Sign Up</Link>
              </p>
              <p>
                <Link to="/forgotpassword" className="text-primary text-decoration-none">Forgot Password?</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
          <img
            src="https://img.freepik.com/free-vector/cyber-data-security-online-concept-illustration-internet-security-information-privacy-protection_1150-37328.jpg"
            alt="Secure Login Illustration"
            className="img-fluid"
            style={{ maxWidth: '70%' }}
          />
        </div>

        
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
