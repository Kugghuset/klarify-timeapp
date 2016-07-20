'use strict'

import User from './user.db';
import config from '../../config';
import utils from '../../utils/utils';

// Initialize the user table
// User.initialize();

/**
 * Route: GET '/api/users/'
 */
export const index = (req, res) => {
  // Get the top and page for pagination
  let {top, page} = req.query;

  User.find(top, page)
  .then((users) => res.status(200).json(users))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: GET '/api/users/:id'
 */
export const show = (req, res) => {
  // Get the id
  let {id} = req.params;

  User.findById(id)
  .then((user) => res.status(200).json(user))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: POST '/api/users/'
 */
export const create = (req, res) => {
  // Get the user
  let _user = req.body;

  User.create(_user)
  .then((user) => res.status(200).json(user))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: PUT '/api/users/:id'
 */
export const update = (req, res) => {
  // Get the id and user
  let {id} = req.params;
  let _user = req.body;

  User.update(id, _user)
  .then((user) => res.status(200).json(user))
  .catch((err) => utils.handleError(res, err));
}

/**
 * Route: DELETE '/api/users/:id'
 */
export const remove = (req, res) => {
  // Get the id
  let {id} = req.params;

  User.remove(id)
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
