'use strict'

import express from 'express';
import controller from './timeAppCategory.controller';
import auth from '../../services/auth/auth.service';

const router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/dim-categories', auth.isAuthenticated(), controller.getDimCategories);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/set-rule', auth.isAuthenticated(), controller.setRule)
router.put('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.remove);

export default router;
