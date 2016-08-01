'use strict'

import _ from 'lodash';
import Promise from 'bluebird';
import later from 'later';
import moment from 'moment';

import config from '../../config';
import utils from '../../utils/utils';
import timeApp from './../timeApp/timeApp.service';

/**
 * Sets the schedule to at 2 AM every day.
 * This will be either 4 AM or 3 AM in Sweden.
 */
const scheduleEveryDay = later.parse.recur()
  .on(2).hour();

function getReports() {
  const dateFrom = moment().subtract(30, 'days').toDate();
  const dateTo = moment().toDate();

  utils.log('Running scheduled update.', 'info', { dateFrom, dateTo });

  return timeApp.loginAndInsert(dateFrom, dateTo)
  .then(data => utils.logResolve(data, 'Scheduled update completed', 'info', { dateFrom, dateTo }))
  .catch(err => utils.log('Scheduled updated failed', 'error', { err: err.toString(),  dateFrom, dateTo }))
}

utils.log('Setting schedule to run at 2 AM every morning', 'info');

/**
 * Set the schedule using later.
 */
later.setInterval(getReports, scheduleEveryDay);

export default {

}
