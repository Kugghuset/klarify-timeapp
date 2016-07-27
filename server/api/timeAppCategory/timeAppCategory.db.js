'use strict'

import _ from 'lodash';
import sql from 'seriate';
import mssql from 'mssql';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import config from '../../config';

/**
 * Returns a params object for *timeAppCategory*.
 *
 * @param {Object} timeAppCategory TimeAppCategory object
 * @return {Object}
 */
const getParams = (timeAppCategory = {}) => {
  return {
    timeAppCategoryId: {
      type: sql.BigInt,
      val: timeAppCategory.timeAppCategoryId,
    },
    description: {
      type: sql.VarChar(255),
      val: timeAppCategory.description,
    },
    customerName: {
      type: sql.VarChar(255),
      val: timeAppCategory.customerName,
    },
    projectName: {
      type: sql.VarChar(255),
      val: timeAppCategory.projectName,
    },
    code: {
      type: sql.VarChar(255),
      val: timeAppCategory.code,
    },
    employeeName: {
      type: sql.VarChar(512),
      val: timeAppCategory.employeeName,
    },
    timeAppEmployeeId: {
      type: sql.BigInt,
      val: timeAppCategory.timeAppEmployeeId,
    },
    categoryId: {
      type: sql.BigInt,
      val: timeAppCategory.categoryId,
    },
  };
};

/**
 * Initializes the timeAppCategory table.
 *
 * @param {Booelan} logSuccess Defaults to false
 * @return {Promise}
 */
export const initialize = (logSuccess = false) => new Promise((resolve, reject) => {
  // Execute the query
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategory.initialize.sql')
  })
  .then((res) => {
    if (logSuccess) {
      utils.log('TimeAppCategory table initialized.');
    }
    resolve(res);
  })
  .catch((err) => {
    utils.log('Could not initialize timeAppCategory table:');
    utils.log(err);
    reject(err);
  });
});

/**
 * Returns a promise of the *top* number of timeAppCategorys at page *page*.
 *
 * @param {Number} __top The top number of timeAppCategorys to get, optional
 * @param {Number} __page The page number at which to get *top* number of timeAppCategorys, optional
 * @return {Promise} -> {Object}
 */
export const find = (__top, __page) => new Promise((resolve, reject) => {
  // Get the top and offset if any
  let {top, offset} = utils.paginate(__top, __page);

  // No pagination will be used if *top* is undefined.
  let _query = _.isUndefined(top)
    ? sql.fromFile('./sql/timeAppCategory.find.sql')
    : utils.paginateQuery(sql.fromFile('./sql/timeAppCategory.find.sql'), 'FROM [dbo].[TimeAppCategory]', top, offset);

  // Execute the query
  sql.execute({
    query: _query
  })
  .then((timeAppCategorys) => resolve(utils.objectify(timeAppCategorys)))
  .catch(reject);
});

/**
 * Returns a promise of the timeAppCategorys at *timeAppCategoryId*.
 *
 * @param {Number} timeAppCategoryId The ID of the timeAppCategory
 * @return {Promise} -> {Object}
 */
export const findById = (timeAppCategoryId) => new Promise((resolve, reject) => {
  // Execute the query and then objectify it if needed.
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategory.findById.sql'),
    params: {
      timeAppCategoryId: {
        type: sql.BigInt,
        val: timeAppCategoryId
      }
    }
  })
  .then((timeAppCategorys) => {
    // Resolve the timeAppCategory
    resolve(utils.objectify(timeAppCategorys[0]));
  })
  .catch(reject);
});

/**
 * Creates a timeAppCategory and returns it.
 *
 * @param {Object} timeAppCategory TimeAppCategory to create
 * @return {Promise} -> {Object}
 */
export const create = (timeAppCategory) => new Promise((resolve, reject) => {
  let _params = getParams(timeAppCategory);

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategory.create.sql'),
    params: _params,
  })
  .then((timeAppCategorys) => resolve(utils.objectify(timeAppCategorys[0])))
  .catch(reject)
});

/**
 * @param {Number} timeAppCategoryId The ID of the timeAppCategory
 * @param {Object} timeAppCategory The timeAppCategory values to update with
 * @return {Promise} -> {Object}
 */
export const update = (timeAppCategoryId, timeAppCategory) => new Promise((resolve, reject) => {
  // Get the params
  let _params = getParams(_.assign({}, timeAppCategory, { timeAppCategoryId: timeAppCategoryId }));

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategory.update.sql'),
    params: _params,
  })
  .then((timeAppCategorys) => resolve(utils.objectify(timeAppCategorys[0])))
  .catch(reject)
});

/**
 * Disables the timeAppCategory and returns a promise of the void that is the timeAppCategory.
 *
 * @param {Number} timeAppCategoryId
 * @return {Promise} -> {Object}
 */
export const remove = (timeAppCategoryId) => new Promise((resolve, reject) => {
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategory.disable.sql'),
    params: {
      timeAppCategoryId: {
        type: sql.BigInt,
        val: timeAppCategoryId
      }
    }
  })
  .then(resolve)
  .catch(reject);
});

/**
 * Inserts many timeAppCategorys into the DB.
 *
 * @param {Array} timeAppCategorys Array of timeAppCategorys to insert into the DB
 * @return {Promise} -> {Array} Array of the recently inserted timeAppCategorys
 */
export const createMany = (timeAppCategorys) => utils.createManySQL(timeAppCategorys, 'TimeAppCategory', __dirname, 'timeAppCategory');

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
  createMany: createMany
}
