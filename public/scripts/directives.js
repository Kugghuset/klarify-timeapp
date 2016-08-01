'use strict'

import Vue from 'vue';
import $ from 'jquery';

import utils from './services/utils';
import Eventer from './services/eventer';

export const rubberScroll = Vue.directive('rubber-scroll', {
  bind: function () {
    // Return early if not iDevice
    if (!utils.isIDevice()) {
      return;
    }

    // Get the element
    const _element = this.el;

    if (!_element) {
      return;
    }

    $(_element).addClass('rubber-scroll');

    Eventer.on('su-modal-open', function ($el) {
      if (_element !== $el) {
        $(_element).removeClass('rubber-scroll');
      }
    }, this);

    Eventer.on('su-modal-close', function ($el) {
      if (!$(_element).hasClass('rubber-scroll')) {
        $(_element).addClass('rubber-scroll');
      }
    }, this);
  },
  unbind: function () {
    Eventer.off('su-modal-open', undefined, this);
    Eventer.off('su-modal-close', undefined, this);
  },
});

export const noScrollOn = Vue.directive('no-scroll-on', {
  bind: function (eventName) {
    this.eventNames = [];
  },
  /**
   * @param {String[]} params
   */
  update: function (params) {
      // Get a reference to the actual element
      const _element = this.el;

      // Return early if there is no element
      if (!_element) {
        return;
      }

    _.forEach(params, function (eventName, index) {
      if (this.eventNames[index] === eventName) {
        return;
      }

      // If there is one already, unsubscribe from it
      if (this.eventNames[index]) {
        Eventer.off(this.eventNames[index], undefined, this);
      }

      // Set the current eventName
      this.eventNames[index] = eventName;

      // Subscribe to the events
      if (this.eventNames[index] && index === 0) {
        // If it's the 0th event, add the class when called
        Eventer.on(this.eventNames[index], function () {
          $(_element).addClass('no-scroll');
        }, this);
      } else if (this.eventNames[index] && index === 1) {
        // If it's the 1st event, remove the class when called
        Eventer.on(this.eventNames[index], function () {
          $(_element).removeClass('no-scroll');
        }, this);
      }
    }.bind(this));


  },
  unbind: function () {
    _.forEach(this.eventNames, function (eventName) {
      Eventer.off(eventName, undefined, this)
    }.bind(this));
  },
});

export const topAtScrollPos = Vue.directive('top-at-scroll-pos', {
  bind: function () {

  },
  update: function (_selector = 'body') {
    const _scrollParent = document.querySelector(_selector);

    if (!_.isElement(this.el) || !_scrollParent) {
      return;
    }

    if (document.body.clientWidth <= 535) {
      this.el.style.top = `${_scrollParent.scrollTop}px`;
    }
  },
});

export default {
  rubberScroll: rubberScroll,
  noScrollOn: noScrollOn,
  topAtScrollPos: topAtScrollPos,
}
