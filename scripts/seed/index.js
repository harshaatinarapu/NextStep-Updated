const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const Branch = require("../../models/branch");
const Subject = require("../../models/subject");
const Branchsub = require("../../models/branchsubject");
const PlacementTopic = require("../../models/placementtopic");
const PlacementQuestion = require("../../models/placementquestion");
const Resource = require("../../models/resourse");
const User = require("../../models/userSchema");
const leetcodeTop150 = require("./leetcodeTop150Data");
const indiabixAptitude = require("./indiabixAptitudeData");

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nextstep";

async function seed() {
  console.log("🌱 Starting NextStep database seeding...");
  await mongoose.connect(mongoURI);
  console.log(" Connected to MongoDB:", mongoURI);

  // Clear existing collections
  await Promise.all([
    Branch.deleteMany({}),
    Subject.deleteMany({}),
    Branchsub.deleteMany({}),
    PlacementTopic.deleteMany({}),
    PlacementQuestion.deleteMany({}),
    Resource.deleteMany({}),
    User.deleteMany({})
  ]);
  console.log("🧹 Cleared existing database records.");

  // 1. Seed Branches
  const branchNames = [
    "IT", "CSE", "ECE", "EEE", "MECH", "CIVIL",
    "CSE-AIML", "CSE-CS", "CSE-IOT", "CSE-DS"
  ];
  const branchDocs = {};
  for (const name of branchNames) {
    branchDocs[name] = await Branch.create({ branchName: name });
  }
  console.log(` Created ${Object.keys(branchDocs).length} branches.`);

  // 2. Seed Subjects
  const subjectsData = [
    { subjectName: "PSUC", subjectCode: "9HC01" },
    { subjectName: "EC", subjectCode: "9HC04" },
    { subjectName: "MAC", subjectCode: "9HC11" },
    { subjectName: "EELS", subjectCode: "9HC02" },
    { subjectName: "EP", subjectCode: "9HC07" },
    { subjectName: "DS", subjectCode: "9EC01" },
    { subjectName: "AC", subjectCode: "9HC12" },
    { subjectName: "BEEE", subjectCode: "9AC48" },
    { subjectName: "EG", subjectCode: "9BC01" },
    { subjectName: "DBMS", subjectCode: "9FC04" },
    { subjectName: "DAA", subjectCode: "9FC05" },
    { subjectName: "OS", subjectCode: "9FC06" },
    { subjectName: "CN", subjectCode: "9FC07" },
    { subjectName: "SE", subjectCode: "9FC08" },
    { subjectName: "COA", subjectCode: "9FC09" },
    { subjectName: "Java OOP", subjectCode: "9FC10" }
  ];

  const subjectDocs = {};
  for (const sub of subjectsData) {
    subjectDocs[sub.subjectName] = await Subject.create(sub);
  }
  console.log(` Created ${Object.keys(subjectDocs).length} subjects.`);

  // 3. Seed Branch-Subject associations
  const techBranches = ["IT", "CSE", "CSE-AIML", "CSE-CS", "CSE-IOT", "CSE-DS", "ECE", "EEE"];
  const branchsubEntries = [];

  // Semester 1
  const sem1Subs = ["PSUC", "EC", "MAC", "EELS", "BEEE"];
  for (const b of techBranches) {
    for (const s of sem1Subs) {
      if (branchDocs[b] && subjectDocs[s]) {
        branchsubEntries.push({
          branch: branchDocs[b]._id,
          subject: subjectDocs[s]._id,
          semester: 1
        });
      }
    }
  }

  // Semester 2
  const sem2Subs = ["EP", "DS", "AC", "EG"];
  for (const b of techBranches) {
    for (const s of sem2Subs) {
      if (branchDocs[b] && subjectDocs[s]) {
        branchsubEntries.push({
          branch: branchDocs[b]._id,
          subject: subjectDocs[s]._id,
          semester: 2
        });
      }
    }
  }

  // Semester 3
  const sem3Subs = ["DBMS", "DAA", "Java OOP", "COA"];
  for (const b of techBranches) {
    for (const s of sem3Subs) {
      if (branchDocs[b] && subjectDocs[s]) {
        branchsubEntries.push({
          branch: branchDocs[b]._id,
          subject: subjectDocs[s]._id,
          semester: 3
        });
      }
    }
  }

  // Semester 4
  const sem4Subs = ["OS", "CN", "SE"];
  for (const b of techBranches) {
    for (const s of sem4Subs) {
      if (branchDocs[b] && subjectDocs[s]) {
        branchsubEntries.push({
          branch: branchDocs[b]._id,
          subject: subjectDocs[s]._id,
          semester: 4
        });
      }
    }
  }

  await Branchsub.insertMany(branchsubEntries);
  console.log(` Created ${branchsubEntries.length} branch-subject mappings.`);

  // 4. Seed Resources (Sample study material for subjects)
  const sampleResources = [
    {
      subject_id: subjectDocs["DBMS"]._id,
      subject: "DBMS",
      branch: "IT",
      sem: 3,
      resourceType: "notes",
      title: "DBMS Complete Lecture Notes & Unit Summaries",
      url: "https://www.geeksforgeeks.org/dbms/",
      fileUrl: "https://www.geeksforgeeks.org/dbms/"
    },
    {
      subject_id: subjectDocs["DBMS"]._id,
      subject: "DBMS",
      branch: "IT",
      sem: 3,
      resourceType: "previous_paper",
      title: "DBMS End-Semester Question Paper (2024)",
      url: "https://example.com/papers/dbms-2024.pdf",
      fileUrl: "https://example.com/papers/dbms-2024.pdf"
    },
    {
      subject_id: subjectDocs["DBMS"]._id,
      subject: "DBMS",
      branch: "IT",
      sem: 3,
      resourceType: "video",
      title: "DBMS Complete Course Playlist",
      url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_CUQ-FXxgzKQ1dwr_ZJWZ",
      fileUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_CUQ-FXxgzKQ1dwr_ZJWZ"
    },
    {
      subject_id: subjectDocs["DBMS"]._id,
      subject: "DBMS",
      branch: "IT",
      sem: 3,
      resourceType: "book",
      title: "Database System Concepts by Silberschatz & Korth",
      url: "https://www.db-book.com/",
      fileUrl: "https://www.db-book.com/"
    },
    {
      subject_id: subjectDocs["DS"]._id,
      subject: "DS",
      branch: "IT",
      sem: 2,
      resourceType: "notes",
      title: "Data Structures Hand-written Class Notes",
      url: "https://www.geeksforgeeks.org/data-structures/",
      fileUrl: "https://www.geeksforgeeks.org/data-structures/"
    },
    {
      subject_id: subjectDocs["DS"]._id,
      subject: "DS",
      branch: "IT",
      sem: 2,
      resourceType: "previous_paper",
      title: "Data Structures Previous Year Question Paper (2023)",
      url: "https://example.com/papers/ds-2023.pdf",
      fileUrl: "https://example.com/papers/ds-2023.pdf"
    },
    {
      subject_id: subjectDocs["PSUC"]._id,
      subject: "PSUC",
      branch: "CSE",
      sem: 1,
      resourceType: "notes",
      title: "C Programming and Problem Solving Fundamentals",
      url: "https://www.learn-c.org/",
      fileUrl: "https://www.learn-c.org/"
    },
    {
      subject_id: subjectDocs["OS"]._id,
      subject: "OS",
      branch: "CSE",
      sem: 4,
      resourceType: "notes",
      title: "Operating Systems Comprehensive Notes",
      url: "https://www.geeksforgeeks.org/operating-systems/",
      fileUrl: "https://www.geeksforgeeks.org/operating-systems/"
    }
  ];

  await Resource.insertMany(sampleResources);
  console.log(` Created ${sampleResources.length} sample resources.`);

  // 5. Seed Placement Topics
  const mainAptitude = await PlacementTopic.create({
    name: "Aptitude",
    description: "Quantitative, Logical Reasoning & Verbal ability questions for preliminary screening rounds",
    order: 1,
    parentId: null
  });

  const mainDSA = await PlacementTopic.create({
    name: "DSA",
    description: "Data Structures & Algorithms interview questions curated from LeetCode Top Interview 150",
    order: 2,
    parentId: null
  });

  const mainCore = await PlacementTopic.create({
    name: "Core Subjects",
    description: "OS, DBMS, Computer Networks & System Design essentials",
    order: 3,
    parentId: null
  });

  // 6. Seed Aptitude Subtopics and Questions from IndiaBIX
  const allQuestionsData = [];
  let totalAptitudeQuestions = 0;

  for (const section of indiabixAptitude) {
    const subTopicDoc = await PlacementTopic.create({
      name: section.name,
      description: section.description,
      order: section.order,
      parentId: mainAptitude._id
    });

    for (const q of section.questions) {
      allQuestionsData.push({
        topicId: subTopicDoc._id,
        question: q.question,
        link: q.link,
        difficulty: q.difficulty,
        companyTags: q.companyTags || []
      });
      totalAptitudeQuestions++;
    }
  }

  console.log(` Created ${indiabixAptitude.length} Aptitude sections with ${totalAptitudeQuestions} questions from IndiaBIX.`);

  // 7. Seed DSA Subtopics and Questions from LeetCode Top Interview 150
  let totalDsaQuestions = 0;

  for (const category of leetcodeTop150) {
    const subTopicDoc = await PlacementTopic.create({
      name: category.name,
      description: category.description,
      order: category.order,
      parentId: mainDSA._id
    });

    for (const q of category.questions) {
      allQuestionsData.push({
        topicId: subTopicDoc._id,
        question: q.question,
        link: q.link,
        difficulty: q.difficulty,
        companyTags: q.companyTags || []
      });
      totalDsaQuestions++;
    }
  }

  console.log(` Created ${leetcodeTop150.length} DSA subtopics with ${totalDsaQuestions} questions from LeetCode Top Interview 150.`);

  // Questions under Core Subjects
  allQuestionsData.push(
    {
      topicId: mainCore._id,
      question: "Explain ACID Properties and Transaction Isolation Levels",
      link: "https://www.geeksforgeeks.org/acid-properties-in-dbms/",
      difficulty: "Medium",
      companyTags: ["Amazon", "Oracle"]
    },
    {
      topicId: mainCore._id,
      question: "Process vs Thread and Inter-Process Communication (IPC)",
      link: "https://www.geeksforgeeks.org/difference-between-process-and-thread/",
      difficulty: "Easy",
      companyTags: ["Microsoft", "Cisco"]
    }
  );

  await PlacementQuestion.insertMany(allQuestionsData);
  console.log(` Inserted ${allQuestionsData.length} total placement questions.`);

  // 8. Seed Users
  const testUser = await User.create({
    name: "Student User",
    email: "test@example.com",
    password: "password123",
    role: "user",
    branch: branchDocs["IT"]._id
  });

  const adminUser = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    branch: branchDocs["CSE"]._id
  });

  console.log(" Created test users:");
  console.log(`   - Student: test@example.com / password123`);
  console.log(`   - Admin:   admin@example.com / admin123`);

  console.log(" Seeding completed successfully!");
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
