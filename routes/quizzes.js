const express = require('express')
const router = express.Router();

let MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson');

let url = "mongodb://localhost:27017/";
const client = new MongoClient(url, { useUnifiedTopology: true });
let dbName = 'quizDB';


async function init() {
    // console.log(client.isConnected()); // false
    await client.connect();
    // console.log(client.isConnected()); // true
}

function checkIfExists() {
    const db = client.db(dbName);
  db.listCollections({name: 'quizzes'})
    .next(function(err,collinfo) {
        if (collinfo) {
            console.log('Quiz Collection Exists...');
        }
        else {
            db.createCollection('quizzes');
            console.log('Created quizzes collection...');
        }
    });
}
init();
checkIfExists();



//GET all
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
//GET id
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
//POST new
router.route('/').post(function (req, res) {
    console.log(req.body);
    const db = client.db(dbName);
    const collection = db.collection('quizzes');
    collection.insertOne(req.body).then(result => {
        if (result) {
            res.send(result);
            console.log(`${req.body.quiz_name} was added to the collection`);
        } else {
            console.log("Could not add quiz to the collection");
        }
    })
});

//TODO: Implement Update/PUT

//Delete quiz
router.route('/:id').delete(function (req, res) {
    const db = client.db(dbName);
    const collection = db.collection('quizzes');
    collection.deleteOne({ _id: ObjectID(req.params.id) }).then(result => {
        if (result) {
            console.log(`Item with id: ${req.params.id} deleted`);
            res.send(result);
        } else {
            console.log("Could not remove quiz from the collection");
        }
    })
});

module.exports = router;