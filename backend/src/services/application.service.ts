import { ApplicationRepository, ApplicationFilterOptions } from '../repositories/application.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import { CreateApplicationInput, UpdateApplicationInput } from '../validators/application.validator';
import { NotFoundError } from '../utils/errors';
import { queueService } from './queue.service';
import { ApplicationStatus } from '@prisma/client';

export class ApplicationService {
  private appRepo: ApplicationRepository;
  private activityRepo: ActivityRepository;

  constructor() {
    this.appRepo = new ApplicationRepository();
    this.activityRepo = new ActivityRepository();
  }

  async getApplications(options: ApplicationFilterOptions) {
    return this.appRepo.findManyWithFilters(options);
  }

  async getApplicationById(id: string, userId: string) {
    const application = await this.appRepo.findByIdAndUserId(id, userId);
    if (!application) {
      throw new NotFoundError('Application not found or you do not have permission to view it');
    }
    return application;
  }

  async createApplication(userId: string, data: CreateApplicationInput) {
    const application = await this.appRepo.create({
      userId,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      jobDescription: data.jobDescription,
      companyWebsite: data.companyWebsite || null,
      jobPostingUrl: data.jobPostingUrl || null,
      applicationDate: data.applicationDate ? new Date(data.applicationDate) : new Date(),
      applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null,
      location: data.location || 'Not Specified',
      workMode: data.workMode,
      employmentType: data.employmentType || 'Full-time Internship',
      salaryOrStipend: data.salaryOrStipend || null,
      status: data.status,
      priority: data.priority,
      recruiterName: data.recruiterName || null,
      recruiterEmail: data.recruiterEmail || null,
      notes: data.notes || null
    });

    await this.activityRepo.log(
      userId,
      application.id,
      'APPLICATION_CREATED',
      `Added application for ${data.jobTitle} at ${data.companyName}`,
      { status: data.status, priority: data.priority }
    );

    if (application.applicationDeadline) {
      const delay = application.applicationDeadline.getTime() - Date.now();
      if (delay > 0) {
        await queueService.scheduleReminder(
          {
            userId,
            applicationId: application.id,
            reminderType: 'APPLICATION_DEADLINE',
            title: `Deadline approaching for ${application.companyName}`,
            dueDate: application.applicationDeadline.toISOString()
          },
          delay - 24 * 60 * 60 * 1000 // 1 day before
        );
      }
    }

    return application;
  }

  async updateApplication(id: string, userId: string, data: UpdateApplicationInput) {
    const existing = await this.appRepo.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError('Application not found or you do not have permission to modify it');
    }

    const updated = await this.appRepo.update(id, userId, {
      ...(data.companyName ? { companyName: data.companyName } : {}),
      ...(data.jobTitle ? { jobTitle: data.jobTitle } : {}),
      ...(data.jobDescription !== undefined ? { jobDescription: data.jobDescription } : {}),
      ...(data.companyWebsite !== undefined ? { companyWebsite: data.companyWebsite || null } : {}),
      ...(data.jobPostingUrl !== undefined ? { jobPostingUrl: data.jobPostingUrl || null } : {}),
      ...(data.applicationDate !== undefined ? { applicationDate: data.applicationDate ? new Date(data.applicationDate) : null } : {}),
      ...(data.applicationDeadline !== undefined ? { applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : null } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.workMode ? { workMode: data.workMode } : {}),
      ...(data.employmentType !== undefined ? { employmentType: data.employmentType } : {}),
      ...(data.salaryOrStipend !== undefined ? { salaryOrStipend: data.salaryOrStipend } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.priority ? { priority: data.priority } : {}),
      ...(data.recruiterName !== undefined ? { recruiterName: data.recruiterName } : {}),
      ...(data.recruiterEmail !== undefined ? { recruiterEmail: data.recruiterEmail || null } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {})
    });

    // Check if status changed
    if (data.status && data.status !== existing.status) {
      await this.activityRepo.log(
        userId,
        id,
        'STATUS_UPDATED',
        `Status updated from ${existing.status} to ${data.status} for ${updated.companyName}`,
        { oldStatus: existing.status, newStatus: data.status }
      );
    } else {
      await this.activityRepo.log(
        userId,
        id,
        'APPLICATION_UPDATED',
        `Updated application details for ${updated.companyName}`,
        { fields: Object.keys(data) }
      );
    }

    return updated;
  }

  async updateStatus(id: string, userId: string, status: ApplicationStatus) {
    return this.updateApplication(id, userId, { status });
  }

  async deleteApplication(id: string, userId: string) {
    const existing = await this.appRepo.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError('Application not found or you do not have permission to delete it');
    }

    await this.appRepo.delete(id, userId);

    await this.activityRepo.log(
      userId,
      null,
      'APPLICATION_DELETED',
      `Deleted application for ${existing.jobTitle} at ${existing.companyName}`
    );

    return { id, message: 'Application deleted successfully' };
  }

  async exportUserData(userId: string) {
    return this.appRepo.getAllForUser(userId);
  }
}
