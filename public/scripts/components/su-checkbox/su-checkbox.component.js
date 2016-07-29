'use strict'

import Vue from 'vue';
import template from './su-checkbox.template.html';

import auth from './../../services/auth';

const SuCheckboxComponent = Vue.extend({
  template,
  data: function () {
    return {
      suName: `checkbox-${auth.guid()}`,
    };
  },
  props: {
    checked: {
      type: Boolean,
      default: undefined,
    },
  },
});

// Register component
Vue.component('su-checkbox', SuCheckboxComponent);

export default SuCheckboxComponent;
