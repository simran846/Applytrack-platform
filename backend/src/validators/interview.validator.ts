import { z } from 'zod';
import { InterviewType, InterviewStatus } from '@prisma/client';

export const createInterviewSchema = z.object({
  applicationId: z.string().uuid('Invalid application ID'),
  interviewDate: z.string().datetime().or(z.string().min(10)),
  interviewType: z.nativeEnum(InterviewType).optional().default(InterviewType.TECHNICAL),
  interviewRound: z.string().min(1).max(50).optional().default('Round 1'),
  meetingLink: z.string().url('Invalid meeting link').optional().or(z.literal('')).nullable(),
  location: z.string().max(100).optional().nullable(),
  preparationNotes: z.string().optional().nullable(),
  feedback: z.string().optional().nullable(),
  status: z.nativeEnum(InterviewStatus).optional().default(InterviewStatus.SCHEDULED)
});

export const updateInterviewSchema = createInterviewSchema.partial().omit({ applicationId: true });

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
