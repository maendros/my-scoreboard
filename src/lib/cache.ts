import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

class Cache {
  async set(key: string, value: any) {
    await redis.set(key, value);
    console.log(
      `Redis Cache SET: ${key}, value length: ${
        Array.isArray(value) ? value.length : "not array"
      }`
    );
  }

  async get<T>(key: string): Promise<T | undefined> {
    const value = (await redis.get(key)) as T;
    console.log(`Redis Cache GET: ${key}, found: ${!!value}`);
    return value;
  }

  async keys(): Promise<string[]> {
    return redis.keys("*");
  }
}

export const teamCache = new Cache();
