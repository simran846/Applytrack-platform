import { PrismaClient, ApplicationStatus, WorkMode, Priority, InterviewType, InterviewStatus, ReminderType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing test/demo data safely
  const existingUser = await prisma.user.findUnique({
    where: { email: 'demo@applytrack.dev' }
  });

  if (existingUser) {
    console.log('Cleaning existing demo data...');
    await prisma.user.delete({
      where: { id: existingUser.id }
    });
  }

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@applytrack.dev',
      passwordHash: hashedPassword,
      name: 'Alex Morgan',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      targetRole: 'Software Development Engineer (SWE) Intern',
      bio: 'Junior CS student passionate about distributed systems, backend architectures, and developer tooling. Actively looking for Summer 2027 SDE internships.'
    }
  });

  console.log(`Created demo user: ${demoUser.email} (Password: Password123!)`);

  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const daysAhead = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  // Application 1: Google
  const googleApp = await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Google',
      jobTitle: 'Software Engineering Intern - Summer 2027',
      jobDescription: 'Design, develop, test, deploy, maintain, and enhance software solutions across Google Cloud and Core Search infrastructure.',
      companyWebsite: 'https://careers.google.com',
      jobPostingUrl: 'https://careers.google.com/jobs/results/123456',
      applicationDate: daysAgo(20),
      applicationDeadline: daysAhead(10),
      location: 'Mountain View, CA / Remote',
      workMode: WorkMode.HYBRID,
      employmentType: 'Summer Internship (12 weeks)',
      salaryOrStipend: '$58 / hr + Housing Stipend',
      status: ApplicationStatus.INTERVIEW,
      priority: Priority.TOP_CHOICE,
      recruiterName: 'Sarah Jenkins',
      recruiterEmail: 'sarah.j@google.recruiting.com',
      notes: 'Passed initial screening call. Practicing tree algorithms and concurrency questions.',
      interviews: {
        create: [
          {
            userId: demoUser.id,
            interviewDate: daysAhead(3),
            interviewType: InterviewType.TECHNICAL,
            interviewRound: 'Technical Interview Round 1',
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            location: 'Google Meet',
            preparationNotes: 'Review Graph algorithms, Dijkstra, and Binary Tree traversals. Be ready for complexity questions.',
            status: InterviewStatus.SCHEDULED
          }
        ]
      },
      reminders: {
        create: [
          {
            userId: demoUser.id,
            title: 'Prepare for Google Technical Interview',
            description: 'Solve 3 medium LeetCode questions on sliding window and dynamic programming.',
            remindAt: daysAhead(2),
            type: ReminderType.INTERVIEW_PREP
          }
        ]
      }
    }
  });

  // Application 2: Amazon
  const amazonApp = await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Amazon',
      jobTitle: 'Software Development Engineer Intern',
      jobDescription: 'Build high-scale distributed systems and customer-facing APIs for AWS EC2 / S3 storage.',
      companyWebsite: 'https://amazon.jobs',
      jobPostingUrl: 'https://amazon.jobs/en/jobs/987654',
      applicationDate: daysAgo(45),
      applicationDeadline: daysAgo(10),
      location: 'Seattle, WA',
      workMode: WorkMode.ONSITE,
      employmentType: 'Summer Internship',
      salaryOrStipend: '$56 / hr + $2,500/mo Housing',
      status: ApplicationStatus.OFFER,
      priority: Priority.HIGH,
      recruiterName: 'David Chen',
      recruiterEmail: 'dchen@amazon.com',
      notes: 'Received official offer letter! Need to decide before the deadline.',
      interviews: {
        create: [
          {
            userId: demoUser.id,
            interviewDate: daysAgo(15),
            interviewType: InterviewType.TECHNICAL,
            interviewRound: 'Final 3x45 Interview Loop',
            meetingLink: 'https://chime.aws/123456',
            location: 'Amazon Chime',
            feedback: 'Strong problem solving on system design and Leadership Principles.',
            status: InterviewStatus.COMPLETED
          }
        ]
      }
    }
  });

  // Application 3: Stripe
  const stripeApp = await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Stripe',
      jobTitle: 'Backend Engineering Intern',
      jobDescription: 'Develop financial infrastructure APIs, high reliability transaction processors, and developer SDKs.',
      companyWebsite: 'https://stripe.com/jobs',
      jobPostingUrl: 'https://stripe.com/jobs/listing/stripe-swe-intern',
      applicationDate: daysAgo(14),
      applicationDeadline: daysAhead(15),
      location: 'San Francisco, CA',
      workMode: WorkMode.REMOTE,
      employmentType: 'Summer Internship',
      salaryOrStipend: '$62 / hr',
      status: ApplicationStatus.INTERVIEW,
      priority: Priority.TOP_CHOICE,
      recruiterName: 'Elena Rostova',
      recruiterEmail: 'elena@stripe.com',
      notes: 'Take-home bug bash test passed. System design & coding pair programming scheduled.',
      interviews: {
        create: [
          {
            userId: demoUser.id,
            interviewDate: daysAhead(6),
            interviewType: InterviewType.SYSTEM_DESIGN,
            interviewRound: 'Architecture & Coding Screen',
            meetingLink: 'https://zoom.us/j/9988776655',
            location: 'Zoom',
            preparationNotes: 'Review API idempotency keys, rate limiting strategies, and webhook retry mechanisms.',
            status: InterviewStatus.SCHEDULED
          }
        ]
      }
    }
  });

  // Application 4: Microsoft
  await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Microsoft',
      jobTitle: 'Software Engineer Intern - Azure Core',
      jobDescription: 'Work on hyper-scale infrastructure powering Azure Kubernetes Service and Virtual Machines.',
      companyWebsite: 'https://careers.microsoft.com',
      jobPostingUrl: 'https://careers.microsoft.com/us/en/job/112233',
      applicationDate: daysAgo(8),
      applicationDeadline: daysAhead(5),
      location: 'Redmond, WA',
      workMode: WorkMode.HYBRID,
      employmentType: 'Summer Internship',
      salaryOrStipend: '$52 / hr',
      status: ApplicationStatus.ONLINE_ASSESSMENT,
      priority: Priority.HIGH,
      notes: 'Received Codility Online Assessment link. 3 questions in 70 minutes.'
    }
  });

  // Application 5: Meta
  await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Meta',
      jobTitle: 'Enterprise Engineering Intern',
      jobDescription: 'Build internal tooling and high performance analytics pipelines.',
      companyWebsite: 'https://metacareers.com',
      applicationDate: daysAgo(5),
      location: 'Menlo Park, CA',
      workMode: WorkMode.ONSITE,
      employmentType: 'Summer Internship',
      status: ApplicationStatus.APPLIED,
      priority: Priority.MEDIUM,
      notes: 'Applied via employee referral.'
    }
  });

  // Application 6: Datadog
  await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Datadog',
      jobTitle: 'Software Engineer Intern - Observability',
      companyWebsite: 'https://datadoghq.com/careers',
      applicationDate: daysAgo(1),
      location: 'New York, NY',
      workMode: WorkMode.REMOTE,
      status: ApplicationStatus.WISHLIST,
      priority: Priority.MEDIUM,
      notes: 'Application opens next Monday. Resume tailored for telemetry and Go/Rust background.'
    }
  });

  // Application 7: Uber
  await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Uber',
      jobTitle: 'Software Engineer Intern - Marketplace',
      companyWebsite: 'https://uber.com/careers',
      applicationDate: daysAgo(30),
      location: 'San Francisco, CA',
      workMode: WorkMode.HYBRID,
      status: ApplicationStatus.REJECTED,
      priority: Priority.MEDIUM,
      notes: 'Received standard automated rejection email after resume screening.'
    }
  });

  // Application 8: Airbnb
  await prisma.application.create({
    data: {
      userId: demoUser.id,
      companyName: 'Airbnb',
      jobTitle: 'Software Engineer Intern - Core Services',
      companyWebsite: 'https://airbnb.com/careers',
      applicationDate: daysAgo(12),
      applicationDeadline: daysAhead(4),
      location: 'San Francisco, CA',
      workMode: WorkMode.REMOTE,
      status: ApplicationStatus.ONLINE_ASSESSMENT,
      priority: Priority.HIGH,
      notes: 'HackerRank test due this Sunday.'
    }
  });

  // Create Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: demoUser.id,
        applicationId: googleApp.id,
        actionType: 'INTERVIEW_SCHEDULED',
        description: 'Scheduled Technical Interview Round 1 with Google',
        createdAt: daysAgo(2)
      },
      {
        userId: demoUser.id,
        applicationId: amazonApp.id,
        actionType: 'STATUS_UPDATED',
        description: 'Offer letter received from Amazon for SDE Intern',
        createdAt: daysAgo(4)
      },
      {
        userId: demoUser.id,
        applicationId: stripeApp.id,
        actionType: 'STATUS_UPDATED',
        description: 'Advanced to Architecture & Coding Screen with Stripe',
        createdAt: daysAgo(3)
      },
      {
        userId: demoUser.id,
        applicationId: googleApp.id,
        actionType: 'APPLICATION_CREATED',
        description: 'Added application for Software Engineering Intern at Google',
        createdAt: daysAgo(20)
      }
    ]
  });

  console.log('✅ Seed data successfully inserted into MySQL!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
