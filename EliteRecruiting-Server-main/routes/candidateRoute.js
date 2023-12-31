const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const getDb = require('../config/dbConfig');

router.get("/candidates/:jobId", async (req, res) => {
    try {
        const db = await getDb();
        const userCollection = db.collection("users");
        const jobCollection = db.collection("jobs");
        const { jobId } = req.params;

        const jobs = await jobCollection.findOne({ _id: ObjectId(jobId) });
        const applicantsEmail = jobs.applicants.map(applicant => applicant.email);
        const cursor = userCollection.find({ 'email': { '$in': applicantsEmail } });
        const result = await cursor.toArray();
        return res.send({ status: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

module.exports = router;
