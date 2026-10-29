const express = require("express");
const router = express.Router();
const Branch = require("../models/branch.js");
const Branchsub = require("../models/branchsubject.js");
const Resource = require("../models/resourse.js");

// Get all subjects (used by frontend / overview)
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Branchsub.find({}).populate('subject').populate('branch');
    const uniqueSubjects = subjects.reduce((acc, curr) => {
      if (!curr.subject || !curr.subject._id) return acc;
      const existing = acc.find(s => s._id.toString() === curr.subject._id.toString());
      if (!existing) {
        acc.push({
          _id: curr.subject._id,
          subjectName: curr.subject.subjectName,
          subjectCode: curr.subject.subjectCode,
          resourceCount: 0
        });
      }
      return acc;
    }, []);
    
    // Add resource count for each subject
    const subjectsWithCount = await Promise.all(uniqueSubjects.map(async (subject) => {
      const resourceCount = await Resource.countDocuments({ subject_id: subject._id });
      return {
        ...subject,
        resourceCount
      };
    }));
    
    res.json(subjectsWithCount);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get resources for a specific subject (used by frontend)
router.get('/resources/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    const resources = await Resource.find({ subject_id: subjectId });
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get all branches
router.get('/branch', async (req, res) => {
  try {
    const blist = await Branch.find({});
    res.json(blist);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// Selection of sem and branch to get subjects
router.get('/:branch/:sem', async (req, res) => {
  try {
    const { branch, sem } = req.params;
    
    // Find the branch (case-insensitive)
    const escapedBranch = branch.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const branchDoc = await Branch.findOne({ 
      branchName: { $regex: new RegExp(`^${escapedBranch}$`, 'i') } 
    });

    if (!branchDoc) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    // Find subjects for the specific branch and semester
    const branchSubjects = await Branchsub.find({
      branch: branchDoc._id,
      semester: parseInt(sem, 10)
    }).populate('subject');
    
    // Filter out missing subjects and format the response
    const formattedSubjects = branchSubjects
      .filter(bs => bs.subject)
      .map(bs => ({
        _id: bs._id,
        subject: {
          _id: bs.subject._id,
          subjectName: bs.subject.subjectName,
          subjectCode: bs.subject.subjectCode
        }
      }));
    
    res.json(formattedSubjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get resources by branch, sem, subject id and type
router.get('/:branch/:sem/:subid/:type', async (req, res) => {
  try {
    const { subid, type } = req.params;
    
    // Support previous_paper and pyq synonymously
    let typeQuery;
    if (type === 'pyq' || type === 'previous_paper') {
      typeQuery = { $in: ['pyq', 'previous_paper'] };
    } else {
      typeQuery = type;
    }

    const reslink = await Resource.find({ 
      subject_id: subid, 
      resourceType: typeQuery 
    });

    res.json(reslink);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

module.exports = router;