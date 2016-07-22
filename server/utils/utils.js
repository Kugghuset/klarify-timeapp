'use strict'

import _ from 'lodash';
import DataObjectParser from 'dataobject-parser';
import seriate from 'seriate';
import mssql from 'mssql';
import path from 'path';

import _sql, { getConnection } from './utils.sql';
import _http from './utils.http';
import _logger from './utils.logger';

import config from '../config';

export const http = _http;
export const logger = _logger;

/**
 * Logs something via the logging tool.
 *
 * @param {Any} message
 */
export const log = (message, level = "info", meta) => _.isUndefined(meta) ? logger.log(level, message) : logger.log(level, message, meta);

export function logPromise(data, message, level, meta) {
  log(message, level, meta);
  return Promise.resolve(data);
}

/**
 * Calls sends a response to the user of 500: Internal Error
 * and logs the actual error.
 *
 * @param {Object} res Express response object
 * @param {Error} err The error
 */
export const handleError = (res, err) => {
  console.log(err);
  res.status(500).send('Internal error');
}

/**
 * Escapes characters which need escaping in a RegExp.
 * This allows for passing in any string into a RegExp constructor
 * and have it seen as literal
 *
 * @param {String} text
 * @return {String}
 */
export const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s\/]/g, "\\$&");
};

/**
 * Returns an escaped RegExp object as the literal string *text*.
 * Flags are optional, but can be provided.
 *
 * @param {String} text
 * @param {String} flags - optional
 * @return {RegExp} - RegExp object
 */
export const literalRegExp = (text, flags) => {
  return new RegExp(escapeRegex(text), flags);
}

/**
 * Returns a new object where property names
 * with dots are converted into nested objects and arrays.
 *
 * Example: { 'prop.sub': 'value' } -> { prop: { sub: value } }
 *
 * @param {Array|Object} sqlArray
 * @return {Array|Object}
 */
export const objectify = (sqlArray) => {
  // Ensure it's an array
  let _isObj;
  if (!_.isArray(sqlArray)) {
    sqlArray = [ sqlArray ];
    _isObj = true;
  }

  let _arr = _.map(sqlArray, (sqlObj) => {
    let _data = new DataObjectParser();

    // Get all values
    _.map(sqlObj, (value, key) => {
      _data.set(key, value);
    });

    return _data.data();
  });

  return _isObj ? _.first(_arr) : _arr;
}

/**
 * Returns an object or array of the top and offset values
 * used for paginating in SQL server.
 *
 * @param {Number} top The number of items to get
 * @param {Number} page The page at which to get items from
 * @param {Boolean} asArray If true, return is an array, defaults to false
 * @return {Object|Array} { top: Number, offset: Number } | [ *top*, *offset* ]
 */
export const paginate = (top, page, asArray = false) => {
  // Get the page number, don't allow negative pages
  let _page = page < 1 ? 1 : page;

  // Get the offset for the page
  let _offset = (_page - 1) * top;

  // Set _offset to undefined if top is undefined,
  // as the assumptions is no pagination was meant to happen.
  if (_.isUndefined(top)) {
    _offset = undefined;
  }

  // Return the object
  return !!asArray
    ? [top, _offset]
    : { top: top, offset: _offset };
}

/**
 * Returns the query which is paginated based on *query* and *attachTo*
 *
 * @param {String} query The query to paginate
 * @param {String} attachTo The string to match after which the pagination will be attached
 * @param {Number} top The number of items to get
 * @param {Number} page The page at which to get items from
 * @return {String}
 */
export const paginateQuery = (query, attachTo, top, offset) => {
  // Get the pagination strings
  let _pagination  = `${attachTo} OFFSET ${offset} ROWS FETCH NEXT ${top} ONLY`;

  // Combine the query with *_pagination*
  return query.replace(literalRegExp(attachTo, 'i'), _pagination);
}

/**
 * Injects *items* into *arr* at *index*.
 *
 * If *override* is true, the action will simply override any
 * elements where *items* are inserted,
 * otherwise the items will simply be pushed forward the length of *items* step.
 *
 * Example: arr=[1, 2, 3, 4], index=2, items=[1], override=false
 *          => [1, 2, 1, 3, 4]
 *
 * Example: arr=[1, 2, 3, 4], index=2, items=[1], override=true
 *          => [1, 2, 1, 4]
 *
 * Note that the only differnce is override=true, and the items in the output (=>)
 *
 * @param {Array} arr The array to perform the injection on, won't be mutated
 * @param {Number} index The index to start from
 * @param {Array|Any} items The items to inject into the array
 * @param {Boolean} override Boolean value for whether the action should override items in the array, defaults to false
 * @return {Array}
 */
