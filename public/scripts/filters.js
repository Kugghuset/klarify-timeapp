'use strict'

import Vue from 'vue';
import _ from 'lodash';
import moment from 'moment';
import marked from 'marked';

import telephone from './services/telephone';

/**
 * Date filer, similar to that of Angular's
 */
Vue.filter('date', (value, format) => {
  return moment(new Date(value)).isValid()
    ? moment(value).format(!!format ? format
    : 'YYYY-MM-DD HH:mm') : value;
});

Vue.filter('tel', {
  read: (val, shortcode) => {
    const _res = _.attempt(() => telephone.pretty(val, shortcode));
    return _.isError(_res)
      ? val
      : _res;
  },
  write: (val, shortcode) => {
    const _res = _.attempt(() => telephone.clean(val));

    return _.isError(_res)
      ? val
      : _res;
  }
});

Vue.filter('marked', marked);

export default {

}
