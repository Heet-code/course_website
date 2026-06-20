import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
  name?: string;
  email: string;
  interestArea?: string;
  sourcePage?: string;
  createdAt: Date;
}

const NewsletterSchema: Schema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  interestArea: { type: String, trim: true },
  sourcePage: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
