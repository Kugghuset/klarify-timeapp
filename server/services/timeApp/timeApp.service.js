'use strict'

import _ from 'lodash';
import Promise from 'bluebird';

import Browser from 'zombie';

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

export default {
  login: login,
}
