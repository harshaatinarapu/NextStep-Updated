import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PlacementPrep from './components/PlacementPrep';
import ExamPrep from './components/ExamPrep';
import AdminPlacementPrep from './components/AdminPlacementPrep';
import AdminExamPrep from './components/AdminExamPrep';
import ApiTest from './components/ApiTest';
import ChatPage from './components/ChatPage';
import FloatingChatButton from './components/FloatingChatButton';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/placement-prep" element={<PlacementPrep />} />
          <Route path="/exam-prep" element={<ExamPrep />} />
          <Route path="/admin/placement-prep" element={<AdminPlacementPrep />} />
          <Route path="/placement-prep/edit" element={<AdminPlacementPrep />} />
          <Route path="/admin/exam-prep" element={<AdminExamPrep />} />
          <Route path="/exam-prep/edit" element={<AdminExamPrep />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
        <FloatingChatButton />
      </div>
    </Router>
  );
}

export default App;
