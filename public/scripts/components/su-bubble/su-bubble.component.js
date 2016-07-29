'use strict'

import Vue from 'vue';
import template from './su-bubble.template.html';

const SuBubbleComponent = Vue.extend({
  template,
  props: {
    text: {
      type: String,
      default: '',
    },
    centerText: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
});

// Register component
Vue.component('su-bubble', SuBubbleComponent);

export default SuBubbleComponent;
