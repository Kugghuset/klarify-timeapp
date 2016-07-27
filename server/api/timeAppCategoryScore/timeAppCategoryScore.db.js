'use strict'

import _ from 'lodash';
import sql from 'seriate';
import mssql from 'mssql';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import config from '../../config';

/**
 * Returns a params object for *timeAppCategoryScore*.
 *
 * @param {Object} timeAppCategoryScore TimeAppCategoryScore object
 * @return {Object}
 */
const getParams = (timeAppCategoryScore = {}) => {
  return {
    timeAppCategoryScoreId: {
      type: sql.BigInt,
      val: timeAppCategoryScore.timeAppCategoryScoreId,
    },
    colName: {
      type: sql.VarChar(255),
      val: timeAppCategoryScore.colName,
    },
    value: {
      type: sql.Int,
      val: timeAppCategoryScore.value,
    },
  };
};

/**
 * Initializes the timeAppCategoryScore table.
 *
 * @param {Booelan} logSuccess Defaults to false
 * @return {Promise}
 */
export const initialize = (logSuccess = false) => new Promise((resolve, reject) => {
  // Execute the query
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryScore.initialize.sql')
  })
  .then((res) => {
    if (logSuccess) {
      utils.log('TimeAppCategoryScore table initialized.');
    }
    resolve(res);
  })
  .catch((err) => {
    utils.log('Could not initialize timeAppCategoryScore table:');
    utils.log(err);
    reject(err);
  });
});

/**
 * Returns a promise of the *top* number of timeAppCategoryScores at page *page*.
 *
 * @param {Number} __top The top number of timeAppCategoryScores to get, optional
 * @param {Number} __page The page number at which to get *top* number of timeAppCategoryScores, optional
 * @return {Promise} -> {Object}
 */
export const find = (__top, __page) => new Promise((resolve, reject) => {
  // Get the top and offset if any
  let {top, offset} = utils.paginate(__top, __page);

  // No pagination will be used if *top* is undefined.
  let _query = _.isUndefined(top)
    ? sql.fromFile('./sql/timeAppCategoryScore.find.sql')
    : utils.paginateQuery(sql.fromFile('./sql/timeAppCategoryScore.find.sql'), 'FROM [dbo].[TimeAppCategoryScore]', top, offset);

  // Execute the query
  sql.execute({
    query: _query
  })
  .then((timeAppCategoryScores) => resolve(utils.objectify(timeAppCategoryScores)))
  .catch(reject);
});

/**
 * Returns a promise of the timeAppCategoryScores at *timeAppCategoryScoreId*.
 *
 * @param {Number} timeAppCategoryScoreId The ID of the timeAppCategoryScore
 * @return {Promise} -> {Object}
 */
export const findById = (timeAppCategoryScoreId) => new Promise((resolve, reject) => {
  // Execute the query and then objectify it if needed.
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryScore.findById.sql'),
    params: {
      timeAppCategoryScoreId: {
        type: sql.BigInt,
        val: timeAppCategoryScoreId
      }
    }
  })
  .then((timeAppCategoryScores) => {
    // Resolve the timeAppCategoryScore
    resolve(utils.objectify(timeAppCategoryScores[0]));
  })
  .catch(reject);
});

/**
 * Creates a timeAppCategoryScore and returns it.
 *
 * @param {Object} timeAppCategoryScore TimeAppCategoryScore to create
 * @return {Promise} -> {Object}
 */
export const create = (timeAppCategoryScore) => new Promise((resolve, reject) => {
  let _params = getParams(timeAppCategoryScore);

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryScore.create.sql'),
    params: _params,
  })
  .then((timeAppCategoryScores) => resolve(utils.objectify(timeAppCategoryScores[0])))
  .catch(reject)
});

/**
 * @param {Number} timeAppCategoryScoreId The ID of the timeAppCategoryScore
 * @param {Object} timeAppCategoryScore The timeAppCategoryScore values to update with
 * @return {Promise} -> {Object}
 */
export const update = (timeAppCategoryScoreId, timeAppCategoryScore) => new Promise((resolve, reject) => {
  // Get the params
  let _params = getParams(_.assign({}, timeAppCategoryScore, { timeAppCategoryScoreId: timeAppCategoryScoreId }));

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryScore.update.sql'),
    params: _params,
  })
  .then((timeAppCategoryScores) => resolve(utils.objectify(timeAppCategoryScores[0])))
  .catch(reject)
});

/**
 * Disables the timeAppCategoryScore and returns a promise of the void that is the timeAppCategoryScore.
 *
 * @param {Number} timeAppCategoryScoreId
 * @return {Promise} -> {Object}
 */
export const remove = (timeAppCategoryScoreId) => new Promise((resolve, reject) => {
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryScore.disable.sql'),
    params: {
      timeAppCategoryScoreId: {
        type: sql.BigInt,
        val: timeAppCategoryScoreId
      }
    }
  })
  .then(resolve)
  .catch(reject);
});

/**
 * Inserts many timeAppCategoryScores into the DB.
 *
 * @param {Array} timeAppCategoryScores Array of timeAppCategoryScores to insert into the DB
 * @return {Promise} -> {Array} Array of the recently inserted timeAppCategoryScores
 */
export const createMany = (timeAppCategoryScores) => utils.createManySQL(timeAppCategoryScores, 'TimeAppCategoryScore', __dirname, 'timeAppCategoryScore');

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
  createMany: createMany
}
