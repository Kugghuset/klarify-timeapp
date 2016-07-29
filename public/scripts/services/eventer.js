'use strict'

import _ from 'lodash';

class Eventer {
  constructor () {
    this.__events = {};
  }

  /**
   * @param {String} eventName Name of the event to listen for
   * @param {Function} listener The function to be called. Defaults to _.noop
   * @param {Object} _this Other identification to use for when the listener could be anonymous
   * @return {{ listener: Function, _this: Object }}
   */
  on(eventName, listener = _.noop, _this) {
    if (!_.isFunction(listener)) {
      listener = _.noop;
    }

    const eventItem = { listener, _this };

    if (_.isArray(this.__events[eventName])) {
      this.__events[eventName].push(eventItem);
    } else {
      this.__events[eventName] = [ eventItem ];
    }

    return eventItem;
  }

  /**
   * @param {String} eventName Name of the event to stop listening for
   * @param {Function} _listener The function to be called.
   * @param {Object} __this Other identification to use for when the listener could be anonymous
   */
  off(eventName, _listener, __this) {
    // Filter out the eventItem where either the listener or this matches *_listener* or *__this*
    this.__events[eventName] = _.filter(this.__events[eventName], ({listener, _this}) => {
      return !_.some([listener === _listener, _this === __this])
    });
  }

  /**
   * @param {String} eventName Name of the event to trigger
   * @param {Any} params Splat array of all params other than *eventName*, will be used when calling listeners
   */
  trigger(eventName, ...params) {
    // Call all listeners on *eventName*
    _.forEach(this.__events[eventName], ({ listener }) => listener(...params));
  }
}

/**
 * Shorthand for tiny events module.
 * @type {{ on: Function, off: Function, trigger: Function }}
 */
export const eventer = new Eventer();

export default eventer;
