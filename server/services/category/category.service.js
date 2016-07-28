'use strict'

import _ from 'lodash';
import Promise from 'bluebird';

import config from '../../config';
import utils from '../../utils/utils';

import TimeAppReport from './../../api/timeAppReport/timeAppReport.db';
import TimeAppCategory from './../../api/timeAppCategory/timeAppCategory.db';
import TimeAppScore from './../../api/timeAppCategoryScore/timeAppCategoryScore.db';

/**
 * @return {Promise}
 */
export function categorizeUpdated() {
  return new Promise((resolve, reject) => {
    const _promises = [
      TimeAppReport.findUpdated(),
      TimeAppCategory.findAllDimCategories(),
      TimeAppScore.find(),
    ];

    Promise.all(_.map(_promises, prom => prom.reflect()))
    .then(proms => Promise.resolve(_.map(proms, prom => prom.isRejected() ? prom.reason() : prom.value())))
    .then(([timeAppReports, categories, timeAppScores]) => {
      utils.print([timeAppReports, categories, timeAppScores], 5);
    })
    .catch(reject);
  });
}

categorizeUpdated();

export default {
  categorizeUpdated: categorizeUpdated,
}
