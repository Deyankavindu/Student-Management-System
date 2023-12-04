const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://pamudithawm:pamu2001@cluster0.ancftyz.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        // Specify the database and collection
        const database = client.db("StudentDB");
        const collection = database.collection("students");

        // Query and log the data from the 'students' collection
        const result = await collection.find({}).toArray();
        console.log("Data in 'students' collection:", result);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
