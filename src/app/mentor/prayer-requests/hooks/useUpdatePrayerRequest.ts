'use client';

import { useToast } from '@/components/Toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PrayerRequestResponse, PriorityOptions, StatusOptions } from '../lib/types';
import { updatePrayerRequest } from '@/actions/prayer/update-prayer-request';

type UpdatePrayerRequestParams = {
  id: number;
  status?: StatusOptions;
  priority?: PriorityOptions;
  notes?: string;
  assignedMentorId?: number | null;
};

export const useUpdatePrayerRequest = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    PrayerRequestResponse,
    Error,
    UpdatePrayerRequestParams
  >({
    mutationFn: (input) => updatePrayerRequest(input),
    onSuccess: (data) => {
      // Invalidate and refetch prayer requests
      queryClient.invalidateQueries({ queryKey: ['prayerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['prayerRequest', data.id] });
      queryClient.invalidateQueries({ queryKey: ['prayerStats'] });
      toast('Prayer request updated successfully', 'success');
    },
    onError: (error) => {
      toast(`Failed to update prayer request: ${error.message}`, 'error');
      console.error("Error updating prayer request:", error);
    },
  });

  return {
    updatePrayerRequest: mutation.mutate,
    updatePrayerRequestAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
};