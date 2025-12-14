'use client';

import { getPrayerRequestStats } from '@/actions/prayer/get-prayer-stats';
import { useToast } from '@/components/Toast';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

type PrayerStatsParams = {
  userId?: number;
  mentorId?: number;
};

type PrayerStats = {
  total: number;
  pending: number;
  inProgress: number;
  fulfilled: number;
  totalStudents: number;
};

export const usePrayerStats = (params: PrayerStatsParams = {}) => {
  const toast = useToast();

  const query = useQuery<PrayerStats, Error>({
    queryKey: ['prayerStats', params],
    queryFn: () => getPrayerRequestStats(params.userId, params.mentorId),
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching prayer stats:", query.error);
    }
  }, [query.isError, query.error, toast]);

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}