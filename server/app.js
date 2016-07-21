'use strict'

import express from 'express';
import * as bodyParser from 'body-parser';
import * as sql from 'seriate';
import  mssql from 'mssql';

import config from './config';
import utils from './utils/utils';

const app = express();

// Set default configuration for Seriate
sql.setDefaultConfig(config.db);

// Log the server instance
utils.log(`Connected to the server: ${config.db.server}`)

// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import routes from './routes';
routes(app, utils.logger);

// Initialize the server
const server = app.listen(config.port, config.ip, () => {
  const host = server.address().address;
  const port = server.address().port;

  utils.log(`App listening on ${host} on port ${port}`);
});
