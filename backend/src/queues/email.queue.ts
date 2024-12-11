import Bull, { Job, Queue as BullQueue } from 'bull'
import { EmailService } from '../services/email.service'
import { redisConfig } from '../config/redis.config'

// Define job types
interface EmailJob {
  type: 'welcome' | 'resetPassword' | 'passwordChanged'
  data: {
    email: string
    name?: string
    resetToken?: string
  }
}

const emailService = new EmailService()
let emailQueue: BullQueue<EmailJob> | null = null

try {
  emailQueue = new Bull<EmailJob>('email-queue', redisConfig)

  emailQueue.on('error', (error: Error) => {
    console.error('Queue error:', error)
    emailQueue = null
  })

  emailQueue.on('failed', (job: Job<EmailJob>, error: Error) => {
    console.error(`Email job ${job?.id} failed:`, error)
  })

  emailQueue.process(async (job: Job<EmailJob>) => {
    return processEmailJob(job.data)
  })
} catch (error) {
  console.error('Failed to initialize email queue:', error)
}

async function processEmailJob(jobData: EmailJob) {
  const { type, data } = jobData

  switch (type) {
    case 'welcome':
      await emailService.sendWelcomeEmail(data.email, data.name || '')
      break
    case 'resetPassword':
      if (!data.resetToken) throw new Error('Reset token is required')
      await emailService.sendResetPasswordEmail(data.email, data.resetToken)
      break
    case 'passwordChanged':
      await emailService.sendPasswordChangedEmail(data.email, data.name || '')
      break
    default:
      throw new Error(`Unknown email type: ${type}`)
  }
}

export async function addEmailToQueue(job: EmailJob) {
  if (!emailQueue) {
    throw new Error('Email queue not initialized')
  }

  try {
    await emailQueue.add(job, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      }
    })
  } catch (error) {
    console.error('Failed to add job to queue:', error)
    throw error
  }
}

// Cleanup pada shutdown
process.on('SIGTERM', async () => {
  if (emailQueue) {
    await emailQueue.close()
  }
}) 