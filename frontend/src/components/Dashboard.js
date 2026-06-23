import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleOptionClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header fade-in" style={{ position: 'relative' }}>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
          <h1>Welcome to NextStep</h1>
          <p>Choose your preparation path and take the next step towards your career goals</p>
        </div>

        <div className="options-grid">
          <div className="option-card fade-in" onClick={() => handleOptionClick('/placement-prep')}>
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
              <i className="fas fa-arrow-right"></i> Start Placement Prep
            </button>
          </div>

          <div className="option-card fade-in" onClick={() => handleOptionClick('/exam-prep')}>
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
              <i className="fas fa-arrow-right"></i> Start Exam Prep
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
