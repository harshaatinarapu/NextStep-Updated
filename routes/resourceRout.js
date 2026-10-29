const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const Resource = require("../models/resourse.js");
const Subject = require("../models/subject.js");
const dotenv = require("dotenv");

const router = express.Router();
dotenv.config();

// Multer setup (store file in memory for direct upload to R2)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Helper to get S3 client
const getS3Client = () => {
  if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    return null;
  }
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
};

// List all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find({}).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch resources' });
  }
});

// Upload Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { subject, resourceType, title, branch, sem } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const s3 = getS3Client();
    if (!s3 || !process.env.R2_BUCKET_NAME) {
      return res.status(503).json({ 
        error: "Cloudflare R2 storage is not configured. Please set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in .env" 
      });
    }

    // Find subject ID if subject name provided
    let subDoc = null;
    if (subject) {
      subDoc = await Subject.findOne({ 
        subjectName: { $regex: new RegExp(`^${subject.trim()}$`, 'i') } 
      });
    }

    // Generate unique file name
    const fileId = uuidv4();
    const fileExt = req.file.originalname.split(".").pop();
    const safeBranch = branch || 'general';
    const safeSubject = subject || 'general';
    const safeType = resourceType || 'notes';
    const fileName = `${safeBranch}/${safeSubject}/${safeType}/${fileId}.${fileExt}`;

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

    // Public URL for the file
    const publicUrlBase = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
    const fileUrl = publicUrlBase ? `${publicUrlBase}/${fileName}` : fileName;

    // Save in MongoDB
    const resource = new Resource({
      subject_id: subDoc ? subDoc._id : null,
      subject: subject || (subDoc ? subDoc.subjectName : ''),
      branch: branch || '',
      sem: sem ? parseInt(sem, 10) : undefined,
      resourceType: safeType,
      title,
      url: fileUrl,
      fileUrl: fileUrl,
      uploadedBy: req.user?._id || null,
    });

    await resource.save();

    res.status(201).json({
      message: "File uploaded successfully",
      resource,
    });
  } catch (err) {
    console.error("Resource upload error:", err);
    res.status(500).json({ error: err.message || "File upload failed" });
  }
});

module.exports = router;
