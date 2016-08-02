'use strict'

import Vue from 'vue';
import template from './route-trigger-refresh.template.html';

import { http } from './../../services/utils';

const RouteTriggerRefreshComponent = Vue.extend({
  template,
  data: function () {
    return {
      isLoading: false,
    };
  },
  methods: {
    triggerUpdate: function () {
      this.isLoading = true;

      http.get('/services/time-app/trigger-refresh')
      .then(function (data) {
        this.isLoading = false;
      }.bind(this))
      .catch(function (err) {
        this.isLoading = false;
        console.log(err);
      }.bind(this));
    },
  }
});

// Register component
Vue.component('route-trigger-refresh', RouteTriggerRefreshComponent);

export default RouteTriggerRefreshComponent;
