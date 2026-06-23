const Subject=require("./models/subject.js");
const connectDB = require("./config/db.js");
const mongoose = require("mongoose");
const Branchsub=require("./models/branchsubject.js");
const Branch=require("./models/branch.js");

const data=[
    {
        subjectName:"EC",
        subjectCode:"9HC04",
    },
    {
        subjectName:"PSUC",
        subjectCode:"9HC01",
    },
    {
        subjectName:"MAC",
        subjectCode:"9HC11",
    },
    {
        subjectName:"EELS",
        subjectCode:"9HC01",
    },
    


    {
        subjectName:"EP",
        subjectCode:"9HC07",
    },
    {
        subjectName:"DS",
        subjectCode:"9EC01",
    },
    {
        subjectName:"AC",
        subjectCode:"9HC12",
    },
    {
        subjectName:"BEEE",
        subjectCode:"9AC48",
    },
    {
        subjectName:"EG",
        subjectCode:"9BC01",
    },
    
    
    
    
];


connectDB().then(async ()=>{
    try{
        const branchsubdata =[
            {
                branch: await Branch.findOne({branchName:"IT"},"_id"),
                subject: await Subject.findOne({subjectName:"PSUC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE"},"_id"),
                subject: await Subject.findOne({subjectName:"PSUC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-CS"},"_id"),
                subject: await Subject.findOne({subjectName:"PSUC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-DS"},"_id"),
                subject: await Subject.findOne({subjectName:"PSUC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"EEE"},"_id"),
                subject: await Subject.findOne({subjectName:"PSUC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"IT"},"_id"),
                subject: await Subject.findOne({subjectName:"EC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE"},"_id"),
                subject: await Subject.findOne({subjectName:"EC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-CS"},"_id"),
                subject: await Subject.findOne({subjectName:"EC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-DS"},"_id"),
                subject: await Subject.findOne({subjectName:"EC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"EEE"},"_id"),
                subject: await Subject.findOne({subjectName:"EC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"IT"},"_id"),
                subject: await Subject.findOne({subjectName:"MAC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE"},"_id"),
                subject: await Subject.findOne({subjectName:"MAC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-CS"},"_id"),
                subject: await Subject.findOne({subjectName:"MAC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-DS"},"_id"),
                subject: await Subject.findOne({subjectName:"MAC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"EEE"},"_id"),
                subject: await Subject.findOne({subjectName:"MAC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"IT"},"_id"),
                subject: await Subject.findOne({subjectName:"EELS"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE"},"_id"),
                subject: await Subject.findOne({subjectName:"EELS"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-CS"},"_id"),
                subject: await Subject.findOne({subjectName:"EELS"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-DS"},"_id"),
                subject: await Subject.findOne({subjectName:"EELS"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"EEE"},"_id"),
                subject: await Subject.findOne({subjectName:"EELS"},"_id"),
                semester: 1,
            },






            {
                branch: await Branch.findOne({branchName:"ECE"},"_id"),
                subject: await Subject.findOne({subjectName:"PSUC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-IOT"},"_id"),
                subject: await Subject.findOne({subjectName:"PSUC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-AIML"},"_id"),
                subject: await Subject.findOne({subjectName:"PSUC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"MECH"},"_id"),
                subject: await Subject.findOne({subjectName:"PSUC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CIVIL"},"_id"),
                subject: await Subject.findOne({subjectName:"PSUC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"ECE"},"_id"),
                subject: await Subject.findOne({subjectName:"MAC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-IOT"},"_id"),
                subject: await Subject.findOne({subjectName:"MAC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-AIML"},"_id"),
                subject: await Subject.findOne({subjectName:"MAC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"MECH"},"_id"),
                subject: await Subject.findOne({subjectName:"MAC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CIVIL"},"_id"),
                subject: await Subject.findOne({subjectName:"MAC"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"ECE"},"_id"),
                subject: await Subject.findOne({subjectName:"EELS"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-IOT"},"_id"),
                subject: await Subject.findOne({subjectName:"EELS"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-AIML"},"_id"),
                subject: await Subject.findOne({subjectName:"EELS"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"MECH"},"_id"),
                subject: await Subject.findOne({subjectName:"EELS"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CIVIL"},"_id"),
                subject: await Subject.findOne({subjectName:"EELS"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"ECE"},"_id"),
                subject: await Subject.findOne({subjectName:"EP"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-IOT"},"_id"),
                subject: await Subject.findOne({subjectName:"EP"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CSE-AIML"},"_id"),
                subject: await Subject.findOne({subjectName:"EP"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"MECH"},"_id"),
                subject: await Subject.findOne({subjectName:"EP"},"_id"),
                semester: 1,
            },
            {
                branch: await Branch.findOne({branchName:"CIVIL"},"_id"),
                subject: await Subject.findOne({subjectName:"EP"},"_id"),
                semester: 1,
            },

        ];








        // const result=await Subject.insertMany(data);
        // const result = await Subject.deleteMany({});
        // const result=await Branchsub.deleteMany({});
        // const result=await Branchsub.insertMany(branchsubdata);

        
        console.log("successfully inserted");
        process.exit();
    }catch(err){
        console.log(err);
        process.exit(1);
    }
})



// async function add() {
//     await Subject.insertMany(data);
//     console.log("Branch added successfully!");
// }
// add();