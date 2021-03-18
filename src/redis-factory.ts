import type { RedisFactory } from '@via-profit-services/redis';
import IORedis, { RedisOptions, Redis } from 'ioredis';

import {
  DEFAULT_REDIS_HOST,
  DEFAULT_REDIS_PASSWORD,
  DEFAULT_REDIS_PORT,
} from './constants';

type Cache = {
  redis: Redis;
}

const cache: Cache = {
  redis: null,
}

const redisFactory: RedisFactory = (props, logger) => {

  if (cache.redis) {
    return cache.redis;
  }

  const redisOptions: RedisOptions = {
    port: DEFAULT_REDIS_PORT,
    host: DEFAULT_REDIS_HOST,
    password: DEFAULT_REDIS_PASSWORD,
    retryStrategy: (times: number) => Math.min(times * 50, 20000),
    ...props,
  };

  cache.redis = new IORedis(redisOptions);

  if (logger) {

    cache.redis.on('error', (err) => {
      logger.error(`Redis Common error ${err.errno}`, { err });
    });

    cache.redis.on('connect', () => {
      logger.debug('Redis common connection is Done');
    });

    cache.redis.on('reconnecting', () => {
      logger.debug('Redis common reconnecting');
    });

    cache.redis.on('close', () => {
      logger.debug('Redis common close');
    });
  }

  return cache.redis;
}

export default redisFactory;
