import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  courseId: mongoose.Types.ObjectId;
  courseTitle: string;
  recipientId: mongoose.Types.ObjectId;
  recipientName: string;
  instructorName: string;
  issueDate: Date;
  credentialId: string;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    courseTitle: { type: String, required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientName: { type: String, required: true },
    instructorName: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    credentialId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
