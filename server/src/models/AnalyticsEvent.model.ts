import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  eventName: string;
  sourcePage?: string;
  courseSlug?: string;
  role?: string;
  metadata?: Record<string, any>;
  userId?: mongoose.Types.ObjectId;
  anonymousId?: string;
  userAgent?: string;
  ipHash?: string;
  createdAt: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>({
  eventName: {
    type: String,
    required: true,
    index: true
  },
  sourcePage: { type: String },
  courseSlug: { type: String, index: true },
  role: { type: String },
  metadata: { type: Schema.Types.Mixed },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  anonymousId: { type: String },
  userAgent: { type: String },
  ipHash: { type: String }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema);
