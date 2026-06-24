const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173","https://face-expression-frentend-eta.vercel.app"],
  credentials: true,
}));
app.use(cookieParser());
app.use(passport.initialize());

// Health check / root route — define BEFORE other routers
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Face expression backend is running' });
});

// Routers
const userRouter = require("./routes/user.routes");
const Router = require("./routes/song.routes");

app.use("/", userRouter);
app.use("/", Router);

module.exports = app;