import { InterviewRepository } from '../repositories/interview.repository';
import { ApplicationRepository } from '../repositories/application.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import { CreateInterviewInput, UpdateInterviewInput } from '../validators/interview.validator';
import { NotFoundError } from '../utils/errors';
import { ApplicationStatus } from '@prisma/client';
import { queueService } from './queue.service';

export class InterviewService {
  private interviewRepo: InterviewRepository;
  private appRepo: ApplicationRepository;
  private activityRepo: ActivityRepository;

  constructor() {
    this.interviewRepo = new InterviewRepository();
    this.appRepo = new ApplicationRepository();
    this.activityRepo = new ActivityRepository();
  }

  async getAllUserInterviews(userId: string) {
    return this.interviewRepo.findManyByUserId(userId);
  }

  async getInterviewById(id: string, userId: string) {
    const interview = await this.interviewRepo.findByIdAndUserId(id, userId);
    if (!interview) {
      throw new NotFoundError('Interview not found or you do not have permission to view it');
    }
    return interview;
  }

  async createInterview(userId: string, data: CreateInterviewInput) {
    // Verify application belongs to user
    const application = await this.appRepo.findByIdAndUserId(data.applicationId, userId);
    if (!application) {
      throw new NotFoundError('Application not found or you do not have permission to attach an interview to it');
    }

    const interview = await this.interviewRepo.create({
      userId,
      applicationId: data.applicationId,
      interviewDate: new Date(data.interviewDate),
      interviewType: data.interviewType,
      interviewRound: data.interviewRound || 'Round 1',
      meetingLink: data.meetingLink || null,
      location: data.location || null,
      preparationNotes: data.preparationNotes || null,
      feedback: data.feedback || null,
      status: data.status
    });

    // Automatically transition application status to INTERVIEW if currently APPLIED or OA
    if (application.status === ApplicationStatus.APPLIED || application.status === ApplicationStatus.ONLINE_ASSESSMENT || application.status === ApplicationStatus.WISHLIST) {
      await this.appRepo.update(application.id, userId, { status: ApplicationStatus.INTERVIEW });
    }

    await this.activityRepo.log(
      userId,
      application.id,
      'INTERVIEW_SCHEDULED',
      `Scheduled ${data.interviewRound} (${data.interviewType}) for ${application.companyName}`,
      { interviewDate: data.interviewDate, interviewType: data.interviewType }
    );

    // Schedule reminder for interview
    const delay = new Date(data.interviewDate).getTime() - Date.now() - 2 * 60 * 60 * 1000; // 2 hours before
    if (delay > 0) {
      await queueService.scheduleReminder(
        {
          userId,
          applicationId: application.id,
          reminderType: 'INTERVIEW_PREP',
          title: `Upcoming Interview with ${application.companyName}`,
          dueDate: new Date(data.interviewDate).toISOString()
        },
        delay
      );
    }

    return interview;
  }

  async updateInterview(id: string, userId: string, data: UpdateInterviewInput) {
    const existing = await this.interviewRepo.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError('Interview not found or you do not have permission to modify it');
    }

    const updated = await this.interviewRepo.update(id, userId, {
      ...(data.interviewDate ? { interviewDate: new Date(data.interviewDate) } : {}),
      ...(data.interviewType ? { interviewType: data.interviewType } : {}),
      ...(data.interviewRound !== undefined ? { interviewRound: data.interviewRound } : {}),
      ...(data.meetingLink !== undefined ? { meetingLink: data.meetingLink || null } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.preparationNotes !== undefined ? { preparationNotes: data.preparationNotes } : {}),
      ...(data.feedback !== undefined ? { feedback: data.feedback } : {}),
      ...(data.status ? { status: data.status } : {})
    });

    await this.activityRepo.log(
      userId,
      existing.applicationId,
      'INTERVIEW_UPDATED',
      `Updated interview details for ${existing.application.companyName}`
    );

    return updated;
  }

  async deleteInterview(id: string, userId: string) {
    const existing = await this.interviewRepo.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError('Interview not found or you do not have permission to delete it');
    }

    await this.interviewRepo.delete(id, userId);

    await this.activityRepo.log(
      userId,
      existing.applicationId,
      'INTERVIEW_DELETED',
      `Deleted scheduled interview for ${existing.application.companyName}`
    );

    return { id, message: 'Interview deleted successfully' };
  }
}
