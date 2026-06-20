import { Request, Response } from 'express';
import Newsletter from '../models/Newsletter.model';
import { sendEmail } from '../services/email.service';

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { name, email, interestArea, sourcePage } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Thanks! We’ll notify you when live classes start.' });
    }

    const newSubscriber = new Newsletter({
      name,
      email,
      interestArea,
      sourcePage,
    });

    await newSubscriber.save();

    // Send optional confirmation email if Resend is configured
    try {
      await sendEmail({
        to: email,
        subject: 'You joined The Learning Collective waitlist',
        text: 'Thanks for joining. We will notify you when live classes start.',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>You're on the waitlist!</h2>
            <p>Thanks for joining The Learning Collective waitlist. We will notify you as soon as live classes start.</p>
            <p>Best,<br/>The Learning Collective Team</p>
          </div>
        `
      });
    } catch (emailErr) {
      // Ignore email errors to ensure we still return success if saved to DB
      console.warn('Failed to send waitlist email (Resend may not be configured):', emailErr);
    }

    return res.status(201).json({ success: true, message: 'Thanks! We’ll notify you when live classes start.' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
