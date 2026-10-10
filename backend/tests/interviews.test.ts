import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/db';

describe('Interviews and Analytics API Endpoints', () => {
  let token: string;
  let userId: string;
  let applicationId: string;
  let interviewId: string;

  beforeAll(async () => {
    const regRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Interview Tester',
      email: `tester_${Date.now()}@example.com`,
      password: 'Password123!'
    });
    token = regRes.body.data.token;
    userId = regRes.body.data.user.id;

    // Create an application first
    const appRes = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        companyName: 'Apple',
        jobTitle: 'iOS Software Engineer Intern',
        status: 'APPLIED',
        workMode: 'HYBRID'
      });
    applicationId = appRes.body.data.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: userId }
    });
    await prisma.$disconnect();
  });

  describe('Interviews CRUD', () => {
    it('should schedule an interview and automatically update application status to INTERVIEW', async () => {
      const interviewDate = new Date(Date.now() + 86400000 * 3).toISOString();
      const res = await request(app)
        .post('/api/v1/interviews')
        .set('Authorization', `Bearer ${token}`)
        .send({
          applicationId,
          interviewDate,
          interviewType: 'TECHNICAL',
          interviewRound: 'Round 1 System Design',
          meetingLink: 'https://apple.webex.com/meet/1234',
          preparationNotes: 'Review Swift and CoreData concepts'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.interviewRound).toBe('Round 1 System Design');
      interviewId = res.body.data.id;

      // Verify application status updated
      const appCheck = await request(app)
        .get(`/api/v1/applications/${applicationId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(appCheck.body.data.status).toBe('INTERVIEW');
    });

    it('should retrieve all user scheduled interviews', async () => {
      const res = await request(app)
        .get('/api/v1/interviews')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should update interview feedback', async () => {
      const res = await request(app)
        .patch(`/api/v1/interviews/${interviewId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          feedback: 'Went very well! Answered concurrency questions cleanly.'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.feedback).toContain('concurrency');
    });
  });

  describe('Analytics Overview', () => {
    it('should calculate accurate metrics and conversion rates', async () => {
      const res = await request(app)
        .get('/api/v1/analytics/overview')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.metrics.total).toBe(1);
      expect(res.body.data.metrics.interviews).toBe(1);
      expect(res.body.data.metrics.interviewConversionRate).toBe(100);
      expect(res.body.data.monthlyTrend).toBeDefined();
      expect(res.body.data.workModeDistribution).toBeDefined();
    });
  });
});
