'use strict'

import TimeAppCategoryResult from './timeAppCategoryResult.db';
import config from '../../config';
import utils from '../../utils/utils';

// Initialize the timeAppCategoryResult table
TimeAppCategoryResult.initialize();

/**
 * Route: GET '/api/timeAppCategoryResults/'
 */
export const index = (req, res) => {
  // Get the top and page for pagination
  let {top, page} = req.query;

  TimeAppCategoryResult.find(top, page)
  .then((timeAppCategoryResults) => res.status(200).json(timeAppCategoryResults))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/timeAppCategoryResults/:id'
 */
export const show = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategoryResult.findById(id)
  .then((timeAppCategoryResult) => res.status(200).json(timeAppCategoryResult))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: POST '/api/timeAppCategoryResults/'
 */
export const create = (req, res) => {
  // Get the timeAppCategoryResult
  let _timeAppCategoryResult = req.body;

  TimeAppCategoryResult.create(_timeAppCategoryResult)
  .then((timeAppCategoryResult) => res.status(200).json(timeAppCategoryResult))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/timeAppCategoryResults/:id'
 */
export const update = (req, res) => {
  // Get the id and timeAppCategoryResult
  let {id} = req.params;
  let _timeAppCategoryResult = req.body;

  TimeAppCategoryResult.update(id, _timeAppCategoryResult)
  .then((timeAppCategoryResult) => res.status(200).json(timeAppCategoryResult))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: DELETE '/api/timeAppCategoryResults/:id'
 */
export const remove = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategoryResult.remove(id)
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
