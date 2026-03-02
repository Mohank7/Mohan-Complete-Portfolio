const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || 'true') === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function formatMailError(error) {
  const message = error && error.message ? String(error.message) : 'Unknown mail error.';
  const code = error && error.code ? String(error.code) : '';
  if (code) {
    return `${code}: ${message}`;
  }
  return message;
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(email).trim())) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const transporter = buildTransporter();
    if (!transporter) {
      return res.status(500).json({
        success: false,
        message: 'Email transport not configured. Set SMTP_* values in .env.',
      });
    }

    const receiver = process.env.CONTACT_RECEIVER || 'mohankmy18@gmail.com';
    const fromAddress = process.env.FROM_EMAIL || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `Portfolio Contact <${fromAddress}>`,
      to: receiver,
      replyTo: String(email).trim(),
      subject: `[Portfolio] ${subject || 'New message from website'}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${String(name)}</p>
        <p><strong>Email:</strong> ${String(email)}</p>
        <p><strong>Subject:</strong> ${String(subject || 'New message from website')}</p>
        <p><strong>Message:</strong><br/>${String(message).replace(/\n/g, '<br/>')}</p>
      `,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: formatMailError(error) });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Portfolio server running on http://localhost:${port}`);
});
