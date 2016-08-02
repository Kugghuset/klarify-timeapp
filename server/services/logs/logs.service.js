'use strict'

import _ from 'lodash';
import Promise from 'bluebird';
import path from 'path';
import fs from 'fs';

import config from '../../config';
import utils from '../../utils/utils';

/**
 * Route: GET '/services/logs[/:filename]
 */
export function getLogs(req, res) {
  const _path = !!req.params.filename
    ? path.resolve(utils.logger.logPath.replace(/logfile$/, ''), req.params.filename)
    : `${utils.logger.logPath}.log`;

  // The file doesn't exist or it's an illegal file
  if (!fs.existsSync(_path)) {
    utils.log(`Someone requested the non existant log file at ${path.basename(_path)}`);
    return res.status(404).send('Not found');
  } else if (/\//.test(req.params.filename)) {
    utils.log(`Someone requested the non allowed log file at ${req.params.filename}`);
    return res.status(404).send('Not found');
  }

  utils.log(`Someone requested the log file at ${path.basename(_path)}`);

  res.sendFile(_path);
}

export default {
  getLogs: getLogs,
}
