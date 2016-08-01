'use strict'

import Vue from 'vue';
import template from './su-datepicker.template.html';
import rome from 'rome';

import auth from './../../services/auth';
import moment from 'moment';

const SuDatepickerComponent = Vue.extend({
  template,
  data: function () {
    return {
      romeInstance: undefined,
      romeId: `rome-${auth.guid()}`,
    };
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: undefined,
    },
    maxDate: {
      type: Date,
      default: undefined,
    },
    minDate: {
      type: Date,
      default: undefined,
    },
  },
  methods: {
    dateValidator: function (date) {
      // Get the min- and maxDate
      const { minDate, maxDate } = this;

      // If there is no min- nor maxDate, return true
      if (!_.some([minDate, maxDate])) {
        return true;
      }

      const _date = moment(date);

      if (!minDate) {
        // No minDate, only check if it's before
        return _date.isSameOrBefore(maxDate);
      } else if (!maxDate) {
        // No maxDate, only check if it's after
        return _date.isSameOrAfter(minDate);
      } else {
        // Check if it's between
        return _date.isBetween(minDate, maxDate);
      }
    },
  },
  computed: {
    _date: {
      get: function () {
        return !!this.date
          ? moment(this.date).format('YYYY-MM-DD')
          : undefined;
      },
      set: function (val) {
        const _date = !!val && moment(new Date(val)).isValid()
          ? new Date(val)
          : undefined;

        if (!moment(this.date).isSame(_date, 'day')) {
          this.date = _date;
        }
      },
    },
  },
  ready: function () {
    this.romeInstance = rome(document.getElementById(this.romeId), {
      weekStart: 1,
      weekdayFormat: 'short',
      time: false,
      initialValue: this._date,
      inputFormat: 'YYYY-MM-DD',
      dateValidator: this.dateValidator,
    });

    /**
     * Set this._date (which will parse the string to an actual date).
     *
     * Will be called every time the user clicks a date.
     */
    this.romeInstance.on('data', function () {
      this._date = this.romeInstance.getDate();
    }.bind(this));
  },
});

// Register component
Vue.component('su-datepicker', SuDatepickerComponent);

export default SuDatepickerComponent;
