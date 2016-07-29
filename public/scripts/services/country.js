'use strict'

import _ from 'lodash';
import countries from 'world-countries';


/**
 * Finds the country of the which the supplied telephone number belongs to.
 *
 * @param {String} tel The telephone number to check the country of
 * @param {String} defaultCountry The country to return if none is found. Optional, defaults to 'se'
 * @return {String} Country code, example 'se' or 'gb'
 */
export function shortcodeByTel(tel, defaultShortcode = 'se') {
  // Return the default if the tel isn't a string or the start of the number is a single zero
  if (!_.isString(tel) || /^(0[1-9])/.test(tel)) {
    return defaultShortcode;
  }

  // Clean the start up
  const _tel = tel.replace(/^(\+|00)/, '');

  // Find the matching country
  const _country = _.findLast(countries, (c) => _.some(c.callingCode, (code) => (code && new RegExp('^' + code).test(_tel))));

  // Find the shortcode, there are countries where the shortcode isn't at _country.altSpellings[0]
  const _shortcode = _.find(_.get(_country, 'altSpellings'), (alt = '') => alt.length === 2);

  // If the country exists, return its short code, otherwise return the default value
  return !!_shortcode
    ? _shortcode
    : defaultShortcode;
}

/**
 * Finds the calling code for the supplied *shortcode*.
 *
 * @param {String} shortcode The country shortcode, such as 'se' or 'gb'
 * @param {String} defaultCallingCode The calling code to return if none is found. Optoinal, defaults to '46' (Sweden's calling code)
 * @return {String} Calling code, example '46', '44'
 */
export function callingCodeByShortcode(shortcode, defaultCallingCode = '46') {
  // If the shortcode is a number, convert to string
  const _shortcode = _.isNumber(shortcode)
    ? shortcode.toString()
    : shortcode;

  // If _shortcode isn't a string or it's falsy, return the default shortcode
  if (!_.isString(_shortcode) || !_shortcode) {
    return defaultCallingCode;
  }

  // Find the matching country
  const _country = _.find(countries, (c) => _.some(c.altSpellings, (alt = '') => (alt && new RegExp('^' + alt + '$', 'i').test(_shortcode))));

  // If the country exists, return its callingCode, otherwise return the default value
  return !!_.get(_country, 'callingCode')
    ? _country.callingCode
    : defaultCallingCode;
}

/**
 * Returns true or false for whether *value* is a country code or not.
 *
 * Note, the check is case-insensitive.
 *
 * @param {String} value Value to check if it's a country shortcode or not. Case-insensitive.
 * @param {Boolean} isStrict
 * @return {Boolean}
 */
export function isShortCode(value, isStrict) {
  // If it's not a string, it can't be a country code
  if (!_.isString(value)) { return false; }

  // Allow 'EN' to work as a short code, although it's not
  if (!isStrict && (value.toUpperCase() === 'EN' || value.toUpperCase() === 'ENG')) {
    return true;
  }

  // Return whether it is a country code or not.
  let _c = _.find(countries, (c) => _.some(c.altSpellings, (alt = '') => (alt && new RegExp('^' + alt + '$', 'i').test(value))));

  return !!_c;
}

export default {
  shortcodeByTel: shortcodeByTel,
  callingCodeByShortcode: callingCodeByShortcode,
  isShortCode: isShortCode,
}
