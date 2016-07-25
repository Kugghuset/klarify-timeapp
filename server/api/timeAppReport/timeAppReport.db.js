'use strict'

import _ from 'lodash';
import sql from 'seriate';
import mssql from 'mssql';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import config from '../../config';

/**
 * Returns a params object for *timeAppReport*.
 *
 * @param {Object} timeAppReport TimeAppReport object
 * @return {Object}
 */
const getParams = (timeAppReport = {}) => {
  return {
    timeAppReportId: {
      type: sql.BigInt,
      val: timeAppReport.timeAppReportId,
    },
    type: {
      type: sql.VarChar(255),
      val: timeAppReport.type,
    },
    employeeName: {
      type: sql.VarChar(512),
      val: timeAppReport.employeeName,
    },
    date: {
      type: sql.Date,
      val: timeAppReport.date,
    },
    customerName: {
      type: sql.VarChar(255),
      val: timeAppReport.customerName,
    },
    projectName: {
      type: sql.VarChar(255),
      val: timeAppReport.projectName,
    },
    comment: {
      type: sql.VarChar,
      val: timeAppReport.comment,
    },
    code: {
      type: sql.VarChar(255),
      val: timeAppReport.code,
    },
    quantity: {
      type: sql.Float,
      val: timeAppReport.quantity,
    },
    price: {
      type: sql.Float,
      val: timeAppReport.price,
    },
    sum: {
      type: sql.Float,
      val: timeAppReport.sum,
    },
    employeeId: {
      type: sql.BigInt,
      val: timeAppReport.employeeId,
    },
    timeAppEmployeeId: {
      type: sql.BigInt,
      val: timeAppReport.timeAppEmployeeId,
    },
  };
};

/**
 * Initializes the timeAppReport table.
 *
 * @param {Booelan} logSuccess Defaults to false
 * @return {Promise}
 */
export const initialize = (logSuccess = false) => new Promise((resolve, reject) => {
  // Execute the query
  sql.execute({
    query: sql.fromFile('./sql/timeAppReport.initialize.sql')
  })
  .then((res) => {
    if (logSuccess) {
      utils.log('TimeAppReport table initialized.');
    }
    resolve(res);
  })
  .catch((err) => {
    utils.log('Could not initialize timeAppReport table:');
    utils.log(err);
    reject(err);
  });
});

/**
 * Returns a promise of the *top* number of timeAppReports at page *page*.
 *
 * @param {Number} __top The top number of timeAppReports to get, optional
 * @param {Number} __page The page number at which to get *top* number of timeAppReports, optional
 * @return {Promise} -> {Object}
 */
export const find = (__top, __page) => new Promise((resolve, reject) => {
  // Get the top and offset if any
  let {top, offset} = utils.paginate(__top, __page);

  // No pagination will be used if *top* is undefined.
  let _query = _.isUndefined(top)
    ? sql.fromFile('./sql/timeAppReport.find.sql')
    : utils.paginateQuery(sql.fromFile('./sql/timeAppReport.find.sql'), 'FROM [dbo].[TimeAppReport]', top, offset);

  // Execute the query
  sql.execute({
    query: _query
  })
  .then((timeAppReports) => resolve(utils.objectify(timeAppReports)))
  .catch(reject);
});

/**
 * Returns a promise of the timeAppReports at *timeAppReportId*.
 *
 * @param {Number} timeAppReportId The ID of the timeAppReport
 * @return {Promise} -> {Object}
 */
export const findById = (timeAppReportId) => new Promise((resolve, reject) => {
  // Execute the query and then objectify it if needed.
  sql.execute({
    query: sql.fromFile('./sql/timeAppReport.findById.sql'),
    params: {
      timeAppReportId: {
        type: sql.BigInt,
        val: timeAppReportId
      }
    }
  })
  .then((timeAppReports) => {
    // Resolve the timeAppReport
    resolve(utils.objectify(timeAppReports[0]));
  })
  .catch(reject);
});

/**
 * Creates a timeAppReport and returns it.
 *
 * @param {Object} timeAppReport TimeAppReport to create
 * @return {Promise} -> {Object}
 */
export const create = (timeAppReport) => new Promise((resolve, reject) => {
  let _params = getParams(timeAppReport);

  sql.execute({
    query: sql.fromFile('./sql/timeAppReport.create.sql'),
    params: _params,
  })
  .then((timeAppReports) => resolve(utils.objectify(timeAppReports[0])))
  .catch(reject)
});

/**
 * @param {Number} timeAppReportId The ID of the timeAppReport
 * @param {Object} timeAppReport The timeAppReport values to update with
 * @return {Promise} -> {Object}
 */
export const update = (timeAppReportId, timeAppReport) => new Promise((resolve, reject) => {
  // Get the params
  let _params = getParams(_.assign({}, timeAppReport, { timeAppReportId: timeAppReportId }));

  sql.execute({
    query: sql.fromFile('./sql/timeAppReport.update.sql'),
    params: _params,
  })
  .then((timeAppReports) => resolve(utils.objectify(timeAppReports[0])))
  .catch(reject)
});

/**
 * Disables the timeAppReport and returns a promise of the void that is the timeAppReport.
 *
 * @param {Number} timeAppReportId
 * @return {Promise} -> {Object}
 */
export const remove = (timeAppReportId) => new Promise((resolve, reject) => {
  sql.execute({
    query: sql.fromFile('./sql/timeAppReport.disable.sql'),
    params: {
      timeAppReportId: {
        type: sql.BigInt,
        val: timeAppReportId
      }
    }
  })
  .then(resolve)
  .catch(reject);
});

/**
 * Inserts many timeAppReports into the DB.
 *
 * @param {Array} timeAppReports Array of timeAppReports to insert into the DB
 * @return {Promise} -> {Array} Array of the recently inserted timeAppReports
 */
export const createMany = (timeAppReports) => utils.createManySQL(timeAppReports, 'TimeAppReport', __dirname, 'timeAppReport');

export function mergeMany(timeAppReports) {
  return new Promise((resolve, reject) => {
    const _tableName = `TimeAppReport_${utils.guid().slice(0, 10)}`;

    utils.createManySQL(timeAppReports, _tableName, __dirname, 'timeAppReport', undefined, undefined, false)
    .then(rowCount => sql.execute({
        query: sql.fromFile('./sql/timeAppReport.mergeTemp.sql')
          .replace(/\{table_name\}/ig, _tableName)
    }))
    .then(data => utils.logPromise(data, 'Merged timeAppReports', 'info', { tableName: _tableName }))
    .then(resolve)
    .catch(reject);
  });
}

/**
 * @return {Promise<{}>}
 */
export function mergeToMaster() {
  return new Promise((resolve, reject) => {
    sql.execute({
      query: sql.fromFile('./sql/timeAppReport.mergeToMaster.sql')
    })
    .then(resolve)
    .catch(reject);
  });
}

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
  createMany: createMany,
  mergeMany: mergeMany,
  mergeToMaster: mergeToMaster,
}
