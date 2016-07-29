'use strict'

import TimeAppCategoryRule from './timeAppCategoryRule.db';
import config from '../../config';
import utils from '../../utils/utils';

// Initialize the timeAppCategoryRule table
TimeAppCategoryRule.initialize();

/**
 * Route: GET '/api/timeAppCategoryRules/'
 */
export const index = (req, res) => {
  // Get the top and page for pagination
  let {top, page} = req.query;

  TimeAppCategoryRule.find(top, page)
  .then((timeAppCategoryRules) => res.status(200).json(timeAppCategoryRules))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/timeAppCategoryRules/:id'
 */
export const show = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategoryRule.findById(id)
  .then((timeAppCategoryRule) => res.status(200).json(timeAppCategoryRule))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: POST '/api/timeAppCategoryRules/'
 */
export const create = (req, res) => {
  // Get the timeAppCategoryRule
  let _timeAppCategoryRule = req.body;

  TimeAppCategoryRule.create(_timeAppCategoryRule)
  .then((timeAppCategoryRule) => res.status(200).json(timeAppCategoryRule))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/timeAppCategoryRules/:id'
 */
export const update = (req, res) => {
  // Get the id and timeAppCategoryRule
  let {id} = req.params;
  let _timeAppCategoryRule = req.body;

  TimeAppCategoryRule.update(id, _timeAppCategoryRule)
  .then((timeAppCategoryRule) => res.status(200).json(timeAppCategoryRule))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: DELETE '/api/timeAppCategoryRules/:id'
 */
export const remove = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategoryRule.remove(id)
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
