import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('student');
  const [giveOTP, setGiveOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [loader, setLoader] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleSignup = async () => {
    try {
      const data = { username, password, email, mobile, role, otp, isClicked };
      await axios.post('https://eduvance-backend.onrender.com/signup', data);
      toast.success('User registered successfully!', { toastId: 'signupSuccess' });
      setTimeout(() => navigate('/login'), 800);
    } catch (error) {
      console.log('Error signing up:', error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage, { toastId: 'signupError' });
      } else {
        toast.error('Failed to register user. Please try again later.', { toastId: 'signupError' });
      }
    }
  };

  const sendEmail = async () => {
    setLoader(true);
    setIsClicked(true);
    await axios
      .post('https://eduvance-backend.onrender.com/send-otp', { email })
      .then((response) => {
        toast.success('OTP Sent Successfully');
        setGiveOTP(true);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
    setLoader(false);
  };

  return (
    <div className="container-fluid p-3 h-100">
      <div className="row h-100">
        <div className="col-md-5 bg-primary d-flex justify-content-center align-items-center">
          <img
            src="https://static.vecteezy.com/system/resources/previews/003/689/228/original/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg"
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: '90%', height:'85%' }}
          />
        </div>
        <div className="col-md-7 d-flex justify-content-center align-items-center">
          <div className="p-4 shadow rounded bg-white" style={{ minWidth: '400px', maxWidth: '500px' }}>
            <h1 className="h3 mb-4 text-center">Create a New Account</h1>

            <div className="mb-2">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="d-flex justify-content-end">
                {loader === false ? (
                  <button className="btn btn-success mt-2" onClick={sendEmail}>
                    Send OTP
                  </button>
                ) : (
                  <button className="btn btn-secondary mt-2" disabled>
                    Sending...
                  </button>
                )}
              </div>
            </div>

            {giveOTP && (
              <div className="mb-2">
                <label htmlFor="otp" className="form-label">OTP</label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-2">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="mobile" className="form-label">Mobile</label>
              <input
                type="text"
                className="form-control"
                id="mobile"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                className="form-select"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-4">
              <button className="w-100 btn btn-primary" onClick={handleSignup}>
                Create Account
              </button>
            </div>

            <div className="text-center">
              <p>
                Already have an account? <Link to="/login" className='text-decoration-none'>Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
