'use strict'

import Vue from 'vue';
import template from './su-sidebar.template.html';

import auth from './../../services/auth';

/**
 * Example of how routes should input.
 *
 * @property {String} title The title of route
 * @property {String} name The name, as used by VueRouter
 * @property {String} url The url like part, as used by VueRouter
 */
const exampleRouteObject = {
  title: 'Home',
  name: 'home',
  url: '/',
};

const SuSidebarComponent = Vue.extend({
  template,
  props: {
    routes: {
      type: Array,
      default: function () { return []; },
    },
    menuOpen: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    logout: function () {
      auth.logout();
    },
  },
});

// Register component
Vue.component('su-sidebar', SuSidebarComponent);

export default SuSidebarComponent;
