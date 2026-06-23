import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }));
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
      const data = isLoginMode 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(endpoint, data, {
        withCredentials: true
      });

      if (response.status === 200 || response.status === 201) {
        showAlert('Success! Redirecting...', 'success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      const message = error.response?.data?.error || 'An error occurred. Please try again.';
      showAlert(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="logo">
          <h1><i className="fas fa-graduation-cap"></i> NextStep</h1>
          <p>Your journey to success starts here</p>
        </div>

        {alert.show && (
          <div className={`alert alert-${alert.type} show`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label>Account Type</label>
              <div className="role-selection">
                <div 
                  className={`role-option ${formData.role === 'user' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('user')}
                >
                  <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={() => {}} />
                  <i className="fas fa-user"></i>
                  <div>Student</div>
                </div>
                <div 
                  className={`role-option ${formData.role === 'admin' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('admin')}
                >
                  <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={() => {}} />
                  <i className="fas fa-crown"></i>
                  <div>Admin</div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <i className={`fas ${isLoginMode ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                {isLoginMode ? ' Sign In' : ' Create Account'}
              </>
            )}
          </button>
        </form>

        <div className="toggle-form">
          <p>{isLoginMode ? "Don't have an account?" : "Already have an account?"}</p>
          <a onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? "Sign up here" : "Sign in here"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