export const inject = (arr, index, items, override = false) => {
  // Get the leading and trailing arrays
  let [_leading, _trailing] = [arr.slice(0, index), arr.slice(index)];

  // Allow items to be a single item as well
  let _items = _.isArray(items)
    ? items
    : [items];

  // If override is truthy, overried the items, otherwise don't
  return override
    ? _leading.concat(_items, _trailing.slice(_items.length))
    : _leading.concat(_items, _trailing);
}

/**
 * Returns a GUID string.
 *
 * Example output: '1a729180f8-1f9c3-18d86-13b26-15ff6120931f241'
 *
 * @return {String} GUID string
 */
export const guid = () => {
  return _.times(5, (i) => {
    // Assign n to 2 if i === 0, 3 if i === 4, otherwise 1
    let n = [2, 1, 1, 1, 3][i];

    return _.times(n, () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring()).join('');
  }).join('-');
}

/**
 * Returns an array of SQL like objects from the default *.initialize.sql file contents.
 *
 * @param {String} fileContents The contents of the SQL file to parse
 * @param {Array} skipNames Array of all columns to skip by name, defaults to []
 * @param {Boolean} skipIdentity Boolean for whether the identity column should be skipped, defaults to true
 * @param {Object} __sql Should be either *mssql* or *sql* (seriate), from which the type system will be used. Defaults to *mssql*
 * @return {Array}
 */
