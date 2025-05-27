import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text
    });
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  const message = `
    You are receiving this email because you (or someone else) have requested the reset of the password for your account.
    
    Please click on the following link, or paste this into your browser to complete the process:
    ${resetUrl}
    
    If you did not request this, please ignore this email and your password will remain unchanged.
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    text: message
  });
};
