import { Request, Response } from 'express';
import { Course } from '../models/Course.model';
import { Enrollment } from '../models/Enrollment.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import mongoose from 'mongoose';

export const submitQuiz = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const { courseId } = req.params;
  const { answers } = req.body; // Array of correct index options

  const course = await Course.findById(courseId);
  if (!course || !course.quiz) {
    throw new ApiError(404, 'Quiz not found for this course');
  }

  const enrollment = await Enrollment.findOne({
    userId: req.user._id,
    courseId: course._id,
  });

  if (!enrollment) {
    throw new ApiError(400, 'Student must be enrolled to submit quizzes');
  }

  const questions = course.quiz.questions;
  let score = req.body.score;
  let passed = false;
  let correctCount = 0;

  if (typeof score === 'number') {
    passed = score >= course.quiz.passingScore;
    correctCount = Math.round((score / 100) * questions.length);
  } else {
    if (!answers || !Array.isArray(answers)) {
      throw new ApiError(400, 'Either answers array or score must be provided');
    }
    if (answers.length !== questions.length) {
      throw new ApiError(400, `Answer sheet length mismatch. Expected ${questions.length} answers.`);
    }

    // Count correct answers
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    score = Math.round((correctCount / questions.length) * 100);
    passed = score >= course.quiz.passingScore;
  }

  // Save score to enrollment completedQuizzes
  const completedMap = enrollment.completedQuizzes || new Map();
  completedMap.set(course.quiz.id || 'final-quiz', score);
  enrollment.completedQuizzes = completedMap;
  await enrollment.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { score, passed, correctCount, totalQuestions: questions.length },
        'Quiz submitted successfully'
      )
    );
});

export const updateCourseQuiz = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const { courseId } = req.params;
  const { title, questions, passingScore } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Permission denied');
  }

  course.quiz = {
    id: course.quiz?.id || `quiz-${Math.random().toString(36).substring(2, 9)}`,
    title,
    questions,
    passingScore,
  };

  await course.save();

  res
    .status(200)
    .json(new ApiResponse(200, course.quiz, 'Quiz updated successfully'));
});
