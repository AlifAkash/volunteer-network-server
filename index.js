const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bm8ip.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const taskCollection = client.db("volunteerNetwork").collection("volunteerTask");
    const userTaskCollection = client.db("volunteerNetwork").collection("userTask");
    console.log("Connected");
    app.post("/addVolunteerTask", (req,res) => {
        const task = req.body;
        taskCollection.insertOne(task)
        .then(result => {
            res.send(result.insertedCount);
        })
    })

    app.post("/registeredUserTask", (req, res) => {
        const userTask = req.body;
        userTaskCollection.insertOne(userTask)
        .then(result => {
            res.send(result.insertedCount);
        })
        
    })

    app.get("/volunteerTasks", (req, res) => {
        taskCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get("/volunteerTask/:key", (req, res) => {
        taskCollection.find({key : req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.get("/registeredTask", (req,res) => {
        console.log(req.query.email);
        const queryEmail = req.query.email;
        userTaskCollection.find({ email: queryEmail })
        .toArray((err, documents) =>{
            res.send(documents);
        })
    })

});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})