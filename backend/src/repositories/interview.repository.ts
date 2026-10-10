import { prisma } from '../config/db';
import { Prisma } from '@prisma/client';

export class InterviewRepository {
  async findByIdAndUserId(id: string, userId: string) {
    return prisma.interview.findFirst({
      where: { id, userId },
      include: {
        application: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true,
            status: true,
            workMode: true
          }
        }
      }
    });
  }

  async findManyByUserId(userId: string) {
    return prisma.interview.findMany({
      where: { userId },
      include: {
        application: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true,
            status: true,
            workMode: true
          }
        }
      },
      orderBy: { interviewDate: 'asc' }
    });
  }

  async getUpcomingInterviews(userId: string, limit: number = 5) {
    const now = new Date();
    return prisma.interview.findMany({
      where: {
        userId,
        interviewDate: {
          gte: now
        }
      },
      include: {
        application: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true
          }
        }
      },
      orderBy: { interviewDate: 'asc' },
      take: limit
    });
  }

  async create(data: Prisma.InterviewUncheckedCreateInput) {
    return prisma.interview.create({
      data,
      include: {
        application: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true
          }
        }
      }
    });
  }

  async update(id: string, userId: string, data: Prisma.InterviewUncheckedUpdateInput) {
    return prisma.interview.update({
      where: { id, userId },
      data,
      include: {
        application: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true
          }
        }
      }
    });
  }

  async delete(id: string, userId: string) {
    return prisma.interview.delete({
      where: { id, userId }
    });
  }
}
