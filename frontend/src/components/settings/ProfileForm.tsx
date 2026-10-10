'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User } from '@/types';
import { userApi } from '@/lib/api';
import { useToast } from '../ui/Toast';
import { useAuth } from '@/lib/auth-context';
import { User as UserIcon, Target, Mail } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  targetRole: z.string().optional(),
  bio: z.string().max(1000).optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export interface ProfileFormProps {
  user: User | null;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { success, error: toastError } = useToast();
  const { refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      targetRole: user?.targetRole || 'Software Development Engineer Intern',
      bio: user?.bio || ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        targetRole: user.targetRole || 'Software Development Engineer Intern',
        bio: user.bio || ''
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await userApi.updateProfile(values);
      await refreshUser();
      success('Profile updated', 'Your profile details have been saved.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toastError('Update Error', msg);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Personal Profile</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Update your public name, target internship role, and recruitment bio.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Alex Morgan"
            leftIcon={<UserIcon className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            value={user?.email || ''}
            disabled
            leftIcon={<Mail className="w-4 h-4" />}
            helperText="Email cannot be changed"
          />
        </div>

        <Input
          label="Target Role"
          placeholder="Software Development Engineer (SWE) Intern"
          leftIcon={<Target className="w-4 h-4" />}
          error={errors.targetRole?.message}
          {...register('targetRole')}
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Recruiting Bio & Focus Areas
          </label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Junior CS student passionate about distributed systems, backend architectures, and API design."
            {...register('bio')}
          />
        </div>

        <div className="pt-2 text-right">
          <Button type="submit" isLoading={isSubmitting}>
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
