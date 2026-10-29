import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [apiStatus, setApiStatus] = useState('Testing...');
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    testApiEndpoints();
  }, []);

  const testApiEndpoints = async () => {
    const endpoints = [
      { name: 'Health Check', url: '/api/health' },
      { name: 'Branches', url: '/api/branches' },
      { name: 'Auth Login', url: '/api/auth/login', method: 'POST', data: { email: 'test@example.com', password: 'password123' } },
      { name: 'Placement Topics', url: '/api/placementprep/topics' },
      { name: 'Exam Subjects', url: '/api/examprep/subjects' }
    ];

    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const config = {
          method: endpoint.method || 'GET',
          url: endpoint.url
        };
        
        if (endpoint.data) {
          config.data = endpoint.data;
        }

        const response = await axios(config);
        if (response.data?.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        results[endpoint.name] = {
          status: 'SUCCESS',
          statusCode: response.status,
          data: response.data
        };
      } catch (error) {
        results[endpoint.name] = {
          status: 'ERROR',
          statusCode: error.response?.status || 'No response',
          error: error.message
        };
      }
    }

    setTestResults(results);
    setApiStatus('Complete');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>API Connection Test</h2>
      <p>Status: {apiStatus}</p>
      
      <div style={{ marginTop: '20px' }}>
        {Object.entries(testResults).map(([name, result]) => (
          <div key={name} style={{ 
            marginBottom: '10px', 
            padding: '10px', 
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: result.status === 'SUCCESS' ? '#d4edda' : '#f8d7da'
          }}>
            <h4>{name}</h4>
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Code:</strong> {result.statusCode}</p>
            {result.error && <p><strong>Error:</strong> {result.error}</p>}
            {result.data && <p><strong>Data:</strong> {JSON.stringify(result.data).substring(0, 100)}...</p>}
          </div>
        ))}
      </div>
      
      <button onClick={testApiEndpoints} style={{ 
        marginTop: '20px', 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Retest API Endpoints
      </button>
    </div>
  );
};

export default ApiTest;
