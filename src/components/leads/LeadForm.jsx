// src/components/leads/LeadForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod'; // Assuming you have zod for validation
import { zodResolver } from '@hookform/resolvers/zod'; // For zod integration with react-hook-form

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import moment from 'moment'; // For date handling

// Define the schema for lead validation
// Adjust this schema to match your Lead model and desired validation
const leadSchema = z.object({
  name: z.string().min(1, 'Lead name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
  industry: z.enum([
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Real Estate', 'Marketing', 'Other'
  ]).optional(),
  company_size: z.enum([
    '1-10', '11-50', '51-200', '201-1000', '1000+'
  ]).optional(),
  status: z.enum([
    'new', 'contacted', 'qualified', 'proposal', 'negotiation',
    'closed_won', 'closed_lost'
  ]).default('new'),
  lead_score: z.number().min(0).max(100).default(50).optional(),
  estimated_value: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Value cannot be negative').optional()
  ),
  source: z.enum([
    'website', 'referral', 'cold_outreach', 'social_media', 'event',
    'advertisement', 'other'
  ]).optional(),
  notes: z.string().optional(),
  last_contact_date: z.string().optional(), // Storing as string for simpler form handling
  next_follow_up: z.string().optional(),    // Storing as string for simpler form handling
});

const LeadForm = ({ initialData = {}, onSubmit, submitButtonText = 'Submit', isLoading = false }) => {
  const form = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      company: initialData.company || '',
      position: initialData.position || '',
      phone: initialData.phone || '',
      industry: initialData.industry || '',
      company_size: initialData.company_size || '',
      status: initialData.status || 'new',
      lead_score: initialData.lead_score || 50,
      estimated_value: initialData.estimated_value || 0,
      source: initialData.source || '',
      notes: initialData.notes || '',
      last_contact_date: initialData.last_contact_date ? moment(initialData.last_contact_date).format('YYYY-MM-DD') : '',
      next_follow_up: initialData.next_follow_up ? moment(initialData.next_follow_up).format('YYYY-MM-DD') : '',
    },
  });

  const handleSubmit = (data) => {
    // Convert date strings back to ISO format or Date objects if needed by backend
    const submissionData = { ...data };
    if (submissionData.last_contact_date) {
      submissionData.last_contact_date = moment(submissionData.last_contact_date).toISOString();
    }
    if (submissionData.next_follow_up) {
      submissionData.next_follow_up = moment(submissionData.next_follow_up).toISOString();
    }
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <Label htmlFor="name">Lead Name</Label>
        <Input
          id="name"
          {...form.register('name')}
          className={form.formState.errors.name && 'border-red-500'}
        />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...form.register('email')}
          className={form.formState.errors.email && 'border-red-500'}
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" {...form.register('company')} />
      </div>

      {/* Position */}
      <div>
        <Label htmlFor="position">Position</Label>
        <Input id="position" {...form.register('position')} />
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" {...form.register('phone')} />
      </div>

      {/* Status */}
      <div>
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={(value) => form.setValue('status', value)} value={form.watch('status')}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'].map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lead Score */}
      <div>
        <Label htmlFor="lead_score">Lead Score (0-100)</Label>
        <Input id="lead_score" type="number" {...form.register('lead_score', { valueAsNumber: true })} />
        {form.formState.errors.lead_score && (
          <p className="text-red-500 text-sm">{form.formState.errors.lead_score.message}</p>
        )}
      </div>

      {/* Estimated Value */}
      <div>
        <Label htmlFor="estimated_value">Estimated Value ($)</Label>
        <Input id="estimated_value" type="number" step="0.01" {...form.register('estimated_value')} />
        {form.formState.errors.estimated_value && (
          <p className="text-red-500 text-sm">{form.formState.errors.estimated_value.message}</p>
        )}
      </div>

      {/* Source */}
      <div>
        <Label htmlFor="source">Source</Label>
        <Select onValueChange={(value) => form.setValue('source', value)} value={form.watch('source')}>
          <SelectTrigger id="source">
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            {['website', 'referral', 'cold_outreach', 'social_media', 'event', 'advertisement', 'other'].map((source) => (
              <SelectItem key={source} value={source} className="capitalize">
                {source.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Last Contact Date */}
      <div>
        <Label htmlFor="last_contact_date">Last Contact Date</Label>
        <Input id="last_contact_date" type="date" {...form.register('last_contact_date')} />
      </div>

      {/* Next Follow Up Date */}
      <div>
        <Label htmlFor="next_follow_up">Next Follow Up Date</Label>
        <Input id="next_follow_up" type="date" {...form.register('next_follow_up')} />
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...form.register('notes')} rows={4} />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitButtonText}
      </Button>
    </form>
  );
};

export default LeadForm;