// src/pages/Activities.jsx
import React, { useState, useEffect } from 'react'; // <--- Added useEffect
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // <--- Import useLocation
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';

import {
  useActivities,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
} from '@/hooks/useActivities';
import { useLeads } from '@/hooks/useLeads';

import ActivityCard from '@/components/activities/ActivityCard';
import ActivityForm from '@/components/activities/ActivityForm';

const Activities = () => {
  const queryClient = useQueryClient();
  const location = useLocation(); // <--- Initialize useLocation
  const [pageSearchTerm, setPageSearchTerm] = useState(''); // <--- State for search term on this page
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
  const [isEditActivityDialogOpen, setIsEditActivityDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  // Sync pageSearchTerm with global search term from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPageSearchTerm(params.get('search') || '');
  }, [location.search]);

  // Fetch all activities
  const { data: activities, isLoading, isError, error } = useActivities();
  
  // Fetch all leads (needed for ActivityForm dropdown and search filtering)
  const { data: leads = [] } = useLeads();

  // Mutation hooks
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();

  // Filter activities based on the synchronized pageSearchTerm
  const filteredActivities = activities?.filter((activity) => {
    const searchLower = pageSearchTerm.toLowerCase();
    
    // Find the associated lead for more comprehensive search
    const associatedLead = leads.find(l => l._id === activity.lead_id);
    const leadName = associatedLead?.name?.toLowerCase() || '';
    const leadCompany = associatedLead?.company?.toLowerCase() || '';

    return (
      activity.subject?.toLowerCase().includes(searchLower) ||
      activity.type?.toLowerCase().includes(searchLower) ||
      activity.description?.toLowerCase().includes(searchLower) ||
      leadName.includes(searchLower) ||
      leadCompany.includes(searchLower)
    );
  }) || [];

  const handleCreateActivity = async (newActivityData) => {
    try {
      await createActivityMutation.mutateAsync(newActivityData);
      queryClient.invalidateQueries(['activities']);
      setIsAddActivityDialogOpen(false);
    } catch (error) {
      console.error('Failed to create activity:', error);
      // TODO: Show user-friendly error notification (e.g., toast)
    }
  };

  const handleEditActivity = async (updatedActivityData) => {
    try {
      await updateActivityMutation.mutateAsync({
        id: editingActivity._id,
        ...updatedActivityData,
      });
      queryClient.invalidateQueries(['activities']);
      setIsEditActivityDialogOpen(false);
      setEditingActivity(null);
    } catch (error) {
      console.error('Failed to update activity:', error);
      // TODO: Show user-friendly error notification
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivityMutation.mutateAsync(activityId);
      queryClient.invalidateQueries(['activities']);
    } catch (error) {
      console.error('Failed to delete activity:', error);
      // TODO: Show user-friendly error notification
    }
  };

  const handleToggleActivityComplete = async (activityId, completedStatus) => {
    try {
      await updateActivityMutation.mutateAsync({
        id: activityId,
        completed: completedStatus,
      });
      queryClient.invalidateQueries(['activities']);
    } catch (error) {
      console.error('Failed to toggle activity complete status:', error);
      // TODO: Show user-friendly error notification
    }
  };

  const openEditDialog = (activity) => {
    setEditingActivity(activity);
    setIsEditActivityDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-4">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load activities: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Activity Management</h2>
        <Button onClick={() => setIsAddActivityDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="h-5 w-5 mr-2" /> Add Activity
        </Button>
      </div>

      {/* The global search bar is now handled by Layout.jsx */}
      {/* This input below is removed as it's redundant now */}
      {/*
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search activities, leads, or company..."
          className="pl-9 pr-4 py-2 w-full rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      */}

      {filteredActivities.length === 0 ? (
        <p className="text-gray-400 text-center text-lg mt-10">No activities found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              lead={leads.find(l => l._id === activity.lead_id)}
              onEdit={openEditDialog}
              onDelete={handleDeleteActivity}
              onToggleComplete={handleToggleActivityComplete}
            />
          ))}
        </div>
      )}

      {/* Dialog for adding new activity */}
      <Dialog open={isAddActivityDialogOpen} onOpenChange={setIsAddActivityDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Activity</DialogTitle>
            <DialogDescription>
              Create a new activity for a lead.
            </DialogDescription>
          </DialogHeader>
          <ActivityForm
            onSubmit={handleCreateActivity}
            isLoading={createActivityMutation.isLoading}
            leads={leads}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for editing activity */}
      <Dialog open={isEditActivityDialogOpen} onOpenChange={setIsEditActivityDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Activity</DialogTitle>
            <DialogDescription>
              Modify the details of this activity.
            </DialogDescription>
          </DialogHeader>
          {editingActivity && (
            <ActivityForm
              initialData={editingActivity}
              onSubmit={handleEditActivity}
              isLoading={updateActivityMutation.isLoading}
              leads={leads}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activities;