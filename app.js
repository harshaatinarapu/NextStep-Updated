const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config(); // loads .env

const connectDB = require("./config/db");
const Branch = require("./models/branch.js");
const Subject = require("./models/subject.js");
const { protect } = require("./middlewares/protectmiddleware.js");

const resourceroute = require("./routes/resourceRout.js");
const exampreproute = require("./routes/examprepRoute.js");
const placementpreproute = require("./routes/placementprepRoute.js");
const registerloginroute = require("./routes/loginin.js");

const app = express();

// connect DB
connectDB();

const PORT = process.env.PORT || 5000;

// Cookie parser
app.use(cookieParser());

// CORS configuration (handles origin properly with credentials)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use("/api/resources", resourceroute);
app.use("/api/placementprep", protect, placementpreproute);
app.use("/api/auth", registerloginroute);
app.use("/api/examprep", protect, exampreproute);

// Branches endpoint
app.get("/api/branches", async (req, res) => {
  try {
    const branches = await Branch.find({});
    res.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// Development route to test API connectivity
app.get("/api/health", (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NextStep API is running',
    timestamp: new Date().toISOString()
  });
});

// AI chat bot route
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
  const { prompt, message } = req.body || {};
  const userText = typeof prompt === 'string' && prompt.trim() ? prompt.trim() : (typeof message === 'string' ? message.trim() : '');

  if (!userText) {
    return res.status(400).json({ error: "Invalid request", message: "'prompt' (or 'message') is required" });
  }

  // If no GEMINI_API_KEY or if placeholder/revoked key, return helpful assistant message
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here' || GEMINI_API_KEY.includes('AIzaSyBirZx69o6e0NeAagKAwnLGSSckn_4aP_A')) {
    return res.json({
      response: `Hello! I am your **NextStep AI Assistant**.\n\nTo enable full live Gemini responses, please generate a free Gemini API key at [Google AI Studio](https://aistudio.google.com/) and set \`GEMINI_API_KEY=your_key\` in your \`.env\` file.\n\nIn the meantime, you can explore:\n- **Placement Preparation**: DSA and Aptitude practice problems\n- **Exam Preparation**: Study notes, previous question papers, and syllabus materials for your branch and semester.`,
      paragraphs: ["AI Assistant running in offline/informational mode."]
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userText }]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('Gemini API Error:', errorText);
      return res.json({
        response: `⚠️ **AI Service Notice**: Unable to reach Google Gemini API (Status: ${response.status}). Please check your \`GEMINI_API_KEY\` in \`.env\`.\n\n*Your query*: "${userText}"`,
        paragraphs: [`API Status: ${response.status}`]
      });
    }

    const data = await response.json();

    if (data && Array.isArray(data.candidates) && data.candidates[0] && data.candidates[0].content) {
      const parts = data.candidates[0].content.parts || [];
      const firstPart = parts.find(p => typeof p.text === 'string' && p.text.length > 0);
      let rawText = firstPart ? firstPart.text : '';

      // Clean markdown text
      let cleanedText = rawText
        .trim()
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\t/g, '    ');

      let paragraphs = cleanedText.split('\n\n').map(p => p.trim()).filter(Boolean);

      res.json({ 
        response: cleanedText,
        paragraphs
      });
    } else {
      res.json({
        response: "Received response from Gemini, but content format was unexpected.",
        paragraphs: []
      });
    }

  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message
    });
  }
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  
  // Catch all handler for client-side routing (Express 5 syntax)
  app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

// Start server if not run by test runner
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
