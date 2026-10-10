import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import { env } from '../config/env';

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(data: RegisterInput) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('An account with this email address already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const user = await this.userRepo.create({
      name: data.name,
      email: data.email,
      passwordHash,
      targetRole: data.targetRole || 'Software Development Engineer'
    });

    const token = this.generateToken(user.id, user.email, user.name);

    return { user, token };
  }

  async login(data: LoginInput) {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.email, user.name);

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      targetRole: user.targetRole,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return { user: safeUser, token };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  generateToken(id: string, email: string, name: string): string {
    return jwt.sign(
      { id, email, name },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}
