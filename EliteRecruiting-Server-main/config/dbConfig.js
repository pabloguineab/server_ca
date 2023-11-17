
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pabloguinea:Proyecto7-@jobportalapi.fjqn2c4.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { /* opciones */ });

let db;

client.connect(err => {
    if (err) {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1);
    }
    db = client.db("Elite-Recruit");
});

exports.getDb = function() {
    if (!db) {
        throw new Error("La base de datos no está conectada");
    }
    return db;
};
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

exports.getDb = async function() {
    await client.connect();
    return client.db("Elite-Recruit");
};

run().catch(console.dir);