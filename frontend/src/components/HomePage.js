import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dsa');
  const [activeBranch, setActiveBranch] = useState('CSE');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse user info', e);
    }
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const branches = [
    { code: 'CSE', name: 'Computer Science', icon: 'fa-laptop-code', badge: 'High Demand' },
    { code: 'IT', name: 'Information Tech', icon: 'fa-network-wired', badge: 'Popular' },
    { code: 'CSE-AIML', name: 'AI & Machine Learning', icon: 'fa-brain', badge: 'Trending' },
    { code: 'CSE-DS', name: 'Data Science', icon: 'fa-database', badge: 'Trending' },
    { code: 'CSE-CS', name: 'Cyber Security', icon: 'fa-shield-halved', badge: 'Critical' },
    { code: 'CSE-IOT', name: 'Internet of Things', icon: 'fa-microchip', badge: 'Innovative' },
    { code: 'ECE', name: 'Electronics & Comm', icon: 'fa-bolt', badge: 'Core Tech' },
    { code: 'EEE', name: 'Electrical & Electronics', icon: 'fa-plug-circle-bolt', badge: 'Core Tech' },
    { code: 'MECH', name: 'Mechanical Engg', icon: 'fa-gears', badge: 'Evergreen' },
    { code: 'CIVIL', name: 'Civil Engineering', icon: 'fa-building-columns', badge: 'Infrastructure' }
  ];

  const dsaHighlights = [
    { title: 'Array & Strings', count: '24 Problems', difficulty: 'Easy - Hard', tag: 'Amazon, Google' },
    { title: 'Two Pointers & Sliding Window', count: '14 Problems', difficulty: 'Medium', tag: 'Microsoft, Meta' },
    { title: 'Trees, BST & Traversals', count: '22 Problems', difficulty: 'Medium - Hard', tag: 'Uber, TCS Digital' },
    { title: 'Graph BFS / DFS & Dijkstra', count: '16 Problems', difficulty: 'Medium - Hard', tag: 'Adobe, Infosys SP' },
    { title: 'Dynamic Programming (1D & Multi)', count: '18 Problems', difficulty: 'Hard', tag: 'Directi, Atlassian' },
    { title: 'Stack, Queue & Linked List', count: '15 Problems', difficulty: 'Easy - Med', tag: 'Accenture, Wipro' }
  ];

  const aptitudeHighlights = [
    { title: 'Time & Work, Pipes & Cisterns', questions: '8 Core Types', keyFormula: 'Work = Efficiency × Time' },
    { title: 'Speed, Time, Distance & Trains', questions: '9 Core Types', keyFormula: 'Relative Speed & Lengths' },
    { title: 'Profit, Loss & Simple/Compound Interest', questions: '10 Core Types', keyFormula: 'Effective Percentage Shifts' },
    { title: 'Permutations, Combinations & Probability', questions: '7 Core Types', keyFormula: 'nPr, nCr & Event Odds' },
    { title: 'Ratios, Proportions & Mixtures', questions: '8 Core Types', keyFormula: 'Alligation Cross Rule' },
    { title: 'Clocks, Calendars & Number Series', questions: '6 Core Types', keyFormula: 'Angle Formula & Odd Days' }
  ];

  const samplePrompts = [
    "Explain Kadane's Algorithm for Maximum Subarray with an intuitive step-by-step example.",
    "Derive the short-cut formula for Compound Interest difference over 2 and 3 years.",
    "Give me 5 high-priority Previous Year Exam questions for Operating System Deadlocks.",
    "What is the difference between TCP and UDP with real-world socket programming examples?"
  ];

  const [activePrompt, setActivePrompt] = useState(samplePrompts[0]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="homepage-wrapper">
      {/* =========================================================
          TOP NAVIGATION BAR
          Features Branding, Quick Nav, and Top-Right LOGIN BUTTON
          ========================================================= */}
      <header className="home-navbar">
        <div className="home-nav-container">
          <div className="home-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="home-brand-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="home-brand-text">
              <span className="brand-name">NextStep</span>
              <span className="brand-sub">Exam & Placement Portal</span>
            </div>
          </div>

          <nav className="home-nav-links">
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection('features')}>Features</button>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection('semesters')}>Semester Hub</button>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection('placements')}>Placement Track</button>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection('ai-tutor')}>AI Tutor</button>
            <button type="button" className="nav-link-btn" onClick={() => scrollToSection('how-it-works')}>Workflow</button>
          </nav>

          {/* TOP RIGHT CORNER LOGIN BUTTON */}
          <div className="home-nav-actions">
            {currentUser ? (
              <div className="nav-user-logged">
                <button className="home-top-dashboard-btn" onClick={handleDashboardClick}>
                  <i className="fas fa-th-large"></i> Go to Dashboard
                </button>
                <button className="home-top-login-btn" onClick={handleLoginClick} title="Switch Account / Sign In">
                  <i className="fas fa-sign-in-alt"></i> Login
                </button>
              </div>
            ) : (
              <button className="home-top-login-btn glow-hover" onClick={handleLoginClick} id="top-nav-login-btn">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO SECTION
          ========================================================= */}
      <section className="home-hero-section">
        <div className="hero-aurora-glow"></div>
        <div className="container hero-content">
          <div className="hero-pill-badge fade-in">
            <span className="pulsing-dot"></span>
            <span>All-In-One Engineering Examination & Campus Placement Portal</span>
          </div>

          <h1 className="hero-headline fade-in">
            Master Your <span className="gradient-text-exam">Semester Exams</span>.<br />
            Crack Your Dream <span className="gradient-text-placement">Placements</span>.
          </h1>

          <p className="hero-description fade-in">
            NextStep bridges university academic excellence and high-paying tech career readiness.
            Access branch & semester-wise verified <strong>Lecture Notes, PYQs, and Books</strong> alongside 
            structured tracks for <strong>LeetCode Top 150 DSA</strong>, <strong>IndiaBIX Aptitude</strong>, 
            and a 24/7 <strong>Google Gemini AI Study Tutor</strong>.
          </p>

          <div className="hero-cta-group fade-in">
            <button className="hero-btn-primary" onClick={handleLoginClick}>
              <span>Start Preparing Now</span>
              <i className="fas fa-arrow-right"></i>
            </button>
            <button className="hero-btn-secondary" onClick={() => scrollToSection('features')}>
              <i className="fas fa-compass"></i>
              <span>Explore Platform</span>
            </button>
          </div>

          {/* Interactive Metric Cards */}
          <div className="hero-metrics-grid fade-in">
            <div className="metric-card">
              <div className="metric-icon-box branch-box">
                <i className="fas fa-code-branch"></i>
              </div>
              <div className="metric-data">
                <div className="metric-number">10 Branches</div>
                <div className="metric-label">CSE, IT, ECE, EEE, AI/ML, Mech & more</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box dsa-box">
                <i className="fas fa-laptop-code"></i>
              </div>
              <div className="metric-data">
                <div className="metric-number">LeetCode 150</div>
                <div className="metric-label">Handpicked DSA Interview Questions</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box apt-box">
                <i className="fas fa-chart-pie"></i>
              </div>
              <div className="metric-data">
                <div className="metric-number">77+ Aptitude</div>
                <div className="metric-label">IndiaBIX Quantitative Topics with formulas</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box ai-box">
                <i className="fas fa-wand-magic-sparkles"></i>
              </div>
              <div className="metric-data">
                <div className="metric-number">Gemini AI</div>
                <div className="metric-label">Instant Doubt Solving & Concept Coaching</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          KEY PILLARS SECTION (Features Breakdown)
          ========================================================= */}
      <section className="home-section" id="features">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Everything You Need In One Place</span>
            <h2 className="section-title">Designed Specially for Engineering Undergrads</h2>
            <p className="section-subtitle">
              Say goodbye to scattered WhatsApp PDFs, outdated Google Drives, and messy bookmark lists.
              NextStep organizes your entire undergraduate learning journey.
            </p>
          </div>

          <div className="features-showcase-grid">
            {/* Feature 1 */}
            <div className="showcase-card exam-feature-card">
              <div className="card-badge-top exam-pill">
                <i className="fas fa-book-open"></i> Semester Track
              </div>
              <div className="card-icon-round exam-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Branch & Semester Wise Prep</h3>
              <p>
                Targeted university syllabus coverage from Semester 1 through Semester 8.
                No more studying the wrong subject or outdated topics.
              </p>
              <ul className="feature-bullets">
                <li><i className="fas fa-check-circle"></i> Complete Branch-Subject mapping</li>
                <li><i className="fas fa-check-circle"></i> High-yield unit lecture notes</li>
                <li><i className="fas fa-check-circle"></i> Previous Year Question Papers (PYQs)</li>
                <li><i className="fas fa-check-circle"></i> Curated video playlists & reference textbooks</li>
              </ul>
              <div className="card-action-link" onClick={() => scrollToSection('semesters')}>
                Explore Semester Hub <i className="fas fa-chevron-right"></i>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="showcase-card placement-feature-card">
              <div className="card-badge-top placement-pill">
                <i className="fas fa-rocket"></i> Career Accelerator
              </div>
              <div className="card-icon-round placement-icon">
                <i className="fas fa-terminal"></i>
              </div>
              <h3>Curated Placement Roadmaps</h3>
              <p>
                Crack top product companies and tier-1 IT recruitment drives. 
                Complete topic-wise DSA sheets and quantitative aptitude modules.
              </p>
              <ul className="feature-bullets">
                <li><i className="fas fa-check-circle"></i> LeetCode Top 150 categorized into 23 subtopics</li>
                <li><i className="fas fa-check-circle"></i> IndiaBIX Quantitative Aptitude across 20 modules</li>
                <li><i className="fas fa-check-circle"></i> Company recruitment tags (Amazon, TCS, Google, etc.)</li>
                <li><i className="fas fa-check-circle"></i> Persistent checkbox completion & live progress tracking</li>
              </ul>
              <div className="card-action-link" onClick={() => scrollToSection('placements')}>
                Explore Placement Track <i className="fas fa-chevron-right"></i>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="showcase-card ai-feature-card">
              <div className="card-badge-top ai-pill">
                <i className="fas fa-sparkles"></i> 24/7 AI Companion
              </div>
              <div className="card-icon-round ai-icon">
                <i className="fas fa-robot"></i>
              </div>
              <h3>Google Gemini AI Study Tutor</h3>
              <p>
                Stuck at 2 AM before an exam or interview? Our embedded Gemini AI tutor
                explains proofs, dry-runs algorithms, and breaks down numericals.
              </p>
              <ul className="feature-bullets">
                <li><i className="fas fa-check-circle"></i> Real-time step-by-step problem breakdown</li>
                <li><i className="fas fa-check-circle"></i> Code debugging & time-complexity explanation</li>
                <li><i className="fas fa-check-circle"></i> Quantitative aptitude shortcut derivations</li>
                <li><i className="fas fa-check-circle"></i> Available anytime via floating chat widget</li>
              </ul>
              <div className="card-action-link" onClick={() => scrollToSection('ai-tutor')}>
                See AI Tutor in Action <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEMESTER PREPARATION INTERACTIVE SHOWCASE
          ========================================================= */}
      <section className="home-section alt-bg" id="semesters">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Semester Exam Mastery</span>
            <h2 className="section-title">Support Across 10 Engineering Disciplines</h2>
            <p className="section-subtitle">
              Select your department and access verified learning materials organized semester-by-semester.
            </p>
          </div>

          {/* Branch Pill Selector */}
          <div className="branch-pills-container">
            {branches.map(b => (
              <button
                key={b.code}
                className={`branch-pill ${activeBranch === b.code ? 'active' : ''}`}
                onClick={() => setActiveBranch(b.code)}
              >
                <i className={`fas ${b.icon}`}></i>
                <span className="pill-code">{b.code}</span>
              </button>
            ))}
          </div>

          {/* Active Branch Display Box */}
          <div className="branch-preview-box">
            <div className="branch-preview-header">
              <div>
                <span className="branch-badge-highlight">Selected Engineering Branch</span>
                <h3>
                  {branches.find(b => b.code === activeBranch)?.name} ({activeBranch})
                </h3>
              </div>
              <div className="sem-indicator-pills">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <span key={sem} className={`sem-chip ${sem <= 4 ? 'sem-completed' : ''}`}>
                    Sem {sem}
                  </span>
                ))}
              </div>
            </div>

            <div className="resource-quad-grid">
              <div className="quad-card">
                <div className="quad-icon notes-color">
                  <i className="fas fa-file-lines"></i>
                </div>
                <h4>Lecture Notes</h4>
                <p>Clean, unit-wise summaries with solved diagrams and formulas for fast exam revision.</p>
                <span className="quad-count">All Units Covered</span>
              </div>

              <div className="quad-card">
                <div className="quad-icon pyq-color">
                  <i className="fas fa-file-circle-question"></i>
                </div>
                <h4>Previous Year Papers (PYQs)</h4>
                <p>Authentic university examination question sets to identify recurring question patterns.</p>
                <span className="quad-count">Past 5 Years</span>
              </div>

              <div className="quad-card">
                <div className="quad-icon video-color">
                  <i className="fas fa-play"></i>
                </div>
                <h4>Curated Video Lectures</h4>
                <p>High-rated professor and educator YouTube lectures mapped directly to your curriculum.</p>
                <span className="quad-count">Topic-by-Topic</span>
              </div>

              <div className="quad-card">
                <div className="quad-icon book-color">
                  <i className="fas fa-book"></i>
                </div>
                <h4>Standard Reference Books</h4>
                <p>Recommended academic author textbooks stored securely on Cloudflare R2 / S3 storage.</p>
                <span className="quad-count">Instant Access</span>
              </div>
            </div>

            <div className="branch-preview-footer">
              <p>Ready to view full subjects and downloads for <strong>{activeBranch}</strong>?</p>
              <button className="action-btn-primary" onClick={handleLoginClick}>
                Access {activeBranch} Study Materials <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PLACEMENT PREPARATION TRACK SECTION
          ========================================================= */}
      <section className="home-section" id="placements">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Crack On-Campus & Off-Campus Drives</span>
            <h2 className="section-title">Structured Coding & Aptitude Training</h2>
            <p className="section-subtitle">
              Top tech companies recruit using two main elimination rounds: Quantitative Aptitude tests and Data Structures & Algorithms interviews. NextStep prepares you for both.
            </p>
          </div>

          {/* Placement Tabs */}
          <div className="placement-tab-nav">
            <button 
              className={`placement-tab-btn ${activeTab === 'dsa' ? 'active' : ''}`}
              onClick={() => setActiveTab('dsa')}
            >
              <i className="fas fa-code"></i> LeetCode Top 150 DSA
            </button>
            <button 
              className={`placement-tab-btn ${activeTab === 'aptitude' ? 'active' : ''}`}
              onClick={() => setActiveTab('aptitude')}
            >
              <i className="fas fa-calculator"></i> IndiaBIX Quantitative Aptitude
            </button>
          </div>

          {/* DSA Tab Content */}
          {activeTab === 'dsa' && (
            <div className="tab-pane-content fade-in">
              <div className="tab-info-banner">
                <div className="tab-info-text">
                  <h3>Master 150 Foundational Problems across 23 DSA Categories</h3>
                  <p>Includes Array, Two Pointers, Sliding Window, Trees, Graphs, DP, Intervals, Binary Search, and Backtracking.</p>
                </div>
                <div className="company-logo-strip">
                  <span className="company-pill"><i className="fab fa-google"></i> Google</span>
                  <span className="company-pill"><i className="fab fa-amazon"></i> Amazon</span>
                  <span className="company-pill"><i className="fab fa-microsoft"></i> Microsoft</span>
                  <span className="company-pill">TCS Digital</span>
                  <span className="company-pill">Infosys SP</span>
                </div>
              </div>

              <div className="dsa-grid">
                {dsaHighlights.map((item, idx) => (
                  <div key={idx} className="dsa-topic-card">
                    <div className="dsa-card-top">
                      <span className="topic-order">0{idx + 1}</span>
                      <span className="topic-diff-badge">{item.difficulty}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <div className="dsa-card-bottom">
                      <span className="dsa-count"><i className="fas fa-list-check"></i> {item.count}</span>
                      <span className="dsa-recruiter"><i className="fas fa-briefcase"></i> {item.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aptitude Tab Content */}
          {activeTab === 'aptitude' && (
            <div className="tab-pane-content fade-in">
              <div className="tab-info-banner aptitude-banner">
                <div className="tab-info-text">
                  <h3>77 Comprehensive Aptitude Questions Across 20 Real Placement Sections</h3>
                  <p>Practice time-saving shortcut strategies, formula derivations, and standard problem types tested in TCS, Cognizant, Wipro, and Accenture.</p>
                </div>
                <div className="company-logo-strip">
                  <span className="company-pill">TCS NQT</span>
                  <span className="company-pill">Accenture</span>
                  <span className="company-pill">Cognizant GenC</span>
                  <span className="company-pill">Wipro Elite</span>
                  <span className="company-pill">Deloitte</span>
                </div>
              </div>

              <div className="aptitude-grid">
                {aptitudeHighlights.map((item, idx) => (
                  <div key={idx} className="aptitude-card">
                    <div className="apt-top">
                      <span className="apt-badge"><i className="fas fa-lightbulb"></i> Section {idx + 1}</span>
                      <span className="apt-types">{item.questions}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <div className="apt-formula-box">
                      <span className="formula-label">Key Formula Concept:</span>
                      <code>{item.keyFormula}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="placement-cta-banner">
            <div className="cta-banner-text">
              <h4>Ready to track your progress with persistent checkmarks?</h4>
              <p>Keep track of your solved questions, live percentages, and direct LeetCode links.</p>
            </div>
            <button className="hero-btn-primary" onClick={handleLoginClick}>
              Explore Placement Tracker <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          GEMINI AI STUDY TUTOR SECTION
          ========================================================= */}
      <section className="home-section alt-bg" id="ai-tutor">
        <div className="container">
          <div className="ai-showcase-container">
            <div className="ai-showcase-left">
              <div className="ai-tag">
                <i className="fas fa-wand-magic-sparkles"></i> Powered by Google Gemini
              </div>
              <h2>Your Personal 24/7 Engineering AI Mentor</h2>
              <p>
                Never get stuck waiting for office hours. NextStep integrates Google's cutting-edge Gemini model to give you deep, contextual explanations for engineering theories, mathematics, and programming algorithms.
              </p>

              <div className="ai-capabilities-list">
                <div className="ai-cap-item">
                  <div className="ai-cap-icon"><i className="fas fa-bolt"></i></div>
                  <div>
                    <h5>Instant Concept Explanations</h5>
                    <p>Get clear analogies for OS, DBMS, Computer Networks, and Theory of Computation.</p>
                  </div>
                </div>

                <div className="ai-cap-item">
                  <div className="ai-cap-icon"><i className="fas fa-bug"></i></div>
                  <div>
                    <h5>Code Debugging & Optimization</h5>
                    <p>Paste any C++, Java, or Python solution to analyze space & time complexity tradeoffs.</p>
                  </div>
                </div>

                <div className="ai-cap-item">
                  <div className="ai-cap-icon"><i className="fas fa-calculator"></i></div>
                  <div>
                    <h5>Quantitative Aptitude Shortcut Derivations</h5>
                    <p>Understand the intuition behind formulas rather than memorizing blind tricks.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ai-showcase-right">
              <div className="ai-mock-chat-box">
                <div className="mock-chat-header">
                  <div className="mock-chat-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="mock-chat-title">
                    <strong>NextStep AI Study Tutor</strong>
                    <span><i className="fas fa-circle online-dot"></i> Ready to help</span>
                  </div>
                </div>

                <div className="mock-chat-messages">
                  <div className="chat-bubble user-bubble">
                    <p>{activePrompt}</p>
                  </div>
                  <div className="chat-bubble bot-bubble">
                    <div className="bot-typing-header">
                      <i className="fas fa-sparkles"></i> Gemini 2.5 Flash Response:
                    </div>
                    <p>
                      <strong>Intuitive Breakdown:</strong> To find the maximum subarray sum in O(n) time, Kadane's Algorithm maintains a running sum. At each index, you decide whether to extend the existing contiguous subarray or start fresh from the current element:
                    </p>
                    <pre><code>current_sum = max(nums[i], current_sum + nums[i]);
max_sum = max(max_sum, current_sum);</code></pre>
                    <p className="bot-note">Space Complexity: O(1) auxiliary | Time: O(n) linear scan.</p>
                  </div>
                </div>

                <div className="mock-prompt-suggestions">
                  <span className="prompt-label">Try asking:</span>
                  <div className="prompt-chip-list">
                    {samplePrompts.map((prompt, i) => (
                      <button 
                        key={i} 
                        className={`prompt-chip ${activePrompt === prompt ? 'active' : ''}`}
                        onClick={() => setActivePrompt(prompt)}
                      >
                        Prompt #{i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mock-chat-footer">
                  <button className="launch-ai-btn" onClick={handleLoginClick}>
                    <span>Open AI Study Assistant</span>
                    <i className="fas fa-comment-dots"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WORKFLOW / HOW IT WORKS SECTION
          ========================================================= */}
      <section className="home-section" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Your Step-By-Step Journey</span>
            <h2 className="section-title">How NextStep Propels You to Success</h2>
            <p className="section-subtitle">
              A proven 5-step roadmap engineered to elevate your GPA and secure top recruitment offers.
            </p>
          </div>

          <div className="workflow-steps-grid">
            <div className="workflow-step-card">
              <div className="step-number-bubble">01</div>
              <h4>Choose Branch & Sem</h4>
              <p>Filter your exact engineering stream to instantly populate relevant curriculum subjects.</p>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-bubble">02</div>
              <h4>Study Notes & PYQs</h4>
              <p>Master semester concepts quickly with unit lecture summaries and previous year exams.</p>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-bubble">03</div>
              <h4>Solve LeetCode 150</h4>
              <p>Work through 23 curated DSA categories with direct LeetCode problem links.</p>
            </div>

            <div className="workflow-step-card">
              <div className="step-number-bubble">04</div>
              <h4>Practice Aptitude</h4>
              <p>Tackle 77 high-yield IndiaBIX quantitative aptitude questions with standard formulas.</p>
            </div>

            <div className="workflow-step-card highlight-step">
              <div className="step-number-bubble finish-bubble"><i className="fas fa-trophy"></i></div>
              <h4>Ace Placements!</h4>
              <p>Walk into technical and aptitude interviews with 100% confidence and verified preparation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STUDENT & ADMIN ROLE HIGHLIGHTS
          ========================================================= */}
      <section className="home-section alt-bg">
        <div className="container">
          <div className="roles-split-grid">
            <div className="role-box student-role">
              <div className="role-badge"><i className="fas fa-user-graduate"></i> For Students</div>
              <h3>Empowering Every Undergrad</h3>
              <p>
                Get instant access to everything needed for 8 semesters of engineering plus placement drives without any paywalls or cluttered ads.
              </p>
              <ul className="role-perks">
                <li><i className="fas fa-check"></i> Free access to all notes, papers, and books</li>
                <li><i className="fas fa-check"></i> Individual progress tracking for LeetCode & Aptitude</li>
                <li><i className="fas fa-check"></i> Direct integration with Google Gemini AI chatbot</li>
                <li><i className="fas fa-check"></i> Clean, responsive, dark aurora user interface</li>
              </ul>
            </div>

            <div className="role-box admin-role">
              <div className="role-badge admin-badge"><i className="fas fa-shield-halved"></i> For Faculty & Admins</div>
              <h3>Centralized Academic Management</h3>
              <p>
                Faculty, placement coordinators, and campus administrators can curate content, upload question papers, and add new interview problems.
              </p>
              <ul className="role-perks">
                <li><i className="fas fa-check"></i> Direct file uploads to Cloudflare R2 / AWS S3</li>
                <li><i className="fas fa-check"></i> Add and update DSA & Aptitude practice questions</li>
                <li><i className="fas fa-check"></i> Maintain branch, semester, and subject structures</li>
                <li><i className="fas fa-check"></i> Protected role-based JWT administrative routes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          COMPANIES / RECRUITERS SHOWCASE
          ========================================================= */}
      <section className="home-companies-strip">
        <div className="container text-center">
          <p className="recruiters-title">PREPARE FOR CAMPUS RECRUITERS & INDUSTRY LEADERS</p>
          <div className="company-badges-wrap">
            <span className="recruiter-badge"><i className="fab fa-google"></i> Google</span>
            <span className="recruiter-badge"><i className="fab fa-amazon"></i> Amazon</span>
            <span className="recruiter-badge"><i className="fab fa-microsoft"></i> Microsoft</span>
            <span className="recruiter-badge">TATA Consultancy Services</span>
            <span className="recruiter-badge">Infosys</span>
            <span className="recruiter-badge">Wipro</span>
            <span className="recruiter-badge">Accenture</span>
            <span className="recruiter-badge">Cognizant</span>
            <span className="recruiter-badge">Deloitte</span>
            <span className="recruiter-badge">Capgemini</span>
          </div>
        </div>
      </section>

      {/* =========================================================
          END OF HOME PAGE CTA SECTION
          Includes the prominent LOGIN BUTTON at the end of the home page
          ========================================================= */}
      <section className="home-bottom-cta-section" id="login-bottom">
        <div className="container">
          <div className="bottom-cta-card">
            <div className="cta-glow-circle"></div>
            <div className="cta-badge">
              <i className="fas fa-fire"></i> Ready to Take The Next Step?
            </div>
            
            <h2 className="bottom-cta-title">
              Your Journey to Academic and Placement Success Begins Here
            </h2>

            <p className="bottom-cta-description">
              Join fellow engineering students who are mastering their semester syllabus and preparing for competitive campus recruitment with NextStep. Sign in now to access your curated dashboard!
            </p>

            {/* PROMINENT LOGIN BUTTON AT THE END OF HOME PAGE */}
            <div className="bottom-cta-button-group">
              <button 
                className="home-end-login-btn glow-hover" 
                onClick={handleLoginClick}
                id="end-of-page-login-btn"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Login to NextStep</span>
                <i className="fas fa-arrow-right arrow-icon"></i>
              </button>

              <button 
                className="home-end-register-btn"
                onClick={handleLoginClick}
              >
                <i className="fas fa-user-plus"></i>
                <span>Create New Account</span>
              </button>
            </div>

            <div className="bottom-cta-subtext">
              <span><i className="fas fa-shield-alt"></i> Safe & Secure Authentication</span>
              <span>•</span>
              <span><i className="fas fa-bolt"></i> Instant Access to 10 Branches</span>
              <span>•</span>
              <span><i className="fas fa-infinity"></i> 100% Free for Students</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOMEPAGE FOOTER
          ========================================================= */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <div className="footer-brand">
                <i className="fas fa-graduation-cap"></i>
                <span>NextStep</span>
              </div>
              <p>
                The comprehensive platform for engineering exam preparation and campus placement training. Built for students, powered by intelligence.
              </p>
              <div className="footer-social-links">
                <a href="https://github.com/harshaatinarapu/NextStep-Updated" target="_blank" rel="noopener noreferrer" title="GitHub Repository">
                  <i className="fab fa-github"></i>
                </a>
                <span className="social-pill"><i className="fas fa-heart"></i> Open Source</span>
              </div>
            </div>

            <div className="footer-col">
              <h5>Semester Hub</h5>
              <ul>
                <li><button type="button" className="footer-link-btn" onClick={() => { setActiveBranch('CSE'); scrollToSection('semesters'); }}>Computer Science (CSE)</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => { setActiveBranch('IT'); scrollToSection('semesters'); }}>Information Tech (IT)</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => { setActiveBranch('CSE-AIML'); scrollToSection('semesters'); }}>AI & Machine Learning</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => { setActiveBranch('ECE'); scrollToSection('semesters'); }}>Electronics (ECE)</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => { setActiveBranch('MECH'); scrollToSection('semesters'); }}>Mechanical (MECH)</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Placement Track</h5>
              <ul>
                <li><button type="button" className="footer-link-btn" onClick={() => { setActiveTab('dsa'); scrollToSection('placements'); }}>LeetCode Top 150 DSA</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => { setActiveTab('aptitude'); scrollToSection('placements'); }}>IndiaBIX Quantitative Aptitude</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => scrollToSection('placements')}>Company Recruiter Tags</button></li>
                <li><button type="button" className="footer-link-btn" onClick={() => scrollToSection('placements')}>Progress Percentage Tracker</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Quick Actions</h5>
              <ul>
                <li>
                  <button type="button" className="footer-link-btn highlight-link" onClick={handleLoginClick}>
                    <i className="fas fa-sign-in-alt"></i> Login / Register
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={handleDashboardClick}>
                    <i className="fas fa-gauge"></i> Student Dashboard
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link-btn" onClick={() => scrollToSection('ai-tutor')}>
                    <i className="fas fa-robot"></i> Gemini AI Assistant
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>© {new Date().getFullYear()} NextStep. Built with passion for engineering students.</p>
            <div className="footer-legal-tags">
              <span>Semester Exams</span>
              <span>•</span>
              <span>Campus Placements</span>
              <span>•</span>
              <span>Gemini AI Tutor</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
