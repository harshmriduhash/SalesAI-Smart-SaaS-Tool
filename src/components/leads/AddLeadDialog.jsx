import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateLead } from '@/hooks/useLeads';
import { PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Assuming you have a toast notification library

const AddLeadDialog = ({ isOpen, onOpenChange }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const { mutate: createLead, isLoading, isError, error } = useCreateLead();

  const onSubmit = (data) => {
    createLead(data, {
      onSuccess: () => {
        toast.success('Lead created successfully!');
        reset();
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(`Error creating lead: ${err.message || err.data?.message || 'Unknown error'}`);
        console.error('Error creating lead:', err);
      },
    });
  };

  const status = watch('status');
  const industry = watch('industry');
  const company_size = watch('company_size');
  const source = watch('source');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Lead</DialogTitle>
          <DialogDescription className="text-gray-300">
            Fill in the details to add a new sales lead.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-white">
              Name
            </Label>
            <Input id="name" {...register('name', { required: 'Name is required' })} className="col-span-3 bg-white/10 border-white/30 text-white placeholder:text-gray-400" />
            {errors.name && <p className="col-span-4 text-red-400 text-sm">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-white">
              Email
            </Label>
            <Input id="email" type="email" {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })} className="col-span-3 bg-white/10 border-white/30 text-white placeholder:text-gray-400" />
            {errors.email && <p className="col-span-4 text-red-400 text-sm">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right text-white">
              Company
            </Label>
            <Input id="company" {...register('company')} className="col-span-3 bg-white/10 border-white/30 text-white placeholder:text-gray-400" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-white">
              Phone
            </Label>
            <Input id="phone" {...register('phone')} className="col-span-3 bg-white/10 border-white/30 text-white placeholder:text-gray-400" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right text-white">
              Status
            </Label>
            <Select onValueChange={(value) => setValue('status', value)} value={status}>
              <SelectTrigger id="status" className="col-span-3 bg-white/10 border-white/30 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal Sent</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed_won">Closed Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="industry" className="text-right text-white">
              Industry
            </Label>
            <Select onValueChange={(value) => setValue('industry', value)} value={industry}>
              <SelectTrigger id="industry" className="col-span-3 bg-white/10 border-white/30 text-white">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company_size" className="text-right text-white">
              Company Size
            </Label>
            <Select onValueChange={(value) => setValue('company_size', value)} value={company_size}>
              <SelectTrigger id="company_size" className="col-span-3 bg-white/10 border-white/30 text-white">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-1000">201-1000</SelectItem>
                <SelectItem value="1000+">1000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="source" className="text-right text-white">
              Source
            </Label>
            <Select onValueChange={(value) => setValue('source', value)} value={source}>
              <SelectTrigger id="source" className="col-span-3 bg-white/10 border-white/30 text-white">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="advertisement">Advertisement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right text-white">
              Notes
            </Label>
            <Textarea id="notes" {...register('notes')} className="col-span-3 bg-white/10 border-white/30 text-white placeholder:text-gray-400" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? 'Adding...' : 'Add Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadDialog;