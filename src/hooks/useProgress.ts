import { useState, useEffect, useCallback } from 'react';
import { CourseEnrollment, Certificate } from '../types';
import { mockApi } from '../lib/api';

export const useProgress = (courseId: string | undefined, userId: string | undefined) => {
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!courseId || !userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await mockApi.getEnrollment(courseId, userId);
      setEnrollment(data);
    } catch (err) {
      setError('Failed to fetch enrollment progress.');
    } finally {
      setLoading(false);
    }
  }, [courseId, userId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const enroll = async () => {
    if (!courseId || !userId) return null;
    setLoading(true);
    try {
      const data = await mockApi.enrollInCourse(courseId, userId);
      setEnrollment(data);
      return data;
    } catch (err) {
      setError('Enrollment failed.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = async (lessonId: string, isCompleted: boolean) => {
    if (!courseId || !userId) return null;
    try {
      const data = await mockApi.updateLessonProgress(courseId, userId, lessonId, isCompleted);
      if (data) {
        setEnrollment(data);
      }
      return data;
    } catch (err) {
      setError('Failed to update lesson completion status.');
      return null;
    }
  };

  const submitQuizResult = async (quizId: string, score: number) => {
    if (!courseId || !userId) return null;
    try {
      const res = await mockApi.submitQuizScore(courseId, userId, quizId, score);
      setEnrollment(res.enrollment);
      return res;
    } catch (err) {
      setError('Failed to submit quiz score.');
      return null;
    }
  };

  return { enrollment, loading, error, enroll, toggleLesson, submitQuizResult, refetch: fetchProgress };
};

export const useStudentCertificates = (userId: string | undefined) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCertificates = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await mockApi.getCertificates(userId);
      setCertificates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return { certificates, loading, refetch: fetchCertificates };
};
