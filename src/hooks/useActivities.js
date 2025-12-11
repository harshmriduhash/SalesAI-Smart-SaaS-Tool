import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActivityAPI } from '@/entities/all';

// Fetch all activities
export const useActivities = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: () => ActivityAPI.list(filters),
    ...options,
  });
};

// Create a new activity
export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newActivity) => ActivityAPI.create(newActivity),
    onSuccess: () => {
      queryClient.invalidateQueries(['activities']); // Invalidate all activities to refetch
      queryClient.invalidateQueries(['leads']); // Invalidate leads if activities affect lead dashboards
    },
  });
};

// Update an existing activity
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updatedActivity }) => ActivityAPI.update(id, updatedActivity),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['activities']);
      queryClient.invalidateQueries(['activity', variables.id]);
      queryClient.invalidateQueries(['leads']); // Invalidate leads if activities affect lead dashboards
    },
  });
};

// Delete an activity
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => ActivityAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['activities']);
      queryClient.invalidateQueries(['leads']); // Invalidate leads if activities affect lead dashboards
    },
  });
};