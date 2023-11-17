const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const getDb = require('../config/dbConfig');

router.patch("/apply", async (req, res) => {
    try {
        const db = await getDb();
        const jobCollection = db.collection("jobs");
        const { userId, jobId, email } = req.body;

        const filter = { _id: ObjectId(jobId) };
        const updateDoc = {
            $push: { applicants: { id: ObjectId(userId), email } },
        };

        const result = await jobCollection.updateOne(filter, updateDoc);

        if (result.acknowledged) {
            return res.send({ status: true, data: result });
        }

        res.send({ status: false });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

router.patch("/query", async (req, res) => {
    try {
        const db = await getDb();
        const jobCollection = db.collection("jobs");
        const { userId, jobId, email, question } = req.body;

        const filter = { _id: ObjectId(jobId) };
        const updateDoc = {
            $push: {
                queries: {
                    id: ObjectId(userId),
                    email,
                    question: question,
                    reply: [],
                },
            },
        };

        const result = await jobCollection.updateOne(filter, updateDoc);

        if (result?.acknowledged) {
            return res.send({ status: true, data: result });
        }

        res.send({ status: false });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

router.patch("/reply", async (req, res) => {
    try {
        const db = await getDb();
        const jobCollection = db.collection("jobs");
        const { userId, reply } = req.body;

        const filter = { "queries.id": ObjectId(userId) };

        const updateDoc = {
            $push: {
                "queries.$[user].reply": reply,
            },
        };
        const arrayFilter = {
            arrayFilters: [{ "user.id": ObjectId(userId) }],
        };

        const result = await jobCollection.updateOne(filter, updateDoc, arrayFilter);
        if (result.acknowledged) {
            return res.send({ status: true, data: result });
        }

        res.send({ status: false });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

module.exports = router;
