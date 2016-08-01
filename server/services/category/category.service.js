'use strict'

import _ from 'lodash';
import Promise from 'bluebird';

import config from '../../config';
import utils from '../../utils/utils';

import TimeAppReport from './../../api/timeAppReport/timeAppReport.db';
import TimeAppCategory from './../../api/timeAppCategory/timeAppCategory.db';
import TimeAppCategoryCriteria from './../../api/timeAppCategoryCriteria/timeAppCategoryCriteria.db';
import TimeAppCategoryRule from './../../api/timeAppCategoryRule/timeAppCategoryRule.db';

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
      TimeAppCategoryCriteria.find(),
      TimeAppCategoryRule.find(),
    ];

    utils.log('Categorizing updated reports', 'info');

    Promise.all(_promises)
    .then(([timeAppReports, categories, timeAppCriteria, rules]) => {
      // When all data is gotten, categorize all reports
      const data = _.map(timeAppReports, report => categorizeReport(report, rules, timeAppCriteria, categories))

      utils.log('Completed categorizing updated reports', 'info', { reportsLength: data.length });

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
      TimeAppCategoryCriteria.find(),
      TimeAppCategoryRule.find(),
    ];

    utils.log('Categorizing reports', 'info', { reportsLength: reports.length });

    Promise.all(_promises)
    .then(([categories, timeAppCriteria, rules]) => {
      // When all data is gotten, categorize all reports
      const data = _.map(reports, report => categorizeReport(report, rules, timeAppCriteria, categories))

      utils.log('Completed categorizing reports', 'info', { reportsLength: data.length });

      resolve(data);
    })
    .catch(reject);
  });
}

/**
 * Merges timeAppCategories and updates categoryIds of reports.
 *
 * @param {{ sum: Number, categoryId: Number, customerName: String, projectName: String, code: String, employeeId:Number, timeAppReportId: Number, employeeName: String, probabilityPercentage: Number }[]} catReports
 * @return {Promise}
 */
export function storeCategorizedReports(catReports) {
  return TimeAppCategory.mergeCategorizedReports(catReports);
}

/**
 * @param {{ type: String, employeeName: String, date: Date, customerName: String, projectName: String, comment: String, code: String, quantity: Number, price: Number, sum: Number, categoryId: Number, isUpdated: Boolean }[]} [reports]
 * @return {Promise}
 */
export function categorizeAndStore(reports) {
  return (
    _.isUndefined(reports)
      ? categorizeUpdated()
      : categorizeReports(reports)
  )
  .then(data => storeCategorizedReports(data))
  .then(Promise.resolve)
  .catch(Promise.reject);
}

/**
 * @param {{ timeAppReportId: Number, type: String, code: String, customerName: String, date: Date, employeeId: Number, employeeName: String, projectName: String, givenCategoryId: Number, timeAppCategory: { categoryId: Number, categoryName: String, probabilityPercentage: Number, timeAppCategoryId: Number } }} reportRule
 * @return {Promise}
 */
export function createRule(reportRule) {
  // Creat the rule from the passed in object.
  const rule = _.assign(
    {},
    _.pick(reportRule, ['timeAppReportId', 'code', 'customerName', 'projectName', 'employeeId', 'employeeName']),
    { categoryId: reportRule.givenCategoryId, }
  );

  utils.log('Creating rule', 'info', rule);

  return TimeAppCategoryRule.create(rule)
  .then(_rule => utils.logResolve(_rule,'Successfully created rule', 'info', _rule))
  .catch(err => utils.logReject(err, 'Failed to create rule', 'error', { err: err, rule: rule }));
}

/**
 * Creates the rule and updates all rules with less than 100 % probabilityPercentage.
 *
 * @param {{ dateTo: Date, dateFrom: Date, reportRule: { timeAppReportId: Number, type: String, code: String, customerName: String, date: Date, employeeId: Number, employeeName: String, projectName: String, givenCategoryId: Number, timeAppCategory: { categoryId: Number, categoryName: String, probabilityPercentage: Number, timeAppCategoryId: Number } } }} paramData
 * @return {Promise}
 */
export function createRuleAndCategorize(paramData = {}) {
  const { reportRule, dateFrom, dateTo } = paramData;

  // First create the rule
  return createRule(reportRule)
  // Find all categorized reports with less than 100 % probabilityPercentage
  .then(data => utils.logResolve(data, 'Finding categorized reports without complete certainty', 'info'))
  .then(data => TimeAppReport.findCategorized({ dateFrom, dateTo }))
  .then(data => utils.logResolve(data, 'Successfully found categorized reports without complete certainty', 'info', { reportsLength: data.length }))
  // Categorize and store the reports
  .then(timeAppReports => categorizeAndStore(timeAppReports))
  //  Find all categorized reports with less than 100 % probabilityPercentage again for resolving.
  .then(data => TimeAppReport.findCategorized())
  .catch(Promise.reject);
}

export default {
  categorizeUpdated: categorizeUpdated,
  categorizeReports: categorizeReports,
  storeCategorizedReports: storeCategorizedReports,
  categorizeAndStore: categorizeAndStore,
  createRule: createRule,
  createRuleAndCategorize: createRuleAndCategorize,
}
