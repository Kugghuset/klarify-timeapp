'use strict'

import Vue from 'vue';
import template from './su-range.template.html';

const SuRangeComponent = Vue.extend({
  template,
  props: {
    value: {
      type: Number,
      twoWay: true,
      default: undefined,
    },
    step: {
      Type: Number,
      default: 1,
    },
    min: {
      Type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
  },
});

// Register component
Vue.component('su-range', SuRangeComponent);

export default SuRangeComponent;
