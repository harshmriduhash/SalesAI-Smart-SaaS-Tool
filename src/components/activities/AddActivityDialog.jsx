import React, { useState, useEffect } from "react"; // Import useEffect
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription // Import DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useCreateActivity } from "@/hooks/useActivities"; // Use hook
import { useLeads } from "@/hooks/useLeads"; // To get leads for dropdown
import { toast } from "react-hot-toast"; // For notifications

const activityTypes = ["call", "email", "meeting", "demo", "follow_up", "note"];
const priorities = ["low", "medium", "high", "urgent"];

// Removed activityToEdit props for simplicity, will add if editing is a specific requirement later
export default function AddActivityDialog({ isOpen, onOpenChange }) { // Renamed from open/onClose to isOpen/onOpenChange
  const { data: leads, isLoading: isLoadingLeads, isError: isErrorLeads } = useLeads();
  const { mutate: createActivity, isLoading: isSubmitting } = useCreateActivity();

  const [formData, setFormData] = useState({
    lead_id: "",
    type: "",
    subject: "",
    description: "",
    priority: "medium",
    scheduled_date: "",
    duration: ""
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        lead_id: "",
        type: "",
        subject: "",
        description: "",
        priority: "medium",
        scheduled_date: "",
        duration: ""
      });
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lead_id || !formData.type || !formData.subject) {
      toast.error("Please fill all required fields: Lead, Activity Type, Subject.");
      return;
    }

    createActivity({
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      scheduled_date: formData.scheduled_date || undefined
    }, {
      onSuccess: () => {
        toast.success('Activity created successfully!');
        onOpenChange(false); // Close dialog
      },
      onError: (err) => {
        console.error("Error creating activity:", err);
        toast.error(`Error creating activity: ${err.message || 'Unknown error'}`);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Plus className="w-5 h-5" /> Add New Activity
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Log a new interaction or task for a lead.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lead_id" className="text-white">Lead <span className="text-red-400">*</span></Label>
              <Select value={formData.lead_id} onValueChange={(value) => handleInputChange('lead_id', value)} required>
                <SelectTrigger id="lead_id" className="bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder={isLoadingLeads ? "Loading leads..." : (isErrorLeads ? "Error loading leads" : "Select a lead")} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {isLoadingLeads ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : isErrorLeads ? (
                    <SelectItem value="error" disabled>Error loading leads</SelectItem>
                  ) : leads && leads.length > 0 ? (
                    leads.map((lead) => (
                      <SelectItem key={lead._id} value={lead._id}>
                        {lead.name} - {lead.company || 'No Company'}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-leads" disabled>No leads available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-white">Activity Type <span className="text-red-400">*</span></Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)} required>
                <SelectTrigger id="type" className="bg-white/10 border-white/30 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-white">Subject <span className="text-red-400">*</span></Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brief description of the activity"
              className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed notes about this activity..."
              rows={3}
              className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-white">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger id="priority" className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled_date" className="text-white">Scheduled Date & Time</Label>
              <Input
                id="scheduled_date"
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                className="bg-white/10 border-white/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="30"
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Activity...
                </>
              ) : (
                'Add Activity'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}