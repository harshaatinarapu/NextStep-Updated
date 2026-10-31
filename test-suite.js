// test-suite.js: End-to-end API verification for NextStep
const http = require('http');
const app = require('./app');

const PORT = 5000;
let authToken = '';
let authCookie = '';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    if (authToken) {
      reqHeaders['Authorization'] = `Bearer ${authToken}`;
    }
    if (authCookie) {
      reqHeaders['Cookie'] = authCookie;
    }
    if (data) {
      reqHeaders['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let resBody = '';
      if (res.headers['set-cookie']) {
        const cookies = res.headers['set-cookie'];
        const tokenCookie = cookies.find(c => c.startsWith('token='));
        if (tokenCookie) {
          authCookie = tokenCookie.split(';')[0];
        }
      }

      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          const parsed = resBody ? JSON.parse(resBody) : null;
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: resBody });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

let server;

async function runTests() {
  console.log('🧪 Starting NextStep End-to-End API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.data?.status === 'OK', 'GET /api/health returns 200 OK');

    // 2. Branches
    const branches = await request('GET', '/api/branches');
    assert(branches.status === 200 && Array.isArray(branches.data) && branches.data.length > 0, `GET /api/branches returns ${branches.data?.length} branches`);

    // 3. User Login with seeded user
    const login = await request('POST', '/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    assert(login.status === 200 && login.data?.token, 'POST /api/auth/login succeeds and returns JWT token');
    if (login.data?.token) {
      authToken = login.data.token;
    }

    // 4. Auth Me check
    const me = await request('GET', '/api/auth/me');
    assert(me.status === 200 && me.data?.email === 'test@example.com', 'GET /api/auth/me returns authenticated user details');

    // 5. Placement Topics
    const topics = await request('GET', '/api/placementprep/topics');
    assert(topics.status === 200 && Array.isArray(topics.data) && topics.data.length >= 2, `GET /api/placementprep/topics returns ${topics.data?.length} topics`);

    // 6. DSA Subtopics
    const dsaSubtopics = await request('GET', '/api/placementprep/topics/dsa');
    assert(dsaSubtopics.status === 200 && Array.isArray(dsaSubtopics.data) && dsaSubtopics.data.length > 0, `GET /api/placementprep/topics/dsa returns ${dsaSubtopics.data?.length} DSA subtopics`);

    // 7. DSA Subtopic Questions (Arrays)
    const arrayQuestions = await request('GET', '/api/placementprep/topics/dsa/Arrays');
    assert(arrayQuestions.status === 200 && Array.isArray(arrayQuestions.data) && arrayQuestions.data.length > 0, `GET /api/placementprep/topics/dsa/Arrays returns ${arrayQuestions.data?.length} questions`);

    // 8. Aptitude Subtopics (IndiaBIX Sections)
    const aptSubtopics = await request('GET', '/api/placementprep/topics/aptitude');
    assert(aptSubtopics.status === 200 && Array.isArray(aptSubtopics.data) && aptSubtopics.data.length === 20, `GET /api/placementprep/topics/aptitude returns all 20 IndiaBIX sections`);

    // 9. Aptitude Questions (Time and Work)
    const twQuestions = await request('GET', '/api/placementprep/topics/aptitude/Time%20and%20Work');
    assert(twQuestions.status === 200 && Array.isArray(twQuestions.data) && twQuestions.data.length > 0, `GET /api/placementprep/topics/aptitude/Time and Work returns ${twQuestions.data?.length} questions`);

    // 10. Exam Prep Subjects Overview
    const subjects = await request('GET', '/api/examprep/subjects');
    assert(subjects.status === 200 && Array.isArray(subjects.data) && subjects.data.length > 0, `GET /api/examprep/subjects returns ${subjects.data?.length} subjects`);

    // 9. Exam Prep Branch & Sem (IT Semester 3)
    const itSem3 = await request('GET', '/api/examprep/IT/3');
    assert(itSem3.status === 200 && Array.isArray(itSem3.data) && itSem3.data.length > 0, `GET /api/examprep/IT/3 returns ${itSem3.data?.length} subjects for IT Sem 3`);

    // 10. Exam Prep Resources for DBMS
    let dbmsId = null;
    if (itSem3.data && itSem3.data.length > 0) {
      const dbms = itSem3.data.find(s => s.subject?.subjectName === 'DBMS');
      if (dbms) dbmsId = dbms.subject._id;
    }
    if (dbmsId) {
      const dbmsNotes = await request('GET', `/api/examprep/IT/3/${dbmsId}/notes`);
      assert(dbmsNotes.status === 200 && Array.isArray(dbmsNotes.data) && dbmsNotes.data.length > 0, `GET /api/examprep/IT/3/:subid/notes returns ${dbmsNotes.data?.length} notes`);
    }

    // 11. Resources listing
    const resources = await request('GET', '/api/resources');
    assert(resources.status === 200 && Array.isArray(resources.data) && resources.data.length > 0, `GET /api/resources returns ${resources.data?.length} uploaded resources`);

    // 12. Admin Login & Role Check
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    assert(adminLogin.status === 200 && adminLogin.data?.role === 'admin', 'POST /api/auth/login logs in admin and verifies role is admin');
    if (adminLogin.data?.token) {
      authToken = adminLogin.data.token;
    }

    // 13. Admin Add Question to DSA
    const arrayTopic = dsaSubtopics.data.find(s => /array/i.test(s.name));
    assert(!!arrayTopic, 'Found DSA Array topic for admin question upload');
    let addedDsaQId = null;
    if (arrayTopic) {
      const addDsaQ = await request('POST', '/api/placementprep/questions', {
        topicId: arrayTopic._id,
        question: 'Trapping Rain Water II (Admin Test Upload)',
        link: 'https://leetcode.com/problems/trapping-rain-water-ii/',
        difficulty: 'Hard',
        companyTags: ['Google', 'Amazon']
      });
      assert(addDsaQ.status === 201 && addDsaQ.data?.question?._id, 'POST /api/placementprep/questions successfully uploads DSA question');
      addedDsaQId = addDsaQ.data?.question?._id;

      // Verify question is immediately visible in topic questions list
      const updatedQuestions = await request('GET', `/api/placementprep/questions/${arrayTopic._id}`);
      const foundInList = updatedQuestions.data?.some(q => q._id === addedDsaQId);
      assert(foundInList === true, 'GET /api/placementprep/questions/:topicId immediately includes newly uploaded question for students');
    }

    // 14. Admin Add Question to Aptitude
    const twTopic = aptSubtopics.data.find(s => /time and work/i.test(s.name));
    assert(!!twTopic, 'Found Aptitude Time and Work section for admin upload');
    let addedAptQId = null;
    if (twTopic) {
      const addAptQ = await request('POST', '/api/placementprep/questions', {
        topicId: twTopic._id,
        question: 'Efficiency Calculation under Variable Manpower (Admin Test Upload)',
        link: 'https://www.indiabix.com/aptitude/time-and-work/',
        difficulty: 'Medium',
        companyTags: ['TCS', 'Infosys']
      });
      assert(addAptQ.status === 201 && addAptQ.data?.question?._id, 'POST /api/placementprep/questions successfully uploads Aptitude question');
      addedAptQId = addAptQ.data?.question?._id;
    }

    // Clean up test questions
    if (addedDsaQId) {
      const delDsa = await request('DELETE', `/api/placementprep/questions/${addedDsaQId}`);
      assert(delDsa.status === 200, 'DELETE /api/placementprep/questions/:id cleans up test DSA question');
    }
    if (addedAptQId) {
      const delApt = await request('DELETE', `/api/placementprep/questions/${addedAptQId}`);
      assert(delApt.status === 200, 'DELETE /api/placementprep/questions/:id cleans up test Aptitude question');
    }

    // 15. Admin Add & Delete Exam Resource
    const addResource = await request('POST', '/api/resources', {
      subject: 'DBMS',
      branch: 'IT',
      sem: 3,
      resourceType: 'notes',
      title: 'DBMS Concurrency Control Test Notes',
      url: 'https://example.com/dbms-concurrency.pdf'
    });
    assert(addResource.status === 201 && addResource.data?.resource?._id, 'POST /api/resources creates exam resource with direct link');
    if (addResource.data?.resource?._id) {
      const delRes = await request('DELETE', `/api/resources/${addResource.data.resource._id}`);
      assert(delRes.status === 200, 'DELETE /api/resources/:id deletes exam resource');
    }

    // 16. Chatbot test
    const chat = await request('POST', '/chat', { message: 'Hello! What is NextStep?' });
    assert(chat.status === 200 && chat.data?.response, 'POST /chat connects to AI model and returns response');

    console.log(`\n================================`);
    console.log(`Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`================================\n`);

    if (server) {
      server.close(() => {
        process.exit(failed > 0 ? 1 : 0);
      });
    } else {
      process.exit(failed > 0 ? 1 : 0);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    if (server) server.close();
    process.exit(1);
  }
}

server = app.listen(PORT, () => {
  setTimeout(runTests, 800);
});
