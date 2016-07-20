'use strict'

import express from 'express';
import * as bodyParser from 'body-parser';
import * as sql from 'seriate';

import config from './config';
import utils from './utils/utils';

const app = express();

// Set default configuration for Seriate
// sql.setDefaultConfig(config.db);

// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import routes from './routes';
routes(app, utils.logger);

// Initialize the server
const server = app.listen(config.port, config.ip, () => {
  let host = server.address().address;
  let port = server.address().port;

  utils.log('App listening on %s on port %s', host, port);
});
