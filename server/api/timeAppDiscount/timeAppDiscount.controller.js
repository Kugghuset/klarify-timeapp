'use strict'

import TimeAppDiscount from './timeAppDiscount.db';
import config from '../../config';
import utils from '../../utils/utils';

// Initialize the timeAppDiscount table
TimeAppDiscount.initialize();

/**
 * Route: GET '/api/timeAppDiscounts/'
 */
export const index = (req, res) => {
  // Get the top and page for pagination
  let {top, page} = req.query;

  TimeAppDiscount.find(top, page)
  .then((timeAppDiscounts) => res.status(200).json(timeAppDiscounts))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/timeAppDiscounts/:id'
 */
export const show = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppDiscount.findById(id)
  .then((timeAppDiscount) => res.status(200).json(timeAppDiscount))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: POST '/api/timeAppDiscounts/'
 */
export const create = (req, res) => {
  // Get the timeAppDiscount
  let _timeAppDiscount = req.body;

  TimeAppDiscount.create(_timeAppDiscount)
  .then((timeAppDiscount) => res.status(200).json(timeAppDiscount))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/timeAppDiscounts/:id'
 */
export const update = (req, res) => {
  // Get the id and timeAppDiscount
  let {id} = req.params;
  let _timeAppDiscount = req.body;

  TimeAppDiscount.update(id, _timeAppDiscount)
  .then((timeAppDiscount) => res.status(200).json(timeAppDiscount))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: DELETE '/api/timeAppDiscounts/:id'
 */
export const remove = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppDiscount.remove(id)
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
