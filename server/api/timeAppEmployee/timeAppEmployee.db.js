'use strict'

import _ from 'lodash';
import sql from 'seriate';
import mssql from 'mssql';
import moment from 'moment';
import Promise from 'bluebird';

import utils from '../../utils/utils';
import config from '../../config';

/**
 * Returns a params object for *timeAppEmployee*.
 *
 * @param {Object} timeAppEmployee TimeAppEmployee object
 * @return {Object}
 */
const getParams = (timeAppEmployee = {}) => {
  return {
    timeAppEmployeeId: {
      type: sql.BigInt,
      val: timeAppEmployee.timeAppEmployeeId,
    },
    firstName: {
      type: sql.VarChar(255),
      val: timeAppEmployee.firstName,
    },
    lastName: {
      type: sql.VarChar(255),
      val: timeAppEmployee.lastName,
    },
    name: {
      type: sql.VarChar(512),
      val: timeAppEmployee.name,
    },
    employeeId: {
      type: sql.BigInt,
      val: timeAppEmployee.employeeId,
    },
  };
};

/**
 * Initializes the timeAppEmployee table.
 *
 * @param {Booelan} logSuccess Defaults to false
 * @return {Promise}
 */
export const initialize = (logSuccess = false) => new Promise((resolve, reject) => {
  // Execute the query
  sql.execute({
    query: sql.fromFile('./sql/timeAppEmployee.initialize.sql')
  })
  .then((res) => {
    if (logSuccess) {
      utils.log('TimeAppEmployee table initialized.');
    }
    resolve(res);
  })
  .catch((err) => {
    utils.log('Could not initialize timeAppEmployee table:');
    utils.log(err);
    reject(err);
  });
});

/**
 * Returns a promise of the *top* number of timeAppEmployees at page *page*.
 *
 * @param {Number} __top The top number of timeAppEmployees to get, optional
 * @param {Number} __page The page number at which to get *top* number of timeAppEmployees, optional
 * @return {Promise} -> {Object}
 */
export const find = (__top, __page) => new Promise((resolve, reject) => {
  // Get the top and offset if any
  let {top, offset} = utils.paginate(__top, __page);

  // No pagination will be used if *top* is undefined.
  let _query = _.isUndefined(top)
    ? sql.fromFile('./sql/timeAppEmployee.find.sql')
    : utils.paginateQuery(sql.fromFile('./sql/timeAppEmployee.find.sql'), 'FROM [dbo].[TimeAppEmployee]', top, offset);

  // Execute the query
  sql.execute({
    query: _query
  })
  .then((timeAppEmployees) => resolve(utils.objectify(timeAppEmployees)))
  .catch(reject);
});

/**
 * Returns a promise of the timeAppEmployees at *timeAppEmployeeId*.
 *
 * @param {Number} timeAppEmployeeId The ID of the timeAppEmployee
 * @return {Promise} -> {Object}
 */
export const findById = (timeAppEmployeeId) => new Promise((resolve, reject) => {
  // Execute the query and then objectify it if needed.
  sql.execute({
    query: sql.fromFile('./sql/timeAppEmployee.findById.sql'),
    params: {
      timeAppEmployeeId: {
        type: sql.BigInt,
        val: timeAppEmployeeId
      }
    }
  })
  .then((timeAppEmployees) => {
    // Resolve the timeAppEmployee
    resolve(utils.objectify(timeAppEmployees[0]));
  })
  .catch(reject);
});

/**
 * Creates a timeAppEmployee and returns it.
 *
 * @param {Object} timeAppEmployee TimeAppEmployee to create
 * @return {Promise} -> {Object}
 */
export const create = (timeAppEmployee) => new Promise((resolve, reject) => {
  let _params = getParams(timeAppEmployee);

  sql.execute({
    query: sql.fromFile('./sql/timeAppEmployee.create.sql'),
    params: _params,
  })
  .then((timeAppEmployees) => resolve(utils.objectify(timeAppEmployees[0])))
  .catch(reject)
});

