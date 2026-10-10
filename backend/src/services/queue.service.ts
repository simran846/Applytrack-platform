import { Queue, Worker, Job } from 'bullmq';
import { redisClient, isRedisAvailable } from '../config/redis';
import { logger } from '../config/logger';

export interface ReminderJobData {
  userId: string;
  applicationId?: string;
  reminderType: string;
  title: string;
  dueDate: string;
}

class QueueService {
  private reminderQueue: Queue | null = null;
  private reminderWorker: Worker | null = null;

  constructor() {
    if (isRedisAvailable && redisClient) {
      try {
        this.reminderQueue = new Queue('reminders', {
          connection: redisClient
        });

        this.reminderWorker = new Worker(
          'reminders',
          async (job: Job<ReminderJobData>) => {
            logger.info(` Processing reminder job ${job.id} for user ${job.data.userId}: ${job.data.title}`);
            // Logic for sending in-app notification / deadline alert
            return { processed: true, at: new Date() };
          },
          { connection: redisClient }
        );

        this.reminderWorker.on('completed', (job) => {
          logger.info(` Reminder job ${job.id} completed successfully`);
        });

        this.reminderWorker.on('failed', (job, err) => {
          logger.error(` Reminder job ${job?.id} failed: ${err.message}`);
        });
      } catch (err) {
        logger.warn('Failed to initialize BullMQ queue, continuing in fallback mode');
      }
    }
  }

  async scheduleReminder(data: ReminderJobData, delayMs: number) {
    if (this.reminderQueue) {
      try {
        await this.reminderQueue.add('sendReminder', data, {
          delay: Math.max(0, delayMs),
          removeOnComplete: true,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          }
        });
        logger.info(` Scheduled Redis reminder for ${data.title} in ${Math.round(delayMs / 1000)}s`);
        return true;
      } catch (e) {
        logger.warn('Failed to schedule Redis reminder: ' + (e as Error).message);
      }
    }
    // Fallback log
    logger.info(`[Fallback Queue] Reminder created: "${data.title}" for ${data.dueDate}`);
    return false;
  }
}

export const queueService = new QueueService();
