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

    // 12. Chatbot test
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
