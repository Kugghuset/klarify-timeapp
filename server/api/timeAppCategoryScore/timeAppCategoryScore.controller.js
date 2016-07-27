'use strict'

import TimeAppCategoryScore from './timeAppCategoryScore.db';
import config from '../../config';
import utils from '../../utils/utils';

// Initialize the timeAppCategoryScore table
TimeAppCategoryScore.initialize();

/**
 * Route: GET '/api/timeAppCategoryScores/'
 */
export const index = (req, res) => {
  // Get the top and page for pagination
  let {top, page} = req.query;

  TimeAppCategoryScore.find(top, page)
  .then((timeAppCategoryScores) => res.status(200).json(timeAppCategoryScores))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/timeAppCategoryScores/:id'
 */
export const show = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategoryScore.findById(id)
  .then((timeAppCategoryScore) => res.status(200).json(timeAppCategoryScore))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: POST '/api/timeAppCategoryScores/'
 */
export const create = (req, res) => {
  // Get the timeAppCategoryScore
  let _timeAppCategoryScore = req.body;

  TimeAppCategoryScore.create(_timeAppCategoryScore)
  .then((timeAppCategoryScore) => res.status(200).json(timeAppCategoryScore))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/timeAppCategoryScores/:id'
 */
export const update = (req, res) => {
  // Get the id and timeAppCategoryScore
  let {id} = req.params;
  let _timeAppCategoryScore = req.body;

  TimeAppCategoryScore.update(id, _timeAppCategoryScore)
  .then((timeAppCategoryScore) => res.status(200).json(timeAppCategoryScore))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: DELETE '/api/timeAppCategoryScores/:id'
 */
export const remove = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategoryScore.remove(id)
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
