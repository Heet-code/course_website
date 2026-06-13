import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface IQuizSchema extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  questions: IQuizQuestion[];
  passingScore: number;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
});

const StandaloneQuizSchema = new Schema<IQuizSchema>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, unique: true },
    title: { type: String, required: true },
    questions: [QuizQuestionSchema],
    passingScore: { type: Number, default: 70 },
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model<IQuizSchema>('Quiz', StandaloneQuizSchema);
