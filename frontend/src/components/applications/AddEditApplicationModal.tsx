'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Application, ApplicationStatus, WorkMode, Priority } from '@/types';
import { applicationsApi } from '@/lib/api';
import { useToast } from '../ui/Toast';

const applicationFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().optional(),
  companyWebsite: z.string().url('Invalid URL').optional().or(z.literal('')),
  jobPostingUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  applicationDate: z.string().optional(),
  applicationDeadline: z.string().optional(),
  location: z.string().optional(),
  workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']),
  employmentType: z.string().optional(),
  salaryOrStipend: z.string().optional(),
  status: z.enum(['WISHLIST', 'APPLIED', 'ONLINE_ASSESSMENT', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'TOP_CHOICE']),
  recruiterName: z.string().optional(),
  recruiterEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  notes: z.string().optional()
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export interface AddEditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationToEdit?: Application | null;
  onSaved: () => void;
}

export function AddEditApplicationModal({
  isOpen,
  onClose,
  applicationToEdit,
  onSaved
}: AddEditApplicationModalProps) {
  const { success, error: toastError } = useToast();
  const isEditing = !!applicationToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      companyName: '',
      jobTitle: 'Software Development Engineer Intern',
      companyWebsite: '',
      jobPostingUrl: '',
      applicationDate: new Date().toISOString().split('T')[0],
      applicationDeadline: '',
      location: 'Remote',
      workMode: 'REMOTE',
      employmentType: 'Summer Internship',
      salaryOrStipend: '',
      status: 'APPLIED',
      priority: 'MEDIUM',
      recruiterName: '',
      recruiterEmail: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (applicationToEdit) {
      reset({
        companyName: applicationToEdit.companyName,
        jobTitle: applicationToEdit.jobTitle,
        jobDescription: applicationToEdit.jobDescription || '',
        companyWebsite: applicationToEdit.companyWebsite || '',
        jobPostingUrl: applicationToEdit.jobPostingUrl || '',
        applicationDate: applicationToEdit.applicationDate ? new Date(applicationToEdit.applicationDate).toISOString().split('T')[0] : '',
        applicationDeadline: applicationToEdit.applicationDeadline ? new Date(applicationToEdit.applicationDeadline).toISOString().split('T')[0] : '',
        location: applicationToEdit.location || '',
        workMode: applicationToEdit.workMode,
        employmentType: applicationToEdit.employmentType || 'Summer Internship',
        salaryOrStipend: applicationToEdit.salaryOrStipend || '',
        status: applicationToEdit.status,
        priority: applicationToEdit.priority,
        recruiterName: applicationToEdit.recruiterName || '',
        recruiterEmail: applicationToEdit.recruiterEmail || '',
        notes: applicationToEdit.notes || ''
      });
    } else {
      reset({
        companyName: '',
        jobTitle: 'Software Development Engineer Intern',
        companyWebsite: '',
        jobPostingUrl: '',
        applicationDate: new Date().toISOString().split('T')[0],
        applicationDeadline: '',
        location: 'Remote',
        workMode: 'REMOTE',
        employmentType: 'Summer Internship',
        salaryOrStipend: '',
        status: 'APPLIED',
        priority: 'MEDIUM',
        recruiterName: '',
        recruiterEmail: '',
        notes: ''
      });
    }
  }, [applicationToEdit, reset, isOpen]);

  const onSubmit = async (values: ApplicationFormValues) => {
    try {
      const payload = {
        ...values,
        applicationDate: values.applicationDate ? new Date(values.applicationDate).toISOString() : undefined,
        applicationDeadline: values.applicationDeadline ? new Date(values.applicationDeadline).toISOString() : undefined
      };

      if (isEditing && applicationToEdit) {
        await applicationsApi.update(applicationToEdit.id, payload);
        success('Application updated', `Successfully saved changes for ${values.companyName}`);
      } else {
        await applicationsApi.create(payload);
        success('Application created', `Added ${values.jobTitle} at ${values.companyName}`);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save application';
      toastError('Save Error', msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit ${applicationToEdit.companyName} Application` : 'Add New Application'}
      description="Record details about the role, hiring stage, compensation, and recruiter contact."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            placeholder="e.g. Google, Stripe, Datadog"
            required
            error={errors.companyName?.message}
            {...register('companyName')}
          />
          <Input
            label="Job Title"
            placeholder="e.g. SDE Intern, Backend Engineer"
            required
            error={errors.jobTitle?.message}
            {...register('jobTitle')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select label="Application Status" {...register('status')}>
            <option value="WISHLIST">Wishlist</option>
            <option value="APPLIED">Applied</option>
            <option value="ONLINE_ASSESSMENT">Online Assessment</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </Select>

          <Select label="Work Mode" {...register('workMode')}>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </Select>

          <Select label="Priority" {...register('priority')}>
            <option value="TOP_CHOICE">Top Choice</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Application Date"
            type="date"
            error={errors.applicationDate?.message}
            {...register('applicationDate')}
          />
          <Input
            label="Deadline / OA Due Date"
            type="date"
            error={errors.applicationDeadline?.message}
            {...register('applicationDeadline')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Location"
            placeholder="e.g. Mountain View, CA / Remote"
            error={errors.location?.message}
            {...register('location')}
          />
          <Input
            label="Salary / Hourly Stipend"
            placeholder="e.g. $55 / hr + Housing"
            error={errors.salaryOrStipend?.message}
            {...register('salaryOrStipend')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Job Posting URL"
            type="url"
            placeholder="https://..."
            error={errors.jobPostingUrl?.message}
            {...register('jobPostingUrl')}
          />
          <Input
            label="Company Website"
            type="url"
            placeholder="https://..."
            error={errors.companyWebsite?.message}
            {...register('companyWebsite')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Recruiter Name"
            placeholder="e.g. Sarah Jenkins"
            error={errors.recruiterName?.message}
            {...register('recruiterName')}
          />
          <Input
            label="Recruiter Email"
            type="email"
            placeholder="recruiter@company.com"
            error={errors.recruiterEmail?.message}
            {...register('recruiterEmail')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Personal Notes & Interview Strategy
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300"
            placeholder="e.g. Applied with employee referral from John. Need to prepare tree and graph questions."
            {...register('notes')}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Application'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
