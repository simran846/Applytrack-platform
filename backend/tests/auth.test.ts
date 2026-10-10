import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/db';

describe('Auth API Endpoints', () => {
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  afterAll(async () => {
    // Cleanup test user
    await prisma.user.deleteMany({
      where: { email: { contains: 'test_' } }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully and return token and user data', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Jane Doe',
          email: testEmail,
          password: testPassword,
          targetRole: 'Software Engineer Intern'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(testEmail.toLowerCase());
      expect(res.body.data.token).toBeDefined();
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject duplicate email registration', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Jane Duplicate',
          email: testEmail,
          password: testPassword
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('should reject invalid password without required complexity', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Invalid User',
          email: `invalid_${Date.now()}@example.com`,
          password: 'simple'
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should authenticate user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testEmail,
          password: testPassword
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword99!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user when authenticated with Bearer token', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: testPassword });

      const token = loginRes.body.data.token;

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(testEmail.toLowerCase());
      expect(res.body.data.name).toBe('Jane Doe');
    });

    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
