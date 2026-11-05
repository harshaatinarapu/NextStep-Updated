# NextStep 🎓

> **All-in-One Engineering Semester Exam Preparation & Campus Placement Portal**

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6.0+-brightgreen.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

NextStep is a production-ready, full-stack web platform built for engineering students to master both university semester examinations and competitive campus placement interviews. It consolidates syllabus-oriented study materials with structured problem-solving tracks from **LeetCode Top Interview 150** and **IndiaBIX Quantitative Aptitude**, reinforced with an integrated **Gemini AI chatbot assistant**.

---

## 🌟 Key Features

### 1. 🎯 Placement Preparation Track
- **LeetCode Top Interview 150**: 150 essential DSA interview problems structured across **23 subtopics**:
  - Array / String (24 problems)
  - Two Pointers, Sliding Window, Matrix, Hashmap, Intervals, Stack
  - Linked List, Binary Tree General, BST, BFS, DFS
  - Graph General, Graph BFS, Trie, Backtracking, Divide & Conquer, Kadane's Algorithm
  - Binary Search, Heap / Priority Queue, Bit Manipulation, Math, 1D DP, Multidimensional DP
- **IndiaBIX Quantitative Aptitude**: 77 placement questions divided into **20 core sections**:
  - *Time and Work*, *Pipes and Cistern*, *Time and Distance*, *Problems on Trains*, *Boats and Streams*
  - *Profit and Loss*, *Simple Interest*, *Compound Interest*, *Percentage*, *Ratio and Proportion*
  - *Partnership*, *Problems on Ages*, *Average*, *Problems on Numbers*, *H.C.F and L.C.M*
  - *Alligation or Mixture*, *Permutation and Combination*, *Probability*, *Clock*, *Calendar*
- **Company Tags & Difficulty Ratings**: Questions labeled with difficulty (`Easy`, `Medium`, `Hard`) and recruiter company tags (`TCS`, `Infosys`, `Wipro`, `Accenture`, `Cognizant`, `Deloitte`, `Capgemini`, `Amazon`, `Google`, etc.).
- **Live Progress Tracking**: Persistent checkbox marking with real-time percentage completion calculation stored per student.
- **Direct Problem Links**: One-click deep links to practice on **LeetCode** and **IndiaBIX**.

---

### 2. 📚 Semester Exam Preparation (Branch & Sem Wise)
- **10 Engineering Branches Supported**: IT, CSE, ECE, EEE, MECH, CIVIL, CSE-AIML, CSE-CS, CSE-IOT, CSE-DS.
- **Semester Filter (Sem 1 to 8)**: Seamless navigation to find exact subjects mapped to the chosen branch and semester.
- **4 Types of Study Materials**:
  - 📝 **Lecture Notes & Summaries**
  - 📄 **Previous Year Question Papers (PYQs)**
  - 🎥 **Curated Video Playlists**
  - 📖 **Recommended Reference Textbooks**

---

### 3. 🤖 Interactive AI Study Assistant
- Embedded conversational study tutor accessible directly inside the portal.
- Powered by **Google Gemini API** (`/chat`).
- Helps students understand complex theoretical concepts, debug code, and walk through aptitude formulas.

---

### 4. 🔐 Authentication & Role-Based Access Control
- Secure **JWT (JSON Web Token)** authentication supporting both HTTP-only cookies and Authorization headers.
- Passwords hashed with **bcryptjs**.
- Distinct roles:
  - **Student (`user`)**: Access exam notes, question papers, and placement tracks.
  - **Admin (`admin`)**: Upload new study resources, manage branch-subject mappings, and maintain questions.

---

