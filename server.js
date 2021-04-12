//Requires
let express = require('express');
let app = express();
const apiRouterQuizzes = require('./routes/quizzes.js');

var api = express.Router();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
})

//Set path for API
app.use('/api/v1', api);

//Use routes from api. Normally this would be protected by authorization
api.use('/quizzes', apiRouterQuizzes);

//Default path
app.get('/', (req, res) => {
    res.send("Hello from the mongo API server");
});

var server = app.listen(4000, function () {
    console.log("Server running...");
});

module.exports = app;