'use strict'

import Vue from 'vue';
import VueRouter from 'vue-router';

import components from './components/components';

Vue.use(VueRouter);

/**
 * Vue router uses an (not necessarily) empty component as base
 * instead of a new Vue instance.
 */
const App = Vue.extend({});

/**
 * Router instance.
 */
const router = new VueRouter({
  hashbang: false,
});

router.map({
  '/': {
    name: 'main',
    component: components.routeMain,
    subRoutes: {
      '/set-rules': {
        name: 'setRules',
        component:  components.routeSetRules,
      },
    }
  },
});

router.redirect({
  '*': '/set-rules'
});

router.start(App, '#app-mount');

export default router;
