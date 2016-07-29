'use strict'

import Vue from 'vue';
import template from './su-content-container.template.html';

const SuContentContainerComponent = Vue.extend({
  template,
  props: {
    title: String
  }
});

// Register component
Vue.component('su-content-container', SuContentContainerComponent);

export default SuContentContainerComponent;
