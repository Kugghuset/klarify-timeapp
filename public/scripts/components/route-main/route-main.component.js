'use strict'

import Vue from 'vue';
import template from './route-main.template.html';

const RouteMainComponent = Vue.extend({
  template,
  data: function () {
    return {
      actualRoutes: [
        { title: 'Trigger refresh', name: 'triggerRefresh', url: '/trigger-refresh' },
        { title: 'Set rules', name: 'setRules', url: '/set-rules' },
      ],
      menuOpen: false,
    };
  },
  props: {
    title: String
  }
});

// Register component
Vue.component('route-main', RouteMainComponent);

export default RouteMainComponent;
