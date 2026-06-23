const express = require("express");
const router =express.Router();
const Branch= require("../models/branch.js");
const Branchsub=require("../models/branchsubject.js");
const Resource = require("../models/resourse.js");

// Get all subjects (used by frontend)
router.get('/subjects', async(req,res)=>{
    try {
        const subjects = await Branchsub.find({}).populate('subject').populate('branch');
        const uniqueSubjects = subjects.reduce((acc, curr) => {
            const existing = acc.find(s => s.subject._id.toString() === curr.subject._id.toString());
            if (!existing) {
                acc.push({
                    _id: curr.subject._id,
                    subjectName: curr.subject.subjectName,
                    subjectCode: curr.subject.subjectCode,
                    resourceCount: 0 // Will be calculated
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
router.get('/resources/:subjectId', async(req,res)=>{
    try {
        const { subjectId } = req.params;
        const resources = await Resource.find({ subject_id: subjectId });
        res.json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

router.get('/branch', async(req,res)=>{
    const blist=await Branch.find({});
    res.json(blist);
});

//selection of sem and types of notes(pyqs, notes)
router.get('/:branch/:sem',async(req,res)=>{
    try {
        const {branch,sem} = req.params;
        
        // Find the branch first
        const branchDoc = await Branch.findOne({branchName: branch});
        if (!branchDoc) {
            return res.status(404).json({error: 'Branch not found'});
        }
        
        // Find subjects for the specific branch and semester
        const branchSubjects = await Branchsub.find({
            branch: branchDoc._id,
            semester: parseInt(sem)
        }).populate('subject');
        
        // Format the response to match frontend expectations
        const formattedSubjects = branchSubjects.map(bs => ({
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
        res.status(500).json({error: 'Failed to fetch subjects'});
    }
});
router.get('/:branch/:sem/:subid/:type',async(req,res)=>{
    try {
        const {subid,type}=req.params;
        const reslink=await Resource.find({subject_id:subid,resourceType:type});
        res.json(reslink);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({error: 'Failed to fetch resources'});
    }
});



module.exports=router;