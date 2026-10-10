'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Application, Interview, InterviewType, InterviewStatus } from '@/types';
import { interviewsApi } from '@/lib/api';
import { useToast } from '../ui/Toast';

const interviewSchema = z.object({
  applicationId: z.string().min(1, 'Please select an application'),
  interviewDate: z.string().min(1, 'Interview date & time is required'),
  interviewType: z.enum(['PHONE_SCREEN', 'TECHNICAL', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'HR', 'FINAL_ROUND', 'TAKE_HOME', 'OTHER']),
  interviewRound: z.string().min(1, 'Interview round name is required'),
  meetingLink: z.string().url('Invalid URL').optional().or(z.literal('')),
  location: z.string().optional(),
  preparationNotes: z.string().optional(),
  feedback: z.string().optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'])
});

type InterviewFormValues = z.infer<typeof interviewSchema>;

export interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: Application[];
  selectedApplication?: Application | null;
  interviewToEdit?: Interview | null;
  onSaved: () => void;
}

export function ScheduleInterviewModal({
  isOpen,
  onClose,
  applications,
  selectedApplication,
  interviewToEdit,
  onSaved
}: ScheduleInterviewModalProps) {
  const { success, error: toastError } = useToast();
  const isEditing = !!interviewToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      applicationId: selectedApplication?.id || '',
      interviewDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
      interviewType: 'TECHNICAL',
      interviewRound: 'Technical Round 1',
      meetingLink: '',
      location: 'Google Meet / Zoom',
      preparationNotes: '',
      feedback: '',
      status: 'SCHEDULED'
    }
  });

  useEffect(() => {
    if (interviewToEdit) {
      reset({
        applicationId: interviewToEdit.applicationId,
        interviewDate: new Date(interviewToEdit.interviewDate).toISOString().slice(0, 16),
        interviewType: interviewToEdit.interviewType,
        interviewRound: interviewToEdit.interviewRound,
        meetingLink: interviewToEdit.meetingLink || '',
        location: interviewToEdit.location || '',
        preparationNotes: interviewToEdit.preparationNotes || '',
        feedback: interviewToEdit.feedback || '',
        status: interviewToEdit.status
      });
    } else if (selectedApplication) {
      reset({
        applicationId: selectedApplication.id,
        interviewDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
        interviewType: 'TECHNICAL',
        interviewRound: 'Technical Round 1',
        meetingLink: '',
        location: 'Google Meet',
        preparationNotes: '',
        feedback: '',
        status: 'SCHEDULED'
      });
    }
  }, [interviewToEdit, selectedApplication, reset, isOpen]);

  const onSubmit = async (values: InterviewFormValues) => {
    try {
      const payload = {
        ...values,
        interviewDate: new Date(values.interviewDate).toISOString()
      };

      if (isEditing && interviewToEdit) {
        await interviewsApi.update(interviewToEdit.id, payload);
        success('Interview updated', 'Successfully modified interview details');
      } else {
        await interviewsApi.create(payload);
        success('Interview scheduled', `Scheduled ${values.interviewRound}`);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save interview';
      toastError('Interview Error', msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Update Interview Round' : 'Schedule New Interview'}
      description="Attach an interview stage, meeting link, and preparation notes."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Application Selector */}
        {!isEditing && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Target Application *
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('applicationId')}
            >
              <option value="">-- Choose Application --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} — {app.jobTitle}
                </option>
              ))}
            </select>
            {errors.applicationId && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.applicationId.message}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Interview Date & Time"
            type="datetime-local"
            required
            error={errors.interviewDate?.message}
            {...register('interviewDate')}
          />

          <Select label="Interview Type" {...register('interviewType')}>
            <option value="PHONE_SCREEN">Phone Screen</option>
            <option value="TECHNICAL">Technical / Coding</option>
            <option value="SYSTEM_DESIGN">System Design</option>
            <option value="BEHAVIORAL">Behavioral / Leadership</option>
            <option value="HR">HR / Recruiter Call</option>
            <option value="FINAL_ROUND">Final Round Loop</option>
            <option value="TAKE_HOME">Take-home Bug Bash</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Round Name"
            placeholder="e.g. Technical Round 1, System Design"
            required
            error={errors.interviewRound?.message}
            {...register('interviewRound')}
          />

          <Select label="Status" {...register('status')}>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="RESCHEDULED">Rescheduled</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Meeting Video Link"
            type="url"
            placeholder="https://meet.google.com/..."
            error={errors.meetingLink?.message}
            {...register('meetingLink')}
          />
          <Input
            label="Meeting Location / Platform"
            placeholder="Google Meet, Zoom, Chime"
            error={errors.location?.message}
            {...register('location')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Preparation Strategy & Key Topics
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Brush up on concurrency, graph BFS/DFS, and STAR method leadership stories."
            {...register('preparationNotes')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Post-Interview Feedback / Debrief Notes
          </label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Answered dynamic programming question with O(n) space optimization. Went smoothly."
            {...register('feedback')}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Schedule Interview'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
