import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
  resources: string[];
  isPreview?: boolean;
}

export interface IModule {
  id: string;
  title: string;
  lessons: ILesson[];
}

export interface IQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IQuiz {
  id: string;
  title: string;
  questions: IQuestion[];
  passingScore: number;
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  isFree: boolean;
  price: number;
  originalPrice?: number;
  instructorName: string;
  instructorId: mongoose.Types.ObjectId;
  rating: number;
  enrolledCount: number;
  modules: IModule[];
  quiz?: IQuiz;
  certificateAvailable: boolean;
  status: 'published' | 'draft';
  outcomes?: string[];
  requirements?: string[];
  tags?: string[];
  modelEmbedUrl?: string;
  modelPath?: string;
}

const LessonSchema = new Schema<ILesson>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  resources: [{ type: String }],
  isPreview: { type: Boolean, default: false },
});

const ModuleSchema = new Schema<IModule>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  lessons: [LessonSchema],
});

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
});

const QuizSchema = new Schema<IQuiz>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  questions: [QuestionSchema],
  passingScore: { type: Number, default: 70 },
});

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    fullDescription: { type: String },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    duration: { type: String, required: true },
    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    originalPrice: { type: Number },
    instructorName: { type: String, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, default: 0 },
    enrolledCount: { type: Number, default: 0 },
    modules: [ModuleSchema],
    quiz: QuizSchema,
    certificateAvailable: { type: Boolean, default: true },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    outcomes: [{ type: String }],
    requirements: [{ type: String }],
    tags: [{ type: String }],
    modelEmbedUrl: { type: String },
    modelPath: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
