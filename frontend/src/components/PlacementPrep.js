import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlacementPrep = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isDsaFlow, setIsDsaFlow] = useState(false);
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
    if (topic.name === 'DSA') {
      setIsDsaFlow(true);
      setSelectedTopic(topic);
      setSelectedSubtopic(null);
      setQuestions([]);
      try {
        const response = await axios.get('/api/placementprep/topics/dsa');
        setSubtopics(response.data);
      } catch (error) {
        console.error('Error fetching DSA subtopics:', error);
        setSubtopics([]);
      }
      return;
    }
    setSelectedTopic(topic);
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
      const response = await axios.get(`/api/placementprep/topics/dsa/${encodeURIComponent(subtopic.name)}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching subtopic questions:', error);
      setQuestions([]);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

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
          <p>Master the skills needed to land your dream job</p>
        </div>

        <div className="placement-content">
          {!selectedTopic && !isDsaFlow ? (
            <div className="topics-grid">
              <h2>Choose a Topic to Start</h2>
              <div className="topics-list">
                {topics.map((topic) => (
                  <div 
                    key={topic._id} 
                    className="topic-card"
                    onClick={() => handleTopicClick(topic)}
                  >
                    <div className="topic-icon">
                      <i className="fas fa-code"></i>
                    </div>
                    <h3>{topic.name}</h3>
                    <p>{topic.description}</p>
                    <div className="topic-stats">
                      {topic.name === 'DSA' ? (
                        <span><i className="fas fa-layer-group"></i> Explore Subtopics</span>
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
          ) : isDsaFlow && !selectedSubtopic ? (
            <div className="topics-grid">
              <div className="questions-header">
                <button className="back-btn" onClick={() => { setIsDsaFlow(false); setSelectedTopic(null); }}>
                  <i className="fas fa-arrow-left"></i> Back to Topics
                </button>
                <h2>{selectedTopic?.name}</h2>
                <p>{selectedTopic?.description}</p>
              </div>
              <h2>Choose a Subtopic</h2>
              <div className="topics-list">
                {subtopics.map((sub) => (
                  <div 
                    key={sub._id}
                    className="topic-card"
                    onClick={() => handleSubtopicClick(sub)}
                  >
                    <div className="topic-icon">
                      <i className="fas fa-layer-group"></i>
                    </div>
                    <h3>{sub.name}</h3>
                    <p>{sub.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="questions-section">
              <div className="questions-header">
                <button className="back-btn" onClick={() => {
                  if (isDsaFlow && selectedSubtopic) {
                    setSelectedSubtopic(null);
                    setQuestions([]);
                  } else {
                    setSelectedTopic(null);
                    setIsDsaFlow(false);
                    setQuestions([]);
                  }
                }}>
                  <i className="fas fa-arrow-left"></i> {isDsaFlow && selectedSubtopic ? 'Back to Subtopics' : 'Back to Topics'}
                </button>
                <h2>{isDsaFlow ? (selectedSubtopic?.name || selectedTopic?.name) : selectedTopic.name}</h2>
                <p>{isDsaFlow ? (selectedSubtopic?.description || selectedTopic?.description) : selectedTopic.description}</p>
              </div>

              <div className="questions-list">
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <div key={question._id} className="question-card">
                      <div className="question-header">
                        <span className="question-number">Q{index + 1}</span>
                        <span className="question-difficulty">{question.difficulty}</span>
                      </div>
                      <div className="question-content">
                        <h4>{question.question}</h4>
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
                              Open Problem
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
