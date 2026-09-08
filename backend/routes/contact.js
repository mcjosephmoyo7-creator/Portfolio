const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (request, response, next) => {
  const { name, email, subject, message } = request.body || {};
  const fields = { name, email, subject, message };

  if (Object.values(fields).some((value) => typeof value !== "string" || !value.trim())) {
    return response.status(400).json({ error: "Name, email, subject, and message are required." });
  }
  if (!emailPattern.test(email.trim())) {
    return response.status(400).json({ error: "Please provide a valid email address." });
  }
  if (name.length > 100 || email.length > 254 || subject.length > 200 || message.length > 5000) {
    return response.status(400).json({ error: "One or more fields are too long." });
  }
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.CONTACT_EMAIL) {
    return response.status(503).json({ error: "Email service is not configured." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: `Portfolio contact <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email.trim(),
      subject: subject.trim(),
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    });
    return response.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;