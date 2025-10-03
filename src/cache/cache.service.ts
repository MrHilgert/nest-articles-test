import { Injectable } from '@nestjs/common';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Injectable()
export class CacheService {
  private keyv: Keyv;

  constructor(namespace: string) {
    this.keyv = new Keyv({
      store: new KeyvRedis(process.env.REDIS_URL || 'redis://localhost:6379'),
      namespace,
    });

    this.keyv.on('error', err => console.error('Keyv Redis connection error:', err));
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.keyv.get(key);
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    await this.keyv.set(key, value, ttlMs);
  }

  async delete(key: string): Promise<void> {
    await this.keyv.delete(key);
  }
}