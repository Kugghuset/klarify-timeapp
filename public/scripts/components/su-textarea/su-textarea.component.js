'use strict'

import Vue from 'vue';
import template from './su-textarea.template.html';

import auth from './../../services/auth';
import autosize from 'autosize';

const SuTextareaComponent = Vue.extend({
  template,
  data: function () {
    return {
      textareaId: `textarea-${auth.guid()}`,
    };
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    autoSize: {
      type: Boolean,
      default: true,
    }
  },
  created: function () {
    if (this.autoSize) {
      /**
       * Seems to work but feels super wonky.
       *
       * For some reason the *ready* hook is never called, so I cannot use it.
       */
      setTimeout(function () {
        const _textarea = document.querySelector(`#${this.textareaId}`);
        autosize(_textarea);
        autosize.update(_textarea);
      }.bind(this), 50);
    }
  },
});

// Register component
Vue.component('su-textarea', SuTextareaComponent);

export default SuTextareaComponent;
