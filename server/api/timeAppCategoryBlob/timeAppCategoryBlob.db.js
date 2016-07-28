'use strict'

import _ from 'lodash';
import sql from 'seriate';
import mssql from 'mssql';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import config from '../../config';

/**
 * Returns a params object for *timeAppCategoryBlob*.
 *
 * @param {Object} timeAppCategoryBlob TimeAppCategoryBlob object
 * @return {Object}
 */
const getParams = (timeAppCategoryBlob = {}) => {
  return {
    timeAppCategoryBlobId: {
      type: sql.BigInt,
      val: timeAppCategoryBlob.timeAppCategoryBlobId,
    },
    timeAppReportId: {
      type: sql.BigInt,
      val: timeAppCategoryBlob.timeAppReportId,
    },
  };
};

/**
 * Initializes the timeAppCategoryBlob table.
 *
 * @param {Booelan} logSuccess Defaults to false
 * @return {Promise}
 */
export const initialize = (logSuccess = false) => new Promise((resolve, reject) => {
  // Execute the query
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryBlob.initialize.sql')
  })
  .then((res) => {
    if (logSuccess) {
      utils.log('TimeAppCategoryBlob table initialized.');
    }
    resolve(res);
  })
  .catch((err) => {
    utils.log('Could not initialize timeAppCategoryBlob table:');
    utils.log(err);
    reject(err);
  });
});

/**
 * Returns a promise of the *top* number of timeAppCategoryBlobs at page *page*.
 *
 * @param {Number} __top The top number of timeAppCategoryBlobs to get, optional
 * @param {Number} __page The page number at which to get *top* number of timeAppCategoryBlobs, optional
 * @return {Promise} -> {Object}
 */
export const find = (__top, __page) => new Promise((resolve, reject) => {
  // Get the top and offset if any
  let {top, offset} = utils.paginate(__top, __page);

  // No pagination will be used if *top* is undefined.
  let _query = _.isUndefined(top)
    ? sql.fromFile('./sql/timeAppCategoryBlob.find.sql')
    : utils.paginateQuery(sql.fromFile('./sql/timeAppCategoryBlob.find.sql'), 'FROM [dbo].[TimeAppCategoryBlob]', top, offset);

  // Execute the query
  sql.execute({
    query: _query
  })
  .then((timeAppCategoryBlobs) => resolve(utils.objectify(timeAppCategoryBlobs)))
  .catch(reject);
});

/**
 * Returns a promise of the timeAppCategoryBlobs at *timeAppCategoryBlobId*.
 *
 * @param {Number} timeAppCategoryBlobId The ID of the timeAppCategoryBlob
 * @return {Promise} -> {Object}
 */
export const findById = (timeAppCategoryBlobId) => new Promise((resolve, reject) => {
  // Execute the query and then objectify it if needed.
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryBlob.findById.sql'),
    params: {
      timeAppCategoryBlobId: {
        type: sql.BigInt,
        val: timeAppCategoryBlobId
      }
    }
  })
  .then((timeAppCategoryBlobs) => {
    // Resolve the timeAppCategoryBlob
    resolve(utils.objectify(timeAppCategoryBlobs[0]));
  })
  .catch(reject);
});

/**
 * Creates a timeAppCategoryBlob and returns it.
 *
 * @param {Object} timeAppCategoryBlob TimeAppCategoryBlob to create
 * @return {Promise} -> {Object}
 */
export const create = (timeAppCategoryBlob) => new Promise((resolve, reject) => {
  let _params = getParams(timeAppCategoryBlob);

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryBlob.create.sql'),
    params: _params,
  })
  .then((timeAppCategoryBlobs) => resolve(utils.objectify(timeAppCategoryBlobs[0])))
  .catch(reject)
});

/**
 * @param {Number} timeAppCategoryBlobId The ID of the timeAppCategoryBlob
 * @param {Object} timeAppCategoryBlob The timeAppCategoryBlob values to update with
 * @return {Promise} -> {Object}
 */
export const update = (timeAppCategoryBlobId, timeAppCategoryBlob) => new Promise((resolve, reject) => {
  // Get the params
  let _params = getParams(_.assign({}, timeAppCategoryBlob, { timeAppCategoryBlobId: timeAppCategoryBlobId }));

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryBlob.update.sql'),
    params: _params,
  })
  .then((timeAppCategoryBlobs) => resolve(utils.objectify(timeAppCategoryBlobs[0])))
  .catch(reject)
});

/**
 * Disables the timeAppCategoryBlob and returns a promise of the void that is the timeAppCategoryBlob.
 *
 * @param {Number} timeAppCategoryBlobId
 * @return {Promise} -> {Object}
 */
export const remove = (timeAppCategoryBlobId) => new Promise((resolve, reject) => {
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryBlob.disable.sql'),
    params: {
      timeAppCategoryBlobId: {
        type: sql.BigInt,
        val: timeAppCategoryBlobId
      }
    }
  })
  .then(resolve)
  .catch(reject);
});

/**
 * Inserts many timeAppCategoryBlobs into the DB.
 *
 * @param {Array} timeAppCategoryBlobs Array of timeAppCategoryBlobs to insert into the DB
 * @return {Promise} -> {Array} Array of the recently inserted timeAppCategoryBlobs
 */
export const createMany = (timeAppCategoryBlobs) => utils.createManySQL(timeAppCategoryBlobs, 'TimeAppCategoryBlob', __dirname, 'timeAppCategoryBlob');

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
  createMany: createMany
}
