'use strict'

import Vue from 'vue';
import Promise from 'bluebird';
import moment from 'moment';
import template from './route-set-rules.template.html';

import { http } from './../../services/utils';

const RouteSetRulesComponent = Vue.extend({
  template,
  data: function () {
    return {
      reports: [],
      categories: [],
      isLoading: true,
      currentPage: 0,
      pageSize: 50,
      dateFrom: moment().subtract(3, 'months').toDate(),
      dateTo: new Date(),
      predicate: 'timeAppCategory.probabilityPercentage',
      sortOrder: 'asc',
      filteredReports: this.setFilteredReports(),
    };
  },
  route: {
    data: function () {
      return new Promise((resolve, reject) => {
        const _promises = [
          http.get('api/time-app-reports/categorized'),
          http.get('api/time-app-categories/dim-categories')
        ];

        Promise.all(_.map(_promises, prom => prom.reflect()))
        .then(data => Promise.resolve(_.map(data, val => val.isRejected() ? val.reason() : val.value())))
        .then(data => { return Promise.resolve(data); })
        .then(([reports, categories]) => {
          resolve({ reports, isLoading: false, currentPage: 0, categories: _.map(categories, cat => ({ name: cat.categoryName, value: cat.categoryId })) })
          this._reports = reports;
        });
      });
    },
  },
  computed: {
    _reports: {
      get: function () {
        return this.reports;
      },
      set: function (reports) {
        this.reports = reports;
        this.setFilteredReports();
      },
    },
    _dateFrom: {
      get: function () {
        return this.dateFrom;
      },
      set: function (dateFrom) {
        if (!moment(dateFrom).isSame(this.dateFrom, 'day')) {
          this.dateFrom = dateFrom;
          this.setFilteredReports();
        }
      },
    },
    _dateTo: {
      get: function () {
        return this.dateTo;
      },
      set: function (dateTo) {
        if (!moment(dateTo).isSame(this.dateTo, 'day')) {
          this.dateTo = dateTo;
          this.setFilteredReports();
        }
      },
    },
  },
  methods: {
    saveRule: function (report) {
      this.isLoading = true;
      const _report = JSON.parse(JSON.stringify(report));

      const data = { dateFrom: this.dateFrom, dateTo: this.dateTo, reportRule: _report };

      http.put(`api/time-app-categories/set-rule`, data)
      .then(function (reports) {
        this._reports = reports;
        this.isLoading = false;
      }.bind(this))
      .catch(err => {
      });
    },
    getPage: function (reports = [], pageIndex = 0, size = 50) {
      return reports.slice(pageIndex * size, pageIndex * size + size);
    },
    getMaxIndex: function (reports = [], size = 50) {
      return Math.floor(reports.length / size);
    },
    setOrder: function (predicate) {
      if (this.predicate !== predicate) {
        this.predicate = predicate;
        this.sortOrder = 'asc';
      } else {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      }

      this.setFilteredReports();
    },
    setFilteredReports: function () {
      const { dateTo, dateFrom } = this;

      this.filteredReports = _.chain(this._reports)
        .orderBy(this.predicate, this.sortOrder)
        .filter(report => isSameOrBetween(report.date, dateFrom, dateTo, 'day'))
        .value();

      return this.filteredReports;
    },
  },
});

function isSameOrBetween(date, dateFrom, dateTo, granularity) {
  return moment(date).isSameOrAfter(dateFrom, granularity) && moment(date).isSameOrBefore(dateTo, granularity);
}

// Register component
Vue.component('route-set-rules', RouteSetRulesComponent);

export default RouteSetRulesComponent;
