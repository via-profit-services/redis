import { Middleware, ServerError } from '@via-profit-services/core';
import { RedisMiddlewareFactory } from '@via-profit-services/redis';

import redisFactory from './redis-factory';

const middlewareFactory: RedisMiddlewareFactory = (config) => {
  const middleware: Middleware = ({ context }) => {
    const { logger } = context;

    try {
      context.redis = context.redis ?? redisFactory(config, logger.server);

      return {
        context,
      }

    } catch (err) {
      throw new ServerError('Failed to create Redis instance', { err })
    }
  };

  return middleware;
}

export default middlewareFactory;