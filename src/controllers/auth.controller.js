require("dotenv").config();
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
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
    });

    const token = generateToken(user);
    res.cookie("token", token);

    res.status(201).json({
      message: "user successfully register",
      user: {
        username: user.username,
        email: user.email,
      },
    });
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

    console.log(email, password);

    if ((!username && !email) || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const User = await userModel
      .findOne({
        $or: [{ username: username }, { email: email }],
      })
      .select("+password");

    if (!User) {
      return res.status(404).json({
        message: "user not found.",
      });
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

module.exports = {
  registerController,
  loginController,
  getMe,
  logout,
};
