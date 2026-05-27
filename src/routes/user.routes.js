const { Router } = require("express");
const {registerController, loginController, getMe, logout } = require("../controllers/auth.controller");
const authUser = require("../Middlewares/auth.middleware");
const passport = require('passport');

const userRouter = Router();

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/getMe", authUser, getMe);
userRouter.post("/logout", logout)

userRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);

// ── GET /api/auth/google/callback ────────────────────────────
userRouter.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }),
  (req, res) => {
    sendToken(res, req.user);
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
);

module.exports = userRouter;
