import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LeadAPI } from '@/entities/all'; // Import the LeadAPI

// Fetch all leads
export const useLeads = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => LeadAPI.list(filters),
    ...options,
  });
};

// Fetch a single lead by ID
export const useLead = (id, options = {}) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => LeadAPI.get(id),
    enabled: !!id, // Only run if ID is available
    ...options,
  });
};

// Create a new lead
export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newLead) => LeadAPI.create(newLead),
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']); // Invalidate leads query to refetch
      queryClient.invalidateQueries(['activities']); // New lead creates activity
    },
  });
};

// Update an existing lead
export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updatedLead }) => LeadAPI.update(id, updatedLead),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['leads']);
      queryClient.invalidateQueries(['lead', variables.id]);
      queryClient.invalidateQueries(['activities']); // Lead update might create activity
    },
  });
};

// Delete a lead
export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => LeadAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      queryClient.invalidateQueries(['activities']); // Deleting a lead might create activity
    },
  });
};