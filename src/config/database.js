require("dotenv").config();
const mongoose = require("mongoose");

const connectToDb = async () => {
  await mongoose
    .connect(process.env.MONGOOSE)
    .then(() => console.log("Database is connected.."))
    .catch(() => {
      console.log("data base is not connected");
    });
};

module.exports = connectToDb;
