import Redis from 'ioredis'

let redisClient: Redis | null = null

const createRedisClient = () => {
  try {
    const client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null,
      connectTimeout: 3000, // Timeout setelah 3 detik
      retryStrategy(times) {
        if (times > 3) {
          console.log('Redis connection failed, switching to direct email mode')
          return null // Stop retrying after 3 attempts
        }
        const delay = Math.min(times * 50, 2000)
        return delay
      }
    })

    client.on('error', (error) => {
      console.error('Redis connection error:', error)
      redisClient = null
    })

    client.on('connect', () => {
      console.log('Successfully connected to Redis')
      redisClient = client
    })

    return client
  } catch (error) {
    console.error('Failed to create Redis client:', error)
    return null
  }
}

export const redis = createRedisClient()

export const isRedisAvailable = () => {
  return redisClient !== null && redisClient.status === 'ready'
}

export const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null,
    retryStrategy(times: number) {
      if (times > 3) return null
      const delay = Math.min(times * 50, 2000)
      return delay
    }
  }
} 