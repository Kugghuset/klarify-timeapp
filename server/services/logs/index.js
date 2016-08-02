'use strict'

import express from 'express';
import logs from './logs.service';
import auth from '../auth/auth.service';

const router = express.Router();

router.get('/', auth.isAuthenticated(), logs.getLogs);
router.get('/:filename', auth.isAuthenticated(), logs.getLogs);

export default router;
