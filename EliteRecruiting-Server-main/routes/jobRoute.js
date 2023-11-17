const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const getDb = require('../config/dbConfig');

router.get("/applied-jobs/:email", async (req, res) => {
    try {
        const db = await getDb();
        const jobCollection = db.collection("jobs");
        const email = req.params.email;
        const query = { applicants: { $elemMatch: { email } } };
        const result = await jobCollection.find(query).toArray();

        res.send({ status: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

router.get("/applied-jobs/:email/job/:jobId", async (req, res) => {
    try {
        const db = await getDb();
        const jobCollection = db.collection("jobs");
        const email = req.params.email;
        const jobId = req.params.jobId;
        const query = { _id: ObjectId(jobId), applicants: { $elemMatch: { email } } };
        const result = await jobCollection.find(query).project({ applicants: 0 }).toArray();

        res.send({ status: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

router.get("/jobs", async (req, res) => {
    try {
        const db = await getDb();
        const jobCollection = db.collection("jobs");
        const result = await jobCollection.find({}).toArray();
        res.send({ status: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

router.get("/employee-jobs/:email", async (req, res) => {
    try {
        const db = await getDb();
        const jobCollection = db.collection("jobs");
        const { email } = req.params;
        const result = await jobCollection.find({ 'postedBy.email': email }).toArray();
        res.send({ status: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

router.get("/job/:id", async (req, res) => {
    try {
        const db = await getDb();
        const jobCollection = db.collection("jobs");
        const id = req.params.id;

        const result = await jobCollection.findOne({ _id: ObjectId(id) });
        res.send({ status: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

router.post("/job", async (req, res) => {
    try {
        const db = await getDb();
        const jobCollection = db.collection("jobs");
        const job = req.body;

        const result = await jobCollection.insertOne(job);
        res.send({ status: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

module.exports = router;