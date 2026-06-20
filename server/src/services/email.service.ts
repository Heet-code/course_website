import { Resend } from 'resend';
import { env } from '../config/env';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'The Learning Collective <onboarding@resend.dev>'; // In production, use verified domain

// Helper for gracefully handling missing Resend API keys
const sendEmail = async (options: { to: string; subject: string; html: string; text: string }) => {
  if (!resend) {
    console.log(`[Email Service Mock] Would send to ${options.to}: ${options.subject}`);
    return;
  }
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw to prevent disrupting the core application flow
  }
};

export const emailService = {
  async sendWelcomeEmail(email: string, name: string) {
    await sendEmail({
      to: email,
      subject: 'Welcome to The Learning Collective!',
      text: `Hi ${name},\n\nWelcome to The Learning Collective! We're excited to have you on board to build practical, real-world skills.\n\nHappy Learning,\nThe Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111827;">Welcome to The Learning Collective!</h2>
          <p>Hi ${name},</p>
          <p>We're excited to have you on board. You're now ready to start exploring courses and building practical, real-world skills.</p>
          <p>
            <a href="${env.CLIENT_URL}/courses" style="display: inline-block; background-color: #4F46E5; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Browse Courses</a>
          </p>
          <p>Happy Learning,<br/>The Team</p>
        </div>
      `,
    });
  },

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: 'Password Reset Request - The Learning Collective',
      text: `Hi ${name},\n\nYou requested a password reset. Click the link below to reset your password. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111827;">Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>You requested to reset your password. Click the button below to set a new password. This link is valid for 1 hour.</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </p>
          <p>Or copy this link: <br/><a href="${resetUrl}">${resetUrl}</a></p>
          <p style="color: #6B7280; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  },

  async sendEnrollmentEmail(email: string, name: string, courseTitle: string) {
    await sendEmail({
      to: email,
      subject: `You're enrolled in: ${courseTitle}`,
      text: `Hi ${name},\n\nYou've successfully enrolled in "${courseTitle}". Log in to your dashboard to start learning immediately!\n\nHappy Learning,\nThe Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111827;">Enrollment Confirmed!</h2>
          <p>Hi ${name},</p>
          <p>You've successfully enrolled in <strong>${courseTitle}</strong>. You can access the course materials immediately from your dashboard.</p>
          <p>
            <a href="${env.CLIENT_URL}/dashboard" style="display: inline-block; background-color: #4F46E5; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
          </p>
          <p>Happy Learning,<br/>The Team</p>
        </div>
      `,
    });
  },

  async sendCertificateEmail(email: string, name: string, courseTitle: string, certificateId: string) {
    const certUrl = `${env.CLIENT_URL}/dashboard/certificates`;
    await sendEmail({
      to: email,
      subject: `Congratulations! Your certificate for ${courseTitle}`,
      text: `Hi ${name},\n\nCongratulations on completing "${courseTitle}"! Your verified certificate (ID: ${certificateId}) is now available on your dashboard.\n\nKeep up the great work,\nThe Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111827;">Congratulations! 🎓</h2>
          <p>Hi ${name},</p>
          <p>You did it! You've successfully completed <strong>${courseTitle}</strong>.</p>
          <p>Your verified certificate (ID: ${certificateId}) has been issued and is available to download or share directly from your dashboard.</p>
          <p>
            <a href="${certUrl}" style="display: inline-block; background-color: #4F46E5; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Certificate</a>
          </p>
          <p>Keep up the great work,<br/>The Team</p>
        </div>
      `,
    });
  }
};
