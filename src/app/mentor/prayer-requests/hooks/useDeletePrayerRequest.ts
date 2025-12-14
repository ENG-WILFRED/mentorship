"use client";

import { deletePrayerRequest } from "@/actions/prayer/delete-prayer-request";
import { useToast } from "@/components/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePrayerRequest = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { success: boolean; message: string; data: any },
    Error,
    number
  >({
    mutationFn: (prayerRequestId) => deletePrayerRequest(prayerRequestId),
    onSuccess: (data) => {
      // Invalidate prayer requests queries
      queryClient.invalidateQueries({ queryKey: ["prayerRequests"] });
      queryClient.invalidateQueries({ queryKey: ["prayerStats"] });
      toast(data.message, "success");
    },
    onError: (error) => {
      toast(`Failed to delete prayer request: ${error.message}`, "error");
      console.error("Error deleting prayer request:", error);
    },
  });

  return {
    deletePrayerRequest: mutation.mutate,
    deletePrayerRequestAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};
