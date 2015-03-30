/*
 * grunt-contrib-qunit
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

/*global QUnit:true, alert:true*/
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['qunit'], factory);
  } else {
    factory(QUnit)();
  }
}(this, function(QUnit) {
  'use strict';

  return function() {
    // Don't re-order tests.
    QUnit.config.reorder = false;
    // Run tests serially, not in parallel.
    QUnit.config.autorun = false;

    // Send messages to the parent PhantomJS process via alert! Good times!!
    function sendMessage() {
      var args = [].slice.call(arguments);
      alert(JSON.stringify(args));
    }

    // These methods connect QUnit to PhantomJS.
    QUnit.log(function(obj) {
      // What is this I don’t even
      if (obj.message === '[object Object], undefined:undefined') { return; }

      // Parse some stuff before sending it.
      var actual, expected;
      if (!obj.result) {
        // Dumping large objects can be very slow, and the dump isn't used for
        // passing tests, so only dump if the test failed.
        actual = QUnit.jsDump.parse(obj.actual);
        expected = QUnit.jsDump.parse(obj.expected);
      }
      // Send it.
      sendMessage('qunit.log', obj.result, actual, expected, obj.message, obj.source);
    });

    QUnit.testStart(function(obj) {
      sendMessage('qunit.testStart', obj.name);
    });

    QUnit.testDone(function(obj) {
      sendMessage('qunit.testDone', obj.name, obj.failed, obj.passed, obj.total, obj.duration);
    });

    QUnit.moduleStart(function(obj) {
      sendMessage('qunit.moduleStart', obj.name);
    });

    QUnit.moduleDone(function(obj) {
      sendMessage('qunit.moduleDone', obj.name, obj.failed, obj.passed, obj.total);
    });

    QUnit.begin(function() {
      sendMessage('qunit.begin');
    });

    QUnit.done(function(obj) {
      sendMessage('qunit.done', obj.failed, obj.passed, obj.total, obj.runtime);
    });
  };
}));
