import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export const rateLimits = {
  signin: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m') }),
  signup: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m') }),
  submit: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '5 m') }),
}

export async function limit(key: string, limiter: keyof typeof rateLimits) {
  const ip = key
  const rl = rateLimits[limiter]
  return rl.limit(ip)
}


