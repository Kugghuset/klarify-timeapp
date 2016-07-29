'use strict'

import Vue from 'vue';
import template from './su-file-drop.template.html';

import Dropzone from 'dropzone';

import { acceptClass } from './../../mixins';
import auth from '../../services/auth';
import utils from '../../services/utils';

const SuFileDropComponent = Vue.extend({
  template,
  mixins: [acceptClass],
  data: function () {
    return {
      dropzone: null,
      pendingFiles: [],
      isLoading: false,
      dropId: `drop-id-${auth.guid()}`,
    }
  },
  props: {
    onUploaded: {
      type: Function,
      default: function () { return void 0; },
    },
  },
  ready: function () {
    // When the elemenet is loaded, apply the dropzone part.
    const _options = {
      url: '/services/upload',
      headers: auth.getHeaders(),
      clickable: `#${this.dropId} *, #${this.dropId}`,
      acceptedFiles: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      autoProcessQueue: false,
      addedfile: onAddedFile.bind(this),
      removedfile: removedFile.bind(this),
    };

    const _el = document.getElementById(this.dropId);

    this.dropzone = new Dropzone(_el, _options);

    // Listen for the success event
    this.dropzone.on('complete', onUploadedComplete.bind(this));
  },
  methods: {
    remove: function (file) {
      this.dropzone.removeFile(file);
    },
    upload: function () {
      // Upload the files
      this.dropzone.processQueue();
      this.isLoading = true;
    },
  },
});

/**
 * Handles uploaded files
 *
 * @param {File} file The file uploaded
 */
function onUploadedComplete(file) {
  this.isLoading = false;
  let _response = {
    body: utils.jsonParseOrValue(file.xhr.response),
    statusCode: file.xhr.status,
    status: file.xhr.statusText,
  }
  this.onUploaded(_response.body);
  this.dropzone.removeAllFiles();
}

function onAddedFile(file) {
  this.pendingFiles = this.pendingFiles.concat([file]);
}

function removedFile(file) {
  this.pendingFiles = _.filter(this.pendingFiles, f => f !== file);
}

// Register component
Vue.component('su-file-drop', SuFileDropComponent);

export default SuFileDropComponent;
