'use client';

import { useToast } from '@/components/Toast';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { PrayerRequestResponse, StatusOptions } from '../lib/types';
import { fetchPrayerRequests } from '@/actions/prayer/fetch-prayer-requests';

type FetchPrayerRequestsParams = {
  status?: StatusOptions | "all";
  search?: string;
  limit?: number;
  skip?: number;
  createdById?: number;
  assignedMentorId?: number;
  includePrayedBy?: boolean;
};

export const usePrayerRequests = (params: FetchPrayerRequestsParams = {}) => {
  const toast = useToast();

  const query = useQuery<PrayerRequestResponse[], Error>({
    queryKey: ['prayerRequests', params], 
    queryFn: () => fetchPrayerRequests(params), 
  });

  useEffect(() => {
    if (query.isError) {
      console.error("Error fetching prayer requests:", query.error);
    }
  }, [query.isError, query.error, toast]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};