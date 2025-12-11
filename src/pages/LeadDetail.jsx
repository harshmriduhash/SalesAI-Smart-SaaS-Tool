// src/pages/LeadDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import {
  useLead,
  useUpdateLead,
  useDeleteLead
} from '@/hooks/useLeads';

import {
  useActivities,
  useCreateActivity,
  useUpdateActivity, // <--- Import useUpdateActivity hook
  useDeleteActivity, // <--- Import useDeleteActivity hook
} from '@/hooks/useActivities'; // Correct path for activity-related hooks

import AddActivityDialog from '@/components/activities/AddActivityDialog';
import ActivityCard from '@/components/activities/ActivityCard';
import LeadForm from '@/components/leads/LeadForm';
import ActivityForm from '@/components/activities/ActivityForm'; // <--- Import the new ActivityForm

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddActivityDialogOpen, setIsAddActivityDialogOpen] = useState(false);
  const [isEditActivityDialogOpen, setIsEditActivityDialogOpen] = useState(false); // <--- New state for editing activity
  const [editingActivity, setEditingActivity] = useState(null); // <--- New state to store activity being edited

  // Fetch lead details
  const { data: lead, isLoading: isLeadLoading, isError: isLeadError, error: leadError } = useLead(id);
  // Fetch all leads (needed for ActivityForm's lead selection dropdown)
  const { data: allLeads = [] } = useLead(); // Assuming useLead can fetch all if no ID is provided, or you need a useLeads() hook

  // Fetch activities related to this lead
  const { data: activities, isLoading: isActivitiesLoading, isError: isActivitiesError, error: activitiesError } = useActivities({ leadId: id });

  // Mutation hooks
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity(); // <--- Initialize updateActivityMutation
  const deleteActivityMutation = useDeleteActivity(); // <--- Initialize deleteActivityMutation

  const handleUpdateLead = async (updatedData) => {
    try {
      await updateLeadMutation.mutateAsync({ id: lead.id, ...updatedData });
      queryClient.invalidateQueries(['lead', lead.id]);
      queryClient.invalidateQueries(['leads']);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update lead:', error);
      // TODO: Implement user-friendly error notification
    }
  };

  const handleDeleteLead = async () => {
    try {
      await deleteLeadMutation.mutateAsync(lead.id);
      queryClient.invalidateQueries(['leads']);
      navigate('/leads');
    } catch (error) {
      console.error('Failed to delete lead:', error);
      // TODO: Implement user-friendly error notification
    }
  };

  const handleCreateActivity = async (newActivityData) => {
    try {
      await createActivityMutation.mutateAsync(newActivityData);
      queryClient.invalidateQueries(['activities', { leadId: id }]); // Invalidate activities for this lead
      setIsAddActivityDialogOpen(false);
    } catch (error) {
      console.error('Failed to create activity:', error);
      // TODO: Implement user-friendly error notification
    }
  };

  const handleEditActivity = async (updatedActivityData) => { // <--- New handler for editing activities
    try {
      await updateActivityMutation.mutateAsync({ id: editingActivity._id, ...updatedActivityData });
      queryClient.invalidateQueries(['activities', { leadId: id }]);
      setIsEditActivityDialogOpen(false);
      setEditingActivity(null); // Clear editing state
    } catch (error) {
      console.error('Failed to update activity:', error);
      // TODO: Implement user-friendly error notification
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivityMutation.mutateAsync(activityId);
      queryClient.invalidateQueries(['activities', { leadId: id }]);
    } catch (error) {
      console.error('Failed to delete activity:', error);
      // TODO: Implement user-friendly error notification
    }
  };

  const handleToggleActivityComplete = async (activityId, completedStatus) => {
    try {
      await updateActivityMutation.mutateAsync({ id: activityId, completed: completedStatus });
      queryClient.invalidateQueries(['activities', { leadId: id }]);
    } catch (error) {
      console.error('Failed to toggle activity complete status:', error);
    }
  };

  if (isLeadLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading lead details...</span>
      </div>
    );
  }

  if (isLeadError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load lead: {leadError.message}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/leads')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Leads
        </Button>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>Lead not found.</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/leads')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button variant="outline" onClick={() => navigate('/leads')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Leads
      </Button>

      <Card className="mb-6 shadow-xl bg-purple-900/40 backdrop-blur-md text-white border-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-white">{lead.name}</h1>
            {lead.status && (
              <Badge className="ml-4 bg-purple-700 text-white border border-purple-500">
                {lead.status.replace(/_/g, ' ')}
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Pencil className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Lead</DialogTitle>
                  <DialogDescription>
                    Make changes to the lead details here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <LeadForm
                  initialData={lead}
                  onSubmit={handleUpdateLead}
                  submitButtonText="Save Changes"
                  isLoading={updateLeadMutation.isLoading}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the lead.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteLead}
                    disabled={deleteLeadMutation.isLoading}
                  >
                    {deleteLeadMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-gray-300 mb-2">{lead.company} {lead.position ? `• ${lead.position}` : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
            {lead.email && <p><strong>Email:</strong> {lead.email}</p>}
            {lead.phone && <p><strong>Phone:</strong> {lead.phone}</p>}
            {lead.industry && <p><strong>Industry:</strong> {lead.industry}</p>}
            {lead.company_size && <p><strong>Company Size:</strong> {lead.company_size}</p>}
            {lead.source && <p><strong>Source:</strong> {lead.source}</p>}
            {lead.lead_score && <p><strong>Lead Score:</strong> {lead.lead_score}</p>}
            {lead.estimated_value && <p><strong>Estimated Value:</strong> ${lead.estimated_value.toLocaleString()}</p>}
            {lead.last_contact_date && <p><strong>Last Contact:</strong> {moment(lead.last_contact_date).format('MMM DD, YYYY')}</p>}
            {lead.next_follow_up && <p><strong>Next Follow-up:</strong> {moment(lead.next_follow_up).format('MMM DD, YYYY')}</p>}
          </div>
          {lead.notes && (
            <div className="mt-4 p-3 bg-purple-800/50 rounded-md">
              <h4 className="font-semibold text-gray-100">Notes:</h4>
              <p className="text-sm text-gray-200">{lead.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activities Section */}
      <Card className="shadow-xl bg-purple-900/40 backdrop-blur-md text-white border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Activities</CardTitle>
          <Dialog open={isAddActivityDialogOpen} onOpenChange={setIsAddActivityDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Add Activity</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
                <DialogDescription>
                  Create a new activity for this lead.
                </DialogDescription>
              </DialogHeader>
              <ActivityForm
                initialData={{ lead_id: id }} // Pre-fill lead_id for this lead
                onSubmit={handleCreateActivity}
                submitButtonText="Create Activity"
                isLoading={createActivityMutation.isLoading}
                leads={[{ _id: lead._id, name: lead.name, company: lead.company }]} // Pass only this lead for context
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isActivitiesLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : isActivitiesError ? (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to load activities: {activitiesError.message}</AlertDescription>
            </Alert>
          ) : activities && activities.length > 0 ? (
            <div>
              {activities.map((activity) => (
                <ActivityCard
                  key={activity._id}
                  activity={activity}
                  lead={lead} // Pass the lead data to activity card
                  onEdit={(act) => { // <--- Set editing activity and open dialog
                    setEditingActivity(act);
                    setIsEditActivityDialogOpen(true);
                  }}
                  onDelete={handleDeleteActivity}
                  onToggleComplete={handleToggleActivityComplete}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No activities found for this lead.</p>
          )}
        </CardContent>
      </Card>

      {/* Edit Activity Dialog */}
      <Dialog open={isEditActivityDialogOpen} onOpenChange={setIsEditActivityDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Update the details of this activity.
            </DialogDescription>
          </DialogHeader>
          {editingActivity && ( // Only render form if an activity is being edited
            <ActivityForm
              initialData={editingActivity}
              onSubmit={handleEditActivity}
              submitButtonText="Save Changes"
              isLoading={updateActivityMutation.isLoading}
              leads={[{ _id: lead._id, name: lead.name, company: lead.company }]} // Pass only this lead
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadDetail;