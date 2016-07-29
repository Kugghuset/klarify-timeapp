'use strict'

import _ from 'lodash';
import sql from 'seriate';
import mssql from 'mssql';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import config from '../../config';

/**
 * Returns a params object for *timeAppCategoryCriteria*.
 *
 * @param {Object} timeAppCategoryCriteria TimeAppCategoryCriteria object
 * @return {Object}
 */
const getParams = (timeAppCategoryCriteria = {}) => {
  return {
    timeAppCategoryCriteriaId: {
      type: sql.BigInt,
      val: timeAppCategoryCriteria.timeAppCategoryCriteriaId,
    },
    colName: {
      type: sql.VarChar(255),
      val: timeAppCategoryCriteria.colName,
    },
    value: {
      type: sql.Int,
      val: timeAppCategoryCriteria.value,
    },
  };
};

/**
 * Initializes the timeAppCategoryCriteria table.
 *
 * @param {Booelan} logSuccess Defaults to false
 * @return {Promise}
 */
export const initialize = (logSuccess = false) => new Promise((resolve, reject) => {
  // Execute the query
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryCriteria.initialize.sql')
  })
  .then((res) => {
    if (logSuccess) {
      utils.log('TimeAppCategoryCriteria table initialized.');
    }
    resolve(res);
  })
  .catch((err) => {
    utils.log('Could not initialize timeAppCategoryCriteria table:');
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
    ? sql.fromFile('./sql/timeAppCategoryCriteria.find.sql')
    : utils.paginateQuery(sql.fromFile('./sql/timeAppCategoryCriteria.find.sql'), 'FROM [dbo].[TimeAppCategoryCriteria]', top, offset);

  // Execute the query
  sql.execute({
    query: _query
  })
  .then((timeAppCategoryScores) => resolve(utils.objectify(timeAppCategoryScores)))
  .catch(reject);
});

/**
 * Returns a promise of the timeAppCategoryScores at *timeAppCategoryCriteriaId*.
 *
 * @param {Number} timeAppCategoryCriteriaId The ID of the timeAppCategoryCriteria
 * @return {Promise} -> {Object}
 */
export const findById = (timeAppCategoryCriteriaId) => new Promise((resolve, reject) => {
  // Execute the query and then objectify it if needed.
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryCriteria.findById.sql'),
    params: {
      timeAppCategoryCriteriaId: {
        type: sql.BigInt,
        val: timeAppCategoryCriteriaId
      }
    }
  })
  .then((timeAppCategoryScores) => {
    // Resolve the timeAppCategoryCriteria
    resolve(utils.objectify(timeAppCategoryScores[0]));
  })
  .catch(reject);
});

/**
 * Creates a timeAppCategoryCriteria and returns it.
 *
 * @param {Object} timeAppCategoryCriteria TimeAppCategoryCriteria to create
 * @return {Promise} -> {Object}
 */
export const create = (timeAppCategoryCriteria) => new Promise((resolve, reject) => {
  let _params = getParams(timeAppCategoryCriteria);

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryCriteria.create.sql'),
    params: _params,
  })
  .then((timeAppCategoryScores) => resolve(utils.objectify(timeAppCategoryScores[0])))
  .catch(reject)
});

/**
 * @param {Number} timeAppCategoryCriteriaId The ID of the timeAppCategoryCriteria
 * @param {Object} timeAppCategoryCriteria The timeAppCategoryCriteria values to update with
 * @return {Promise} -> {Object}
 */
export const update = (timeAppCategoryCriteriaId, timeAppCategoryCriteria) => new Promise((resolve, reject) => {
  // Get the params
  let _params = getParams(_.assign({}, timeAppCategoryCriteria, { timeAppCategoryCriteriaId: timeAppCategoryCriteriaId }));

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryCriteria.update.sql'),
    params: _params,
  })
  .then((timeAppCategoryScores) => resolve(utils.objectify(timeAppCategoryScores[0])))
  .catch(reject)
});

/**
 * Disables the timeAppCategoryCriteria and returns a promise of the void that is the timeAppCategoryCriteria.
 *
 * @param {Number} timeAppCategoryCriteriaId
 * @return {Promise} -> {Object}
 */
export const remove = (timeAppCategoryCriteriaId) => new Promise((resolve, reject) => {
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryCriteria.disable.sql'),
    params: {
      timeAppCategoryCriteriaId: {
        type: sql.BigInt,
        val: timeAppCategoryCriteriaId
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
export const createMany = (timeAppCategoryScores) => utils.createManySQL(timeAppCategoryScores, 'TimeAppCategoryCriteria', __dirname, 'timeAppCategoryCriteria');

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
  createMany: createMany
}
