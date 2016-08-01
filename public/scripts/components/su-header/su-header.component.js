'use strict'

import Vue from 'vue';
import template from './su-header.template.html';

const SuHeaderComponent = Vue.extend({
  template,
  props: {
    title: {
      type: String,
      default: '',
    },
  },
});

// Register component
Vue.component('su-header', SuHeaderComponent);

export default SuHeaderComponent;
