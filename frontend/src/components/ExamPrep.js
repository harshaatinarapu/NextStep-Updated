import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExamPrep = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [resources, setResources] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showSubjectSelection, setShowSubjectSelection] = useState(false);
  const [showResourceTypeSelection, setShowResourceTypeSelection] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get('/api/branches');
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    if (!selectedBranch || !selectedSemester) return;
    
    setLoading(true);
    try {
      console.log('Fetching subjects for:', selectedBranch, selectedSemester);
      const response = await axios.get(`/api/examprep/${selectedBranch}/${selectedSemester}`);
      console.log('Subjects response:', response.data);
      
      // Handle the actual data structure from backend
      let formattedSubjects = [];
      if (Array.isArray(response.data)) {
        formattedSubjects = response.data.map(item => {
          // Handle different possible data structures
          if (item.subject && item.subject._id) {
            // If subject is populated
            return {
              _id: item._id || item.subject._id,
              subject: {
                _id: item.subject._id,
                subjectName: item.subject.subjectName || 'Unknown Subject',
                subjectCode: item.subject.subjectCode || 'N/A'
              }
            };
          } else if (item._id && !item.subject) {
            // If subject is not populated, it might be just the subject ID
            return {
              _id: item._id,
              subject: {
                _id: item._id,
                subjectName: 'Subject Name',
                subjectCode: 'N/A'
              }
            };
          } else {
            // Fallback for any other structure
            return {
              _id: item._id || Math.random().toString(),
              subject: {
                _id: item._id || Math.random().toString(),
                subjectName: 'Unknown Subject',
                subjectCode: 'N/A'
              }
            };
          }
        });
      }
      
      console.log('Formatted subjects:', formattedSubjects);
      setSubjects(formattedSubjects);
      setShowSubjectSelection(true);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setShowResourceTypeSelection(true);
  };

  const handleResourceTypeClick = async (resourceType) => {
    setSelectedResourceType(resourceType);
    setLoading(true);
    
    try {
      // Use the subject ID from the nested structure
      const subjectId = selectedSubject.subject?._id || selectedSubject._id;
      console.log('Fetching resources for:', selectedBranch, selectedSemester, subjectId, resourceType);
      
      const response = await axios.get(`/api/examprep/${selectedBranch}/${selectedSemester}/${subjectId}/${resourceType}`);
      console.log('Resources response:', response.data);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleBranchSemesterSubmit = (e) => {
    e.preventDefault();
    if (selectedBranch && selectedSemester) {
      fetchSubjects();
    }
  };

  const handleBackToSelection = () => {
    setShowSubjectSelection(false);
    setSelectedSubject(null);
    setResources([]);
    setShowResourceTypeSelection(false);
    setSelectedResourceType('');
  };

  const handleBackToSubjects = () => {
    setShowResourceTypeSelection(false);
    setSelectedResourceType('');
    setResources([]);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="exam-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading exam preparation materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-container">
      <div className="container">
        <div className="exam-header">
          <button className="back-btn" onClick={handleBackToDashboard}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h1>Exam Preparation</h1>
          <p>Access comprehensive study materials for your academic success</p>
        </div>

        <div className="exam-content">
          {!showSubjectSelection ? (
            <div className="branch-semester-selection">
              <h2>Select Your Branch and Semester</h2>
              <form onSubmit={handleBranchSemesterSubmit} className="selection-form">
                <div className="form-group">
                  <label htmlFor="branch">Branch</label>
                  <select 
                    id="branch" 
                    value={selectedBranch} 
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch.branchName}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="semester">Semester</label>
                  <select 
                    id="semester" 
                    value={selectedSemester} 
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" disabled={!selectedBranch || !selectedSemester}>
                  <i className="fas fa-search"></i> Find Subjects
                </button>
              </form>
            </div>
          ) : !showResourceTypeSelection ? (
            <div className="subjects-grid">
              <div className="subjects-header">
                <button className="back-btn" onClick={handleBackToSelection}>
                  <i className="fas fa-arrow-left"></i> Back to Selection
                </button>
                <h2>Choose a Subject</h2>
                <p>Branch: {selectedBranch} | Semester: {selectedSemester}</p>
              </div>
              <div className="subjects-list">
                {subjects.length > 0 ? (
                  subjects.map((subject, index) => (
                    <div
                      key={subject._id || index} 
                      className="subject-card"
                      onClick={() => handleSubjectClick(subject)}
                    >
                      <div className="subject-icon">
                        <i className="fas fa-book"></i>
                      </div>
                      <h3>{subject.subject?.subjectName || subject.subjectName || `Subject ${index + 1}`}</h3>
                      <p>Subject Code: {subject.subject?.subjectCode || subject.subjectCode || 'N/A'}</p>
                      <div className="subject-stats">
                        <span><i className="fas fa-file-alt"></i> Available Resources</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-subjects">
                    <i className="fas fa-inbox"></i>
                    <h3>No subjects found</h3>
                    <p>No subjects are available for {selectedBranch} - Semester {selectedSemester}</p>
                    <button 
                      className="btn btn-secondary" 
                      onClick={handleBackToSelection}
                      style={{ marginTop: '20px' }}
                    >
                      Try Different Selection
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : !selectedResourceType ? (
            <div className="resource-type-selection">
              <div className="resource-type-header">
                <button className="back-btn" onClick={handleBackToSubjects}>
                  <i className="fas fa-arrow-left"></i> Back to Subjects
                </button>
                <h2>Select Resource Type</h2>
                <p>Subject: {selectedSubject?.subject?.subjectName || selectedSubject?.subjectName || 'Selected Subject'}</p>
              </div>
              
              <div className="resource-types-grid">
                <div 
                  className="resource-type-card"
                  onClick={() => handleResourceTypeClick('notes')}
                >
                  <div className="resource-type-icon">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <h3>Notes</h3>
                  <p>Study materials and lecture notes</p>
                </div>
                <div
                  className="resource-type-card"
                  onClick={() => handleResourceTypeClick('ppt')}
                >
                  <div className="resource-type-icon">
                    <i className="fas fa-file-powerpoint"></i>
                  </div>
                  <h3>PowerPoint Slides</h3>
                  <p>Presentations and slides</p>
                </div>
                
                <div 
                  className="resource-type-card"
                  onClick={() => handleResourceTypeClick('previous_paper')}
                >
                  <div className="resource-type-icon">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  <h3>Previous Papers</h3>
                  <p>Past year question papers</p>
                </div>
                
                <div 
                  className="resource-type-card"
                  onClick={() => handleResourceTypeClick('video')}
                >
                  <div className="resource-type-icon">
                    <i className="fas fa-play-circle"></i>
                  </div>
                  <h3>Videos</h3>
                  <p>Video lectures and tutorials</p>
                </div>
                
                <div 
                  className="resource-type-card"
                  onClick={() => handleResourceTypeClick('book')}
                >
                  <div className="resource-type-icon">
                    <i className="fas fa-book"></i>
                  </div>
                  <h3>Books</h3>
                  <p>Reference books and textbooks</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="resources-section">
              <div className="resources-header">
                <button className="back-btn" onClick={handleBackToSubjects}>
                  <i className="fas fa-arrow-left"></i> Back to Resource Types
                </button>
                <h2>{selectedSubject?.subject?.subjectName || selectedSubject?.subjectName || 'Selected Subject'}</h2>
                <p>
                  <i className="fas fa-folder-open" aria-hidden="true"></i>
                  {selectedResourceType === 'ppt'
                    ? 'PowerPoint Slides'
                    : selectedResourceType.replace(/_/g, ' ').toUpperCase()}
                  <span className="resource-count">
                    {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
                  </span>
                </p>
              </div>

              <div className="resources-list">
                {resources.length > 0 ? (
                  <div className="resources-grid">
                    {resources.map((resource) => (
                      <article key={resource._id} className="resource-card">
                        <div className={`resource-icon resource-icon-${resource.resourceType || 'file'}`}>
                          {resource.resourceType === 'video' && <i className="fas fa-play-circle"></i>}
                          {resource.resourceType === 'notes' && <i className="fas fa-file-alt"></i>}
                          {resource.resourceType === 'previous_paper' && <i className="fas fa-file-pdf"></i>}
                          {resource.resourceType === 'book' && <i className="fas fa-book"></i>}
                          {resource.resourceType === 'ppt' && <i className="fas fa-file-powerpoint"></i>}
                          {!['video', 'notes', 'previous_paper', 'book', 'ppt'].includes(resource.resourceType) && <i className="fas fa-file-download"></i>}
                        </div>
                        <div className="resource-content">
                          <h4>{resource.title}</h4>
                          <div className="resource-meta">
                            <span className="resource-type">
                              {resource.resourceType === 'ppt'
                                ? 'PowerPoint Slides'
                                : (resource.resourceType || 'resource').replace(/_/g, ' ')}
                            </span>
                            {resource.branch && <span>Branch {resource.branch}</span>}
                            {resource.sem && <span>Semester {resource.sem}</span>}
                          </div>
                        </div>
                        {(resource.fileUrl || resource.url) ? (
                          <a
                            className="resource-download-btn"
                            href={resource.fileUrl || resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open or download ${resource.title}`}
                          >
                            <i className="fas fa-download" aria-hidden="true"></i>
                            <span>Open / Download</span>
                          </a>
                        ) : (
                          <span className="resource-unavailable">Link unavailable</span>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="no-resources">
                    <i className="fas fa-inbox"></i>
                    <h3>No resources available</h3>
                    <p>Resources for this subject will be added soon.</p>
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

export default ExamPrep;
