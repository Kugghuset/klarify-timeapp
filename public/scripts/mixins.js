'use strict'

/**
 * Mixin to allow components to have class passed down onto them.
 */
export const acceptClass = {
  props: {
    class: {
      type: String,
      default: '',
    },
  },
};

export default {
  acceptClass: acceptClass,
}
