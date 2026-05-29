const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BridgeAI" <no-reply@bridgeai.com>',
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (email) => {
  const subject = 'Welcome to the BridgeAI Revolution!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #0b0e14; color: #ffffff;">
      <h1 style="color: #4facfe;">Welcome to BridgeAI</h1>
      <p>Thank you for joining the Sovereign Network. You've taken the first step toward universal intelligence distillation.</p>
      <p>BridgeAI allows you to extract and synchronize context across multiple LLM platforms with ease.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://bridgeai.com/dashboard" style="background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold;">Go to Dashboard</a>
      </div>
      <p>Stay tuned for daily insights and updates!</p>
      <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
      <p style="font-size: 12px; color: #888;">&copy; 2026 BridgeAI Sovereign. All rights reserved.</p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

const sendPromotionEmail = async (email) => {
  const subject = 'Elevate Your Intelligence with BridgeAI Pro';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #0b0e14; color: #ffffff;">
      <h1 style="color: #4facfe;">BridgeAI: Break the Quota</h1>
      <p>Are you feeling limited by your current plan? Upgrade to <strong>Pro</strong> or <strong>Infinite</strong> today and experience the full power of BridgeAI.</p>
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;">🚀 <strong>Pro:</strong> 100 extractions/month + Advanced Distillation Modes</li>
        <li style="margin-bottom: 10px;">♾️ <strong>Infinite:</strong> Unlimited extractions + Priority Hub Dispatch</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://bridgeai.com/pricing" style="background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold;">Unlock Premium Access</a>
      </div>
      <p>Don't let your data stay siloed. Bridge the gap now.</p>
      <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
      <p style="font-size: 12px; color: #888;">You are receiving this because you subscribed to BridgeAI updates. <a href="#" style="color: #4facfe;">Unsubscribe</a></p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

module.exports = { sendEmail, sendWelcomeEmail, sendPromotionEmail };
