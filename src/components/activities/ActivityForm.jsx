// src/components/activities/ActivityForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Define the schema for activity validation
const activitySchema = z.object({
  lead_id: z.string().min(1, 'Lead is required'),
  type: z.enum(['call', 'email', 'meeting', 'demo', 'follow_up', 'note'], {
    errorMap: () => ({ message: 'Activity type is required' }),
  }),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  outcome: z.enum(['positive', 'neutral', 'negative']).optional(),
  duration: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, 'Duration cannot be negative').optional()
  ),
  scheduled_date: z.string().optional(), // YYYY-MM-DD
  completed: z.boolean().default(false).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

const ActivityForm = ({ initialData = {}, onSubmit, submitButtonText = 'Save Activity', isLoading = false, leads = [] }) => {
  const form = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      lead_id: initialData.lead_id || '',
      type: initialData.type || 'note',
      subject: initialData.subject || '',
      description: initialData.description || '',
      outcome: initialData.outcome || undefined,
      duration: initialData.duration || undefined,
      scheduled_date: initialData.scheduled_date ? moment(initialData.scheduled_date).format('YYYY-MM-DD') : '',
      completed: initialData.completed || false,
      priority: initialData.priority || 'medium',
    },
  });

  const handleSubmit = (data) => {
    // Convert duration to number if it's a string, or keep undefined if empty
    const formattedData = {
      ...data,
      duration: data.duration !== undefined ? Number(data.duration) : undefined,
      // Convert scheduled_date to ISO string if present
      scheduled_date: data.scheduled_date ? moment(data.scheduled_date).toISOString() : undefined,
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="lead_id">Associated Lead</Label>
        <Select
          onValueChange={(value) => form.setValue('lead_id', value)}
          defaultValue={form.watch('lead_id')}
          disabled={!leads || leads.length === 0} // Disable if no leads are available
        >
          <SelectTrigger className="w-full" id="lead_id">
            <SelectValue placeholder="Select a lead" />
          </SelectTrigger>
          <SelectContent>
            {leads.length === 0 && <p className="p-2 text-muted-foreground">No leads available</p>}
            {leads.map((lead) => (
              <SelectItem key={lead._id} value={lead._id}>
                {lead.name} ({lead.company})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.lead_id && (
          <p className="text-sm text-destructive">{form.formState.errors.lead_id.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">Activity Type</Label>
        <Select onValueChange={(value) => form.setValue('type', value)} defaultValue={form.watch('type')}>
          <SelectTrigger className="w-full" id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {['call', 'email', 'meeting', 'demo', 'follow_up', 'note'].map((type) => (
              <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.type && (
          <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          type="text"
          placeholder="Activity Subject"
          {...form.register('subject')}
        />
        {form.formState.errors.subject && (
          <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Detailed description of the activity"
          {...form.register('description')}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="scheduled_date">Scheduled Date</Label>
          <Input
            id="scheduled_date"
            type="date"
            {...form.register('scheduled_date')}
          />
          {form.formState.errors.scheduled_date && (
            <p className="text-sm text-destructive">{form.formState.errors.scheduled_date.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            {...form.register('duration', { valueAsNumber: true })}
            placeholder="e.g., 30"
          />
          {form.formState.errors.duration && (
            <p className="text-sm text-destructive">{form.formState.errors.duration.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="outcome">Outcome</Label>
          <Select onValueChange={(value) => form.setValue('outcome', value)} value={form.watch('outcome') || ''}>
            <SelectTrigger className="w-full" id="outcome">
              <SelectValue placeholder="Select outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.outcome && (
            <p className="text-sm text-destructive">{form.formState.errors.outcome.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="priority">Priority</Label>
          <Select onValueChange={(value) => form.setValue('priority', value)} defaultValue={form.watch('priority')}>
            <SelectTrigger className="w-full" id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {['low', 'medium', 'high', 'urgent'].map((priority) => (
                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.priority && (
            <p className="text-sm text-destructive">{form.formState.errors.priority.message}</p>
          )}
        </div>
      </div>

      {/* Checkbox for completed status if needed, but often handled by Mark Complete button */}
      {/* <div className="flex items-center space-x-2">
        <Checkbox id="completed" {...form.register('completed')} />
        <Label htmlFor="completed">Completed</Label>
      </div> */}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitButtonText}
      </Button>
    </form>
  );
};

export default ActivityForm;