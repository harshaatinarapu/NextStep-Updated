import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse user info:", e);
      }
    }

    // Refresh user info from /api/auth/me to ensure role accuracy
    axios.get('/api/auth/me')
      .then(res => {
        if (res.data) {
          setUser(prev => ({ ...prev, ...res.data }));
          try {
            const currentStored = stored ? JSON.parse(stored) : {};
            localStorage.setItem('user', JSON.stringify({ ...currentStored, ...res.data }));
          } catch (err) {}
        }
      })
      .catch(err => {
        console.warn("Could not refresh user role from /api/auth/me:", err?.response?.data || err.message);
      });
  }, []);

  const isAdmin = user?.role === 'admin';

  const handleOptionClick = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      console.warn("Logout request error:", e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header fade-in" style={{ position: 'relative' }}>
          <div className="header-top-actions" style={{ position: 'absolute', right: 0, top: 0, display: 'flex', gap: '10px' }}>
            {isAdmin && (
              <button 
                className="logout-btn" 
                style={{ background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
                onClick={() => navigate('/placement-prep')}
                title="Preview student placement page"
              >
                <i className="fas fa-eye"></i> Student View
              </button>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>

          <h1>Welcome to NextStep{user?.name ? `, ${user.name}` : ''}</h1>
          {isAdmin && (
            <div className="admin-status-pill">
              <i className="fas fa-shield-alt"></i> Admin Mode
            </div>
          )}
          <p>
            {isAdmin 
              ? 'Administrator control center: Select a preparation track to edit and add new study questions or resources' 
              : 'Choose your preparation path and take the next step towards your career goals'}
          </p>
        </div>

        <div className="options-grid">
          {/* Placement Preparation Card */}
          <div 
            className="option-card fade-in" 
            onClick={() => handleOptionClick(isAdmin ? '/admin/placement-prep' : '/placement-prep')}
          >
            <div className="option-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <h2>Placement Preparation</h2>
            <p>Get ready for your dream job with comprehensive placement preparation materials and practice tests.</p>
            
            <ul className="option-features">
              <li>Technical interview preparation</li>
              <li>HR interview questions</li>
              <li>Coding challenges and solutions</li>
              <li>Aptitude test practice</li>
              <li>Company-specific preparation</li>
              <li>Mock interviews</li>
            </ul>

            <button className="option-btn">
              {isAdmin ? (
                <>
                  <i className="fas fa-edit"></i> Edit Placement Prep
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-right"></i> Start Placement Prep
                </>
              )}
            </button>
          </div>

          {/* Exam Preparation Card */}
          <div 
            className="option-card fade-in" 
            onClick={() => handleOptionClick(isAdmin ? '/admin/exam-prep' : '/exam-prep')}
          >
            <div className="option-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h2>Exam Preparation</h2>
            <p>Excel in your academic exams with comprehensive study materials, notes, and practice papers.</p>
            
            <ul className="option-features">
              <li>Subject-wise study materials</li>
              <li>Previous year question papers</li>
              <li>Video lectures and tutorials</li>
              <li>Interactive quizzes</li>
              <li>Study notes and summaries</li>
              <li>Exam strategies and tips</li>
            </ul>

            <button className="option-btn">
              {isAdmin ? (
                <>
                  <i className="fas fa-edit"></i> Edit Exam Preparation
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-right"></i> Start Exam Prep
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
