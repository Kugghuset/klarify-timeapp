'use strict'

import _ from 'lodash';
import libphone from 'google-libphonenumber';
const {PhoneNumberUtil, PhoneNumberFormat, PhoneNumberType, AsYouTypeFormatter} = libphone;
const phoneUtil = PhoneNumberUtil.getInstance();

import country from './country';

/**
 * @param {Array} coll Collection to check *match* against
 * @param {Any|Any[]} match Item or items to look for in *coll*
 * @return {Boolean}
 */
export function contains(coll, match) {
  const _match = _.isArray(match)
    ? match
    : [match];

  // It's nothing and thus cannot contain anything
  return !!~_.indexOf(coll, match);
}

/**
 * @param {String} tel
 * @param {String} shortcode Defaults to 'se'
 * @return {Object}
 */
function getParsedPhonenumber(tel, shortcode = 'se') {
  // First try get the _shortcode
  let _shortcode = country.shortcodeByTel(tel, shortcode)

  // If none is found, or the number starts with a 0, use *shortcode*.
  if (!_shortcode || /^0/.test(tel)) { _shortcode = shortcode; }

  // Parse the phone number using google phonenumber util
  return _.attempt(() => phoneUtil.parse(tel, _shortcode));
}

/**
 * Cleans *tel* and returns a E164 complient (excluding the leading +) tel format.
 *
 * @throws Error Will only throw errors related to phoneUtil
 *
 * @param {String} tel The telephone number to clean
 * @param {String} shortcode The country shortcode to
 * @return {String} telephone number without the leading 0's or + sign
 */
export const clean = (tel, shortcode = 'se') => {
  // First try get the _shortcode
  let _shortcode = country.shortcodeByTel(tel, shortcode)

  // If none is found, or the number starts with a 0, use *shortcode*.
  if (!_shortcode || /^0/.test(tel)) { _shortcode = shortcode; }

  // Parse the phone number using google phonenumber util
  let _parsedPhonenumber = _.attempt(() => phoneUtil.parse(tel, _shortcode));

  if (_.isError(_parsedPhonenumber)) { return tel; }

  // Format the parsed phone number, remove the leading +
  return phoneUtil.format(_parsedPhonenumber, PhoneNumberFormat.E164).replace(/^\+/, '')
}

/**
 * Returns true or false for whether *tel*
 * is a valid telephone number.
 *
 * Wraps PhoneNumberUtil.isViablePhoneNumber.
 *
 * @param {String} tel
 * @return {Boolean}
 */
export const isValid = (tel) => PhoneNumberUtil.isViablePhoneNumber(tel);

/**
 * @param {String} tel Telephone number to pretty print
 * @param {String} shortcode The shortcode to use for pretty printing
 * @return {String}
 */
export function pretty(tel, shortcode = 'se') {
  // Parse the phone number using google phonenumber util
  const _parsedPhonenumber = getParsedPhonenumber(tel, shortcode);

  // Format the parsed phone number, remove the leading +
  return phoneUtil.format(_parsedPhonenumber, PhoneNumberFormat.INTERNATIONAL);
}

/**
 * @type {Number[]}
 */
const validMobileNumberTypes = [
  PhoneNumberType.MOBILE,
  PhoneNumberType.FIXED_LINE_OR_MOBILE
];

/**
 * Checks whether *tel* is a mobile number or not.
 *
 * @param {String} tel Phone number to check whether it's a mobile number or not
 * @return {Boolean}
 */
export function isMobile(tel, shortcode = 'se') {
  // Parse the phone number using google phonenumber util
  const _parsedPhonenumber = getParsedPhonenumber(tel, shortcode);

  return !_.isError(_parsedPhonenumber)
    ? contains(validMobileNumberTypes, phoneUtil.getNumberType(_parsedPhonenumber))
    : false;
}

export default {
  clean: clean,
  isValid: isValid,
  pretty: pretty,
  isMobile: isMobile,
}