### 5. ☁️ Cloudflare R2 / AWS S3 Cloud Storage
- Cloud object storage integration using `@aws-sdk/client-s3` for uploading and streaming exam PDFs, notes, and question papers.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 18, React Router DOM v6, Axios, FontAwesome Icons, Custom Responsive CSS |
| **Backend** | Node.js, Express.js (v5), Cookie-Parser, CORS, Multer |
| **Database** | MongoDB, Mongoose ORM |
| **Authentication** | JWT (jsonwebtoken), bcryptjs, Secure Cookie sessions |
| **Cloud Storage** | Cloudflare R2 / AWS S3 SDK |
| **AI Integration** | Google Generative AI (Gemini API) |
| **Testing** | Custom End-to-End Automated API Test Suite (`test-suite.js`) |

---

## 📁 Project Structure

```text
NextStep/
├── .vscode/                     # VS Code launch and debug configurations
├── config/
│   └── db.js                    # MongoDB connection helper
├── frontend/                    # React 18 Single Page Application
│   ├── public/                  # Public assets, favicon, index.html
│   └── src/
│       ├── components/          # React components
│       │   ├── Dashboard.js     # Main hub (Student: Start Prep / Admin: Edit Prep)
│       │   ├── ExamPrep.js      # Student branch/sem selection & subject resources
│       │   ├── PlacementPrep.js # Student DSA (150) & Aptitude (IndiaBIX) tracker
│       │   ├── AdminPlacementPrep.js # Admin: Add questions to DSA & Aptitude topics
│       │   ├── AdminExamPrep.js # Admin: Upload notes, PYQs, videos & reference books
│       │   ├── Login.js         # Student/Admin sign-in & register
│       │   └── ApiTest.js       # Diagnostic health panel
│       ├── App.js               # Route definitions
│       ├── App.css              # Theme styling, responsive design & badges
│       └── index.js             # React entrypoint
├── middlewares/
│   └── protectmiddleware.js     # JWT verification & role authorization
├── models/
│   ├── branch.js                # Branch schema
│   ├── subject.js               # Subject schema
│   ├── branchsubject.js         # Branch-Subject-Semester mapping schema
│   ├── placementtopic.js        # Placement topics & subtopics schema
│   ├── placementquestion.js     # Question schema with company tags & difficulty
│   ├── placementprogress.js     # User completion progress tracking
│   ├── resourse.js              # Exam notes & question paper resources
│   └── userSchema.js            # User authentication schema
├── routes/
│   ├── loginin.js               # /api/auth routes (login, register, me, logout)
│   ├── examprepRoute.js         # /api/examprep routes (branch, sem, subject notes)
│   ├── placementprepRoute.js    # /api/placementprep routes (topics, subtopics, questions)
│   └── resourceRout.js          # /api/resources routes (upload & list)
├── scripts/
│   └── seed/
│       ├── index.js             # Comprehensive MongoDB seeder script
│       ├── leetcodeTop150Data.js# 150 LeetCode problems across 23 categories
│       └── indiabixAptitudeData.js # 77 IndiaBIX questions across 20 sections
├── .env.example                 # Template for environment configuration
├── .gitignore                   # Ignored files (node_modules, .env, build)
├── app.js                       # Express app configuration & server setup
├── dev.js                       # Unified runner (spawns backend + React frontend)
├── package.json                 # Backend dependencies & npm scripts
└── test-suite.js                # End-to-end API verification suite (14 test cases)
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection URI)
- Git

---

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/harshaatinarapu/NextStep-Updated.git
   cd NextStep-Updated
   ```

2. **Install Backend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the root folder based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your settings:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/nextstep
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   GEMINI_API_KEY=your_google_gemini_api_key_optional

   # Cloudflare R2 / S3 (optional for local dev)
   R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=your_bucket_name
   R2_PUBLIC_URL=https://pub-your-bucket.r2.dev
   ```

---

### Database Seeding

Populate the database with branches, subjects, mappings, the 150 LeetCode Top Interview problems, and the 20 IndiaBIX Aptitude sections:

```bash
npm run seed
```

To add the IT Semester 7 subjects to an existing database without clearing its data, run:

```bash
npm run seed:it-semester-7
```

This adds Linux Programming, Cloud Computing, Automata theory and compiler design, Devops, Advanced Entrepreneurship, Products and Services, and Cryptography and Network Security. The command is safe to rerun.

Output:
```text
🌱 Starting NextStep database seeding...
 Connected to MongoDB: mongodb://127.0.0.1:27017/nextstep
