"use client";

import { removePrayerFromPrayerRequest } from "@/actions/prayer/remove-prayer";
import { useToast } from "@/components/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RemovePrayerParams = {
  prayerRequestId: number;
  userId: number;
};

export const useRemovePrayer = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { success: boolean; message: string },
    Error,
    RemovePrayerParams
  >({
    mutationFn: ({ prayerRequestId, userId }) =>
      removePrayerFromPrayerRequest(prayerRequestId, userId),
    onSuccess: (data, variables) => {
      // Invalidate queries for this specific prayer request
      queryClient.invalidateQueries({ queryKey: ["prayerRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["prayerRequest", variables.prayerRequestId],
      });
      toast(data.message, "success");
    },
    onError: (error) => {
      toast(`Failed to remove prayer: ${error.message}`, "error");
      console.error("Error removing prayer:", error);
    },
  });

  return {
    removePrayer: mutation.mutate,
    removePrayerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};
