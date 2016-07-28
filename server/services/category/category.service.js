'use strict'

import _ from 'lodash';
import Promise from 'bluebird';

import config from '../../config';
import utils from '../../utils/utils';

import TimeAppReport from './../../api/timeAppReport/timeAppReport.db';
import TimeAppCategory from './../../api/timeAppCategory/timeAppCategory.db';
import TimeAppScore from './../../api/timeAppCategoryScore/timeAppCategoryScore.db';
import TimeAppCategoryRule from './../../api/timeAppCategoryRule/timeAppCategoryRule.db';

/**
 * @return {Promise}
 */
export function categorizeUpdated() {
  return new Promise((resolve, reject) => {
    const _promises = [
      TimeAppReport.findUpdated(),
      TimeAppCategory.findAllDimCategories(),
      TimeAppScore.find(),
      TimeAppCategoryRule.find(),
    ];


    Promise.all(_.map(_promises, prom => prom.reflect()))
    .then(proms => Promise.resolve(_.map(proms, prom => prom.isRejected() ? prom.reason() : prom.value())))
    .then(([timeAppReports, categories, timeAppCriteria, rules]) => {
      const _colNames = _.map(timeAppCriteria, 'colName');

      const _maxScore = _.sumBy(timeAppCriteria, 'value');

      const data =_.chain(timeAppReports)
        .map(report =>
          _.chain(rules)
            .map(rule => (
              _.chain(timeAppCriteria)
                .map(score => _.assign({}, score,  {
                  isMatch: report[score.colName] === rule[score.colName],
                  value: report[score.colName] === rule[score.colName] ? score.value : 0,
                  categoryId: rule.categoryId,
                  val: report[score.colName],
                }))
                .thru(_scores => ({
                  scores: _scores,
                  sum: _.sumBy(_scores, 'value'),
                  categoryId: utils.firstDefined(_scores, 'categoryId'),
                }))
                .value()
              )
            )
            .filter(score => 0 < score.sum)
            .groupBy('sum')
            .map(grouped => _.chain(grouped).orderBy('length', 'desc').first().value())
            .flatten()
            .orderBy('sum', 'desc')
            .first()
            .thru(row => _.pick(row, ['sum', 'categoryId']))
            .thru(score => _.assign({}, score, _.pick(report, _colNames.concat(['timeAppReportId', 'employeeName']))))
            .thru(obj => _.assign({}, obj, _.pick(_.find(categories, ({categoryId}) => categoryId == obj.categoryId), 'categoryName')))
            .thru(obj => _.assign({}, obj, { probabilityPercentage: Math.round(obj.sum / _maxScore * 100) }))
            .value()
        )
        .value();

      utils.print(data)
      resolve(data);
    })
    .catch(reject);
  });
}

categorizeUpdated();

export default {
  categorizeUpdated: categorizeUpdated,
}
