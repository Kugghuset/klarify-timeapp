'use strict'

import TimeAppReport from './timeAppReport.db';
import config from '../../config';
import utils from '../../utils/utils';

// Initialize the timeAppReport table
TimeAppReport.initialize();

/**
 * Route: GET '/api/timeAppReports/'
 */
export const index = (req, res) => {
  // Get the top and page for pagination
  let {top, page} = req.query;

  TimeAppReport.find(top, page)
  .then((timeAppReports) => res.status(200).json(timeAppReports))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/timeAppReports/:id'
 */
export const show = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppReport.findById(id)
  .then((timeAppReport) => res.status(200).json(timeAppReport))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: POST '/api/timeAppReports/'
 */
export const create = (req, res) => {
  // Get the timeAppReport
  let _timeAppReport = req.body;

  TimeAppReport.create(_timeAppReport)
  .then((timeAppReport) => res.status(200).json(timeAppReport))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/timeAppReports/:id'
 */
export const update = (req, res) => {
  // Get the id and timeAppReport
  let {id} = req.params;
  let _timeAppReport = req.body;

  TimeAppReport.update(id, _timeAppReport)
  .then((timeAppReport) => res.status(200).json(timeAppReport))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: DELETE '/api/timeAppReports/:id'
 */
export const remove = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppReport.remove(id)
  .then(() => res.status(201).send('No Content'))
  .catch((err) => utils.handleError(res, err));
}

export default {
  index: index,
  show: show,
  create: create,
  update: update,
  remove: remove,
}
