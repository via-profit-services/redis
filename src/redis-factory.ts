import type { RedisFactory } from '@via-profit-services/redis';
import IORedis, { RedisOptions } from 'ioredis';

import {
  DEFAULT_REDIS_HOST,
  DEFAULT_REDIS_PASSWORD,
  DEFAULT_REDIS_PORT,
} from './constants';

const redisFactory: RedisFactory = (props, logger) => {

  const redisOptions: RedisOptions = {
    port: DEFAULT_REDIS_PORT,
    host: DEFAULT_REDIS_HOST,
    password: DEFAULT_REDIS_PASSWORD,
    retryStrategy: (times: number) => Math.min(times * 50, 20000),
    ...props,
  };

  const redis = new IORedis(redisOptions);

  if (logger) {

    redis.on('error', (err) => {
      logger.error(`Redis Common error ${err.errno}`, { err });
    });

    redis.on('connect', () => {
      logger.debug('Redis common connection is Done');
    });

    redis.on('reconnecting', () => {
      logger.debug('Redis common reconnecting');
    });

    redis.on('close', () => {
      logger.debug('Redis common close');
    });
  }

  return redis;
}

export default redisFactory;
