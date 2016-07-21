'use strict'

import _ from 'lodash';
import DataObjectParser from 'dataobject-parser';
import sql from 'seriate';
import mssql from 'mssql';
import path from 'path';

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
  let _output = _.attempt(() => {
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
  let _tableName = /^\[.*\]$/.test(tableName)
    ? `[dbo].${tableName}`
    : `[dbo].[${tableName}]`;

  // If there's a database, make sure it's in square brackets
  let _database = (!!database && /^\[.*\]$/.test(database))
    ? database
    : `[${database}]`;

  // Use either the default database or *database*
  let _tablePath = !!database
    ? `${_database}.${_tableName}`
    : _tableName;

  // Create the query
  let _query = `DROP TABLE ${_tablePath}`;

  console.log(`Dropping table ${_tablePath}`);

  // Drop the table!
  sql.execute({
    query: _query
  })
  .then((data) => resolve(data))
  .catch(reject);
});

/**
 * @param {Array} collection The items to create many of
 * @param {String} tableName Name of the table to insert *collection* into
 * @param {String} dirname The __dirname variable for setting the root for files
 * @param {String} baseName Base of name for the sql files
 * @param {String} mainId Name of the main id column in the table. Defaults to *baseName* + 'Id'
 * @param {Array} skipNames Array of column names to skip in creating the table. Identity columns will be skipped. Defaults to ['isDisabled', 'dateUpdated', 'dateCreated']
 * @return {Promise} -> {Array}
 */
export const createManySQL = (collection, tableName, dirname, baseName, mainId, skipNames = ['isDisabled', 'dateUpdated', 'dateCreated']) => new Promise((resolve, reject) => {
  // Ensure mainId is defined
  if (!mainId) { mainId = `${baseName}Id`; }

  // Create the temp table
  let _table = new mssql.Table(tableName);

  // Get the column definitions for the table, execpt for the IDS
  let _columns = parseSQLCreateTable(sql.fromFile(path.resolve(dirname, `./sql/${baseName}.initialize.sql`)), skipNames);

  // Set table creation to true, to ensure the table is created if it doesn't exist,
  // which it shouldn't do
  _table.create = true;

  // Add all columns to the table
  _.forEach(_columns, (col, i) => {
    _table.columns.add(col.name, col.type, _.omit(col, ['name', 'type']));
  });

  // Add all rows
  _.forEach(collection, (item) => {
    // Get all parameters from the telList in the order of the column names
    let _data = _.map(_columns, (col) => item[col.name]);

    // Add the row
    _table.rows.add(..._data);
  });

  // Create a request instace and make the bulk operation
  new mssql.Connection(config.db).connect()
  .then((connection) => {
    // Get the current request
    let _request = new mssql.Request(connection);

    return _request.bulk(_table);
  })
  .then((rowCount) => {

    // Query the DB and return the latest inserts
    return sql.execute({
      query: sql.fromFile(path.resolve(dirname, `./sql/${baseName}.find.sql`))
        .replace('SELECT', `SELECT TOP ${rowCount}`)
        + `ORDER BY [${mainId}] DESC`
    });
  })
  // Objectify, reverse and resolve the data
  .then((telList) => resolve(objectify(telList).reverse()))
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

export default {
  http: http,
  logger: logger,
  log: log,
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
}
