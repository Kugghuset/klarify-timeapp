'use strict'

import Vue from 'vue';
import template from './route-main.template.html';

const RouteMainComponent = Vue.extend({
  template,
  props: {
    title: String
  }
});

// Register component
Vue.component('route-main', RouteMainComponent);

export default RouteMainComponent;
