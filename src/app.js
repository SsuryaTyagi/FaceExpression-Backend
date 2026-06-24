const express = require("express");
const  cookieParser = require('cookie-parser');
const cors = require('cors')
// const session      = require('express-session');
const passport     = require('passport');
require('./config/passport');

const app = express()
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(cookieParser())
app.use(passport.initialize());
// app.use(passport.session());

// Require Routers
const userRouter = require("./routes/user.routes");
const Router = require("./routes/song.routes");

app.use("/", userRouter)
app.use("/",Router)

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Face expression backend is running' });
});

module.exports = app