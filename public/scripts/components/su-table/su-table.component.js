'use strict'

import Vue from 'vue';
import template from './su-table.template.html';

import _ from 'lodash';

/**
 * Example of fields.
 *
 * @type {String[]}
 */
const exampleFields = [
  'Field 1',
  'Field 2',
];

/**
 * Example of rows.
 *
 * @type {{}[]}
 */
const exampleRows = [
  { 'Field 1': 'value', 'Field 2': 'value 2', },
  { 'Field 1': 'value3', 'Field 2': 'value 4', },
];

const SuTableComponent = Vue.extend({
  template,
  props: {
    rows: {
      type: Array,
      default: function () { return []; },
    },
    fields: {
      type: Array,
      default: function () { return [] },
    },
  },
  computed: {
    _tableRows: function () {
      return _.map(this.rows, function (row) {
        return `<tr>${_.map(this.fields, field => `<td>${row[field]}</td>`).join('')}</tr>`;
      }.bind(this)).join('');
    },
  },
});

Vue.component('su-table', SuTableComponent);

export default SuTableComponent;