/**
 * @param {Number} timeAppEmployeeId The ID of the timeAppEmployee
 * @param {Object} timeAppEmployee The timeAppEmployee values to update with
 * @return {Promise} -> {Object}
 */
export const update = (timeAppEmployeeId, timeAppEmployee) => new Promise((resolve, reject) => {
  // Get the params
  let _params = getParams(_.assign({}, timeAppEmployee, { timeAppEmployeeId: timeAppEmployeeId }));

  sql.execute({
    query: sql.fromFile('./sql/timeAppEmployee.update.sql'),
    params: _params,
  })
  .then((timeAppEmployees) => resolve(utils.objectify(timeAppEmployees[0])))
  .catch(reject)
});

/**
 * Disables the timeAppEmployee and returns a promise of the void that is the timeAppEmployee.
 *
 * @param {Number} timeAppEmployeeId
 * @return {Promise} -> {Object}
 */
export const remove = (timeAppEmployeeId) => new Promise((resolve, reject) => {
  sql.execute({
    query: sql.fromFile('./sql/timeAppEmployee.disable.sql'),
    params: {
      timeAppEmployeeId: {
        type: sql.BigInt,
        val: timeAppEmployeeId
      }
    }
  })
  .then(resolve)
  .catch(reject);
});

/**
 * Inserts many timeAppEmployees into the DB.
 *
 * @param {Array} timeAppEmployees Array of timeAppEmployees to insert into the DB
 * @return {Promise} -> {Array} Array of the recently inserted timeAppEmployees
 */
// export const createMany = (timeAppEmployees) => utils.createManySQL(timeAppEmployees, 'TimeAppEmployee', __dirname, 'timeAppEmployee');

export function mergeMany(timeAppEmployees) {
  return new Promise((resolve, reject) => {
    const _tableName = `TimeAppEmployee_${utils.guid().slice(0, 10)}`;

    const _meta = { tableName: _tableName };

    utils.log('Merging timeAppEmployees', 'info', _meta);

    utils.createManySQL(timeAppEmployees, _tableName, __dirname, 'timeAppEmployee', undefined, undefined, false)
    .then(rowCount => sql.execute({
        query: sql.fromFile('./sql/timeAppEmployee.mergeTemp.sql')
          .replace(/\{table_name\}/ig, _tableName)
    }))
    .then(data => utils.logResolve(data, 'Merged timeAppEmployees', 'info', _meta))
    .then(resolve)
    .catch(reject);
  });
}

/**
 * @param {{ name: String, firstName: String, lastName: String }[]} timeAppEmployees
 * @return {Promise<{ name: String, firstName: String, lastName: String, employeeId: Number, timeAppEmployeeId: Number }[]>}
 */
export function findByNames(timeAppEmployees) {
  return new Promise((resolve, reject) => {
    const _tableName = `TimeAppEmployee_${utils.guid().slice(0, 10)}`;

    utils.createManySQL(timeAppEmployees, _tableName, __dirname, 'timeAppEmployee', undefined, undefined, false)
    .then(rowCount => sql.execute({
        query: sql.fromFile('./sql/timeAppEmployee.findFromTempTable.sql')
          .replace(/\{table_name\}/ig, _tableName)
    }))
    .then(resolve)
    .catch(reject);
  });
}

/**
 * Tries to get the first name, last name and full name from *fullName*
 * and returns all as an object
 *
 * @param {String} fullName
 * @return {{ firstName: String, lastName: String, name: String }}
 */
export function nameToEmployee(fullName) {
  // Get an array of all names
  const _namesArr = fullName.split(' ');

  // Get all name parts
  const firstName = _namesArr.shift();
  const lastName = _namesArr.pop();

  return { firstName, lastName, name: fullName };
}

export default {
  initialize: initialize,
  find: find,
  findById: findById,
  create: create,
  update: update,
  remove: remove,
  mergeMany: mergeMany,
  findByNames: findByNames,
  nameToEmployee: nameToEmployee,
}
