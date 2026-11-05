const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const Branch = require("../../models/branch");
const Subject = require("../../models/subject");
const Branchsub = require("../../models/branchsubject");
const subjects = require("./itSemester7Subjects");

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nextstep";

async function seedItSemester7() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB.");

    const branch = await Branch.findOne({ branchName: "IT" });
    if (!branch) {
      throw new Error('IT branch not found. Run "npm run seed" to initialize the database.');
    }

    let addedSubjects = 0;
    let addedMappings = 0;

    for (const subjectName of subjects) {
      let subject = await Subject.findOne({ subjectName });
      if (!subject) {
        subject = await Subject.create({ subjectName });
        addedSubjects++;
      }

      const mapping = await Branchsub.findOne({
        branch: branch._id,
        subject: subject._id,
        semester: 7
      });

      if (!mapping) {
        await Branchsub.create({
          branch: branch._id,
          subject: subject._id,
          semester: 7
        });
        addedMappings++;
      }
    }

    console.log(`Added ${addedSubjects} subjects and ${addedMappings} IT Semester 7 mappings.`);
  } finally {
    await mongoose.disconnect();
  }
}

seedItSemester7().catch(error => {
  console.error("IT Semester 7 seeding failed:", error);
  process.exitCode = 1;
});
