import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PlacementPrep from './components/PlacementPrep';
import ExamPrep from './components/ExamPrep';
import ApiTest from './components/ApiTest';
import ChatPage from './components/ChatPage';
import FloatingChatButton from './components/FloatingChatButton';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/placement-prep" element={<PlacementPrep />} />
          <Route path="/exam-prep" element={<ExamPrep />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
        <FloatingChatButton />
      </div>
    </Router>
  );
}

export default App;