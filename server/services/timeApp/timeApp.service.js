'use strict'

import _ from 'lodash';
import Promise from 'bluebird';
import Browser from 'zombie';
import request from 'request';

import config from './../../config';
import utils from '../../utils/utils';

const browser = new Browser({ debug: true });

const __baseUrl = 'https://redovisa.timeapp.se';

/**
 * @param {String} email The email of the user to log in
 * @param {String} password The password of the user to log in
 * @return {Promise<{ sessionId: String }>}
 */
export function login(email, password) {

  const _meta = { email };

  return new Promise((resolve, reject) => {
    const _url = __baseUrl + '/login';
    utils.log(`Visiting ${_url}`);
    browser.visit(_url, () => {
      // Get all inputs of type text and password
      const _inputs = browser.document.querySelectorAll('input[type=text],input[type=password]');

      _.forEach(_inputs, (input) => {
        if (/email/i.test(input.name)) {
          utils.log(`Filling email field.`, undefined, _meta);
          browser.fill(input.name, email);
        } else if (/password/i.test(input.name)) {
          utils.log(`Filling password field.`);
          browser.fill(input.name, password);
        } else {
          utils.log(`Found input with name not matching password or email: ${input.name}`, input.outerHTML);
        }
      });

      browser.pressButton('Logga in', () => {
        utils.log(`Navigated to ${browser.url}`, _meta);

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

          utils.log(_msg, undefined, _meta)
          return reject(new Error(_msg));
        }

        // Get the sessionId set by TimeApp
        const sessionId = utils.getCookie(browser.document.cookie, 'PHPSESSID');

        utils.log(`Got sessionId ${sessionId}`, undefined, _meta);

        resolve({ sessionId });
      });
    });
  });
}

/**
 * @param {String} sessionId
 * @return {Promise<{}>}
 */
export function generateReport(sessionId) {
  return new Promise((resolve, reject) => {
    request({
      method: 'post',
      uri: __baseUrl + '/data/printer/userReports',
      formData: {
        printGlobals: 'printInterval=1&printDateFrom=2016-01-01&printDateTo=2016-07-31&printSort=0&printInvoiced=yes&printOrientation=0&printFormat=1',
        printTitle: 'Sammanställning per användare osv',
        printFilter: 'report',
      },
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cookie': `PHPSESSID=${sessionId}`,
      },
    }, function (err, res, body) {
      const _rows = body.split('\r\n');
      const _keys = _rows[0].split('\t');

      const data = _.chain(_rows.slice(1))
        .map(line => line.split('\t'))
        .map(values => _.reduce(values, (obj, val, i) => _.assign({}, obj, _.set({}, _keys[i], val)), {}))
        .value();

      resolve({ rows: data, keys: _keys });
    });
  });
}

// login(config.timeApp.email, config.timeApp.password)
// .then(({sessionId}) => generateReport(sessionId))
// .then(data => console.log(data))
// .catch(err => console.log(err));

export default {
  login: login,
}
