'use strict'

import express from 'express';
import path from 'path';
import morgan from 'morgan';

const root = path.resolve();

/**
 * @param {Object} app Express instance
 * @param {Function} log To where morgan should log stuff
 */
export default (app, log) => {
  // Client side app
  app.use(express.static(root + '/public'));

  // Logging, should be below static stuff to only log API calls, and not assets
  app.use(morgan('combined', { stream: log.stream }))

  /*****************************************************************
   * Do not remove these,
   * it's used for the Yo generator to find where to inject routes.
   ****************************************************************/

  /// Start inject routes ///
  app.use('/api/users', require('./api/user').default);
  app.use('/api/time-app-employees', require('./api/timeAppEmployee').default);
  app.use('/api/time-app-reports', require('./api/timeAppReport').default);
  app.use('/api/time-app-discounts', require('./api/timeAppDiscount').default);
  app.use('/api/time-app-categories', require('./api/timeAppCategory').default);
  /// Stop inject routes ///

  /// Start inject services ///
  app.use('/services/auth', require('./services/auth').default);
  app.use('/services/time-app', require('./services/timeApp').default);
  /// Stop inject services ///
}
