'use strict'

import _ from 'lodash';
import Promise from 'bluebird';
import mssql, { Connection } from 'mssql';
import sql from 'seriate';
import fs from 'fs';
import path from 'path';

import config from './../config';
import _logger from './utils.logger';

// Connection to db
const __connection = {
  context: new Connection(config.db),
  conn: undefined,
  lastError: undefined,
};

/**
 * Logs to stream
 *
 * @param {String} msg
 */
const log = (message, level = "info", meta) => _.isUndefined(meta) ? _logger.log(level, message) : _logger.log(level, message, meta);

/**
 * Listens for the closed event and sets __connection.conn to undefined.
 */
__connection.context.on('close', () => {
  __connection.conn = undefined;
});

__connection.context.on('error', (err) => {
  log(`The following error occured with the SQL connection:\n${err}`);

  if (__connection.context.connected) {
    log('Closing the SQL connection for now.')
    __connection.context.close();
  }
});

__connection.context.on('connected', (conn) => {
  log(conn);
})

/***************
 * Exports below
 ***************/

/**
 * Keeps a local
 *
 * @param {String} connectionName Name of the connection to get.
 * @return {Promise<{}>} Connection
 */
export function getConnection() {
  if (__connection.context.connected) {
    // There is already a connection.
    return Promise.resolve(__connection.conn);
  }

  // Create a new Connection
  return new Promise((resolve, reject) => {
    log('Connceting to the SQL server.');

    __connection.context.connect()
    .then(connection => {
      log('Successfully connected to the SQL server.');
      // Set the stored connection
      __connection.conn = connection;
      // Resolve it
      resolve(__connection.conn);
    })
    .catch(err => {
      log('An error occured when connecting to the SQL server.');
      reject(err);
    });
  });
}

/**
 * Returns a promise of whether the view called *name* exists or not.
 *
 * @param {String} name Name of the view to check existance of
 * @return {Promise} -> {Boolean}
 */
export function viewExists(name) {
  return new Promise((resolve, reject) => {
    sql.execute({
      query: sql.fromFile('./sql/utils.viewExists.sql'),
      params: {
        name: {
          type: sql.VarChar(255),
          val: name,
        },
      },
    })
    .then(res => resolve(!!res.length))
    .catch(reject);
  });
}

/**
 * @param {String} _path Path to check whethet it's absolute or relative
 * @return {Boolean}
 */
function isAbsolutePath(_path) {
  return path.resolve(_path) === path.normalize(_path).replace(/(.+)([\/|\\])$/, '$1');
}

export function initializeView(options) {
  return new Promise((resolve, reject) => {
    let { name, query, filepath, basedir } = options;

    if (_.isEmpty(query) && !_.isEmpty(filepath)) {
      query = isAbsolutePath(createPath)
        ? fs.readFileSync(filepath, { encoding: 'utf8' })
        : fs.readdirSync(path.resolve(basedir, filepath), { encoding: 'utf8' });
    }

    viewExists(name)
    .then(doesExist => {
      if (doesExist && /CREATE VIEW/i.test(query)) {
        query = query.replace(/CREATE VIEW/i, 'ALTER VIEW');
      } else if (!doesExist && /ALTER VIEW/i.test(query)) {
        query = query.replace(/ALTER VIEW/i, 'CREATE VIEW');
      } else if (!/CREATE VIEW|ALTER VIEW/i.test(query)) {
        query = `${doesExist ? 'ALTER VIEW ' : 'CREATE VIEW'} AS ${query}`;
      }

      return sql.execute({ query });
    })
    .then(resolve)
    .catch(reject);
  });
}

export default {
  getConnection: getConnection,
  viewExists: viewExists,
  initializeView: initializeView,
}
