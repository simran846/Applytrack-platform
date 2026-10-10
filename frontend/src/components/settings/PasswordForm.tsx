'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { userApi } from '@/lib/api';
import { useToast } from '../ui/Toast';
import { Lock, Eye, EyeOff } from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and a number')
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function PasswordForm() {
  const { success, error: toastError } = useToast();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: ''
    }
  });

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      await userApi.changePassword(values);
      success('Password changed', 'Your password has been updated securely.');
      reset();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update password. Check current password.';
      toastError('Password Error', msg);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle p-6 space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Security & Password</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Ensure your account is protected with a strong password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Current Password"
            type={showCurrent ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <Input
            label="New Password"
            type={showNew ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
        </div>

        <div className="pt-2 text-right">
          <Button type="submit" isLoading={isSubmitting}>
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
}
