const { Router } = require("express");
const {
  registerController,
  loginController,
  getMe,
  logout,
  VerifyEmailController,
} = require("../controllers/auth.controller");
const { githubCallback } = require("../controllers/githubAuth.controller");
const authUser = require("../Middlewares/auth.middleware");
const passport = require("passport");
const { generateToken } = require("../utils/generateToken");
const { setAuthCookie } = require("../utils/cookieOptions");

const userRouter = Router();

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);
userRouter.get("/getMe", authUser, getMe);
userRouter.post("/logout", logout);
userRouter.get("/verify-email/:token", VerifyEmailController);

userRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

// ── GET /google/callback ────────────────────────────
userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  (req, res) => {
    const token = generateToken(req.user);

    setAuthCookie(res, token);

    res.redirect(`${process.env.CLIENT_URL}/`);
  },
);

// ── GitHub OAuth ──
userRouter.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
);
userRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=github_failed`,
  }),
  githubCallback,
);

module.exports = userRouter;
