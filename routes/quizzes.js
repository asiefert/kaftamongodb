const express = require('express')
const router = express.Router();

let MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson');

let url = "mongodb://localhost:27017/";
const client = new MongoClient(url, { useUnifiedTopology: true });


async function init() {
    console.log(client.isConnected()); // false
    await client.connect();
    console.log(client.isConnected()); // true
}
init();


let dbName = 'quizDB';

router.route('/').get(function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('quizzes');
    collection.find({}).toArray(function (err, quizzes) {
        if (err) throw err;
        console.log('Found the following records:');
        console.log(quizzes);
        res.send(quizzes);
    });
});

router.route('/:id').get(function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('quizzes');
    collection.findOne({ _id: ObjectID(req.params.id) }).then(result => {
        if (result) {
            res.send(result);
            console.log(result);
        } else {
            res.send("Could not find specific quiz with that ID");
            console.log("Could not find specific quiz with that ID");
        }
    }
    )
}
);
router.route('/').post(function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('quizzes');
    collection.insertOne(req.body).then(result => {
        if (result) {
            res.send(`${req.body.quiz_name} was added to the collection`);
            console.log(`${req.body.quiz_name} was added to the collection`);
        } else {
            console.log("Could not add quiz to the collection");
        }
    })
});

router.route('/:id').delete(function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('quizzes');
    collection.deleteOne({ _id: ObjectID(req.params.id) }).then(result => {
        if (result) {
            console.log(`Item with id: ${req.params.id} deleted`);
            res.send(`Item with id: ${req.params.id} deleted`);
        } else {
            console.log("Could not remove quiz from the collection");
        }
    })
});

module.exports = router;