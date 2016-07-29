'use strict'

import TimeAppCategoryCriteria from './timeAppCategoryCriteria.db';
import config from '../../config';
import utils from '../../utils/utils';

// Initialize the timeAppCategoryCriteria table
TimeAppCategoryCriteria.initialize();

/**
 * Route: GET '/api/timeAppCategoryScores/'
 */
export const index = (req, res) => {
  // Get the top and page for pagination
  let {top, page} = req.query;

  TimeAppCategoryCriteria.find(top, page)
  .then((timeAppCategoryScores) => res.status(200).json(timeAppCategoryScores))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/timeAppCategoryScores/:id'
 */
export const show = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategoryCriteria.findById(id)
  .then((timeAppCategoryCriteria) => res.status(200).json(timeAppCategoryCriteria))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: POST '/api/timeAppCategoryScores/'
 */
export const create = (req, res) => {
  // Get the timeAppCategoryCriteria
  let _timeAppCategoryScore = req.body;

  TimeAppCategoryCriteria.create(_timeAppCategoryScore)
  .then((timeAppCategoryCriteria) => res.status(200).json(timeAppCategoryCriteria))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/timeAppCategoryScores/:id'
 */
export const update = (req, res) => {
  // Get the id and timeAppCategoryCriteria
  let {id} = req.params;
  let _timeAppCategoryScore = req.body;

  TimeAppCategoryCriteria.update(id, _timeAppCategoryScore)
  .then((timeAppCategoryCriteria) => res.status(200).json(timeAppCategoryCriteria))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: DELETE '/api/timeAppCategoryScores/:id'
 */
export const remove = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategoryCriteria.remove(id)
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
