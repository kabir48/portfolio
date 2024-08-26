const express = require("express");
const router = require("./src/route/app");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require("cookie-parser");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const dotEnv = require('dotenv');
dotEnv.config({
    path: './config.env'
});
const app = express();

// MongoDB connection
const uriSession = "mongodb+srv://worldacademy:ward1234@cluster0.nm53krl.mongodb.net/portfolio?retryWrites=true&w=majority";

let uri="mongodb+srv://<username>:<password>@cluster0.nm53krl.mongodb.net/portfolio?retryWrites=true&w=majority";
let options={user:process.env.DB_USER,pass:process.env.DB_PASSWORD,autoIndex:true}
mongoose.connect(uri, options)
    .then(() => console.log('Mongo DB Connected Successfully!'));

// Session setup
app.use(session({
    secret: 'WARDACADEMY-1234',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: uriSession }),
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(bodyParser.json());

// Request rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200
});
app.use(limiter);
app.set('etag', false);

// API Routes
app.use('/api/v1', router);

// Undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        status: "Fail",
        data: "Undefined URL"
    });
});

module.exports = app;
