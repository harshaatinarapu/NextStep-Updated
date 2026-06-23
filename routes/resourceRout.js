const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const Resource = require("../models/resourse.js"); // your schema
const dotenv = require("dotenv");
// const subject=require("../models/subject.js");
const Subject = require("../models/subject.js");

const router = express.Router();

dotenv.config(); 

// Multer setup (store file in memory for direct upload to R2)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudflare R2 Client
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT, // like https://<accountid>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

//Upload Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { subject, resourceType, title, branch, sem } = req.body;
    const sub_id=await Subject.findOne({subjectName:subject},"_id");
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Generate unique file name
    const fileId = uuidv4();
    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `${branch}/${subject}/${resourceType}/${fileId}.${fileExt}`;

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME, // bucket name
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

    // Public URL for the file
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    // Save in MongoDB
    const resource = new Resource({
      subject_id:sub_id,
      subject,
      resourceType,
      title,
      url: fileUrl,
      uploadedBy: req.user?._id || null, // if you have auth
    });

    await resource.save();
    console.log(resource);

    res.json({
      message: "File uploaded successfully",
      resource,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     console.log("File:", req.file);
//     console.log("Body:", req.body);

//     if (!req.file) {
//       return res.status(400).json({ error: "No file received" });
//     }

//     // Simulate success (skip R2 for now)
//     return res.json({ message: "File received successfully!", file: req.file.originalname });
//   } catch (err) {
//     console.error("Upload Error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// });


module.exports = router;
