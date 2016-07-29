'use strict'

import TimeAppCategory from './timeAppCategory.db';
import config from '../../config';
import utils from '../../utils/utils';

// Initialize the timeAppCategory table
TimeAppCategory.initialize();

/**
 * Route: GET '/api/timeAppCategorys/'
 */
export const index = (req, res) => {
  // Get the top and page for pagination
  let {top, page} = req.query;

  TimeAppCategory.find(top, page)
  .then((timeAppCategorys) => res.status(200).json(timeAppCategorys))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/timeAppCategorys/:id'
 */
export const show = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategory.findById(id)
  .then((timeAppCategory) => res.status(200).json(timeAppCategory))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: POST '/api/timeAppCategorys/'
 */
export const create = (req, res) => {
  // Get the timeAppCategory
  let _timeAppCategory = req.body;

  TimeAppCategory.create(_timeAppCategory)
  .then((timeAppCategory) => res.status(200).json(timeAppCategory))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/timeAppCategorys/:id'
 */
export const update = (req, res) => {
  // Get the id and timeAppCategory
  let {id} = req.params;
  let _timeAppCategory = req.body;

  TimeAppCategory.update(id, _timeAppCategory)
  .then((timeAppCategory) => res.status(200).json(timeAppCategory))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: DELETE '/api/timeAppCategorys/:id'
 */
export const remove = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategory.remove(id)
  .then(() => res.status(201).send('No Content'))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/timeAppCategorys/dim-categories'
 */
export function getDimCategories(req, res) {
  TimeAppCategory.findAllDimCategories()
  .then(categories => res.status(200).json(categories))
  .catch(err => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/timeAppCategorys/set-rule'
 */
export function setRule(req, res) {
  TimeAppCategory.setRule(req.body)
  .then(data => res.status(200).json(data))
  .catch(err => utils.handleError(res, err));
};

export default {
  index: index,
  show: show,
  create: create,
  update: update,
  remove: remove,
  getDimCategories: getDimCategories,
  setRule: setRule,
}
