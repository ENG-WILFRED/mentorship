'use client';


import { addPrayerToPrayerRequest } from '@/actions/prayer/add-prayer';
import { useToast } from '@/components/Toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AddPrayerParams = {
  prayerRequestId: number;
  userId: number;
};

export const useAddPrayer = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { success: boolean; message: string },
    Error,
    AddPrayerParams
  >({
    mutationFn: ({ prayerRequestId, userId }) => 
      addPrayerToPrayerRequest(prayerRequestId, userId),
    onSuccess: (data, variables) => {
      // Invalidate queries for this specific prayer request
      queryClient.invalidateQueries({ queryKey: ['prayerRequests'] });
      queryClient.invalidateQueries({ 
        queryKey: ['prayerRequest', variables.prayerRequestId] 
      });
      toast(data.message, 'success');
    },
    onError: (error) => {
      toast(`Failed to add prayer: ${error.message}`, 'error');
      console.error("Error adding prayer:", error);
    },
  });

  return {
    addPrayer: mutation.mutate,
    addPrayerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};