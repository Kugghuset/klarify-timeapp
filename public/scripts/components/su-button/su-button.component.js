'use strict'

import Vue from 'vue';
import template from './su-button.template.html';

import { acceptClass } from './../../mixins';

const SuButtonComponent = Vue.extend({
  template,
  mixins: [acceptClass],
  props: {
    text: {
      type: String,
      default: '',
    },
    _id: {
      type: String,
      default: '',
    },
    add: {
      type: Boolean,
      default: false,
    },
    addSize: {
      type: String,
      default: 'normal',
    },
    clicked: {
      type: Function,
      default: function () { return void 0; },
    },
    params: {
      type: Array,
      default: function () { return []; },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
    colored: {
      type: Boolean,
      default: false,
    },
    bigText: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    click: function () {
      if (!this.disabled || !this.isLoading) {

        this.clicked(...this.params);
      }
    },
  },
  computed: {
    styles: function () {
      const _style = {
        'colored': this.colored,
        'loading': this.isLoading,
        'big-text': this.bigText,
        'add-icon': this.add,
        };

      _.set(_style, this.class, true);
      if (!!this.addSize) { _.set(_style, `add-${this.addSize}`, true); }
      if (!!this.color) { _.set(_style, this.color, true); }

      return _style;
    },
  },
});

// Register component
Vue.component('su-button', SuButtonComponent);

export default SuButtonComponent;
