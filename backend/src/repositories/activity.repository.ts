import { prisma } from '../config/db';

export class ActivityRepository {
  async log(userId: string, applicationId: string | null, actionType: string, description: string, metadata?: any) {
    return prisma.activityLog.create({
      data: {
        userId,
        applicationId,
        actionType,
        description,
        metadata: metadata ? metadata : undefined
      }
    });
  }

  async getRecentUserActivities(userId: string, limit: number = 10) {
    return prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        application: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true,
            status: true
          }
        }
      }
    });
  }
}
