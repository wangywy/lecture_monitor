// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */
var QUERY = 'puppies';

var formGenerator = {
  /**
   * Flickr URL that will give us lots and lots of whatever we're looking for.
   *
   * See http://www.flickr.com/services/api/flickr.photos.search.html for
   * details about the construction of this URL.
   *
   * @type {string}
   * @private
   */
  searchOnBUCT_: 'http://graduate.buct.edu.cn:8080/pyxx/login.aspx',

  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'showLogin_' method.
   *
   * @public
   */
  requestLogin: function() {
    var req = new XMLHttpRequest();
    req.open("GET", this.searchOnBUCT_, true);
    // When the handler functions for these events are called, 
    // they receive as a parameter a ProgressEvent
    req.onload = this.showLogin_.bind(this);
    req.send(null);
  },

  /**
   * Handle the 'onload' event of our login XHR request, generated in
   * 'requestLogin', by generating 'div' and 'input' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  showLogin_: function (e) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(e.target.responseText, 'application/xml');
    var loginForm = doc.querySelector('form');
    document.body.appendChild(loginForm);
  },

  /**
   * Given a photo, construct a URL using the method outlined at
   * http://www.flickr.com/services/api/misc.urlKittenl
   *
   * @param {DOMElement} A kitten.
   * @return {string} The kitten's URL.
   * @private
   */
  constructKittenURL_: function (photo) {
    return "http://farm" + photo.getAttribute("farm") +
        ".static.flickr.com/" + photo.getAttribute("server") +
        "/" + photo.getAttribute("id") +
        "_" + photo.getAttribute("secret") +
        "_s.jpg";
  }
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  formGenerator.requestLogin();
});
