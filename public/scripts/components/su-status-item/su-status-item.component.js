'use strict'

import Vue from 'vue';
import template from './su-status-item.template.html';

const SuStatusItemComponent = Vue.extend({
  template,
  props: {
    title: {
      type: String,
      default: '',
    },
    successful: {
      type: Boolean,
      default: '',
    },
    date: {
      type: String,
      default: null,
    },
  }
});

// Register component
Vue.component('su-status-item', SuStatusItemComponent);

export default SuStatusItemComponent;
