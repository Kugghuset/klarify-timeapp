'use strict'

// import styles
import 'normalize.css/normalize.css';
import 'dropzone/dist/min/dropzone.min.css';
import 'selectize/dist/css/selectize.css'
import '../style/main.scss';

// Ensure jQuery is attached to the window.
window.jQuery = window.$ = require('jquery');

import Vue from 'vue';
import Dropzone from 'dropzone';

Dropzone.autoDiscover = false;

import './filters';
import './directives';
import routes from './routes';