🧹 Cleared existing database records.
 Created 10 branches.
 Created 23 subjects.
 Created 135 branch-subject mappings.
 Created 8 sample resources.
 Created 20 Aptitude sections with 77 questions from IndiaBIX.
 Created 23 DSA subtopics with 150 questions from LeetCode Top Interview 150.
 Inserted 229 total placement questions.
 Created test users:
   - Student: test@example.com / password123
   - Admin:   admin@example.com / admin123
 Seeding completed successfully!
```

---

### Running the Application

You can start both the backend (`http://localhost:5000`) and the React frontend (`http://localhost:3000`) with a single command:

```bash
npm run dev
```

Alternatively:
- **Backend Only**: `npm start`
- **Frontend Only**: `cd frontend && npm start`
- **VS Code**: Press `F5` and select **"Start Full App (Backend + Frontend)"**.

Once running:
- Open your browser to **[http://localhost:3000](http://localhost:3000)**.

---

### 🔑 Default Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Student** | `test@example.com` | `password123` |
| **Admin** | `admin@example.com` | `admin123` |

---

## 🧪 Testing

Run the automated end-to-end API test suite:

```bash
npm test
```

Verifies:
- Server health check (`/api/health`)
- Branch listings (`/api/branches`)
- User authentication and JWT verification (`/api/auth/login`, `/api/auth/me`)
- Placement Topics (`/api/placementprep/topics`)
- DSA Subtopics & Questions (`/api/placementprep/topics/dsa`, `/api/placementprep/topics/dsa/Arrays`)
- IndiaBIX Aptitude Sections & Questions (`/api/placementprep/topics/aptitude`, `/api/placementprep/topics/aptitude/Time and Work`)
- Exam Prep Subjects & Semesters (`/api/examprep/IT/3`)
- Subject Notes retrieval (`/api/examprep/IT/3/:subid/notes`)
- Resource listings (`/api/resources`)
- AI Chatbot response (`/chat`)

---

## 📡 API Reference Overview

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login user & issue JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user details | Private |
| `POST` | `/api/auth/logout` | Clear auth token cookie | Private |

### 2. Placement Preparation (`/api/placementprep`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/placementprep/topics` | Get top-level topics (DSA, Aptitude, Core) | Public |
| `GET` | `/api/placementprep/topics/dsa` | Get all 23 DSA subtopics with problem counts | Public |
| `GET` | `/api/placementprep/topics/dsa/:subtopic` | Get questions for a specific DSA category | Public |
| `GET` | `/api/placementprep/topics/aptitude` | Get all 20 IndiaBIX Aptitude sections with counts | Public |
| `GET` | `/api/placementprep/topics/aptitude/:subtopic` | Get questions for a specific Aptitude section | Public |
| `GET` | `/api/placementprep/questions/:topicId` | Get questions by topic/subtopic ObjectId | Public |
| `GET` | `/api/placementprep/subtopics/:parentId` | Generic subtopics fetcher by parent topic ID | Public |
| `POST` | `/api/placementprep/questions` | Admin: Add question with title, URL, difficulty & tags | Private |
| `DELETE` | `/api/placementprep/questions/:id` | Admin: Delete question by ID | Private |

### 3. Exam Preparation (`/api/examprep`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/examprep/subjects` | Get all subjects across all branches | Public |
| `GET` | `/api/examprep/:branch/:sem` | Get subjects for a specific branch & semester | Public |
| `GET` | `/api/examprep/:branch/:sem/:subid/:type` | Get specific resources (`notes`, `pyq`, `video`, `book`) | Public |

### 4. AI Study Assistant (`/chat`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/chat` | Send a prompt to the AI study chatbot | Public |

---

## 🤝 Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m "Add NewFeature"`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📄 License
This project is licensed under the **ISC License**.
