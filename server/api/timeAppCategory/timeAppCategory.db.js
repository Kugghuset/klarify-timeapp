'use strict'

import _ from 'lodash';
import sql from 'seriate';
import mssql from 'mssql';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import config from '../../config';

import TimeAppCategoryRule from './../timeAppCategoryRule/timeAppCategoryRule.db';

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
    categoryId: {
      type: sql.BigInt,
      val: timeAppCategory.categoryId,
    },
    sum: {
      type: sql.Int,
      val: timeAppCategory.sum,
    },
    probabilityPercentage: {
      type: sql.SmallInt,
      val: timeAppCategory.probabilityPercentage,
    },
    timeAppReportId: {
      type: sql.BigInt,
      val: timeAppCategory.timeAppReportId,
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

/**
 * Returns a promise of all DimCategories but *appified*
 * by using alisases of categoryName and categoryId instead
 * of just _Category_ and _CategoryID_.
 *
 * @return {Promise<{ categoryName: String, categoryId: Number }[]>}
 */
export function findAllDimCategories() {
  return new Promise((resolve, reject) => {
    sql.execute({
      query: sql.fromFile('./sql/timeAppCategory.findAllDimCategories.sql'),
    })
    .then(resolve)
    .catch(reject);
  });
}

/**
 * Merges catReports into TimeAppCategory and TimeAppReport
 * and returns a promise of it.
 *
 * @param {{ sum: Number, categoryId: Number, customerName: String, projectName: String, code: String, employeeId:Number, timeAppReportId: Number, employeeName: String, probabilityPercentage: Number }[]} catReports
 * @return {Promise}
 */
export function mergeCategorizedReports(catReports) {
  const _tableName = `TimeAppCategory_${utils.guid().slice(0, 10)}`;

  const _meta = { tableName: _tableName };

  const opts = {
    collection: catReports,
    tableName: _tableName,
    dirname: __dirname,
    baseName: 'timeAppCategory',
    mainId: undefined,
    skipName: undefined,
    returnValues: false,
    batchSize: 1000,
  };

  utils.log('Merging categories into TimeAppCategory and TimeAppReport', 'info', _meta);

  return utils.createManySQLOpts(opts)
  .then(rowCount => sql.execute({
    query: sql.fromFile('./sql/timeAppCategory.mergeCategorizedReports.sql')
      .replace(/\{table_name\}/ig, _tableName),
  }))
  .then(data => utils.logResolve(data, 'Completed merge of categories into TimeAppCategory and TimeAppReport', 'info', _meta))
  .catch(Promise.reject);
}

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
  createMany: createMany,
  findAllDimCategories: findAllDimCategories,
  mergeCategorizedReports: mergeCategorizedReports,
}
