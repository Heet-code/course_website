import { Request, Response } from 'express';
import { Resend } from 'resend';
import { ContactMessage } from '../models/ContactMessage.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { env } from '../config/env';

// Initialize Resend conditionally
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  // 1. Save message to database
  const contactMsg = await ContactMessage.create({
    name,
    email,
    subject,
    message,
  });

  // 2. Send notification email if Resend is configured
  if (resend && env.CONTACT_RECEIVER_EMAIL) {
    try {
      await resend.emails.send({
        from: 'The Learning Collective <onboarding@resend.dev>', // Use verified domain in production
        to: env.CONTACT_RECEIVER_EMAIL,
        replyTo: email,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h3>New Message from The Learning Collective</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError);
      // We don't fail the API request if email fails, as the message is already saved in DB
    }
  }

  res.status(201).json(new ApiResponse(201, contactMsg, 'Your message has been sent successfully. We will get back to you soon!'));
});
