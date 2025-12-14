'use client';


import { useToast } from '@/components/Toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePrayerRequestInput, PrayerRequestResponse } from '../lib/types';
import { createPrayerRequest } from '@/actions/prayer/create-prayer-request';

export const useCreatePrayerRequest = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<PrayerRequestResponse, Error, CreatePrayerRequestInput>({
    mutationFn: (input) => createPrayerRequest(input),
    onSuccess: () => {
      // Invalidate and refetch prayer requests
      queryClient.invalidateQueries({ queryKey: ['prayerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['prayerStats'] });
      toast('Prayer request created successfully', 'success');
    },
    onError: (error) => {
      toast(`Failed to create prayer request: ${error.message}`, 'error');
      console.error("Error creating prayer request:", error);
    },
  });

  return {
    createPrayerRequest: mutation.mutate,
    createPrayerRequestAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
};