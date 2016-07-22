'use strict'

import TimeAppEmployee from './timeAppEmployee.db';
import config from '../../config';
import utils from '../../utils/utils';

// Initialize the timeAppEmployee table
TimeAppEmployee.initialize();

/**
 * Route: GET '/api/timeAppEmployees/'
 */
export const index = (req, res) => {
  // Get the top and page for pagination
  let {top, page} = req.query;

  TimeAppEmployee.find(top, page)
  .then((timeAppEmployees) => res.status(200).json(timeAppEmployees))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/timeAppEmployees/:id'
 */
export const show = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppEmployee.findById(id)
  .then((timeAppEmployee) => res.status(200).json(timeAppEmployee))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: POST '/api/timeAppEmployees/'
 */
export const create = (req, res) => {
  // Get the timeAppEmployee
  let _timeAppEmployee = req.body;

  TimeAppEmployee.create(_timeAppEmployee)
  .then((timeAppEmployee) => res.status(200).json(timeAppEmployee))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/timeAppEmployees/:id'
 */
export const update = (req, res) => {
  // Get the id and timeAppEmployee
  let {id} = req.params;
  let _timeAppEmployee = req.body;

  TimeAppEmployee.update(id, _timeAppEmployee)
  .then((timeAppEmployee) => res.status(200).json(timeAppEmployee))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: DELETE '/api/timeAppEmployees/:id'
 */
export const remove = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppEmployee.remove(id)
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
