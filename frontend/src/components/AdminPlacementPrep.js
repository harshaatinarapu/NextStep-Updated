import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPlacementPrep = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dsa'); // 'dsa' or 'aptitude'
  const [dsaTopics, setDsaTopics] = useState([]);
  const [aptitudeTopics, setAptitudeTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionUrl, setQuestionUrl] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [companyTags, setCompanyTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [topicQuestions, setTopicQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    fetchAllTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllTopics = async () => {
    setLoading(true);
    try {
      const [dsaRes, aptRes] = await Promise.all([
        axios.get('/api/placementprep/topics/dsa'),
        axios.get('/api/placementprep/topics/aptitude')
      ]);
      setDsaTopics(dsaRes.data || []);
      setAptitudeTopics(aptRes.data || []);

      // Pre-select first topic if available
      if (dsaRes.data && dsaRes.data.length > 0) {
        setSelectedTopicId(dsaRes.data[0]._id);
        fetchQuestionsForTopic(dsaRes.data[0]._id);
      }
    } catch (err) {
      console.error('Error loading topics:', err);
      showAlert('Failed to load topics. Please check server connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAlert({ show: false, message: '', type: 'success' });
    const currentList = tab === 'dsa' ? dsaTopics : aptitudeTopics;
    if (currentList && currentList.length > 0) {
      setSelectedTopicId(currentList[0]._id);
      fetchQuestionsForTopic(currentList[0]._id);
    } else {
      setSelectedTopicId('');
      setTopicQuestions([]);
    }
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    setSelectedTopicId(topicId);
    if (topicId) {
      fetchQuestionsForTopic(topicId);
    } else {
      setTopicQuestions([]);
    }
  };

  const fetchQuestionsForTopic = async (topicId) => {
    if (!topicId) return;
    setLoadingQuestions(true);
    try {
      const res = await axios.get(`/api/placementprep/questions/${topicId}`);
      setTopicQuestions(res.data || []);
    } catch (err) {
      console.error('Error fetching questions for topic:', err);
      setTopicQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTopicId) {
      showAlert('Please select a topic from the dropdown.', 'error');
      return;
    }
    if (!questionTitle.trim()) {
      showAlert('Please enter a question title.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        topicId: selectedTopicId,
        question: questionTitle.trim(),
        link: questionUrl.trim(),
        difficulty,
        companyTags
      };

      const res = await axios.post('/api/placementprep/questions', payload);
      const addedTopicName = res.data?.topicName || 'selected topic';

      showAlert(`🎉 Success! Question added to "${addedTopicName}". It is now live for all students!`, 'success');

      // Clear question title and URL inputs
      setQuestionTitle('');
      setQuestionUrl('');
      setCompanyTags('');
      setDifficulty('Medium');

      // Refresh question list for this topic
      fetchQuestionsForTopic(selectedTopicId);

      // Refresh topics list to update counts
      if (activeTab === 'dsa') {
        const dsaRes = await axios.get('/api/placementprep/topics/dsa');
        setDsaTopics(dsaRes.data || []);
      } else {
        const aptRes = await axios.get('/api/placementprep/topics/aptitude');
        setAptitudeTopics(aptRes.data || []);
      }
    } catch (err) {
      console.error('Error adding question:', err);
      const msg = err.response?.data?.error || 'Failed to add question. Please try again.';
      showAlert(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    try {
      await axios.delete(`/api/placementprep/questions/${questionId}`);
      showAlert('Question deleted successfully.', 'success');
      setTopicQuestions(prev => prev.filter(q => q._id !== questionId));
      
      // Refresh count
      if (activeTab === 'dsa') {
        const dsaRes = await axios.get('/api/placementprep/topics/dsa');
        setDsaTopics(dsaRes.data || []);
      } else {
        const aptRes = await axios.get('/api/placementprep/topics/aptitude');
        setAptitudeTopics(aptRes.data || []);
      }
    } catch (err) {
      console.error('Error deleting question:', err);
      showAlert('Failed to delete question.', 'error');
    }
  };

  const currentTopicList = activeTab === 'dsa' ? dsaTopics : aptitudeTopics;
  const currentTopicObj = currentTopicList.find(t => t._id === selectedTopicId);

  return (
    <div className="admin-container">
      <div className="container">
        {/* Navigation & Header */}
        <div className="admin-header">
          <div className="admin-header-actions">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <button className="preview-student-btn" onClick={() => navigate('/placement-prep')}>
              <i className="fas fa-eye"></i> Student View
            </button>
          </div>
          <div className="admin-title-badge">
            <span className="admin-tag"><i className="fas fa-shield-alt"></i> Admin Panel</span>
          </div>
          <h1>Edit Placement Preparation</h1>
          <p>Add new questions directly to DSA or Aptitude sections. All changes update instantly on student portals.</p>
        </div>

        {/* Section Choice Buttons / Tabs */}
        <div className="admin-choice-tabs">
          <button 
            type="button"
            className={`admin-tab-btn ${activeTab === 'dsa' ? 'active' : ''}`}
            onClick={() => handleTabChange('dsa')}
          >
            <div className="tab-icon"><i className="fas fa-laptop-code"></i></div>
            <div className="tab-text">
              <h3>Add DSA Questions</h3>
              <span>LeetCode Top Interview 150 & Technical Interview coding problems</span>
            </div>
            {activeTab === 'dsa' && <span className="tab-indicator"><i className="fas fa-check-circle"></i></span>}
          </button>

          <button 
            type="button"
            className={`admin-tab-btn ${activeTab === 'aptitude' ? 'active' : ''}`}
            onClick={() => handleTabChange('aptitude')}
          >
            <div className="tab-icon"><i className="fas fa-brain"></i></div>
            <div className="tab-text">
              <h3>Add Aptitude Questions</h3>
              <span>IndiaBIX Quantitative Aptitude & Screening Test sections</span>
            </div>
            {activeTab === 'aptitude' && <span className="tab-indicator"><i className="fas fa-check-circle"></i></span>}
          </button>
        </div>

        {/* Alert Notification */}
        {alert.show && (
          <div className={`alert alert-${alert.type} show`} style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
            <span>{alert.message}</span>
          </div>
        )}

        {/* Upload Form Card */}
        <div className="admin-card fade-in">
          <div className="admin-card-header">
            <div className="card-header-icon">
              <i className={activeTab === 'dsa' ? 'fas fa-code' : 'fas fa-calculator'}></i>
            </div>
            <div>
              <h2>{activeTab === 'dsa' ? 'Add Question to DSA' : 'Add Question to Aptitude'}</h2>
              <p>Select the topic section, enter the question title and problem link, then click Upload.</p>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner" style={{ padding: '40px 0' }}>
              <div className="spinner"></div>
              <p>Loading {activeTab.toUpperCase()} topics...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="admin-form">
              {/* Topic Dropdown */}
              <div className="form-group">
                <label htmlFor="topicSelect">
                  <i className="fas fa-layer-group" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                  Topic (in {activeTab === 'dsa' ? 'DSA' : 'Aptitude'})
                </label>
                <div className="select-wrapper">
                  <select
                    id="topicSelect"
                    className="form-control admin-select"
                    value={selectedTopicId}
                    onChange={handleTopicChange}
                    required
                  >
                    <option value="">-- Select a {activeTab === 'dsa' ? 'DSA Topic' : 'Aptitude Section'} --</option>
                    {currentTopicList.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.name} ({typeof topic.questionCount === 'number' ? `${topic.questionCount} questions` : 'Explore'})
                      </option>
                    ))}
                  </select>
                </div>
                <small className="form-hint">
                  {currentTopicObj?.description || `Choose which ${activeTab === 'dsa' ? 'DSA' : 'Aptitude'} section this problem belongs to.`}
                </small>
              </div>

              {/* Question Title Blank */}
              <div className="form-group">
                <label htmlFor="questionTitle">
                  <i className="fas fa-heading" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                  Question Title
                </label>
                <input
                  id="questionTitle"
                  type="text"
                  className="form-control"
                  placeholder={
                    activeTab === 'dsa'
                      ? 'e.g. Trapping Rain Water, Two Sum II, Longest Palindromic Substring'
                      : 'e.g. Alternate Days Work Execution, Train Crossing Bridge with Opposite Speed'
                  }
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  required
                />
              </div>

              {/* Question URL Blank */}
              <div className="form-group">
                <label htmlFor="questionUrl">
                  <i className="fas fa-link" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                  Question URL (e.g. LeetCode, CodeChef, IndiaBIX)
                </label>
                <input
                  id="questionUrl"
                  type="url"
                  className="form-control"
                  placeholder={
                    activeTab === 'dsa'
                      ? 'e.g. https://leetcode.com/problems/trapping-rain-water/ or CodeChef link'
                      : 'e.g. https://www.indiabix.com/aptitude/time-and-work/'
                  }
                  value={questionUrl}
                  onChange={(e) => setQuestionUrl(e.target.value)}
                />
              </div>

              {/* Difficulty and Company Tags */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                  <label htmlFor="difficulty">
                    <i className="fas fa-signal" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    className="form-control"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="companyTags">
                    <i className="fas fa-building" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                    Company Tags (comma separated)
                  </label>
                  <input
                    id="companyTags"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Amazon, Google, TCS, Infosys"
                    value={companyTags}
                    onChange={(e) => setCompanyTags(e.target.value)}
                  />
                </div>
              </div>

              {/* Upload Button */}
              <button 
                type="submit" 
                className="admin-upload-btn" 
                disabled={submitting || !selectedTopicId || !questionTitle.trim()}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Uploading Question...
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt"></i> Upload Question to {activeTab === 'dsa' ? 'DSA' : 'Aptitude'}
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Live Questions Preview for Selected Topic */}
        {selectedTopicId && (
          <div className="admin-preview-section fade-in">
            <div className="preview-header">
              <h3>
                <i className="fas fa-list-check" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                Questions in "{currentTopicObj?.name || 'Selected Topic'}" ({topicQuestions.length})
              </h3>
              <span className="live-badge"><i className="fas fa-circle" style={{ fontSize: '8px', marginRight: '4px' }}></i> Live Database View</span>
            </div>

            {loadingQuestions ? (
              <div className="loading-spinner" style={{ padding: '20px 0' }}>
                <div className="spinner"></div>
                <p>Refreshing questions...</p>
              </div>
            ) : topicQuestions.length > 0 ? (
              <div className="admin-questions-list">
                {topicQuestions.map((q, idx) => (
                  <div key={q._id} className="admin-question-item">
                    <div className="admin-q-left">
                      <span className="q-index">#{idx + 1}</span>
                      <div>
                        <h4>{q.question}</h4>
                        <div className="admin-q-meta">
                          <span className={`question-difficulty diff-${q.difficulty?.toLowerCase()}`}>
                            {q.difficulty}
                          </span>
                          {q.link && (
                            <a href={q.link} target="_blank" rel="noopener noreferrer" className="q-preview-link">
                              <i className="fas fa-external-link-alt"></i> Open Problem
                            </a>
                          )}
                          {q.companyTags && q.companyTags.length > 0 && (
                            <div className="tags-inline">
                              {q.companyTags.map((tag, tIdx) => (
                                <span key={tIdx} className="mini-tag">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="admin-q-actions">
                      <button
                        className="delete-btn"
                        title="Delete Question"
                        onClick={() => handleDeleteQuestion(q._id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-questions-placeholder">
                <i className="fas fa-folder-open"></i>
                <p>No questions currently added in this topic. Add one using the form above!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlacementPrep;
