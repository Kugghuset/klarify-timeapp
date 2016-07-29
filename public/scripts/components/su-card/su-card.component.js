'use strict'

import Vue from 'vue';
import template from './su-card.template.html';

import _ from 'lodash';

const SuCardComponent = Vue.extend({
  template,
  props: {
    title: {
      type: String,
      default: undefined,
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
    padded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    _hasTitle: function () {
      return !_.isUndefined(this.title);
    },
  }
});

// Register component
Vue.component('su-card', SuCardComponent);

export default SuCardComponent;
