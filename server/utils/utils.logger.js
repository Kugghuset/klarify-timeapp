'use strict'

import winston from 'winston';

/**
 * Logger object, used for logging things to the stream.
 */
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      json: false,
      colorize: true,
      timestamp: true,
    })
  ],
  exitOnError: true
});

/**
 * Stream object
 */
const stream = {
  /**
   * @param {String} message Message to write to stream
   */
  write: (message) => { logger.info(message) }
};

// Attach the stream to logger.
logger.stream = stream;

export default logger;
