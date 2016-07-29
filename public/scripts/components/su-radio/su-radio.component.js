'use strict'

import Vue from 'vue';
import template from './su-radio.template.html';

import auth from './../../services/auth';

const SuRadioComponent = Vue.extend({
  template,
  data: function () {
    return {
      suName: `checkbox-${auth.guid()}`,
    };
  },
  props: {
    checked: {
      type: null,
      default: undefined,
      twoWay: true,
    },
    value: {
      type: null,
      default: undefined,
    },
  },
  computed: {
    isChecked: function () {
      return this.checked === this.value;
    },
  }
});

// Register the component
Vue.component('su-radio', SuRadioComponent);

export default SuRadioComponent;
