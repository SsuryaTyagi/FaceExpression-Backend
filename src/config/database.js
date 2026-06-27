const mongoose = require("mongoose");

let isConnected = false;

const connectToDb = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGOOSE, {
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  console.log("Database is connected..");
};

module.exports = connectToDb;