export const parseSQLCreateTable = (fileContents, skipNames = [], skipIdentity = true, __sql = mssql) => {
  const _output = _.attempt(() => {
    return fileContents
      // Match everything inside the create table statement
      .match(/(CREATE TABLE.*\()([\S\s]*)(?=\)\s)/i)[2]
      // Split on every comma where there is a square bracket following it or some whitespace (ex: , [...)
      .split(/\,\s*(?=\[)/)
      // Remove all extra whitespace
      .map((line) => line.replace(/\s{2,}/g, ''))
      // Remove line comments
      .map((line) => line.replace(/\s*\-\-.*/, ''))
      // Filter out identity column if skipIdentity is true
      .filter((line) => !!skipIdentity ? !/identity\(/i.test(line) : true)
      // Get the names, type, nullability and default value
      .map((line) => {
        return {
          name: line.match(/\[(.+)\]/)[1],
          nullable: !/not null/i.test(line),
          type: (() => {
            let _typeVal = (line.match(/\]\s*([^\s]+)\s*/)[1] || '').toUpperCase();

            let _inBrackets = (line.match(/\((.*)\)/) || [])[1]

            // Check for max values inside brackets (ex: VarChar(MAX))
            let _isMax = /max/i.test(_inBrackets);

            // Set the value to not have brackets (if any)
            _typeVal = _.isUndefined(_inBrackets)
                ? _typeVal
                : _typeVal.replace(/\(.*/, '');

            // Get the param, if any
            let _param = _isMax ? __sql.MAX : Number(_inBrackets);

            // Get the SQL types
            let _sqlType = !_inBrackets
              ? _.get(__sql, _typeVal)
              : _.get(__sql, _typeVal)(_param);

            // Return the sql type
            return _sqlType;
          })(),
          default: (line.match(/default\s([^\s]*)\s/i) || [])[1]
        }
      })
      // Filter out any columns which are in the skipNames array
      .filter((line) => !_.find(skipNames, (name = '') => name.toLowerCase() === (line.name || '').toLowerCase()));
  });

  return !_.isError(_output)
    ? _output
    : [];
}

/**
 * Drops the table at *tableName* in the default database.
 * If *database* is defined, it is used instead.
 *
 * @param {String} tableName Name of the table to drop
 * @param {String} database Name of the database to use, optional
 * @return {Promise} -> {undefined}
 */
export const dropTable = (tableName, database) => new Promise ((resolve, reject) => {
  // Ensure there are wrapping square brackets
  const _tableName = /^\[.*\]$/.test(tableName)
    ? `[dbo].${tableName}`
    : `[dbo].[${tableName}]`;

  // If there's a database, make sure it's in square brackets
  const _database = (!!database && /^\[.*\]$/.test(database))
    ? database
    : `[${database}]`;

  // Use either the default database or *database*
  const _tablePath = !!database
    ? `${_database}.${_tableName}`
    : _tableName;

  // Create the query
  const _query = `DROP TABLE ${_tablePath}`;

  // Drop the table!
  seriate.execute({
    query: _query
  })
  .then((data) => {
    log(`Table ${_tablePath} dropped.`, 'info');
    resolve(data)
  })
  .catch(reject);
});

/**
 * @param {Array} collection The items to create many of
 * @param {String} tableName Name of the table to insert *collection* into
 * @param {String} dirname The __dirname variable for setting the root for files
 * @param {String} baseName Base of name for the sql files
 * @param {String} mainId Name of the main id column in the table. Defaults to *baseName* + 'Id'
 * @param {Array} skipNames Array of column names to skip in creating the table. Identity columns will be skipped. Defaults to ['isDisabled', 'dateUpdated', 'dateCreated']
 * @param {Boolean} returnValues Boolean value of whether the values of the insert should be returned or not. Defaults to true.
 * @return {Promise} -> {Array}
 */
export const createManySQL = (collection, tableName, dirname, baseName, mainId, skipNames = ['isDisabled', 'dateUpdated', 'dateCreated'], returnValues = true) => new Promise((resolve, reject) => {
  // Ensure mainId is defined
  if (!mainId) { mainId = `${baseName}Id`; }

  // Use with output
  const _isArray = _.isArray(collection);

  // Allow either objects or arrays.
  const _collection = _isArray
    ? collection
    : [collection];

  if (!_collection || !_collection.length) {
    return resolve([]);
  }

  // Create the temp table
  const _table = new mssql.Table(tableName);

  let _columns;
  // Get the column definitions for the table, execpt for the IDS
  try {
    _columns = parseSQLCreateTable(seriate.fromFile(path.resolve(dirname, `./sql/${baseName}.initialize.sql`)), skipNames);

  } catch (error) {
    console.log(error);

    return reject();
  }

  // Set table creation to true, to ensure the table is created if it doesn't exist,
  // which it shouldn't do
  _table.create = true;

  // Add all columns to the table
  _.forEach(_columns, (col, i) => {
    _table.columns.add(col.name, col.type, _.omit(col, ['name', 'type']));
  });

  // Add all rows
  _.forEach(_collection, (item) => {
    // Get all parameters from the items in the order of the column names
    const _data = _.map(_columns, (col) => {
      // Get shorthand for the value
      const _value = item[col.name];

      // If any of these are true, a null value should be returned
      const _criteria = [
          (_value || '').toString() === 'NaN',
          _value === 'NaN',
          _.isUndefined(_value),
          /Int/.test(col.type.type || col.type) && isNaN(_value)
        ];

      const _type = col.type.type || col.type;

      // Tedious doesn't seem to like undefined values when parsing Integers
      if (_.some(_criteria)) {
        // The value is eitehr NaN or undefined,
        // which is better handled as null
        return null;
      } else if (/Int/.test(col.type.type || col.type)) {
        return parseInt(_value);
      } else {
        return _value;
      }
    });

    // Add the row
    _table.rows.add(..._data);
  });

  let _request;

  /**
   * TODO: Allow for batch size to be set.
   *       Apparently Azure doesn't like it when we inserts
   *       too many rows at once.
   */

  // Create a request instace and make the bulk operation
  return getConnection()
    .then((connection) => {
    // Get the current request
    _request = new mssql.Request(connection);

    return _request.bulk(_table);
  })
  .then((rowCount) => {
    if (!returnValues) {
      return resolve(rowCount);
    }

    // Query the DB and return the latest inserts
    return seriate.execute({
      query: `SELECT * FROM ${tableName}`,
      // query: seriate.fromFile(path.resolve(dirname, `./sql/${baseName}.find.sql`))
      //   .replace('SELECT', `SELECT TOP ${rowCount}`)
      //   .replace(new RegExp(`\\[dbo\\]\\.\\[${baseName}\\]`, 'ig'), `[dbo].[${tableName}]`)
      //   + `ORDER BY [${mainId}] DESC`
    });
  })
  // Objectify, reverse and resolve the data
  .then((items) => resolve(_isArray ? objectify(items).reverse() : objectify(items[0])))
  .catch(reject);
});

/**
 * Returns the first *propName* from *collection*.
 *
 * @param {ArrayLike} collection The collection to get from
 * @param {String} propName The name of the property to get the first of
 * @param {String} orders The way to order, defaults to 'asc'
 * @return {Any}
 */
export const headBy = (collection, propName, orders = 'asc') => {
  return _.chain(collection)
    .orderBy(propName, orders)
    .thru(_.head)
    .get(propName)
    .value();
}

/**
 * @param {String} cookie The cookie string to get *name* from
 * @param {String} name The name of the cookie to get
 * @return {String}
 */
export function getCookie(cookie, name) {
  return (new RegExp(name + '=([^;]+)').exec(cookie) || [])[1] || null;
}

/**
 * @param {Any} message The message to print
 * @param {Number} verticalPadding Vertical padding as number of '\n', if 0 then none.
 * @param {Boolean} asIs Should *message* be printed as is? Defaults to false
 */
export const print = (message, verticalPadding = 0, asIs = false) => {
  if (!!verticalPadding) { console.log(_.times(verticalPadding, () => '\n').join('')); }
  if (_.some([
    _.isError(message),
    _.isString(message),
    _.isNumber(message),
    _.isUndefined(message),
  ])) { asIs = true; }
  log(
    !!asIs ? message : JSON.stringify(message, null, 4)
  );
  if (!!verticalPadding) { console.log(_.times(verticalPadding, () => '\n').join('')); }
}

/**
 * @param {Array} coll Collection to check *match* against
 * @param {Any|Any[]} match Item or items to look for in *coll*
 * @return {Boolean}
 */
export function contains(coll, match) {
  const _match = _.isArray(match)
    ? match
    : [match];

  // It's nothing and thus cannot contain anything
  return !!~_.indexOf(coll, match);
}

/**
 * Replaces the item at *index* in *coll*.
 *
 * @param {ArrayLike} coll Collection to replace item in
 * @param {Number|String} index Index to replace at. Could also
 * @param {Any} value Value to use instead
 */
export function replace(coll, index, value) {
  // Get a clone of the collection
  let _coll = _.clone(coll);
  // Set the item at *index* to value.
  _coll[index] = value;

  // Return the new item
  return _coll;
}

/**
 * Recursively calls all *promises* in sequence
 * and resolve when all promises are finished.
 *
 * Takes both pure promises and functions returning promises.
 *
 * NOTE: If the array contains functions, these mustn't require parameters,
 * as *sequence* won't pass in any at the moment.
 *
 * @param {Array} promises Array of promises to perform
 * @param {Array} output The output array, do not set!
 * @return {Promise} -> {Array}
 */
function sequence(promises, output) {
    // Make sure output is defined
    if (_.isUndefined(output)) { output = []; }

    // Make sure promises is difined
    if (_.isUndefined(promises)) { promises = []; }

    // When finished
    if (promises.length === output.length) {
        return new Promise(function (resolve, reject) {
            resolve(output);
        });
    }

    // Allow both promises and functions returning promises be used.
    var _promise = _.isFunction(promises[output.length])
        ? promises[output.length]()
        : promises[output.length];

    // Call the promise and then return recursively
    return _promise.then(function (result) {
        // Recursion
        return sequence(promises, output.concat([result]));
    })
    ['catch'](function (err) {
        // Recursion
        return sequence(promises, output.concat([err]));
    });
}

export default {
  http: http,
  logger: logger,
  sql: _sql,
  log: log,
  logPromise: logPromise,
  handleError: handleError,
  escapeRegex: escapeRegex,
  literalRegExp: literalRegExp,
  objectify: objectify,
  paginate: paginate,
  paginateQuery: paginateQuery,
  inject: inject,
  guid: guid,
  parseSQLCreateTable: parseSQLCreateTable,
  dropTable: dropTable,
  createManySQL: createManySQL,
  headBy: headBy,
  getCookie: getCookie,
  print: print,
  contains: contains,
  replace: replace,
  sequence: sequence,
}
