'use strict'

import express from 'express';
import timeApp from './timeApp.service';
import auth from '../auth/auth.service';

const router = express.Router();

router.get('/trigger-refresh', auth.isAuthenticated(), timeApp.triggerReport);

export default router;
