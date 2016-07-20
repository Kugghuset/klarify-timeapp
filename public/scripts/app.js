'use strict'

// Import styles
import 'normalize.css/normalize.css';
import 'milligram';
import '../style/main.scss';

// Ensure jQuery is attached to the window.
window.jQuery = window.$ = require('jquery');

import Vue from 'vue';
import components from './components/components';

/**
 * Instantiate the Vue app.
 */
const app = new Vue({
  el: '#app-mount',
  components: components,
});

$(window).ready(() => {
  // Do something
}, $);
