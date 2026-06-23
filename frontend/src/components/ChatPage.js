import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const navigate = useNavigate();

  // Minimal markdown → HTML renderer (headings, bold, italic, lists, code, links)
  const renderMarkdown = (md = '') => {
    const escapeHtml = (s) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Work on a copy
    let text = md.trim();

    // Extract fenced code blocks first (preserve content)
    const codeBlocks = [];
    text = text.replace(/```([\s\S]*?)```/g, (_, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
      return `@@CODEBLOCK_${idx}@@`;
    });

    // Headings
    text = text.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
               .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
               .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
               .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
               .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
               .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    // Horizontal rule ---
    text = text.replace(/^---$/gm, '<hr/>');

    // Links [text](url)
    text = text.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Bold and italic (do after code extraction)
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
               .replace(/(^|\s)\*(?!\s)(.+?)\*(?=\s|$)/g, '$1<em>$2</em>');

    // Build lists and paragraphs line by line
    const lines = text.split(/\r?\n/);
    const out = [];
    let inUl = false;
    let inOl = false;
    const closeLists = () => {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
    };
    for (let raw of lines) {
      const line = raw.trim();
      if (/^\*\s+.+/.test(line) || /^-\s+.+/.test(line)) {
        if (!inUl) { closeLists(); out.push('<ul>'); inUl = true; }
        out.push(`<li>${line.replace(/^[-*]\s+/, '')}</li>`);
      } else if (/^\d+\.\s+.+/.test(line)) {
        if (!inOl) { closeLists(); out.push('<ol>'); inOl = true; }
        out.push(`<li>${line.replace(/^\d+\.\s+/, '')}</li>`);
      } else if (line === '') {
        closeLists();
      } else {
        closeLists();
        out.push(`<p>${line}</p>`);
      }
    }
    closeLists();

    let html = out.join('\n');

    // Restore code blocks
    html = html.replace(/@@CODEBLOCK_(\d+)@@/g, (_, i) => codeBlocks[Number(i)] || '');

    return html;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await axios.post('/chat', { message: input.trim() });
      const data = res.data;
      const text = typeof data === 'string'
        ? data
        : (data?.response
            || (Array.isArray(data?.paragraphs) ? data.paragraphs.join('\n\n') : ''));
      setResponse(text || '');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reach /chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page container">
      <div className="placement-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <h1>AI Chatbot</h1>
        <p>Ask questions and get help</p>
      </div>

      <div className="chat-card">
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            className="chat-input"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button className="chat-send-btn" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
        {error && <div className="alert alert-error show" style={{marginTop: '12px'}}>{error}</div>}
        {response && (
          <div className="chat-response">
            <h4>Response</h4>
            <div className="chat-markdown" dangerouslySetInnerHTML={{ __html: renderMarkdown(response) }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
