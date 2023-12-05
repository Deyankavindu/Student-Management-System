const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import cors module

const app = express();
app.use(cors()); // Use cors middleware
app.use(express.json());

const uri = "mongodb+srv://pamudithawm:pamu2001@cluster0.ancftyz.mongodb.net/?retryWrites=true&w=majority";

app.post('/insert', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db("StudentDB");
        const collection = database.collection("students");
        const counters = database.collection("counters");

        // Get the current count
        let counter = await counters.findOne({ _id: "studentId" });

        if (!counter) {
            // If no counter exists, create one
            await counters.insertOne({ _id: "studentId", seq: 0 });
            counter = { seq: 0 };
        }

        // Increment the counter
        await counters.updateOne({ _id: "studentId" }, { $inc: { seq: 1 } });

        // Add the counter to the student data
        req.body.SID = counter.seq;

        // Modify the subjects array to only include the names of the checked subjects
        const checkedSubjects = req.body.Subjects.filter(subject => subject.checked).map(subject => subject.name);
        req.body.Subjects = checkedSubjects;

        const result = await collection.insertOne(req.body);
        res.status(201).json({ message: 'Data inserted successfully', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while inserting data', error: error.toString() });
    } finally {
        await client.close();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));