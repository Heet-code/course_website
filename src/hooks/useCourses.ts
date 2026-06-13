import { useState, useEffect, useCallback } from 'react';
import { Course } from '../types';
import { mockApi } from '../lib/api';

export const useCourses = (filters?: { category?: string; difficulty?: string; search?: string; instructorId?: string; priceType?: string }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockApi.getCourses(filters);
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch courses catalog.');
    } finally {
      setLoading(false);
    }
  }, [filters?.category, filters?.difficulty, filters?.search, filters?.instructorId, filters?.priceType]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
};

export const useCourseDetails = (courseId: string | undefined) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await mockApi.getCourseById(courseId);
      if (data) {
        setCourse(data);
      } else {
        setError('Course not found.');
      }
    } catch (err) {
      setError('Failed to fetch course details.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, refetch: fetchCourse };
};
