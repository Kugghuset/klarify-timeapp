'use strict'

import _ from 'lodash';
import Vue from 'vue';
import template from './su-input.template.html';

const SuInputComponent = Vue.extend({
  template,
  props: {
    value: {
      type: null,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    _id: {
      type: String,
      default: '',
    },
    centerText: {
      type: Boolean,
      default: false,
    },
    bigText: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hasValue: function () {
      return this.value || this.value === 0;
    },
  },
});

// Register component
Vue.component('su-input', SuInputComponent);

export default SuInputComponent;
