import { prisma } from '../config/db';
import { ApplicationStatus, WorkMode, Priority } from '@prisma/client';
import { ActivityRepository } from '../repositories/activity.repository';
import { InterviewRepository } from '../repositories/interview.repository';
import { ApplicationRepository } from '../repositories/application.repository';

export class AnalyticsService {
  private activityRepo: ActivityRepository;
  private interviewRepo: InterviewRepository;
  private appRepo: ApplicationRepository;

  constructor() {
    this.activityRepo = new ActivityRepository();
    this.interviewRepo = new InterviewRepository();
    this.appRepo = new ApplicationRepository();
  }

  async getDashboardOverview(userId: string) {
    const applications = await prisma.application.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        workMode: true,
        priority: true,
        createdAt: true,
        applicationDate: true
      }
    });

    const totalApplications = applications.length;

    // Status counts
    const statusCounts: Record<ApplicationStatus, number> = {
      WISHLIST: 0,
      APPLIED: 0,
      ONLINE_ASSESSMENT: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
      WITHDRAWN: 0
    };

    // Workmode counts
    const workModeCounts: Record<WorkMode, number> = {
      REMOTE: 0,
      HYBRID: 0,
      ONSITE: 0
    };

    // Priority counts
    const priorityCounts: Record<Priority, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      TOP_CHOICE: 0
    };

    applications.forEach((app) => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
      if (workModeCounts[app.workMode] !== undefined) {
        workModeCounts[app.workMode]++;
      }
      if (priorityCounts[app.priority] !== undefined) {
        priorityCounts[app.priority]++;
      }
    });

    const appliedCount = totalApplications - statusCounts.WISHLIST;
    const interviewCount = statusCounts.INTERVIEW + statusCounts.OFFER; // reached interview stage
    const offerCount = statusCounts.OFFER;
    const rejectedCount = statusCounts.REJECTED;

    // Conversion rates calculation
    const interviewConversionRate = appliedCount > 0 ? ((interviewCount / appliedCount) * 100).toFixed(1) : '0.0';
    const offerConversionRate = appliedCount > 0 ? ((offerCount / appliedCount) * 100).toFixed(1) : '0.0';
    const interviewToOfferRate = interviewCount > 0 ? ((offerCount / interviewCount) * 100).toFixed(1) : '0.0';

    // Activity timeline over last 6 months
    const monthlyActivityMap: { [key: string]: { month: string; applications: number; interviews: number; offers: number } } = {};
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleString('en-US', { month: 'short' });
      monthlyActivityMap[key] = { month: monthLabel, applications: 0, interviews: 0, offers: 0 };
    }

    applications.forEach((app) => {
      const date = app.applicationDate || app.createdAt;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyActivityMap[key]) {
        monthlyActivityMap[key].applications++;
        if (app.status === ApplicationStatus.INTERVIEW || app.status === ApplicationStatus.OFFER) {
          monthlyActivityMap[key].interviews++;
        }
        if (app.status === ApplicationStatus.OFFER) {
          monthlyActivityMap[key].offers++;
        }
      }
    });

    const monthlyTrend = Object.values(monthlyActivityMap);

    const upcomingInterviews = await this.interviewRepo.getUpcomingInterviews(userId, 4);
    const upcomingDeadlines = await this.appRepo.getUpcomingDeadlines(userId, 4);
    const recentActivities = await this.activityRepo.getRecentUserActivities(userId, 8);

    return {
      metrics: {
        total: totalApplications,
        applied: statusCounts.APPLIED + statusCounts.ONLINE_ASSESSMENT + statusCounts.INTERVIEW + statusCounts.OFFER + statusCounts.REJECTED,
        wishlist: statusCounts.WISHLIST,
        oa: statusCounts.ONLINE_ASSESSMENT,
        interviews: statusCounts.INTERVIEW,
        offers: statusCounts.OFFER,
        rejected: statusCounts.REJECTED,
        withdrawn: statusCounts.WITHDRAWN,
        interviewConversionRate: Number(interviewConversionRate),
        offerConversionRate: Number(offerConversionRate),
        interviewToOfferRate: Number(interviewToOfferRate)
      },
      statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      })),
      workModeDistribution: Object.entries(workModeCounts).map(([mode, count]) => ({
        mode,
        count
      })),
      priorityDistribution: Object.entries(priorityCounts).map(([priority, count]) => ({
        priority,
        count
      })),
      monthlyTrend,
      upcomingInterviews,
      upcomingDeadlines,
      recentActivities
    };
  }

  async getDetailedAnalytics(userId: string) {
    const overview = await this.dashboardData(userId);
    return overview;
  }

  private async dashboardData(userId: string) {
    return this.getDashboardOverview(userId);
  }
}
