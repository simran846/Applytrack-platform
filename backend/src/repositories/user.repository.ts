import { prisma } from '../config/db';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        targetRole: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase()
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        targetRole: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        targetRole: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
}
