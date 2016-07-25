'use strict'

import _ from 'lodash';
import sql from 'seriate';
import mssql from 'mssql';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import config from '../../config';

/**
 * Returns a params object for *timeAppDiscount*.
 *
 * @param {Object} timeAppDiscount TimeAppDiscount object
 * @return {Object}
 */
const getParams = (timeAppDiscount = {}) => {
  return {
    timeAppDiscountId: {
      type: sql.BigInt,
      val: timeAppDiscount.timeAppDiscountId,
    },
    customerName: {
      type: sql.VarChar(255),
      val: timeAppDiscount.customerName,
    },
    projectName: {
      type: sql.VarChar(255),
      val: timeAppDiscount.projectName,
    },
    discount: {
      type: sql.Float,
      val: timeAppDiscount.discount,
    },
  };
};

/**
 * Initializes the timeAppDiscount table.
 *
 * @param {Booelan} logSuccess Defaults to false
 * @return {Promise}
 */
export const initialize = (logSuccess = false) => new Promise((resolve, reject) => {
  // Execute the query
  sql.execute({
    query: sql.fromFile('./sql/timeAppDiscount.initialize.sql')
  })
  .then((res) => {
    if (logSuccess) {
      utils.log('TimeAppDiscount table initialized.');
    }
    resolve(res);
  })
  .catch((err) => {
    utils.log('Could not initialize timeAppDiscount table:');
    utils.log(err);
    reject(err);
  });
});

/**
 * Returns a promise of the *top* number of timeAppDiscounts at page *page*.
 *
 * @param {Number} __top The top number of timeAppDiscounts to get, optional
 * @param {Number} __page The page number at which to get *top* number of timeAppDiscounts, optional
 * @return {Promise} -> {Object}
 */
export const find = (__top, __page) => new Promise((resolve, reject) => {
  // Get the top and offset if any
  let {top, offset} = utils.paginate(__top, __page);

  // No pagination will be used if *top* is undefined.
  let _query = _.isUndefined(top)
    ? sql.fromFile('./sql/timeAppDiscount.find.sql')
    : utils.paginateQuery(sql.fromFile('./sql/timeAppDiscount.find.sql'), 'FROM [dbo].[TimeAppDiscount]', top, offset);

  // Execute the query
  sql.execute({
    query: _query
  })
  .then((timeAppDiscounts) => resolve(utils.objectify(timeAppDiscounts)))
  .catch(reject);
});

/**
 * Returns a promise of the timeAppDiscounts at *timeAppDiscountId*.
 *
 * @param {Number} timeAppDiscountId The ID of the timeAppDiscount
 * @return {Promise} -> {Object}
 */
export const findById = (timeAppDiscountId) => new Promise((resolve, reject) => {
  // Execute the query and then objectify it if needed.
  sql.execute({
    query: sql.fromFile('./sql/timeAppDiscount.findById.sql'),
    params: {
      timeAppDiscountId: {
        type: sql.BigInt,
        val: timeAppDiscountId
      }
    }
  })
  .then((timeAppDiscounts) => {
    // Resolve the timeAppDiscount
    resolve(utils.objectify(timeAppDiscounts[0]));
  })
  .catch(reject);
});

/**
 * Creates a timeAppDiscount and returns it.
 *
 * @param {Object} timeAppDiscount TimeAppDiscount to create
 * @return {Promise} -> {Object}
 */
export const create = (timeAppDiscount) => new Promise((resolve, reject) => {
  let _params = getParams(timeAppDiscount);

  sql.execute({
    query: sql.fromFile('./sql/timeAppDiscount.create.sql'),
    params: _params,
  })
  .then((timeAppDiscounts) => resolve(utils.objectify(timeAppDiscounts[0])))
  .catch(reject)
});

/**
 * @param {Number} timeAppDiscountId The ID of the timeAppDiscount
 * @param {Object} timeAppDiscount The timeAppDiscount values to update with
 * @return {Promise} -> {Object}
 */
export const update = (timeAppDiscountId, timeAppDiscount) => new Promise((resolve, reject) => {
  // Get the params
  let _params = getParams(_.assign({}, timeAppDiscount, { timeAppDiscountId: timeAppDiscountId }));

  sql.execute({
    query: sql.fromFile('./sql/timeAppDiscount.update.sql'),
    params: _params,
  })
  .then((timeAppDiscounts) => resolve(utils.objectify(timeAppDiscounts[0])))
  .catch(reject)
});

/**
 * Disables the timeAppDiscount and returns a promise of the void that is the timeAppDiscount.
 *
 * @param {Number} timeAppDiscountId
 * @return {Promise} -> {Object}
 */
export const remove = (timeAppDiscountId) => new Promise((resolve, reject) => {
  sql.execute({
    query: sql.fromFile('./sql/timeAppDiscount.disable.sql'),
    params: {
      timeAppDiscountId: {
        type: sql.BigInt,
        val: timeAppDiscountId
      }
    }
  })
  .then(resolve)
  .catch(reject);
});

/**
 * Inserts many timeAppDiscounts into the DB.
 *
 * @param {Array} timeAppDiscounts Array of timeAppDiscounts to insert into the DB
 * @return {Promise} -> {Array} Array of the recently inserted timeAppDiscounts
 */
export const createMany = (timeAppDiscounts) => utils.createManySQL(timeAppDiscounts, 'TimeAppDiscount', __dirname, 'timeAppDiscount');

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
  createMany: createMany
}
