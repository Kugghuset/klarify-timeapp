'use strict'

import _ from 'lodash';
import Promise from 'bluebird';
import Browser from 'zombie';
import request from 'request';
import moment from 'moment';

import config from './../../config';
import utils from '../../utils/utils';

const __baseUrl = 'https://redovisa.timeapp.se';

/**
 * TODO:
 * - Create some sort of sessionId cache
 * - Figure out how long a session lasts
 */

/****************
 * Exports below
 ****************/

/**
 * @param {String} email The email of the user to log in
 * @param {String} password The password of the user to log in
 * @return {Promise<{ sessionId: String }>}
 */
export function login(email, password) {
  // Create a new browser instance
  const browser = new Browser({ debug: true });

  // Get the meta data for logs
  const _meta = { email };

  return new Promise((resolve, reject) => {
    const _url = __baseUrl + '/login';
    utils.log(`Visiting ${_url}`, 'info', _meta);
    browser.visit(_url, () => {
      // Get all inputs of type text and password
      const _inputs = browser.document.querySelectorAll('input[type=text],input[type=password]');

      _.forEach(_inputs, (input) => {
        if (/email/i.test(input.name)) {
          utils.log(`Filling email field.`, 'info', _meta);
          browser.fill(input.name, email);
        } else if (/password/i.test(input.name)) {
          utils.log(`Filling password field.`, 'info', _meta);
          browser.fill(input.name, password);
        } else {
          utils.log(`Found input with name not matching password or email: ${input.name}`, 'info', _.assign({}, _meta, { outerHML: input.outerHTML }));
        }
      });

      // Get the value of the login button
      const _loginText = _.chain(browser.document.querySelector('input[name=formLogin]'))
        .attempt(input => input.value)
        .thru(value => _.isError(value) ? 'Logga in' : value)
        .value();

      utils.log(`Clicking button: ${_loginText}`, 'info', _meta);

      browser.pressButton(_loginText, () => {
        utils.log(`Navigated to ${browser.url}`, 'info', _meta);

        // Check if user is logged in
        const _isLoggedIn = /\/mypage$/i.test(browser.url);

        // Is the user logged in?
        if (!_isLoggedIn) {
          // Get the error text
          const _errText = _.attempt(() => browser.document.querySelector('.alert>p').innerHTML);

          // Get the error message and log
          const _msg = _.isError(_errText)
            ? 'Could not log in'
            : `Could not log in. Reason: ${_errText}`;

          utils.log(_msg, 'info', _meta)
          return reject(new Error(_msg));
        }

        // Get the sessionId set by TimeApp
        const sessionId = utils.getCookie(browser.document.cookie, 'PHPSESSID');

        utils.log(`Got sessionId ${sessionId}`, 'info', _meta);

        resolve({ sessionId });
      });
    });
  });
}

/**
 * Generates reports belonging to *sessionId* between *dateFrom* to *dateTo*
 * matching *filter*.
 *
 * - sessionId is **required**
 * - If no *dateFrom* is provided, the beginning of the current month will be used
 * - If no *dateTo* is provided, the end of the current month will be used
 * - If no *filter* is provided, 'report' will be used
 *
 * @param {{ sessionId: String, dateFrom: Date, dateTo: Date, filter: String }} context
 * @return {Promise<{ keys: String[], rows: {}[], sessionId: String, dateFrom: Date, dateTo: Date, filter: String }>}
 */
export function generateReport(context) {
  return new Promise((resolve, reject) => {
    const {
      sessionId,
      dateFrom,
      dateTo,
      filter
    } = context;

    // sessionId is the only required property of *context*.
    if (!sessionId) {
      const err = new Error('Missing sessionId.')
      utils.log('Failed to get report', 'info', _.assign({}, context, { err: _.toString(err) }));
      return reject();
    }

    /**
     * Format the dates into YYYY-MM-DD.
     *
     * If *dateFrom* isn't a date, use the start of the current month,
     * otherwise use that date.
     *
     * *dateTo* will either be end of the current month
     * or the provided date.
     */
    const _dateFrom = !_.isDate(dateFrom)
      ? moment().startOf('month').format('YYYY-MM-DD')
      : moment(dateFrom).format('YYYY-MM-DD');

    const _dateTo = !_.isDate(dateTo)
      ? moment().endOf('month').format('YYYY-MM-DD')
      : moment(dateTo).format('YYYY-MM-DD');

    /**
     * Get the filter. Defaults to 'report' if filter is empty.
     */
    const _filter = _.isEmpty(filter) || !_.isString(filter)
      ? 'report'
      : _.toLower(filter);

    // Get the meta data for logging
    const _meta = { sessionId, _filter, _dateFrom, _dateTo };

    utils.log('Generating report', 'info', _meta);

    request({
      method: 'post',
      uri: __baseUrl + '/data/printer/userReports',
      formData: {
        printGlobals: `printInterval=1&printDateFrom=${_dateFrom}&printDateTo=${_dateTo}&printSort=0&printInvoiced=yes&printArchived=yes&printOrientation=0&printFormat=1`,
        printTitle: 'Sammanställning per användare osv',
        printFilter: 'report',
      },
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cookie': `PHPSESSID=${sessionId}`,
      },
    }, function (err, res, body) {
      // If a
      if (utils.literalRegExp('<!DOCTYPE html>').test(body)) {
        err = new Error('Incorrect sessionId or incorrect input');
      }

      if (err) {
        utils.log('Failed to get report', 'info', _.assign({}, _meta, { err: _.toString(err) }));
        return reject(err);
      }

      // Get all rows, which are separated by \r\n
      const _rows = body.split('\r\n');
      // And get all keys, which is the header row
      const _keys = _rows[0].split('\t');

      // Get the data from all but the first rows
      const data = _.chain(_rows.slice(1))
        // Split each line by the tab character
        .map(line => line.split('\t'))
        // Filter out any empty rows
        .filter(_.some)
        // Create objects of each row
        .map(values => _.reduce(values, (obj, val, i) => _.assign({}, obj, _.set({}, _keys[i], val)), {}))
        // Sort values by what's presumably the date row
        .orderBy(_keys[2], 'asc')
        .value();

      utils.log('Successfully receieved report', 'info', _.assign({}, _meta, { rowLength: data.length, keys: _keys }));

      const report = {
        rows: data,
        keys: _keys,
        dateFrom: new Date(_dateFrom),
        dateTo: new Date(_dateTo),
        filter: _filter,
        sessionId: sessionId,
      };

      resolve(report);
    });
  });
}

// login(config.timeApp.email, config.timeApp.password)
// .then(generateReport)
// .then(() => {})
// .catch(err => {});

export default {
  login: login,
  generateReport: generateReport,
}
