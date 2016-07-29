'use strict'

import Vue from 'vue';
import template from './su-modal.template.html';

import Promise from 'bluebird';

import eventer from './../../services/eventer';

function noop() {
  return void 0;
}

const SuModalComponent = Vue.extend({
  template,
  data: function () {
    return {
      isOpen: false,
      modalOpen: false,
    };
  },
  props: {
    title: {
      type: String,
      default: undefined,
    },
    closed: {
      type: Function,
      default: noop,
    },
    clickedOutside: {
      type: Function,
      default: noop,
    },
    params: {
      type: Array,
      default: function () { return []; },
    },
  },
  methods: {
    waitSet: function (index, value, wait) {
      setTimeout(function () { this.$set(index, value); }.bind(this), wait);
    },
    open: function () {
      eventer.trigger('su-modal-open', this.$el);

      this.$set('modalOpen', true);

      this.waitSet('isOpen', true, 150);
    },
    close: function () {
      eventer.trigger('su-modal-close', this.$el);

      this.closed(...this.params);

      this.isOpen = false;
      this.waitSet('modalOpen', false, 250);
    },
    cancel: function () {
      eventer.trigger('su-modal-close', this.$el);

      if (this.clickedOutside === noop) {
        this.closed(...this.params);
      } else {
        this.clickedOutside(...this.params);
      }

      this.isOpen = false;
      this.waitSet('modalOpen', false, 250);
    },
  },
});

// Register component
Vue.component('su-modal', SuModalComponent);

export default SuModalComponent;
