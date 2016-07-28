'use strict'

import _ from 'lodash';
import sql from 'seriate';
import mssql from 'mssql';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import config from '../../config';

/**
 * Returns a params object for *timeAppCategoryResult*.
 *
 * @param {Object} timeAppCategoryResult TimeAppCategoryResult object
 * @return {Object}
 */
const getParams = (timeAppCategoryResult = {}) => {
  return {
    timeAppCategoryResultId: {
      type: sql.BigInt,
      val: timeAppCategoryResult.timeAppCategoryResultId,
    },
    isMatch: {
      type: sql.Bit,
      val: timeAppCategoryResult.isMatch,
    },
    timeAppCategoryId: {
      type: sql.BigInt,
      val: timeAppCategoryResult.timeAppCategoryId,
    },
    timeAppCategoryScoreId: {
      type: sql.BigInt,
      val: timeAppCategoryResult.timeAppCategoryScoreId,
    },
    timeAppReportId: {
      type: sql.BigInt,
      val: timeAppCategoryResult.timeAppReportId,
    },
    colName: {
      type: sql.VarChar(255),
      val: timeAppCategoryResult.colName,
    },
    value: {
      type: Int,
      val: timeAppCategoryResult.value,
    },
    categoryId: {
      type: sql.BigInt,
      val: timeAppCategoryResult.categoryId,
    },
    timeAppCategoryBlobId: {
      type: sql.BigInt,
      val: timeAppCategoryResult.timeAppCategoryBlobId,
    },
  };
};

/**
 * Initializes the timeAppCategoryResult table.
 *
 * @param {Booelan} logSuccess Defaults to false
 * @return {Promise}
 */
export const initialize = (logSuccess = false) => new Promise((resolve, reject) => {
  // Execute the query
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryResult.initialize.sql')
  })
  .then((res) => {
    if (logSuccess) {
      utils.log('TimeAppCategoryResult table initialized.');
    }
    resolve(res);
  })
  .catch((err) => {
    utils.log('Could not initialize timeAppCategoryResult table:');
    utils.log(err);
    reject(err);
  });
});

/**
 * Returns a promise of the *top* number of timeAppCategoryResults at page *page*.
 *
 * @param {Number} __top The top number of timeAppCategoryResults to get, optional
 * @param {Number} __page The page number at which to get *top* number of timeAppCategoryResults, optional
 * @return {Promise} -> {Object}
 */
export const find = (__top, __page) => new Promise((resolve, reject) => {
  // Get the top and offset if any
  let {top, offset} = utils.paginate(__top, __page);

  // No pagination will be used if *top* is undefined.
  let _query = _.isUndefined(top)
    ? sql.fromFile('./sql/timeAppCategoryResult.find.sql')
    : utils.paginateQuery(sql.fromFile('./sql/timeAppCategoryResult.find.sql'), 'FROM [dbo].[TimeAppCategoryResult]', top, offset);

  // Execute the query
  sql.execute({
    query: _query
  })
  .then((timeAppCategoryResults) => resolve(utils.objectify(timeAppCategoryResults)))
  .catch(reject);
});

/**
 * Returns a promise of the timeAppCategoryResults at *timeAppCategoryResultId*.
 *
 * @param {Number} timeAppCategoryResultId The ID of the timeAppCategoryResult
 * @return {Promise} -> {Object}
 */
export const findById = (timeAppCategoryResultId) => new Promise((resolve, reject) => {
  // Execute the query and then objectify it if needed.
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryResult.findById.sql'),
    params: {
      timeAppCategoryResultId: {
        type: sql.BigInt,
        val: timeAppCategoryResultId
      }
    }
  })
  .then((timeAppCategoryResults) => {
    // Resolve the timeAppCategoryResult
    resolve(utils.objectify(timeAppCategoryResults[0]));
  })
  .catch(reject);
});

/**
 * Creates a timeAppCategoryResult and returns it.
 *
 * @param {Object} timeAppCategoryResult TimeAppCategoryResult to create
 * @return {Promise} -> {Object}
 */
export const create = (timeAppCategoryResult) => new Promise((resolve, reject) => {
  let _params = getParams(timeAppCategoryResult);

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryResult.create.sql'),
    params: _params,
  })
  .then((timeAppCategoryResults) => resolve(utils.objectify(timeAppCategoryResults[0])))
  .catch(reject)
});

/**
 * @param {Number} timeAppCategoryResultId The ID of the timeAppCategoryResult
 * @param {Object} timeAppCategoryResult The timeAppCategoryResult values to update with
 * @return {Promise} -> {Object}
 */
export const update = (timeAppCategoryResultId, timeAppCategoryResult) => new Promise((resolve, reject) => {
  // Get the params
  let _params = getParams(_.assign({}, timeAppCategoryResult, { timeAppCategoryResultId: timeAppCategoryResultId }));

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryResult.update.sql'),
    params: _params,
  })
  .then((timeAppCategoryResults) => resolve(utils.objectify(timeAppCategoryResults[0])))
  .catch(reject)
});

/**
 * Disables the timeAppCategoryResult and returns a promise of the void that is the timeAppCategoryResult.
 *
 * @param {Number} timeAppCategoryResultId
 * @return {Promise} -> {Object}
 */
export const remove = (timeAppCategoryResultId) => new Promise((resolve, reject) => {
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryResult.disable.sql'),
    params: {
      timeAppCategoryResultId: {
        type: sql.BigInt,
        val: timeAppCategoryResultId
      }
    }
  })
  .then(resolve)
  .catch(reject);
});

/**
 * Inserts many timeAppCategoryResults into the DB.
 *
 * @param {Array} timeAppCategoryResults Array of timeAppCategoryResults to insert into the DB
 * @return {Promise} -> {Array} Array of the recently inserted timeAppCategoryResults
 */
export const createMany = (timeAppCategoryResults) => utils.createManySQL(timeAppCategoryResults, 'TimeAppCategoryResult', __dirname, 'timeAppCategoryResult');

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
  createMany: createMany
}
