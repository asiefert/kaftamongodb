//Requires
let express = require('express');
let app = express();
const apiRouterQuizzes = require('./routes/quizzes.js');

var api = express.Router();

app.use(express.json());

//Set path for API
app.use('/api/v1', api);

//Use routes from api. Normally this would be protected by authorization
api.use('/quizzes', apiRouterQuizzes);

//Default path
app.get('/', (req, res) => {
    res.send("Hello from the mongo API server")
});

var server = app.listen(4000, function () {
    console.log("Server running...");
});

module.exports = app;