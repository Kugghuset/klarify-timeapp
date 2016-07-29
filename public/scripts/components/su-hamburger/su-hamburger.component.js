'use strict'

import Vue from 'vue';
import template from './su-hamburger.template.html';

import { acceptClass } from './../../mixins';

const SuHamburgerComponent = Vue.extend({
  template,
  mixins: [acceptClass],
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    clicked: {
      type: Function,
      default: function () { return void 0; },
    },
    params: {
      type: Array,
      default: function () { return []; },
    },
  },
  computed: {
    _class: function () {
      return _.filter([
        this.class,
        this.isOpen ? 'is-open' : '',
      ]).join(' ');
    },
  },
  methods: {
    toggleIsOpen: function () {
      this.isOpen = !this.isOpen;
      this.clicked(...this.params);
    },
  },
});

// Register component
Vue.component('su-hamburger', SuHamburgerComponent);

export default SuHamburgerComponent;
