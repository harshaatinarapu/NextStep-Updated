import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on login page
  if (location.pathname === '/login') return null;

  return (
    <button
      className="chat-fab"
      onClick={() => navigate('/chat')}
      aria-label="Open AI Chatbot"
      title="AI Chatbot"
    >
      <i className="fas fa-robot"></i>
    </button>
  );
};

export default FloatingChatButton;
