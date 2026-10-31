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
            className="option-card option-card-placement fade-in" 
            onClick={() => handleOptionClick(isAdmin ? '/admin/placement-prep' : '/placement-prep')}
          >
            <div className="card-top-pill placement-pill">
              <i className="fas fa-rocket"></i> Career Booster
            </div>
            <div className="option-icon icon-placement">
              <i className="fas fa-laptop-code"></i>
            </div>
            <h2>Placement Preparation</h2>
            <p>Get interview-ready with 150 LeetCode DSA problems & 20 IndiaBIX Quantitative Aptitude sections.</p>
            
            <ul className="option-features">
              <li><span className="feature-bullet bullet-cyan"><i className="fas fa-code"></i></span> Technical interview DSA coding</li>
              <li><span className="feature-bullet bullet-pink"><i className="fas fa-brain"></i></span> IndiaBIX Quantitative Aptitude</li>
              <li><span className="feature-bullet bullet-amber"><i className="fas fa-building"></i></span> Company tags (TCS, Amazon, Infosys)</li>
              <li><span className="feature-bullet bullet-emerald"><i className="fas fa-check-circle"></i></span> Live progress tracking per topic</li>
              <li><span className="feature-bullet bullet-purple"><i className="fas fa-comments"></i></span> HR & behavioral interview tips</li>
              <li><span className="feature-bullet bullet-gold"><i className="fas fa-trophy"></i></span> LeetCode & IndiaBIX direct practice</li>
            </ul>

            <button className="option-btn option-btn-placement">
              {isAdmin ? (
                <>
                  <i className="fas fa-edit"></i> Edit Placement Prep
                </>
              ) : (
                <>
                  <i className="fas fa-bolt"></i> Start Placement Prep
                </>
              )}
            </button>
          </div>

          {/* Exam Preparation Card */}
          <div 
            className="option-card option-card-exam fade-in" 
            onClick={() => handleOptionClick(isAdmin ? '/admin/exam-prep' : '/exam-prep')}
          >
            <div className="card-top-pill exam-pill">
              <i className="fas fa-star"></i> Semester Ace
            </div>
            <div className="option-icon icon-exam">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h2>Exam Preparation</h2>
            <p>Score high in your academic exams with branch & semester-wise notes, previous papers, and videos.</p>
            
            <ul className="option-features">
              <li><span className="feature-bullet bullet-purple"><i className="fas fa-book-open"></i></span> 10 Engineering branches covered</li>
              <li><span className="feature-bullet bullet-coral"><i className="fas fa-file-invoice"></i></span> Previous Year Question Papers (PYQs)</li>
              <li><span className="feature-bullet bullet-rose"><i className="fas fa-play-circle"></i></span> Curated video lecture playlists</li>
              <li><span className="feature-bullet bullet-amber"><i className="fas fa-feather-alt"></i></span> Unit-wise lecture summaries & notes</li>
              <li><span className="feature-bullet bullet-emerald"><i className="fas fa-bookmark"></i></span> Standard reference textbooks</li>
              <li><span className="feature-bullet bullet-cyan"><i className="fas fa-bullseye"></i></span> Exam scoring tips & formulas</li>
            </ul>

            <button className="option-btn option-btn-exam">
              {isAdmin ? (
                <>
                  <i className="fas fa-edit"></i> Edit Exam Preparation
                </>
              ) : (
                <>
                  <i className="fas fa-fire"></i> Start Exam Prep
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
