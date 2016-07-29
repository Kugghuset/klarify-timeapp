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
 * TODO: Rename TimeAppScore to TimeAppCriteria
 */

/**
 * Matches the *report* against *rule* based on all *timeAppCriteria*.
 *
 * @param {{ type: String, employeeName: String, date: Date, customerName: String, projectName: String, comment: String, code: String, quantity: Number, price: Number, sum: Number, categoryId: Number, isUpdated: Boolean }} report
 * @param {{ description: String, customerName: String, projectName: String, code: String, employeeId: Number, categoryId: Number }} rule
 * @param {{ colName: String, value: Number }[]} timeAppCriteria
 * @return {{ sum: Number, categoryId: Number }}
 */
function matchRule(report, rule, timeAppCriteria) {
  return _.chain(timeAppCriteria)
    // Filter out any non matching criteria
    .filter(criteria => report[criteria.colName] === rule[criteria.colName])
    // Summarize and return the *sum* and *categoryId*
    .thru(criteria => ({
      sum: _.sumBy(criteria, 'value'),
      categoryId: rule.categoryId,
    }))
    .value()
}

/**
 * Categorizes a single *report* against *rules* and
 *
 * @param {{ type: String, employeeName: String, date: Date, customerName: String, projectName: String, comment: String, code: String, quantity: Number, price: Number, sum: Number, categoryId: Number, isUpdated: Boolean }} report
 * @param {{ description: String, customerName: String, projectName: String, code: String, employeeId: Number, categoryId: Number }[]} rules
 * @param {{ colName: String, value: Number }[]} timeAppCriteria
 * @param {{ categoryName: String, categoryId: Number }[]} categories
 */
function categorizeReport(report, rules, timeAppCriteria, categories) {
  // Get all valid colNames
  const _colNames = _.map(timeAppCriteria, 'colName');

  // Get the max score possible
  const _maxScore = _.sumBy(timeAppCriteria, 'value');

  return _.chain(rules)
    // Map over all rules and match *report* against *rule*
    .map(rule => matchRule(report, rule, timeAppCriteria))
    // Filter any non-matching values
    .filter(score => 0 < score.sum)
    /**
     * Group by sum to get most often used category by each score.
     * This to ensure it's less random when there are multiple categories
     * with the same score.
     */
    .groupBy('sum')
    /**
     * Map over each array grouped by scores and create subgroups by their categoryId.
     * Order these by length in descending order and pick the first one.
     */
    .map(grouped => _.chain(grouped).groupBy('categoryId').orderBy('length', 'desc').first().value())
    // Flatten the array
    .flatten()
    // Order by score in descending order
    .orderBy('sum', 'desc')
    // Pick the first item, which is the one with the highest score.
    .first()
    // Assign the values from *report* on the *colNames* properties and also *timeAppReportId* and *employeeName*
    .thru(score => _.assign({}, score, _.pick(report, _colNames.concat(['timeAppReportId', 'employeeName']))))
    // Calculate the probabilityPercentage by getting the percentage of correct score
    .thru(obj => _.assign({}, obj, { probabilityPercentage: Math.round(obj.sum / _maxScore * 100) }))
    .value()
}

/**
 * Categorizes all reports with the isUpdated flag
 * and returns a promise of the scores.
 *
 * @return {Promise<{ sum: Number, categoryId: Number, customerName: String, projectName: String, code: String, employeeId:Number, timeAppReportId: Number, employeeName: String, probabilityPercentage: Number }[]>}
 */
export function categorizeUpdated() {
  return new Promise((resolve, reject) => {
    // Get all requried data from db
    const _promises = [
      TimeAppReport.findUpdated(),
      TimeAppCategory.findAllDimCategories(),
      TimeAppScore.find(),
      TimeAppCategoryRule.find(),
    ];

    Promise.all(_promises)
    .then(([timeAppReports, categories, timeAppCriteria, rules]) => {
      // When all data is gotten, categorize all reports
      const data = _.map(timeAppReports, report => categorizeReport(report, rules, timeAppCriteria, categories))

      resolve(data);
    })
    .catch(reject);
  });
}

/**
 * Categorizes all *reports*
 * and returns a promise of the scores.
 *
 * @param {{ type: String, employeeName: String, date: Date, customerName: String, projectName: String, comment: String, code: String, quantity: Number, price: Number, sum: Number, categoryId: Number, isUpdated: Boolean }[]} reports
 * @return {Promise<{ sum: Number, categoryId: Number, customerName: String, projectName: String, code: String, employeeId:Number, timeAppReportId: Number, employeeName: String, probabilityPercentage: Number }[]>}
 */
export function categorizeReports(reports) {
  return new Promise((resolve, reject) => {
    // Get all requried data from db
    const _promises = [
      TimeAppCategory.findAllDimCategories(),
      TimeAppScore.find(),
      TimeAppCategoryRule.find(),
    ];

    Promise.all(_promises)
    .then(([categories, timeAppCriteria, rules]) => {
      // When all data is gotten, categorize all reports
      const data = _.map(reports, report => categorizeReport(report, rules, timeAppCriteria, categories))

      resolve(data);
    })
    .catch(reject);
  });
}

/**
 * Merges timeAppCategories and updates categoryIds of reports.
 *
 * @param {{ sum: Number, categoryId: Number, customerName: String, projectName: String, code: String, employeeId:Number, timeAppReportId: Number, employeeName: String, probabilityPercentage: Number }[]} catReports
 */
export function storeCategorizedReports(catReports) {
  return new Promise((resolve, reject) => {
    // Do something
    resolve();
  });
}

export default {
  categorizeUpdated: categorizeUpdated,
  categorizeReports: categorizeReports,
}
