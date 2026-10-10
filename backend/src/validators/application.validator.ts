import { z } from 'zod';
import { ApplicationStatus, WorkMode, Priority } from '@prisma/client';

export const createApplicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(150),
  jobTitle: z.string().min(1, 'Job title is required').max(150),
  jobDescription: z.string().optional().nullable(),
  companyWebsite: z.string().url('Invalid website URL').optional().or(z.literal('')).nullable(),
  jobPostingUrl: z.string().url('Invalid job posting URL').optional().or(z.literal('')).nullable(),
  applicationDate: z.string().datetime().or(z.string().date()).optional().nullable(),
  applicationDeadline: z.string().datetime().or(z.string().date()).optional().nullable(),
  location: z.string().max(100).optional().nullable().default('Not Specified'),
  workMode: z.nativeEnum(WorkMode).optional().default(WorkMode.REMOTE),
  employmentType: z.string().max(100).optional().nullable().default('Full-time Internship'),
  salaryOrStipend: z.string().max(100).optional().nullable(),
  status: z.nativeEnum(ApplicationStatus).optional().default(ApplicationStatus.APPLIED),
  priority: z.nativeEnum(Priority).optional().default(Priority.MEDIUM),
  recruiterName: z.string().max(100).optional().nullable(),
  recruiterEmail: z.string().email('Invalid email').optional().or(z.literal('')).nullable(),
  notes: z.string().optional().nullable()
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const queryApplicationSchema = z.object({
  page: z.string().optional().default('1').transform((v) => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('10').transform((v) => Math.min(100, Math.max(1, parseInt(v, 10) || 10))),
  search: z.string().optional(),
  status: z.nativeEnum(ApplicationStatus).optional(),
  workMode: z.nativeEnum(WorkMode).optional(),
  priority: z.nativeEnum(Priority).optional(),
  sortBy: z.enum(['applicationDate', 'applicationDeadline', 'companyName', 'createdAt', 'updatedAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type QueryApplicationInput = z.infer<typeof queryApplicationSchema>;
