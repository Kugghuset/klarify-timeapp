'use strict'

import Vue from 'vue';
import Promise from 'bluebird';
import template from './route-set-rules.template.html';


import { http } from './../../services/utils';

const RouteSetRulesComponent = Vue.extend({
  template,
  data: function () {
    return {
      reports: [],
      categories: [],
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
        .then(data => { console.log(data); return Promise.resolve(data); })
        .then(([reports, categories]) => {
          resolve({ reports, categories: _.map(categories, cat => ({ name: cat.categoryName, value: cat.categoryId })) })
        });
      });
    },
  },
  computed: {
    _reports: function () {
      return _.filter(this.reports, report => report.timeAppCategory.probabilityPercentage < 100);
    },
  },
  methods: {
    saveRule: function (report) {
      const _report = JSON.parse(JSON.stringify(report));
      console.log(_report);
    }
  }
});

// Register component
Vue.component('route-set-rules', RouteSetRulesComponent);

export default RouteSetRulesComponent;
