'use strict'

import _ from 'lodash';
import sql from 'seriate';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import auth from '../../services/auth/auth.service';

/**
 * Returns a params object for *user*.
 *
 * @param {Object} user User object
 * @return {Object}
 */
const getParams = (user = {}) => {
  return {
    userId: {
      type: sql.BigInt,
      val: user.userId,
    },
    name: {
      type: sql.VarChar(255),
      val: user.name,
    },
    email: {
      type: sql.VarChar(255),
      val: user.email,
    },
    password: {
      type: sql.VarChar(255),
      val: user.password,
    }
  }
};

/**
 * Initializes the user table.
 *
 * @param {Booelan} logSuccess Defaults to false
 * @return {Promise}
 */
export const initialize = (logSuccess = false) => new Promise((resolve, reject) => {
  // Execute the query
  sql.execute({
    query: sql.fromFile('./sql/user.initialize.sql')
  })
  .then((res) => {
    if (logSuccess) {
      utils.log('User table initialized.');
    }
    resolve(res);
  })
  .catch((err) => {
    utils.log('Could not initialize user table:');
    utils.log(err);
    reject(err);
  });
});

/**
 * Returns a promise of the *top* number of users at page *page*.
 *
 * @param {Number} __top The top number of users to get, optional
 * @param {Number} __page The page number at which to get *top* number of users, optional
 * @return {Promise} -> {Object}
 */
export const find = (__top, __page) => new Promise((resolve, reject) => {
  // Get the top and offset if any
  let {top, offset} = utils.paginate(__top, __page);

  // No pagination will be used if *top* is undefined.
  let _query = _.isUndefined(top)
    ? sql.fromFile('./sql/user.find.sql')
    : utils.paginateQuery(sql.fromFile('./sql/user.find.sql'), 'FROM [dbo].[User]', top, offset);

  // Execute the query
  sql.execute({
    query: _query
  })
  .then((users) => resolve(utils.objectify(users)))
  .catch(reject);
});

/**
 * Returns a promise of the users at *userId*.
 *
 * @param {Number} userId The ID of the user
 * @param {Boolean} keepPassword Boolean value for whether the password should be returned, defaults to false
 * @return {Promise} -> {Object}
 */
export const findById = (userId, keepPassword = false) => new Promise((resolve, reject) => {
  // Execute the query and then objectify it if needed.
  sql.execute({
    query: sql.fromFile('./sql/user.findById.sql'),
    params: {
      userId: {
        type: sql.BigInt,
        val: userId
      }
    }
  })
  .then((users) => {
    // Should the password be returned?
    let _user = !!keepPassword
      ? users[0]
      : _.omit(users[0], 'password');

    // Resolve the user
    resolve(utils.objectify(_user));
  })
  .catch(reject);
});

/**
 * Creates a user and returns it.
 *
 * @param {Object} user User to create
 * @return {Promise} -> {Object}
 */
export const create = (user) => new Promise((resolve, reject) => {
  // Handle incorrecet input
  if (!user) { return reject(new Error('Cannot create user. None provided.')); }

  // Password and email are required
  if (!user.password) { return reject(new Error('Cannot create user. No password provided')); }
  if (!user.email) { return reject(new Error('Cannot create user. No email provided')); }

  // Encrypt the password
  let _password = auth.encryptPassword(user.password);

  let _params = getParams(_.assign({}, user, { password: _password }));

  sql.execute({
    query: sql.fromFile('./sql/user.create.sql'),
    params: _params,
  })
  .then((users) => resolve(utils.objectify(users[0])))
  .catch(reject)
});

/**
 * @param {Number} userId The ID of the user
 * @param {Object} user The user values to update with
 * @return {Promise} -> {Object}
 */
export const update = (userId, user) => new Promise((resolve, reject) => {
  // Get the params
  let _params = getParams(_.assign({}, user, { userId: userId }));

  sql.execute({
    query: sql.fromFile('./sql/user.update.sql'),
    params: _params,
  })
  .then((users) => utils.objectify(users[0]))
  .catch(reject)
});

/**
 * Disables the user and returns a promise of the void that is the user.
 *
 * @param {Number} userId
 * @return {Promise} -> {Object}
 */
export const remove = (userId) => new Promise((resolve, reject) => {
  sql.execute({
    query: sql.fromFile('./sql/user.disable.sql'),
    params: {
      userId: {
        type: sql.BigInt,
        val: userId
      }
    }
  })
  .then(resolve)
  .catch(reject);
});

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
}
