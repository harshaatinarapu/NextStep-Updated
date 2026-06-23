const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

const Branch = require("./models/branch.js");

const resourceroute = require("./routes/resourceRout.js");
const exampreproute = require("./routes/examprepRoute.js");
const placementpreproute = require("./routes/placementprepRoute.js");
const registerloginroute = require("./routes/loginin.js");

const cookieParser = require('cookie-parser');



//
const { protect } = require("./middlewares/protectmiddleware.js");

const { uploadToR2 } = require("./r2");

const cors = require("cors");
const Subject = require("./models/subject.js");


dotenv.config();   // loads .env

const app = express();

// connect DB
connectDB();


const PORT = process.env.PORT

// async function add(str) {
//     await Branch.create({
//         branchName: str
//     });
//     console.log("Branch added successfully!");
// }
// add("IT");y
// add("CSE");
// add("ECE");
// add("EEE");
// add("MECH");
// add("CIVIL");
// add("CSE-AIML");
// add("CSE-CS");
// add("CSE-IOT");
// add("CSE-DS");

// async function deleteAllBranches() {
//     try {
//         await Branch.deleteMany({});
//         console.log("All branches deleted successfully!");
//     } catch (err) {
//         console.error("Error deleting branches:", err);
//     }
// }
// deleteAllBranches();

// async function add(subname,subcode) {
//     await Subject.create({
//         subjectName:subname,
//         subjectCode:subcode,
//     });
//     console.log("Branch added successfully!");
// }
// add("DBMS","9FC04");

app.use(cookieParser());

// Middleware to clear problematic cookies and handle large headers
app.use((req, res, next) => {
  // Clear any cookies that might be too large
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    if (cookies.length > 5) { // If more than 5 cookies, clear them
      res.clearCookie('token');
      res.clearCookie('session');
      res.clearCookie('connect.sid');
    }
  }
  
  // Set headers to handle large requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
  credentials: true,
  optionsSuccessStatus: 200
}));


// API Routes (must come before static files)
app.use("/api/resources", resourceroute);
app.use("/api/placementprep/", protect, placementpreproute);
app.use("/api/auth/", registerloginroute);
app.use("/api/examprep/", protect, exampreproute);


const API_KEY = "AIzaSyBirZx69o6e0NeAagKAwnLGSSckn_4aP_A";
// Replace the existing chat endpoint with this corrected version
app.post("/chat", async (req, res) => {
  const { prompt, message } = req.body || {};
  const userText = typeof prompt === 'string' && prompt.trim() ? prompt.trim() : (typeof message === 'string' ? message.trim() : '');

  if (!userText) {
    return res.status(400).json({ error: "Invalid request", message: "'prompt' (or 'message') is required" });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY,
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
      console.error('API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && Array.isArray(data.candidates) && data.candidates[0] && data.candidates[0].content) {
      // res.json({
      //   response: data.candidates[0].content.parts[0].text
      // });


      const parts = data.candidates[0].content.parts || [];
      const firstPart = parts.find(p => typeof p.text === 'string' && p.text.length > 0);
      let rawText = firstPart ? firstPart.text : '';

      // --- CLEANUP WHILE KEEPING MARKDOWN ---
      let cleanedText = rawText
        .trim()                       // remove leading/trailing whitespace
        .replace(/\n{3,}/g, '\n\n')  // collapse 3+ newlines to 2
        .replace(/\t/g, '    ');      // replace tabs with spaces

      // Optional: split into paragraphs if needed for frontend
      let paragraphs = cleanedText.split('\n\n').map(p => p.trim()).filter(p => p);

      res.send({ 
        response: cleanedText,    // full text with markdown
        paragraphs               // optional structured array
      });



    } else {
      throw new Error('Unexpected response structure');
    }

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message
    });
  }
});





// API endpoint for branches
app.get("/api/branches", async (req, res) => {
  try {
    const branches = await Branch.find({});
    res.json(branches);
  } catch (error) {
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

// Serve static files from React app (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  
  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

app.get("/upload",async (req,res)=>{
  await uploadToR2("test.txt","This is the file i have created");
  res.send("file is uploaded successfully");
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
