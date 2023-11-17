const express = require('express');
const router = express.Router();
const getDb = require('../config/dbConfig');

router.post("/user", async (req, res) => {
    try {
        const db = getDb();
        const userCollection = db.collection("users");
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al conectar con la base de datos");
    }
});

router.get("/user/:email", async (req, res) => {
    const email = req.params.email;

    const result = await userCollection.findOne({ email });

    if (result?.email) {
        return res.send({ status: true, data: result });
    }

    res.send({ status: false });
});

router.get("/users", async (req, res) => {
    const cursor = userCollection.find({});
    const result = await cursor.toArray();
    return res.send({ status: true, data: result });
});

module.exports = router