'use strict'

import Vue from 'vue';
import VueRouter from 'vue-router';

import components from './components/components';
import { contains } from './services/utils';

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
        component: components.routeSetRules,
      },
      '/trigger-refresh': {
        name: 'triggerRefresh',
        component: components.routeTriggerRefresh,
      },
    },
  },
});

router.redirect({
  '*': '/trigger-refresh'
});


// Ensure routes which require auth is only accessible when authenticated
router.beforeEach((transition) => {
  if (contains(['setRules', 'triggerRefresh'], transition.to.name)) {
    transition.next();
  } else {
    transition.redirect('triggerRefresh');
  }
});


router.start(App, '#app-mount');

export default router;
