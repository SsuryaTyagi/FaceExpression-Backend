require("dotenv").config();
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("../services/email.service.js");
const {
  generateToken,
  verifyVerificationToken,
} = require("../utils/generateToken");
const redis = require("../config/cache");

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const isAlreadyExists = await userModel.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (isAlreadyExists) {
      return res.status(409).json({
        message:
          isAlreadyExists.email === email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
      verified: false,
    });

    const token = generateToken(user);
    await sendVerificationEmail(email, username, token);

    return res
      .status(201)
      .json({ message: "Check your email to verify your account." });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const loginController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // console.log(email, password);

    if ((!username && !email) || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const query = [];
    if (email) query.push({ email });
    if (username) query.push({ username });

    const User = await userModel.findOne({ $or: query }).select("+password");

    if (!User) {
      return res.status(404).json({
        message: "user not found.",
      });
    }
    // console.log("User:", User);
    // console.log("Verified Value:", User.verified);
    // console.log("Type:", typeof User.verified);
    
    if (!User.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    const validPass = await bcrypt.compare(password, User.password);

    if (!validPass) {
      return res.status(401).json({
        message: "invalid password",
      });
    }

    const token = generateToken(User);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "user successfully login",
      user: {
        username: User.username,
        email: User.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User fetched successfully",
    user,
  });
};
const logout = async (req, res) => {
  const token = req.cookies.token;

  res.clearCookie("token");

  await redis.set(token, Date.now().toString());

  res.status(200).json({
    message: "logout successfully",
  });
};

const VerifyEmailController = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = verifyVerificationToken(token);

    const user = await userModel.findOne({ _id: decoded.id });
    if (!user) return res.status(400).json({ message: "Invalid link" });
    if (user.verified)
      return res.status(400).json({ message: "Already verified" });

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    const msg =
      err.name === "TokenExpiredError" ? "Link expired" : "Invalid link";
    return res.status(400).json({ message: msg });
  }
};

module.exports = {
  registerController,
  loginController,
  getMe,
  logout,
  VerifyEmailController,
};
