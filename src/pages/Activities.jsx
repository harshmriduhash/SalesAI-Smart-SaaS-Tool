// src/pages/Activities.jsx
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

import {
  useActivities,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
} from "@/hooks/useActivities";
import { useLeads } from "@/hooks/useLeads"; // To fetch all leads for the activity form

import ActivityCard from "@/components/activities/ActivityCard";
import ActivityForm from "@/components/activities/ActivityForm";

const Activities = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
  const [isEditActivityDialogOpen, setIsEditActivityDialogOpen] =
    useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  // Fetch all activities
  const { data: activities, isLoading, isError, error } = useActivities();

  // Fetch all leads (needed for ActivityForm dropdown)
  const { data: leads = [] } = useLeads();

  // Mutation hooks
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivity();

  // Filter activities based on search term
  const filteredActivities =
    activities?.filter((activity) => {
      const searchLower = searchTerm.toLowerCase();
      // Assuming activity has subject, type, description, and potentially lead info
      const leadName =
        leads.find((l) => l._id === activity.lead_id)?.name.toLowerCase() || "";
      const leadCompany =
        leads.find((l) => l._id === activity.lead_id)?.company.toLowerCase() ||
        "";

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
      queryClient.invalidateQueries(["activities"]);
      setIsAddActivityDialogOpen(false);
    } catch (error) {
      console.error("Failed to create activity:", error);
      // TODO: Show user-friendly error notification (e.g., toast)
    }
  };

  const handleEditActivity = async (updatedActivityData) => {
    try {
      await updateActivityMutation.mutateAsync({
        id: editingActivity._id,
        ...updatedActivityData,
      });
      queryClient.invalidateQueries(["activities"]);
      setIsEditActivityDialogOpen(false);
      setEditingActivity(null);
    } catch (error) {
      console.error("Failed to update activity:", error);
      // TODO: Show user-friendly error notification
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivityMutation.mutateAsync(activityId);
      queryClient.invalidateQueries(["activities"]);
    } catch (error) {
      console.error("Failed to delete activity:", error);
      // TODO: Show user-friendly error notification
    }
  };

  const handleToggleActivityComplete = async (activityId, completedStatus) => {
    try {
      await updateActivityMutation.mutateAsync({
        id: activityId,
        completed: completedStatus,
      });
      queryClient.invalidateQueries(["activities"]);
    } catch (error) {
      console.error("Failed to toggle activity complete status:", error);
      // TODO: Show user-friendly error notification
    }
  };

  const openEditDialog = (activity) => {
    setEditingActivity(activity);
    setIsEditActivityDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading activities...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load activities: {error?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-white mb-6">
        Activity Management
      </h1>

      {/* Search and Add Activity Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search activities, leads, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-purple-900/40 backdrop-blur-md text-white border-purple-700 placeholder-gray-400 w-full"
          />
        </div>

        {/* Add Activity Button */}
        <Dialog
          open={isAddActivityDialogOpen}
          onOpenChange={setIsAddActivityDialogOpen}
        >
          <Button
            onClick={() => setIsAddActivityDialogOpen(true)}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Activity
          </Button>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
              <DialogDescription>
                Create a new activity and associate it with a lead.
              </DialogDescription>
            </DialogHeader>
            <ActivityForm
              onSubmit={handleCreateActivity}
              submitButtonText="Create Activity"
              isLoading={createActivityMutation.isLoading}
              leads={leads}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {" "}
        {/* <--- Updated grid layout */}
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => {
            const associatedLead = leads.find(
              (lead) => lead._id === activity.lead_id
            );

            return (
              <ActivityCard
                key={activity._id}
                activity={activity}
                lead={associatedLead}
                onEdit={openEditDialog}
                onDelete={handleDeleteActivity}
                onToggleComplete={handleToggleActivityComplete}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">
              {searchTerm
                ? "No activities match your search."
                : "No activities found. Create your first activity!"}
            </p>
          </div>
        )}
      </div>

      {/* Edit Activity Dialog */}
      <Dialog
        open={isEditActivityDialogOpen}
        onOpenChange={setIsEditActivityDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Update the details of this activity.
            </DialogDescription>
          </DialogHeader>
          {editingActivity && (
            <ActivityForm
              initialData={editingActivity}
              onSubmit={handleEditActivity}
              submitButtonText="Save Changes"
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
