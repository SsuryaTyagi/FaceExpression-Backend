const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');
const connectToDb = require("./config/database"); // ← add this

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173","https://face-expression-frentend-eta.vercel.app"],
  credentials: true,
}));
app.use(cookieParser());
app.use(passport.initialize());

// Connect to DB on every request (no-op after first successful connect per warm instance)
app.use(async (req, res, next) => {
  try {
    await connectToDb();
    next();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(500).json({ error: "Database unavailable" });
  }
});

// Health check / root route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Face expression backend is running' });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

// Routers
const userRouter = require("./routes/user.routes");
const songRouter = require("./routes/song.routes");

app.use("/", userRouter);
app.use("/", songRouter);

module.exports = app;