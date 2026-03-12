const nodemailer = require('nodemailer');

// Load .env for local development only.
try {
  require('dotenv').config();
} catch (_) {
  // Ignore if dotenv isn't available in the serverless runtime.
}

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

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST,OPTIONS');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

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
        message: 'Email transport not configured. Set SMTP_* values in environment.',
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
};
