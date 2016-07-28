'use strict'

import TimeAppCategoryBlob from './timeAppCategoryBlob.db';
import config from '../../config';
import utils from '../../utils/utils';

// Initialize the timeAppCategoryBlob table
TimeAppCategoryBlob.initialize();

/**
 * Route: GET '/api/timeAppCategoryBlobs/'
 */
export const index = (req, res) => {
  // Get the top and page for pagination
  let {top, page} = req.query;

  TimeAppCategoryBlob.find(top, page)
  .then((timeAppCategoryBlobs) => res.status(200).json(timeAppCategoryBlobs))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/timeAppCategoryBlobs/:id'
 */
export const show = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategoryBlob.findById(id)
  .then((timeAppCategoryBlob) => res.status(200).json(timeAppCategoryBlob))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: POST '/api/timeAppCategoryBlobs/'
 */
export const create = (req, res) => {
  // Get the timeAppCategoryBlob
  let _timeAppCategoryBlob = req.body;

  TimeAppCategoryBlob.create(_timeAppCategoryBlob)
  .then((timeAppCategoryBlob) => res.status(200).json(timeAppCategoryBlob))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/timeAppCategoryBlobs/:id'
 */
export const update = (req, res) => {
  // Get the id and timeAppCategoryBlob
  let {id} = req.params;
  let _timeAppCategoryBlob = req.body;

  TimeAppCategoryBlob.update(id, _timeAppCategoryBlob)
  .then((timeAppCategoryBlob) => res.status(200).json(timeAppCategoryBlob))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: DELETE '/api/timeAppCategoryBlobs/:id'
 */
export const remove = (req, res) => {
  // Get the id
  let {id} = req.params;

  TimeAppCategoryBlob.remove(id)
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
