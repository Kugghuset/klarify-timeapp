'use strict'

import Vue from 'vue';
import template from './su-prompt.template.html';

import _ from 'lodash';
import Promise from 'bluebird';

const SuPromptComponent = Vue.extend({
  template,
  data: function () {
    return {
      /** Per default a noop function. */
      resolveResult: _.noop,
    };
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    onOk: {
      type: Function,
      default: undefined,
    },
    onCancel: {
      type: Function,
      default: undefined,
    },
    params: {
      type: Array,
      default: function () { return []; },
    },
  },
  computed: {

  },
  methods: {
    prompt: function (message, title) {
      return new Promise(function (resolve, reject) {
        // Set the current message and title
        this.$set('message', message);
        this.$set('title', title);

        this.$set('resolveResult', function (params) {
          resolve(params);
        }.bind(this));

        // Open the modal
        this.$refs.suModal.open();
      }.bind(this));
    },
    _onCancel: function () {
      if (!_.isUndefined(this.onCancel)) {
        this.onCancel(...this.params);
      }

      this.$refs.suModal.close();
      this.resolveResult(false);
    },
    _onOk: function () {
      if (!_.isUndefined(this.onOk)) {
        this.onOk(...this.params);
      }

      this.$refs.suModal.close();
      this.resolveResult(true);
    },
  },
});

// Register component
Vue.component('su-prompt', SuPromptComponent);

export default SuPromptComponent;
