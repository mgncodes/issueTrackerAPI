const express = require('express');
const app = express();

require('dotenv').config('./.env');

const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const morgan = require('morgan');
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected to Database successfully");
});
mongoose.Promise = global.Promise;

// routes
const userRoute = require('./routes/userRoutes');
const issueRoute = require('./routes/issueRoutes');
app.use('/user', userRoute);
app.use('/issue', issueRoute);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// app.use((err, req, res, next) => {
//     res.status(err.status || 500).json({
//         errorMsg: err.message
//     });
// });

module.exports = app;