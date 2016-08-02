'use strict'

import Vue from 'vue';
import template from './su-loader.template.html';

const SuLoaderComponent = Vue.extend({
  template,
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    }
  }
});

// Register component
Vue.component('su-loader', SuLoaderComponent);

export default SuLoaderComponent;
