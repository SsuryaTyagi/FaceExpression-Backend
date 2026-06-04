const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (email, name, token) => {
  const verifyURL = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: `"FaceExpression" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family:Arial; max-width:500px; margin:auto; padding:30px;">
        <h2>Hello ${name}!</h2>
        <p>Click the button below to verify your email. Link expires in 24 hours.</p>
        <a href="${verifyURL}"
           style="background:#7c3aed; color:white; padding:12px 28px;
                  border-radius:8px; text-decoration:none; font-weight:bold;">
          Verify Email
        </a>
        <p style="color:#999; margin-top:20px; font-size:13px;">
          If you didn't register, ignore this email.
        </p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail };