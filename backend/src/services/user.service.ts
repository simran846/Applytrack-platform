import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserProfileInput, ChangePasswordInput } from '../validators/user.validator';
import { NotFoundError, BadRequestError } from '../utils/errors';

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, data: UpdateUserProfileInput) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.userRepo.update(userId, {
      ...(data.name ? { name: data.name } : {}),
      ...(data.targetRole !== undefined ? { targetRole: data.targetRole } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl || null } : {})
    });
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await this.userRepo.findByEmail((await this.userRepo.findById(userId))?.email || '');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new BadRequestError('Incorrect current password');
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(data.newPassword, saltRounds);

    await this.userRepo.update(userId, {
      passwordHash: newPasswordHash
    });

    return { message: 'Password updated successfully' };
  }
}
