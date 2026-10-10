import { prisma } from '../config/db';
import { Prisma, ApplicationStatus, WorkMode, Priority } from '@prisma/client';

export interface ApplicationFilterOptions {
  userId: string;
  search?: string;
  status?: ApplicationStatus;
  workMode?: WorkMode;
  priority?: Priority;
  sortBy?: 'applicationDate' | 'applicationDeadline' | 'companyName' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}

export class ApplicationRepository {
  async findManyWithFilters(options: ApplicationFilterOptions) {
    const { userId, search, status, workMode, priority, sortBy = 'createdAt', sortOrder = 'desc', page, limit } = options;

    const where: Prisma.ApplicationWhereInput = {
      userId,
      ...(status ? { status } : {}),
      ...(workMode ? { workMode } : {}),
      ...(priority ? { priority } : {}),
      ...(search
        ? {
            OR: [
              { companyName: { contains: search } },
              { jobTitle: { contains: search } },
              { location: { contains: search } }
            ]
          }
        : {})
    };

    const skip = (page - 1) * limit;

    const [items, totalItems] = await prisma.$transaction([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          interviews: {
            orderBy: { interviewDate: 'asc' }
          }
        }
      }),
      prisma.application.count({ where })
    ]);

    return {
      items,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit) || 1,
      hasNextPage: page * limit < totalItems,
      hasPrevPage: page > 1
    };
  }

  async findByIdAndUserId(id: string, userId: string) {
    return prisma.application.findFirst({
      where: { id, userId },
      include: {
        interviews: {
          orderBy: { interviewDate: 'asc' }
        },
        reminders: {
          orderBy: { remindAt: 'asc' }
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async create(data: Prisma.ApplicationUncheckedCreateInput) {
    return prisma.application.create({
      data,
      include: {
        interviews: true
      }
    });
  }

  async update(id: string, userId: string, data: Prisma.ApplicationUncheckedUpdateInput) {
    return prisma.application.update({
      where: { id, userId },
      data,
      include: {
        interviews: true
      }
    });
  }

  async delete(id: string, userId: string) {
    return prisma.application.delete({
      where: { id, userId }
    });
  }

  async getAllForUser(userId: string) {
    return prisma.application.findMany({
      where: { userId },
      include: {
        interviews: {
          orderBy: { interviewDate: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getUpcomingDeadlines(userId: string, limit: number = 5) {
    const now = new Date();
    return prisma.application.findMany({
      where: {
        userId,
        applicationDeadline: {
          gte: now
        },
        status: {
          in: [ApplicationStatus.WISHLIST, ApplicationStatus.APPLIED, ApplicationStatus.ONLINE_ASSESSMENT]
        }
      },
      orderBy: { applicationDeadline: 'asc' },
      take: limit
    });
  }
}
