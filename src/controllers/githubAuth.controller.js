const { generateToken } = require("../utils/generateToken");

const githubCallback = (req, res) => {
  const token = generateToken(req.user);

  res.cookie('token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   3 * 24 * 60 * 60 * 1000,
  });

  res.redirect(`${process.env.CLIENT_URL}/`);
};

module.exports = { githubCallback };