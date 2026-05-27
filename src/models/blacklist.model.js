const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "token in required."],
    },
  },
  {
    timestamps: true,
  },
);

const blacklistModul = mongoose.model("blacklist", blacklistSchema);

module.exports = blacklistModul;
