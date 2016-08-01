'use strict'

import _ from 'lodash';
import sql from 'seriate';
import mssql from 'mssql';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import config from '../../config';

/**
 * Returns a params object for *timeAppCategoryRule*.
 *
 * @param {Object} timeAppCategoryRule TimeAppCategoryRule object
 * @return {Object}
 */
const getParams = (timeAppCategoryRule = {}) => {
  return {
    timeAppCategoryRuleId: {
      type: sql.BigInt,
      val: timeAppCategoryRule.timeAppCategoryRuleId,
    },
    description: {
      type: sql.VarChar(255),
      val: timeAppCategoryRule.description,
    },
    timeAppReportId: {
      type: sql.BigInt,
      val: timeAppCategoryRule.timeAppReportId,
    },
    customerName: {
      type: sql.VarChar(255),
      val: timeAppCategoryRule.customerName,
    },
    projectName: {
      type: sql.VarChar(255),
      val: timeAppCategoryRule.projectName,
    },
    code: {
      type: sql.VarChar(255),
      val: timeAppCategoryRule.code,
    },
    employeeName: {
      type: sql.VarChar(512),
      val: timeAppCategoryRule.employeeName,
    },
    employeeId: {
      type: sql.BigInt,
      val: timeAppCategoryRule.employeeId,
    },
    categoryId: {
      type: sql.BigInt,
      val: timeAppCategoryRule.categoryId,
    },
  };
};

/**
 * Initializes the timeAppCategoryRule table.
 *
 * @param {Booelan} logSuccess Defaults to false
 * @return {Promise}
 */
export const initialize = (logSuccess = false) => new Promise((resolve, reject) => {
  // Execute the query
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryRule.initialize.sql')
  })
  .then((res) => {
    if (logSuccess) {
      utils.log('TimeAppCategoryRule table initialized.');
    }
    resolve(res);
  })
  .catch((err) => {
    utils.log('Could not initialize timeAppCategoryRule table:');
    utils.log(err);
    reject(err);
  });
});

/**
 * Returns a promise of the *top* number of timeAppCategoryRules at page *page*.
 *
 * @param {Number} __top The top number of timeAppCategoryRules to get, optional
 * @param {Number} __page The page number at which to get *top* number of timeAppCategoryRules, optional
 * @return {Promise} -> {Object}
 */
export const find = (__top, __page) => new Promise((resolve, reject) => {
  // Get the top and offset if any
  let {top, offset} = utils.paginate(__top, __page);

  // No pagination will be used if *top* is undefined.
  let _query = _.isUndefined(top)
    ? sql.fromFile('./sql/timeAppCategoryRule.find.sql')
    : utils.paginateQuery(sql.fromFile('./sql/timeAppCategoryRule.find.sql'), 'FROM [dbo].[TimeAppCategoryRule]', top, offset);

  // Execute the query
  sql.execute({
    query: _query
  })
  .then((timeAppCategoryRules) => resolve(utils.objectify(timeAppCategoryRules)))
  .catch(reject);
});

/**
 * Returns a promise of the timeAppCategoryRules at *timeAppCategoryRuleId*.
 *
 * @param {Number} timeAppCategoryRuleId The ID of the timeAppCategoryRule
 * @return {Promise} -> {Object}
 */
export const findById = (timeAppCategoryRuleId) => new Promise((resolve, reject) => {
  // Execute the query and then objectify it if needed.
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryRule.findById.sql'),
    params: {
      timeAppCategoryRuleId: {
        type: sql.BigInt,
        val: timeAppCategoryRuleId
      }
    }
  })
  .then((timeAppCategoryRules) => {
    // Resolve the timeAppCategoryRule
    resolve(utils.objectify(timeAppCategoryRules[0]));
  })
  .catch(reject);
});

/**
 * Creates a timeAppCategoryRule and returns it.
 *
 * @param {Object} timeAppCategoryRule TimeAppCategoryRule to create
 * @return {Promise} -> {Object}
 */
export const create = (timeAppCategoryRule) => new Promise((resolve, reject) => {
  let _params = getParams(timeAppCategoryRule);

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryRule.create.sql'),
    params: _params,
  })
  .then((timeAppCategoryRules) => resolve(utils.objectify(timeAppCategoryRules[0])))
  .catch(reject)
});

/**
 * @param {Number} timeAppCategoryRuleId The ID of the timeAppCategoryRule
 * @param {Object} timeAppCategoryRule The timeAppCategoryRule values to update with
 * @return {Promise} -> {Object}
 */
export const update = (timeAppCategoryRuleId, timeAppCategoryRule) => new Promise((resolve, reject) => {
  // Get the params
  let _params = getParams(_.assign({}, timeAppCategoryRule, { timeAppCategoryRuleId: timeAppCategoryRuleId }));

  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryRule.update.sql'),
    params: _params,
  })
  .then((timeAppCategoryRules) => resolve(utils.objectify(timeAppCategoryRules[0])))
  .catch(reject)
});

/**
 * Disables the timeAppCategoryRule and returns a promise of the void that is the timeAppCategoryRule.
 *
 * @param {Number} timeAppCategoryRuleId
 * @return {Promise} -> {Object}
 */
export const remove = (timeAppCategoryRuleId) => new Promise((resolve, reject) => {
  sql.execute({
    query: sql.fromFile('./sql/timeAppCategoryRule.disable.sql'),
    params: {
      timeAppCategoryRuleId: {
        type: sql.BigInt,
        val: timeAppCategoryRuleId
      }
    }
  })
  .then(resolve)
  .catch(reject);
});

/**
 * Inserts many timeAppCategoryRules into the DB.
 *
 * @param {Array} timeAppCategoryRules Array of timeAppCategoryRules to insert into the DB
 * @return {Promise} -> {Array} Array of the recently inserted timeAppCategoryRules
 */
export const createMany = (timeAppCategoryRules) => utils.createManySQL(timeAppCategoryRules, 'TimeAppCategoryRule', __dirname, 'timeAppCategoryRule');

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
  createMany: createMany
}
