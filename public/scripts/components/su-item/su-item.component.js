'use strict'

import Vue from 'vue';
import template from './su-item.template.html';

import _ from 'lodash';

function noop() { return void 0; }

const SuItemComponent = Vue.extend({
  template,
  props: {
    headerTitle: {
      type: String,
      default: '',
    },
    headerValue: {
      type: String,
      default: '',
    },
    removed: {
      type: Function,
      default: noop,
    },
    clicked: {
      type: Function,
      default: noop,
    },
    params: {
      type: Array,
      default: function () { return []; },
    },
    numbered: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    _remove: function () {
      return !_.isUndefined(this.removed)
        ? this.removed
        : function () { return void 0; };
    },
    _clicked: function () {
      return !_.isUndefined(this.clicked)
        ? this.clicked
        : function () { return void 0; };
    },
    _canRemove: function () {
      return this.removed !== noop;
    },
    _clickable: function () {
      return this.clicked !== noop;
    },
  },
  methods: {
    remove: function () {
      this._remove(...this.params);
    },
    click: function () {
      this._clicked(...this.params);
    },
  },
});

// Register component
Vue.component('su-item', SuItemComponent);

export default SuItemComponent;
