'use strict'

import Vue from 'vue';
import template from './su-select.template.html';

import $ from 'jquery';
import selectize from 'selectize';

import auth from './../../services/auth';

const SuSelectComponent = Vue.extend({
  template,
  data: function () {
    return {
      selectize: undefined,
      suSelectId: `select-${auth.guid()}`,
      initInterval: tryInit.apply(this),
    };
  },
  props: {
    placeholder: {
      type: String,
      default: 'No selection',
    },
    value: {
      type: null,
      default: undefined,
      twoWay: true,
    },
    options: {
      type: Array,
      default: function () { []; },
    },
  },
  methods: {
    setValue: function (value) {
      // Set the value
      this.value = value;

      // If selectizeValue doesn't match value, update it as well
      if (this.selectizeValue !== value) {
        this.selectizeValue = value;
      }
    },
    refreshOptions: function () {
      // Get the current value for use when setting the
      const _value = this.value;

      // First clear the options
      this.selectize.clearOptions();
      // Then re-add all options (lazy way of fixing the diff)
      this.selectize.addOption(this.options);
      // Refresh the dropdown if it's open
      this.selectize.refreshOptions(false);
      // Set the value of selectize again, as it'll be bound to nothing otherwise
      this.selectizeValue = _value;
    },
    init: function () {
      /**
       * Set the selectize property on *this*
       * with the object at 0th place after
       * instantiating Selectize on the select.
       */
      this.selectize = $(this.$el)
        .selectize({
          labelField: 'name',
          valueField: 'value',
          onChange: this.setValue,
          searchField: ['name', 'value'],
          selectOnTab: true,
          allowEmptyOption: true,
        })[0]
        .selectize;

      // Refresh the options and set the initial value
      this.refreshOptions();

      // Set up watchers for changes in this.options and this.value
      this.$watch('options', this.refreshOptions);
      this.$watch('value', this.setValue);
    },
  },
  computed: {
    selectizeValue: {
      get: function () {
        // Return the first item from selectize
        return _.get(this, 'selectize.items[0]');
      },
      set: function (value) {
        // Set the value of selectize
        this.selectize.setValue(value);
      },
    },
  },
  beforeDestroy: function () {
    // Clear the init interval if it's destroyed before finished.
    if (this.initInterval) {
      clearInterval(this.initInterval)
    }
  },
});

/**
 * Every 10 milliseconds tries to init the object.
 * This is used instead of the *ready* hook
 * as it won't get called inside a v-if.
 */
function tryInit() {
  return setInterval(function () {
    const el = document.getElementById(this.suSelectId);

    // The element isn't in the document yet, return early.
    if (!el) { return; }

    clearInterval(this.initInterval);
    this.init();
  }.bind(this), 10)
}

// Register component
Vue.component('su-select', SuSelectComponent);

export default SuSelectComponent;
