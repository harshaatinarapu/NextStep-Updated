import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminExamPrep = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [resourceType, setResourceType] = useState('notes');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [existingResources, setExistingResources] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch && selectedSemester) {
      fetchSubjects(selectedBranch, selectedSemester);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch, selectedSemester]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get('/api/branches');
      setBranches(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedBranch(res.data[0].branchName);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    } finally {
      setLoadingBranches(false);
    }
  };

  const fetchSubjects = async (branch, sem) => {
    try {
      const res = await axios.get(`/api/examprep/${branch}/${sem}`);
      const list = (res.data || []).map(item => {
        if (item.subject && item.subject.subjectName) {
          return item.subject;
        }
        return item;
      });
      setSubjects(list);
      if (list.length > 0) {
        setSelectedSubject(list[0].subjectName || '');
        fetchResources(branch, sem, list[0]._id || list[0].subjectName);
      } else {
        setSelectedSubject('');
        setExistingResources([]);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setSubjects([]);
      setExistingResources([]);
    }
  };

  const fetchResources = async (branch, sem, subjectIdOrName) => {
    setLoadingExisting(true);
    try {
      const res = await axios.get(`/api/examprep/${branch}/${sem}/${subjectIdOrName}/all`);
      setExistingResources(res.data || []);
    } catch (e) {
      try {
        const res = await axios.get(`/api/examprep/${branch}/${sem}/${subjectIdOrName}/notes`);
        setExistingResources(res.data || []);
      } catch (err) {
        setExistingResources([]);
      }
    } finally {
      setLoadingExisting(false);
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
    if (!title.trim() || !url.trim() || !selectedSubject) {
      showAlert('Please fill in title, subject, and resource link.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        branch: selectedBranch,
        sem: parseInt(selectedSemester, 10),
        subject: selectedSubject,
        resourceType,
        title: title.trim(),
        url: url.trim(),
        fileUrl: url.trim()
      };

      await axios.post('/api/resources', payload);
      showAlert(`🎉 Success! Exam resource "${title}" has been added for ${selectedSubject}.`, 'success');

      setTitle('');
      setUrl('');
      const subObj = subjects.find(s => s.subjectName === selectedSubject);
      if (subObj) {
        fetchResources(selectedBranch, selectedSemester, subObj._id || selectedSubject);
      }
    } catch (err) {
      console.error('Error uploading resource:', err);
      const msg = err.response?.data?.error || 'Failed to add exam resource.';
      showAlert(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (resId) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await axios.delete(`/api/resources/${resId}`);
      showAlert('Resource deleted successfully.', 'success');
      setExistingResources(prev => prev.filter(r => r._id !== resId));
    } catch (err) {
      console.error('Error deleting resource:', err);
      showAlert('Failed to delete resource.', 'error');
    }
  };

  return (
    <div className="admin-container">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-actions">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <button className="preview-student-btn" onClick={() => navigate('/exam-prep')}>
              <i className="fas fa-eye"></i> Student View
            </button>
          </div>
          <div className="admin-title-badge">
            <span className="admin-tag"><i className="fas fa-shield-alt"></i> Admin Panel</span>
          </div>
          <h1>Edit Exam Preparation</h1>
          <p>Upload lecture notes, previous year question papers (PYQs), video playlists, and textbooks for university exams.</p>
        </div>

        {alert.show && (
          <div className={`alert alert-${alert.type} show`} style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
            <span>{alert.message}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="admin-card fade-in">
          <div className="admin-card-header">
            <div className="card-header-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div>
              <h2>Upload Exam Study Resource</h2>
              <p>Select branch, semester, subject, and resource type, then provide the document title and link.</p>
            </div>
          </div>

          {loadingBranches ? (
            <div className="loading-spinner" style={{ padding: '40px 0' }}>
              <div className="spinner"></div>
              <p>Loading academic branches...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="form-group">
                <label htmlFor="branchSelect">
                  <i className="fas fa-code-branch" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                  Branch
                </label>
                <select
                  id="branchSelect"
                  className="form-control"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  required
                >
                  {branches.map(b => (
                    <option key={b._id} value={b.branchName}>{b.branchName}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="semSelect">
                  <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                  Semester
                </label>
                <select
                  id="semSelect"
                  className="form-control"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subjectSelect">
                  <i className="fas fa-book" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                  Subject
                </label>
                <select
                  id="subjectSelect"
                  className="form-control"
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    const subObj = subjects.find(s => s.subjectName === e.target.value);
                    if (subObj) {
                      fetchResources(selectedBranch, selectedSemester, subObj._id || e.target.value);
                    }
                  }}
                  required
                >
                  {subjects.length === 0 && <option value="">No subjects found for this Sem</option>}
                  {subjects.map((sub, i) => (
                    <option key={sub._id || i} value={sub.subjectName}>
                      {sub.subjectName} ({sub.subjectCode || 'Core'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="typeSelect">
                  <i className="fas fa-file-alt" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                  Resource Type
                </label>
                <select
                  id="typeSelect"
                  className="form-control"
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                >
                  <option value="notes">Lecture Notes & Summaries</option>
                  <option value="previous_paper">Previous Year Paper (PYQ)</option>
                  <option value="video">Video Lecture / Playlist</option>
                  <option value="book">Reference Textbook</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="resourceTitle">
                <i className="fas fa-heading" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                Resource Title
              </label>
              <input
                id="resourceTitle"
                type="text"
                className="form-control"
                placeholder="e.g. Unit 1 Complete Handwritten Notes, 2024 End-Sem Question Paper..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="resourceUrl">
                <i className="fas fa-link" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                Resource URL / Document Link
              </label>
              <input
                id="resourceUrl"
                type="url"
                className="form-control"
                placeholder="e.g. https://drive.google.com/..., PDF link, YouTube link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="admin-upload-btn"
              disabled={submitting || !title.trim() || !url.trim() || !selectedSubject}
            >
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Uploading Resource...
                </>
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt"></i> Upload Exam Resource
                </>
              )}
            </button>
          </form>
          )}
        </div>

        {/* Existing Resources Preview */}
        {selectedSubject && (
          <div className="admin-preview-section fade-in">
            <div className="preview-header">
              <h3>
                <i className="fas fa-folder-open" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                Uploaded Resources for {selectedSubject} ({selectedBranch} Sem {selectedSemester})
              </h3>
              <span className="live-badge"><i className="fas fa-circle" style={{ fontSize: '8px', marginRight: '4px' }}></i> Live</span>
            </div>

            {loadingExisting ? (
              <div className="loading-spinner" style={{ padding: '20px 0' }}>
                <div className="spinner"></div>
                <p>Loading resources...</p>
              </div>
            ) : existingResources.length > 0 ? (
              <div className="admin-questions-list">
                {existingResources.map((item, idx) => (
                  <div key={item._id} className="admin-question-item">
                    <div className="admin-q-left">
                      <span className="q-index">#{idx + 1}</span>
                      <div>
                        <h4>{item.title}</h4>
                        <div className="admin-q-meta">
                          <span className="mini-tag" style={{ textTransform: 'capitalize' }}>{item.resourceType}</span>
                          {(item.url || item.fileUrl) && (
                            <a href={item.url || item.fileUrl} target="_blank" rel="noopener noreferrer" className="q-preview-link">
                              <i className="fas fa-external-link-alt"></i> View Resource
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="admin-q-actions">
                      <button
                        className="delete-btn"
                        title="Delete Resource"
                        onClick={() => handleDeleteResource(item._id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-questions-placeholder">
                <i className="fas fa-inbox"></i>
                <p>No study resources currently uploaded for this subject yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExamPrep;
