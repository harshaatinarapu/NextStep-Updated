import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlacementPrep = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isSubtopicFlow, setIsSubtopicFlow] = useState(false);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    fetchPlacementTopics();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('placement_progress');
    const parsed = stored ? JSON.parse(stored) : {};
    const next = { ...parsed };
    questions.forEach(q => {
      if (next[q._id] === undefined) next[q._id] = false;
    });
    setProgressMap(next);
  }, [questions]);

  const toggleProgress = (qid) => {
    const updated = { ...progressMap, [qid]: !progressMap[qid] };
    setProgressMap(updated);
    localStorage.setItem('placement_progress', JSON.stringify(updated));
  };

  const fetchPlacementTopics = async () => {
    try {
      const response = await axios.get('/api/placementprep/topics');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = async (topic) => {
    // Check if topic has subtopics (DSA, Aptitude, or any with subtopics)
    if (topic.name === 'DSA' || topic.name === 'Aptitude' || (topic.subtopicCount && topic.subtopicCount > 0)) {
      setIsSubtopicFlow(true);
      setSelectedTopic(topic);
      setSelectedSubtopic(null);
      setQuestions([]);
      try {
        let endpoint = `/api/placementprep/subtopics/${topic._id}`;
        if (topic.name === 'DSA') {
          endpoint = '/api/placementprep/topics/dsa';
        } else if (topic.name === 'Aptitude') {
          endpoint = '/api/placementprep/topics/aptitude';
        }
        const response = await axios.get(endpoint);
        setSubtopics(response.data);
      } catch (error) {
        console.error(`Error fetching ${topic.name} subtopics:`, error);
        setSubtopics([]);
      }
      return;
    }

    // Direct questions under topic
    setIsSubtopicFlow(false);
    setSelectedTopic(topic);
    setSelectedSubtopic(null);
    try {
      const response = await axios.get(`/api/placementprep/questions/${topic._id}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }
  };

  const handleSubtopicClick = async (subtopic) => {
    setSelectedSubtopic(subtopic);
    try {
      // 1. Direct topicId lookup
      const response = await axios.get(`/api/placementprep/questions/${subtopic._id}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Direct topicId lookup failed, trying route name:', error);
      try {
        const routePrefix = selectedTopic?.name === 'Aptitude' ? 'aptitude' : 'dsa';
        const response = await axios.get(`/api/placementprep/topics/${routePrefix}/${encodeURIComponent(subtopic.name)}`);
        setQuestions(response.data);
      } catch (err) {
        console.error('Error fetching subtopic questions:', err);
        setQuestions([]);
      }
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const getTopicIcon = (name) => {
    if (name === 'DSA') return 'fas fa-code';
    if (name === 'Aptitude') return 'fas fa-brain';
    if (name === 'Core Subjects') return 'fas fa-server';
    return 'fas fa-book-open';
  };

  const completedCount = questions.filter(q => !!progressMap[q._id]).length;

  if (loading) {
    return (
      <div className="placement-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading placement preparation materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="placement-container">
      <div className="container">
        <div className="placement-header">
          <button className="back-btn" onClick={handleBackToDashboard}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h1>Placement Preparation</h1>
          <p>Master technical interviews and preliminary screening with curated DSA (LeetCode 150) & Aptitude (IndiaBIX)</p>
        </div>

        <div className="placement-content">
          {!selectedTopic && !isSubtopicFlow ? (
            <div className="topics-grid">
              <h2>Choose a Topic to Start</h2>
              <div className="topics-list">
                {topics.map((topic) => (
                  <div 
                    key={topic._id} 
                    className={`topic-card topic-card-${topic.name === 'DSA' ? 'dsa' : topic.name === 'Aptitude' ? 'aptitude' : 'core'}`}
                    onClick={() => handleTopicClick(topic)}
                  >
                    <div className="topic-icon">
                      <i className={getTopicIcon(topic.name)}></i>
                    </div>
                    <h3>{topic.name}</h3>
                    <p>{topic.description}</p>
                    <div className="topic-stats">
                      {topic.subtopicCount > 0 ? (
                        <span>
                          <i className="fas fa-layer-group"></i> {topic.questionCount} Questions ({topic.subtopicCount} Sections)
                        </span>
                      ) : (
                        (typeof topic.questionCount === 'number') && (
                          <span><i className="fas fa-question-circle"></i> {topic.questionCount} Questions</span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isSubtopicFlow && !selectedSubtopic ? (
            <div className="topics-grid">
              <div className="questions-header">
                <button className="back-btn" onClick={() => { setIsSubtopicFlow(false); setSelectedTopic(null); }}>
                  <i className="fas fa-arrow-left"></i> Back to Topics
                </button>
                <h2>{selectedTopic?.name} Study Plan & Sections</h2>
                <p>
                  {selectedTopic?.name === 'DSA'
                    ? 'Curated 150 essential problems across all core data structures and algorithms (LeetCode Top Interview 150)'
                    : selectedTopic?.name === 'Aptitude'
                    ? 'Curated Quantitative Aptitude topic sections based on IndiaBIX placement tests'
                    : selectedTopic?.description}
                </p>
              </div>
              <h2>Choose an {selectedTopic?.name} Section</h2>
              <div className="topics-list">
                {subtopics.map((sub) => (
                  <div 
                    key={sub._id}
                    className={`topic-card subtopic-card subtopic-theme-${selectedTopic?.name === 'DSA' ? 'dsa' : 'aptitude'}`}
                    onClick={() => handleSubtopicClick(sub)}
                  >
                    <div className="topic-icon">
                      <i className={selectedTopic?.name === 'Aptitude' ? 'fas fa-calculator' : 'fas fa-layer-group'}></i>
                    </div>
                    <h3>{sub.name}</h3>
                    <p>{sub.description}</p>
                    <div className="topic-stats" style={{ marginTop: '10px' }}>
                      <span>
                        <i className="fas fa-question-circle"></i> {typeof sub.questionCount === 'number' ? `${sub.questionCount} Questions` : 'View Questions'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="questions-section">
              <div className="questions-header">
                <button className="back-btn" onClick={() => {
                  if (isSubtopicFlow && selectedSubtopic) {
                    setSelectedSubtopic(null);
                    setQuestions([]);
                  } else {
                    setSelectedTopic(null);
                    setIsSubtopicFlow(false);
                    setQuestions([]);
                  }
                }}>
                  <i className="fas fa-arrow-left"></i> {isSubtopicFlow && selectedSubtopic ? `Back to ${selectedTopic?.name} Sections` : 'Back to Topics'}
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginTop: '10px', width: '100%' }}>
                  <div>
                    <h2>{isSubtopicFlow ? (selectedSubtopic?.name || selectedTopic?.name) : selectedTopic?.name}</h2>
                    <p>{isSubtopicFlow ? (selectedSubtopic?.description || selectedTopic?.description) : selectedTopic?.description}</p>
                  </div>
                  {questions.length > 0 && (
                    <div className="progress-badge-box">
                      <div className="subtopic-badge">
                        <i className="fas fa-trophy" style={{ marginRight: '6px', color: '#f59e0b' }}></i>
                        Solved: {completedCount} / {questions.length} ({Math.round((completedCount / questions.length) * 100)}%)
                      </div>
                      <div className="progress-track-bar">
                        <div 
                          className="progress-fill-bar" 
                          style={{ width: `${Math.round((completedCount / questions.length) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="questions-list">
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <div key={question._id} className={`question-card ${progressMap[question._id] ? 'card-completed' : ''}`}>
                      <div className="question-header">
                        <span className="question-number">Q{index + 1}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {progressMap[question._id] && (
                            <span className="solved-pill"><i className="fas fa-check"></i> Completed</span>
                          )}
                          <span className={`question-difficulty diff-${question.difficulty?.toLowerCase()}`}>
                            {question.difficulty === 'Easy' && <i className="fas fa-leaf" style={{ marginRight: '4px' }}></i>}
                            {question.difficulty === 'Medium' && <i className="fas fa-bolt" style={{ marginRight: '4px' }}></i>}
                            {question.difficulty === 'Hard' && <i className="fas fa-fire" style={{ marginRight: '4px' }}></i>}
                            {question.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="question-content">
                        <h4>{question.question}</h4>
                        {question.companyTags && question.companyTags.length > 0 && (
                          <div className="company-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '8px 0 12px 0' }}>
                            {question.companyTags.map((tag, tIdx) => (
                              <span key={tIdx} style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.08)', color: '#4f46e5', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' }}>
                                <i className="fas fa-building" style={{ fontSize: '9px', marginRight: '4px' }}></i>{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="question-actions">
                          <label className="progress-check">
                            <input
                              type="checkbox"
                              checked={!!progressMap[question._id]}
                              onChange={() => toggleProgress(question._id)}
                            />
                            <span>Mark as completed</span>
                          </label>
                          {question.link && (
                            <a
                              href={question.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="open-link-btn"
                            >
                              <i className="fas fa-external-link-alt" style={{ marginRight: '6px' }}></i>
                              {question.link.includes('leetcode.com') ? 'Solve on LeetCode' : question.link.includes('indiabix.com') ? 'Practice on IndiaBIX' : 'Open Problem'}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-questions">
                    <i className="fas fa-inbox"></i>
                    <h3>No questions available</h3>
                    <p>Questions for this topic will be added soon.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementPrep;