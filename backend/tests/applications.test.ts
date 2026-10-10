import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/db';

describe('Applications API Endpoints', () => {
  let userAToken: string;
  let userBToken: string;
  let userAId: string;
  let userBId: string;
  let createdAppId: string;

  beforeAll(async () => {
    // Register User A
    const resA = await request(app).post('/api/v1/auth/register').send({
      name: 'User A',
      email: `user_a_${Date.now()}@example.com`,
      password: 'Password123!'
    });
    userAToken = resA.body.data.token;
    userAId = resA.body.data.user.id;

    // Register User B
    const resB = await request(app).post('/api/v1/auth/register').send({
      name: 'User B',
      email: `user_b_${Date.now()}@example.com`,
      password: 'Password123!'
    });
    userBToken = resB.body.data.token;
    userBId = resB.body.data.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        id: { in: [userAId, userBId] }
      }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/applications', () => {
    it('should create an internship application for authenticated user', async () => {
      const res = await request(app)
        .post('/api/v1/applications')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          companyName: 'Spotify',
          jobTitle: 'Backend Engineering Intern',
          workMode: 'REMOTE',
          priority: 'HIGH',
          status: 'APPLIED',
          salaryOrStipend: '$50/hr'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.companyName).toBe('Spotify');
      expect(res.body.data.userId).toBe(userAId);
      createdAppId = res.body.data.id;
    });

    it('should reject application creation without required fields', async () => {
      const res = await request(app)
        .post('/api/v1/applications')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          companyName: ''
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/applications', () => {
    it('should list applications belonging exclusively to the authenticated user', async () => {
      const resA = await request(app)
        .get('/api/v1/applications')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(resA.status).toBe(200);
      expect(resA.body.data.length).toBeGreaterThanOrEqual(1);
      expect(resA.body.pagination.totalItems).toBeGreaterThanOrEqual(1);

      // User B should see 0 applications
      const resB = await request(app)
        .get('/api/v1/applications')
        .set('Authorization', `Bearer ${userBToken}`);

      expect(resB.status).toBe(200);
      expect(resB.body.data.length).toBe(0);
      expect(resB.body.pagination.totalItems).toBe(0);
    });

    it('should support search and status filtering', async () => {
      const res = await request(app)
        .get('/api/v1/applications?search=Spotify&status=APPLIED')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].companyName).toBe('Spotify');
    });
  });

  describe('Data Ownership Isolation', () => {
    it('should prevent User B from reading User A application', async () => {
      const res = await request(app)
        .get(`/api/v1/applications/${createdAppId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
    });

    it('should prevent User B from updating User A application', async () => {
      const res = await request(app)
        .patch(`/api/v1/applications/${createdAppId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ companyName: 'Hacked Company' });

      expect(res.status).toBe(404);
    });

    it('should prevent User B from deleting User A application', async () => {
      const res = await request(app)
        .delete(`/api/v1/applications/${createdAppId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH & DELETE /api/v1/applications/:id', () => {
    it('should allow User A to update status', async () => {
      const res = await request(app)
        .patch(`/api/v1/applications/${createdAppId}/status`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({ status: 'INTERVIEW' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('INTERVIEW');
    });

    it('should allow User A to delete application', async () => {
      const res = await request(app)
        .delete(`/api/v1/applications/${createdAppId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const verifyRes = await request(app)
        .get(`/api/v1/applications/${createdAppId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(verifyRes.status).toBe(404);
    });
  });
});
