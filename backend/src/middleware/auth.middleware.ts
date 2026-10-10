import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/errors';
import { prisma } from '../config/db';

export interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    // 1. Check HTTP-only cookie
    if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    // 2. Check Authorization Header (Bearer token)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new UnauthorizedError('Authentication token missing. Please sign in.'));
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;
      
      // Ensure user still exists in DB
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true }
      });

      if (!user) {
        return next(new UnauthorizedError('User associated with this token no longer exists.'));
      }

      req.user = user;
      return next();
    } catch (jwtErr) {
      return next(new UnauthorizedError('Invalid or expired authentication token.'));
    }
  } catch (error) {
    return next(error);
  }
}
