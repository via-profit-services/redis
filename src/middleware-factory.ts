import { Middleware, ServerError } from '@via-profit-services/core';
import { RedisMiddlewareFactory } from '@via-profit-services/redis';

import redisFactory from './redis-factory';

const middlewareFactory: RedisMiddlewareFactory = (config) => {

  const pool: ReturnType<Middleware> = {
    context: null,
  };

  const middleware: Middleware = (props) => {

    if (pool.context !== null) {
      return pool;
    }

    const { context } = props;
    const { logger } = context;

    try {
      pool.context = context;
      pool.context.redis = redisFactory(config, logger.server);

      return pool;
    } catch (err) {
      throw new ServerError('Failed to create Redis instance', { err })
    }
  };

  return middleware;
}

export default middlewareFactory;