// Copyright (c) 2013 The Polymer Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//    * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//    * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
(function(scope) {
  scope = scope || {};
  var target = {
    shadow: function(inEl) {
      if (inEl) {
        return inEl.shadowRoot || inEl.webkitShadowRoot;
      }
    },
    canTarget: function(scope) {
      return scope && Boolean(scope.elementFromPoint);
    },
    targetingShadow: function(inEl) {
      var s = this.shadow(inEl);
      if (this.canTarget(s)) {
        return s;
      }
    },
    searchRoot: function(inRoot, x, y) {
      if (inRoot) {
        var t = inRoot.elementFromPoint(x, y);
        var st, sr, os;
        // is element a shadow host?
        sr = this.targetingShadow(t);
        while (sr) {
          // find the the element inside the shadow root
          st = sr.elementFromPoint(x, y);
          if (!st) {
            // check for older shadows
            os = sr.querySelector('shadow');
            // check the older shadow if available
            sr = os && os.olderShadowRoot;
          } else {
            // shadowed element may contain a shadow root
            var ssr = this.targetingShadow(st);
            return this.searchRoot(ssr, x, y) || st;
          }
        }
        // light dom element is the target
        return t;
      }
    },
    findTarget: function(inEvent) {
      var x = inEvent.clientX, y = inEvent.clientY;
      return this.searchRoot(document, x, y);
    }
  };
  scope.targetFinding = target;
  scope.findTarget = target.findTarget.bind(target);

  window.PointerEventsPolyfill = scope;
})(window.PointerEventsPolyfill);

(function() {
  function selector(v) {
    return '[touch-action="' + v + '"]';
  }
  function rule(v) {
    return '{ -ms-touch-action: ' + v + '; touch-action: ' + v + '; }';
  }
  var attrib2css = [
    'none',
    'pan-x',
    'pan-y',
    {
      rule: 'pan-x pan-y',
      selectors: [
        'scroll',
        'pan-x pan-y',
        'pan-y pan-x'
      ]
    }
  ];
  var styles = '';
  attrib2css.forEach(function(r) {
    if (String(r) === r) {
      styles += selector(r) + rule(r);
    } else {
      styles += r.selectors.map(selector) + rule(r.rule);
    }
  });
  var el = document.createElement('style');
  el.textContent = styles;
  // Use querySelector instead of document.head to ensure that in
  // ShadowDOM Polyfill that we have a wrapped head to append to.
  var h = document.querySelector('head');
  // document.write + document.head.appendChild = crazytown
  // use insertBefore instead for correctness in ShadowDOM Polyfill
  h.insertBefore(el, h.firstChild);
})();

/**
 * This is the constructor for new PointerEvents.
 *
 * New Pointer Events must be given a type, and an optional dictionary of
 * initialization properties.
 *
 * Due to certain platform requirements, events returned from the constructor
 * identify as MouseEvents.
 *
 * @constructor
 * @param {String} inType The type of the event to create.
 * @param {Object} [inDict] An optional dictionary of initial event properties.
 * @return {Event} A new PointerEvent of type `inType` and initialized with properties from `inDict`.
 */
(function(scope) {
  // test for DOM Level 4 Events
  var NEW_MOUSE_EVENT = false;
  var HAS_BUTTONS = false;
  try {
    var ev = new MouseEvent('click', {buttons: 1});
    NEW_MOUSE_EVENT = true;
    HAS_BUTTONS = ev.buttons === 1;
  } catch(e) {
  }

  function PointerEvent(inType, inDict) {
    var inDict = inDict || {};
    // According to the w3c spec,
    // http://www.w3.org/TR/DOM-Level-3-Events/#events-MouseEvent-button
    // MouseEvent.button == 0 can mean either no mouse button depressed, or the
    // left mouse button depressed.
    //
    // As of now, the only way to distinguish between the two states of
    // MouseEvent.button is by using the deprecated MouseEvent.which property, as
    // this maps mouse buttons to positive integers > 0, and uses 0 to mean that
    // no mouse button is held.
    //
    // MouseEvent.which is derived from MouseEvent.button at MouseEvent creation,
    // but initMouseEvent does not expose an argument with which to set
    // MouseEvent.which. Calling initMouseEvent with a buttonArg of 0 will set
    // MouseEvent.button == 0 and MouseEvent.which == 1, breaking the expectations
    // of app developers.
    //
    // The only way to propagate the correct state of MouseEvent.which and
    // MouseEvent.button to a new MouseEvent.button == 0 and MouseEvent.which == 0
    // is to call initMouseEvent with a buttonArg value of -1.
    //
    // This is fixed with DOM Level 4's use of buttons
    var buttons = inDict.buttons;
    if (buttons === undefined) {
      switch (inDict.which) {
        case 1: buttons = 1; break;
        case 2: buttons = 4; break;
        case 3: buttons = 2; break;
        default: buttons = 0;
      }
    }

    var e;
    if (NEW_MOUSE_EVENT) {
      e = new MouseEvent(inType, inDict);
    } else {
      e = document.createEvent('MouseEvent');
      // import values from the given dictionary
      var props = {
        bubbles: false,
        cancelable: false,
        view: null,
        detail: null,
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: null
      };

      Object.keys(props).forEach(function(k) {
        if (k in inDict) {
          props[k] = inDict[k];
        }
      });

      // define the properties inherited from MouseEvent
      e.initMouseEvent(
        inType, props.bubbles, props.cancelable, props.view, props.detail,
        props.screenX, props.screenY, props.clientX, props.clientY, props.ctrlKey,
        props.altKey, props.shiftKey, props.metaKey, props.button, props.relatedTarget
      );
    }

    // define the buttons property according to DOM Level 3 spec
    if (!HAS_BUTTONS) {
      // IE 10 has buttons on MouseEvent.prototype as a getter w/o any setting
      // mechanism
      Object.defineProperty(e, 'buttons', {get: function(){ return buttons }, enumerable: true});
    }

    // Spec requires that pointers without pressure specified use 0.5 for down
    // state and 0 for up state.
    var pressure = 0;
    if (inDict.pressure) {
      pressure = inDict.pressure;
    } else {
      pressure = buttons ? 0.5 : 0;
    }

    // define the properties of the PointerEvent interface
    Object.defineProperties(e, {
      pointerId: { value: inDict.pointerId || 0, enumerable: true },
      width: { value: inDict.width || 0, enumerable: true },
      height: { value: inDict.height || 0, enumerable: true },
      pressure: { value: pressure, enumerable: true },
      tiltX: { value: inDict.tiltX || 0, enumerable: true },
      tiltY: { value: inDict.tiltY || 0, enumerable: true },
      pointerType: { value: inDict.pointerType || '', enumerable: true },
      hwTimestamp: { value: inDict.hwTimestamp || 0, enumerable: true },
      isPrimary: { value: inDict.isPrimary || false, enumerable: true }
    });
    return e;
  }

  // attach to window
  scope.PointerEvent = PointerEvent;
})(window);

/**
 * This module implements an ordered list of pointer states
 * Each pointer object here has two properties:
 *  - id: the id of the pointer
 *  - event: the source event of the pointer, complete with positions
 *
 * The ordering of the pointers is from oldest pointer to youngest pointer,
 * which allows for multi-pointer gestures to not rely on the actual ids
 * imported from the source events.
 *
 * Any operation that needs to store state information about pointers can hang
 * objects off of the pointer in the pointermap. This information will be
 * preserved until the pointer is removed from the pointermap.
 */
(function(scope) {
  function PointerMap() {
    this.ids = [];
    this.pointers = [];
  };

  PointerMap.prototype = {
    set: function(inId, inEvent) {
      var i = this.ids.indexOf(inId);
      if (i > -1) {
        this.pointers[i] = inEvent;
      } else {
        this.ids.push(inId);
        this.pointers.push(inEvent);
      }
    },
    has: function(inId) {
      return this.ids.indexOf(inId) > -1;
    },
    'delete': function(inId) {
      var i = this.ids.indexOf(inId);
      if (i > -1) {
        this.ids.splice(i, 1);
        this.pointers.splice(i, 1);
      }
    },
    get: function(inId) {
      var i = this.ids.indexOf(inId);
      return this.pointers[i];
    },
    get size() {
      return this.pointers.length;
    },
    clear: function() {
      this.ids.length = 0;
      this.pointers.length = 0;
    }
  };

  scope.PointerMap = PointerMap;
})(window.PointerEventsPolyfill);

// SideTable is a weak map where possible. If WeakMap is not available the
// association is stored as an expando property.
(function(scope) {
  var SideTable;
  // TODO(dfreedman): WeakMap does not allow for Events to be keys in Firefox
  if (typeof WeakMap !== 'undefined' && navigator.userAgent.indexOf('Firefox/') < 0) {
    SideTable = WeakMap;
  } else {
    var defineProperty = Object.defineProperty;
    var hasOwnProperty = Object.hasOwnProperty;
    var counter = new Date().getTime() % 1e9;

    SideTable = function() {
      this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
    };

    SideTable.prototype = {
      set: function(key, value) {
        defineProperty(key, this.name, {value: value, writable: true});
      },
      get: function(key) {
        return hasOwnProperty.call(key, this.name) ? key[this.name] : undefined;
      },
      delete: function(key) {
        this.set(key, undefined);
      }
    };
  }
  scope.SideTable = SideTable;
})(window.PointerEventsPolyfill);

(function(scope) {

  /**
   * This module is for normalizing events. Mouse and Touch events will be
   * collected here, and fire PointerEvents that have the same semantics, no
   * matter the source.
   * Events fired:
   *   - pointerdown: a pointing is added
   *   - pointerup: a pointer is removed
   *   - pointermove: a pointer is moved
   *   - pointerover: a pointer crosses into an element
   *   - pointerout: a pointer leaves an element
   *   - pointercancel: a pointer will no longer generate events
   */
  var dispatcher = {
    targets: new scope.SideTable,
    handledEvents: new scope.SideTable,
    scrollType: new scope.SideTable,
    pointermap: new scope.PointerMap,
    events: [],
    eventMap: {},
    // Scope objects for native events.
    // This exists for ease of testing.
    eventSources: {},
    /**
     * Add a new event source that will generate pointer events.
     *
     * `inSource` must contain an array of event names named `events`, and
     * functions with the names specified in the `events` array.
     * @param {string} inName A name for the event source
     * @param {Object} inSource A new source of platform events.
     */
    registerSource: function(inName, inSource) {
      var s = inSource;
      var newEvents = s.events;
      if (newEvents) {
        this.events = this.events.concat(newEvents);
        newEvents.forEach(function(e) {
          if (s[e]) {
            this.eventMap[e] = s[e].bind(s);
          }
        }, this);
        this.eventSources[inName] = s;
      }
    },
    // add event listeners for inTarget
    registerTarget: function(inTarget, inAxis) {
      this.scrollType.set(inTarget, inAxis || 'none');
      this.listen(this.events, inTarget, this.boundHandler);
    },
    // remove event listeners for inTarget
    unregisterTarget: function(inTarget) {
      this.scrollType.set(inTarget, null);
      this.unlisten(this.events, inTarget, this.boundHandler);
    },
    // EVENTS
    down: function(inEvent) {
      this.fireEvent('pointerdown', inEvent)
    },
    move: function(inEvent) {
      this.fireEvent('pointermove', inEvent);
    },
    up: function(inEvent) {
      this.fireEvent('pointerup', inEvent);
    },
    enter: function(inEvent) {
      inEvent.bubbles = false;
      this.fireEvent('pointerenter', inEvent)
    },
    leave: function(inEvent) {
      inEvent.bubbles = false;
      this.fireEvent('pointerleave', inEvent);
    },
    over: function(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointerover', inEvent)
    },
    out: function(inEvent) {
      inEvent.bubbles = true;
      this.fireEvent('pointerout', inEvent);
    },
    cancel: function(inEvent) {
      this.fireEvent('pointercancel', inEvent);
    },
    leaveOut: function(event) {
      if (!event.target.contains(event.relatedTarget)) {
        this.leave(event);
      }
      this.out(event);
    },
    enterOver: function(event) {
      if (!event.target.contains(event.relatedTarget)) {
        this.enter(event);
      }
      this.over(event);
    },
    // LISTENER LOGIC
    eventHandler: function(inEvent) {
      // This is used to prevent multiple dispatch of pointerevents from
      // platform events. This can happen when two elements in different scopes
      // are set up to create pointer events, which is relevant to Shadow DOM.
      if (this.handledEvents.get(inEvent)) {
        return;
      }
      var type = inEvent.type;
      var fn = this.eventMap && this.eventMap[type];
      if (fn) {
        fn(inEvent);
      }
      this.handledEvents.set(inEvent, true);
    },
    // set up event listeners
    listen: function(inEvents, inTarget, inListener) {
      inEvents.forEach(function(e) {
        this.addEvent(e, inListener, false, inTarget);
      }, this);
    },
    // remove event listeners
    unlisten: function(inEvents, inTarget, inListener) {
      inEvents.forEach(function(e) {
        this.removeEvent(e, inListener, false, inTarget);
      }, this);
    },
    addEvent: function(inEventName, inEventHandler, inCapture, inTarget) {
      inTarget.addEventListener(inEventName, inEventHandler, inCapture);
    },
    removeEvent: function(inEventName, inEventHandler, inCapture, inTarget) {
      inTarget.removeEventListener(inEventName, inEventHandler, inCapture);
    },
    // EVENT CREATION AND TRACKING
    /**
     * Creates a new Event of type `inType`, based on the information in
     * `inEvent`.
     *
     * @param {string} inType A string representing the type of event to create
     * @param {Event} inEvent A platform event with a target
     * @return {Event} A PointerEvent of type `inType`
     */
    makeEvent: function(inType, inEvent) {
      var e = new PointerEvent(inType, inEvent);
      this.targets.set(e, this.targets.get(inEvent) || inEvent.target);
      return e;
    },
    // make and dispatch an event in one call
    fireEvent: function(inType, inEvent) {
      var e = this.makeEvent(inType, inEvent);
      return this.dispatchEvent(e);
    },
    /**
     * Returns a snapshot of inEvent, with writable properties.
     *
     * @param {Event} inEvent An event that contains properties to copy.
     * @return {Object} An object containing shallow copies of `inEvent`'s
     *    properties.
     */
    cloneEvent: function(inEvent) {
      var eventCopy = {};
      for (var n in inEvent) {
        eventCopy[n] = inEvent[n];
      }
      return eventCopy;
    },
    getTarget: function(inEvent) {
      // if pointer capture is set, route all events for the specified pointerId
      // to the capture target
      if (this.captureInfo) {
        if (this.captureInfo.id === inEvent.pointerId) {
          return this.captureInfo.target;
        }
      }
      return this.targets.get(inEvent);
    },
    setCapture: function(inPointerId, inTarget) {
      if (this.captureInfo) {
        this.releaseCapture(this.captureInfo.id);
      }
      this.captureInfo = {id: inPointerId, target: inTarget};
      var e = new PointerEvent('gotpointercapture', { bubbles: true });
      this.implicitRelease = this.releaseCapture.bind(this, inPointerId);
      document.addEventListener('pointerup', this.implicitRelease);
      document.addEventListener('pointercancel', this.implicitRelease);
      this.targets.set(e, inTarget);
      this.asyncDispatchEvent(e);
    },
    releaseCapture: function(inPointerId) {
      if (this.captureInfo && this.captureInfo.id === inPointerId) {
        var e = new PointerEvent('lostpointercapture', { bubbles: true });
        var t = this.captureInfo.target;
        this.captureInfo = null;
        document.removeEventListener('pointerup', this.implicitRelease);
        document.removeEventListener('pointercancel', this.implicitRelease);
        this.targets.set(e, t);
        this.asyncDispatchEvent(e);
      }
    },
    /**
     * Dispatches the event to its target.
     *
     * @param {Event} inEvent The event to be dispatched.
     * @return {Boolean} True if an event handler returns true, false otherwise.
     */
    dispatchEvent: function(inEvent) {
      var t = this.getTarget(inEvent);
      if (t) {
        return t.dispatchEvent(inEvent);
      }
    },
    asyncDispatchEvent: function(inEvent) {
      setTimeout(this.dispatchEvent.bind(this, inEvent), 0);
    }
  };
  dispatcher.boundHandler = dispatcher.eventHandler.bind(dispatcher);
  scope.dispatcher = dispatcher;
})(window.PointerEventsPolyfill);

/**
 * This module uses Mutation Observers to dynamically adjust which nodes will
 * generate Pointer Events.
 *
 * All nodes that wish to generate Pointer Events must have the attribute
 * `touch-action` set to `none`.
 */
(function(scope) {
  var dispatcher = scope.dispatcher;
  var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
  var map = Array.prototype.map.call.bind(Array.prototype.map);
  var installer = {
    ATTRIB: 'touch-action',
    SELECTOR: '[touch-action]',
    EMITTER: 'none',
    XSCROLLER: 'pan-x',
    YSCROLLER: 'pan-y',
    SCROLLER: /^(?:pan-x pan-y)|(?:pan-y pan-x)|scroll$/,
    OBSERVER_INIT: {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['touch-action']
    },
    watchSubtree: function(inScope) {
      // Only watch scopes that can target find, as these are top-level.
      // Otherwise we can see duplicate additions and removals that add noise.
      //
      // TODO(dfreedman): For some instances with ShadowDOMPolyfill, we can see
      // a removal without an insertion when a node is redistributed among
      // shadows. Since it all ends up correct in the document, watching only
      // the document will yield the correct mutations to watch.
      if (scope.targetFinding.canTarget(inScope)) {
        observer.observe(inScope, this.OBSERVER_INIT);
      }
    },
    enableOnSubtree: function(inScope) {
      var scope = inScope || document;
      this.watchSubtree(inScope);
      if (scope === document && document.readyState !== 'complete') {
        this.installOnLoad();
      } else {
        this.installNewSubtree(scope);
      }
    },
    installNewSubtree: function(inScope) {
      forEach(this.findElements(inScope), this.addElement, this);
    },
    findElements: function(inScope) {
      var scope = inScope || document;
      if (scope.querySelectorAll) {
        return scope.querySelectorAll(this.SELECTOR);
      }
      return [];
    },
    touchActionToScrollType: function(inTouchAction) {
      var t = inTouchAction;
      if (t === this.EMITTER) {
        return 'none';
      } else if (t === this.XSCROLLER) {
        return 'X';
      } else if (t === this.YSCROLLER) {
        return 'Y';
      } else if (this.SCROLLER.exec(t)) {
        return 'XY';
      }
    },
    removeElement: function(inEl) {
      dispatcher.unregisterTarget(inEl);
      // remove touch-action from shadow
      var s = scope.targetFinding.shadow(inEl);
      if (s) {
        dispatcher.unregisterTarget(s);
      }
    },
    addElement: function(inEl) {
      var a = inEl.getAttribute && inEl.getAttribute(this.ATTRIB);
      var st = this.touchActionToScrollType(a);
      if (st) {
        dispatcher.registerTarget(inEl, st);
        // set touch-action on shadow as well
        var s = scope.targetFinding.shadow(inEl);
        if (s) {
          dispatcher.registerTarget(s, st);
        }
      }
    },
    elementChanged: function(inEl) {
      this.removeElement(inEl);
      this.addElement(inEl);
    },
    concatLists: function(inAccum, inList) {
      for (var i = 0, l = inList.length, o; i < l && (o = inList[i]); i++) {
        inAccum.push(o);
      }
      return inAccum;
    },
    // register all touch-action = none nodes on document load
    installOnLoad: function() {
      document.addEventListener('DOMContentLoaded', this.installNewSubtree.bind(this, document));
    },
    flattenMutationTree: function(inNodes) {
      // find children with touch-action
      var tree = map(inNodes, this.findElements, this);
      // make sure the added nodes are accounted for
      tree.push(inNodes);
      // flatten the list
      return tree.reduce(this.concatLists, []);
    },
    mutationWatcher: function(inMutations) {
      inMutations.forEach(this.mutationHandler, this);
    },
    mutationHandler: function(inMutation) {
      var m = inMutation;
      if (m.type === 'childList') {
        var added = this.flattenMutationTree(m.addedNodes);
        added.forEach(this.addElement, this);
        var removed = this.flattenMutationTree(m.removedNodes);
        removed.forEach(this.removeElement, this);
      } else if (m.type === 'attributes') {
        this.elementChanged(m.target);
      }
    },
  };
  var boundWatcher = installer.mutationWatcher.bind(installer);
  scope.installer = installer;
  scope.register = installer.enableOnSubtree.bind(installer);
  // imperatively set the touch action of an element, document, or shadow root
  // use 'auto' to unset the touch-action
  scope.setTouchAction = function(inEl, inTouchAction) {
    var st = this.touchActionToScrollType(inTouchAction);
    if (st) {
      dispatcher.registerTarget(inEl, st);
    } else {
      dispatcher.unregisterTarget(inEl);
    }
  }.bind(installer);
  var MO = window.MutationObserver || window.WebKitMutationObserver;
  if (!MO) {
    installer.watchSubtree = function(){
      console.warn('PointerEventsPolyfill: MutationObservers not found, touch-action will not be dynamically detected');
    };
  } else {
    var observer = new MO(boundWatcher);
  }
})(window.PointerEventsPolyfill);

(function (scope) {
  var dispatcher = scope.dispatcher;
  var pointermap = dispatcher.pointermap;
  // radius around touchend that swallows mouse events
  var DEDUP_DIST = 25;

  // handler block for native mouse events
  var mouseEvents = {
    // Mouse is required to have a pointerId of 1
    POINTER_ID: 1,
    POINTER_TYPE: 'mouse',
    events: [
      'mousedown',
      'mousemove',
      'mouseup',
      'mouseover',
      'mouseout'
    ],
    global: [
      'mousedown',
      'mouseup',
      'mouseover',
      'mouseout'
    ],
    lastTouches: [],
    // duplicate, so a user can do dispatcher.registerTarget(document), and not
    // collide with the global mouse listener
    mouseHandler: dispatcher.eventHandler.bind(dispatcher),
    isEventSimulatedFromTouch: function(inEvent) {
      var lts = this.lastTouches;
      var x = inEvent.clientX, y = inEvent.clientY;
      for (var i = 0, l = lts.length, t; i < l && (t = lts[i]); i++) {
        // simulated mouse events will be swallowed near a primary touchend
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DIST && dy <= DEDUP_DIST) {
          return true;
        }
      }
    },
    prepareEvent: function(inEvent) {
      var e = dispatcher.cloneEvent(inEvent);
      e.pointerId = this.POINTER_ID;
      e.isPrimary = true;
      e.pointerType = this.POINTER_TYPE;
      return e;
    },
    mousedown: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var p = pointermap.has(this.POINTER_ID);
        // TODO(dfreedman) workaround for some elements not sending mouseup
        // http://crbug/149091
        if (p) {
          this.cancel(inEvent);
          p = false;
        }
        if (!p) {
          var e = this.prepareEvent(inEvent);
          pointermap.set(this.POINTER_ID, inEvent);
          dispatcher.down(e);
          dispatcher.listen(this.global, document, this.mouseHandler);
        }
      }
    },
    mousemove: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        dispatcher.move(e);
      }
    },
    mouseup: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var p = pointermap.get(this.POINTER_ID);
        if (p && p.button === inEvent.button) {
          var e = this.prepareEvent(inEvent);
          dispatcher.up(e);
          this.cleanupMouse();
        }
      }
    },
    mouseover: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        dispatcher.enterOver(e);
      }
    },
    mouseout: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        dispatcher.leaveOut(e);
      }
    },
    cancel: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.cancel(e);
      this.cleanupMouse();
    },
    cleanupMouse: function() {
      pointermap.delete(this.POINTER_ID);
      dispatcher.unlisten(this.global, document, this.mouseHandler);
    }
  };

  // mouse move events must be on at all times
  dispatcher.listen(['mousemove'], document, dispatcher.boundHandler);

  scope.mouseEvents = mouseEvents;
})(window.PointerEventsPolyfill);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var findTarget = scope.findTarget;
  var pointermap = dispatcher.pointermap;
  var scrollType = dispatcher.scrollType;
  var touchMap = Array.prototype.map.call.bind(Array.prototype.map);
  // This should be long enough to ignore compat mouse events made by touch
  var DEDUP_TIMEOUT = 2500;

  // handler block for native touch events
  var touchEvents = {
    events: [
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel'
    ],
    POINTER_TYPE: 'touch',
    firstTouch: null,
    isPrimaryTouch: function(inTouch) {
      return this.firstTouch === inTouch.identifier;
    },
    setPrimaryTouch: function(inTouch) {
      if (this.firstTouch === null) {
        this.firstTouch = inTouch.identifier;
        this.firstXY = {X: inTouch.clientX, Y: inTouch.clientY};
        this.scrolling = false;
      }
    },
    removePrimaryTouch: function(inTouch) {
      if (this.isPrimaryTouch(inTouch)) {
        this.firstTouch = null;
        this.firstXY = null;
      }
    },
    touchToPointer: function(inTouch) {
      var e = dispatcher.cloneEvent(inTouch);
      // Spec specifies that pointerId 1 is reserved for Mouse.
      // Touch identifiers can start at 0.
      // Add 2 to the touch identifier for compatibility.
      e.pointerId = inTouch.identifier + 2;
      e.target = findTarget(e);
      e.bubbles = true;
      e.cancelable = true;
      e.button = 0;
      e.buttons = 1;
      e.width = inTouch.webkitRadiusX || inTouch.radiusX;
      e.height = inTouch.webkitRadiusY || inTouch.radiusY;
      e.pressure = inTouch.webkitForce || inTouch.force;
      e.isPrimary = this.isPrimaryTouch(inTouch);
      e.pointerType = this.POINTER_TYPE;
      return e;
    },
    processTouches: function(inEvent, inFunction) {
      var tl = inEvent.changedTouches;
      var pointers = touchMap(tl, this.touchToPointer, this);
      pointers.forEach(inFunction, this);
    },
    // For single axis scrollers, determines whether the element should emit
    // pointer events or behave as a scroller
    shouldScroll: function(inEvent) {
      if (this.firstXY) {
        var ret;
        var scrollAxis = scrollType.get(inEvent.currentTarget);
        if (scrollAxis === 'none') {
          // this element is a touch-action: none, should never scroll
          ret = false;
        } else if (scrollAxis === 'XY') {
          // this element should always scroll
          ret = true;
        } else {
          var t = inEvent.changedTouches[0];
          // check the intended scroll axis, and other axis
          var a = scrollAxis;
          var oa = scrollAxis === 'Y' ? 'X' : 'Y';
          var da = Math.abs(t['client' + a] - this.firstXY[a]);
          var doa = Math.abs(t['client' + oa] - this.firstXY[oa]);
          // if delta in the scroll axis > delta other axis, scroll instead of
          // making events
          ret = da >= doa;
        }
        this.firstXY = null;
        return ret;
      }
    },
    findTouch: function(inTL, inId) {
      for (var i = 0, l = inTL.length, t; i < l && (t = inTL[i]); i++) {
        if (t.identifier === inId) {
          return true;
        }
      }
    },
    // In some instances, a touchstart can happen without a touchend. This
    // leaves the pointermap in a broken state.
    // Therefore, on every touchstart, we remove the touches that did not fire a
    // touchend event.
    // To keep state globally consistent, we fire a
    // pointercancel for this "abandoned" touch
    vacuumTouches: function(inEvent) {
      var tl = inEvent.touches;
      // pointermap.size should be < tl.length here, as the touchstart has not
      // been processed yet.
      if (pointermap.size >= tl.length) {
        var d = [];
        pointermap.ids.forEach(function(i) {
          // Never remove pointerId == 1, which is mouse.
          // Touch identifiers are 2 smaller than their pointerId, which is the
          // index in pointermap.
          if (i !== 1 && !this.findTouch(tl, i - 2)) {
            var p = pointermap.get(i).out;
            d.push(this.touchToPointer(p));
          }
        }, this);
        d.forEach(this.cancelOut, this);
      }
    },
    touchstart: function(inEvent) {
      this.vacuumTouches(inEvent);
      this.setPrimaryTouch(inEvent.changedTouches[0]);
      this.dedupSynthMouse(inEvent);
      if (!this.scrolling) {
        this.processTouches(inEvent, this.overDown);
      }
    },
    overDown: function(inPointer) {
      var p = pointermap.set(inPointer.pointerId, {
        target: inPointer.target,
        out: inPointer,
        outTarget: inPointer.target
      });
      dispatcher.over(inPointer);
      dispatcher.down(inPointer);
    },
    touchmove: function(inEvent) {
      if (!this.scrolling) {
        if (this.shouldScroll(inEvent)) {
          this.scrolling = true;
          this.touchcancel(inEvent);
        } else {
          inEvent.preventDefault();
          this.processTouches(inEvent, this.moveOverOut);
        }
      }
    },
    moveOverOut: function(inPointer) {
      var event = inPointer;
      var pointer = pointermap.get(event.pointerId);
      // a finger drifted off the screen, ignore it
      if (!pointer) {
        return;
      }
      var outEvent = pointer.out;
      var outTarget = pointer.outTarget;
      dispatcher.move(event);
      if (outEvent && outTarget !== event.target) {
        outEvent.relatedTarget = event.target;
        event.relatedTarget = outTarget;
        // recover from retargeting by shadow
        outEvent.target = outTarget;
        if (event.target) {
          dispatcher.leaveOut(outEvent);
          dispatcher.enterOver(event);
        } else {
          // clean up case when finger leaves the screen
          event.target = outTarget;
          event.relatedTarget = null;
          this.cancelOut(event);
        }
      }
      pointer.out = event;
      pointer.outTarget = event.target;
    },
    touchend: function(inEvent) {
      this.dedupSynthMouse(inEvent);
      this.processTouches(inEvent, this.upOut);
    },
    upOut: function(inPointer) {
      if (!this.scrolling) {
        dispatcher.up(inPointer);
        dispatcher.out(inPointer);
      }
      this.cleanUpPointer(inPointer);
    },
    touchcancel: function(inEvent) {
      this.processTouches(inEvent, this.cancelOut);
    },
    cancelOut: function(inPointer) {
      dispatcher.cancel(inPointer);
      dispatcher.out(inPointer);
      this.cleanUpPointer(inPointer);
    },
    cleanUpPointer: function(inPointer) {
      pointermap.delete(inPointer.pointerId);
      this.removePrimaryTouch(inPointer);
    },
    // prevent synth mouse events from creating pointer events
    dedupSynthMouse: function(inEvent) {
      var lts = scope.mouseEvents.lastTouches;
      var t = inEvent.changedTouches[0];
      // only the primary finger will synth mouse events
      if (this.isPrimaryTouch(t)) {
        // remember x/y of last touch
        var lt = {x: t.clientX, y: t.clientY};
        lts.push(lt);
        var fn = (function(lts, lt){
          var i = lts.indexOf(lt);
          if (i > -1) {
            lts.splice(i, 1)
          }
        }).bind(null, lts, lt);
        setTimeout(fn, DEDUP_TIMEOUT);
      }
    }
  };

  scope.touchEvents = touchEvents;
})(window.PointerEventsPolyfill);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var pointermap = dispatcher.pointermap;
  var msEvents = {
    events: [
      'MSPointerDown',
      'MSPointerMove',
      'MSPointerUp',
      'MSPointerOut',
      'MSPointerOver',
      'MSPointerCancel',
      'MSGotPointerCapture',
      'MSLostPointerCapture'
    ],
    POINTER_TYPES: [
      '',
      'unavailable',
      'touch',
      'pen',
      'mouse'
    ],
    prepareEvent: function(inEvent) {
      var e = dispatcher.cloneEvent(inEvent);
      e.pointerType = this.POINTER_TYPES[inEvent.pointerType];
      return e;
    },
    cleanup: function(id) {
      pointermap.delete(id);
    },
    MSPointerDown: function(inEvent) {
      pointermap.set(inEvent.pointerId, inEvent);
      var e = this.prepareEvent(inEvent);
      dispatcher.down(e);
    },
    MSPointerMove: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.move(e);
    },
    MSPointerUp: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.up(e);
      this.cleanup(inEvent.pointerId);
    },
    MSPointerOut: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.leaveOut(e);
    },
    MSPointerOver: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.enterOver(e);
    },
    MSPointerCancel: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      dispatcher.cancel(e);
      this.cleanup(inEvent.pointerId);
    },
    MSLostPointerCapture: function(inEvent) {
      var e = dispatcher.makeEvent('lostpointercapture', inEvent);
      dispatcher.dispatchEvent(e);
    },
    MSGotPointerCapture: function(inEvent) {
      var e = dispatcher.makeEvent('gotpointercapture', inEvent);
      dispatcher.dispatchEvent(e);
    }
  };

  scope.msEvents = msEvents;
})(window.PointerEventsPolyfill);

/**
 * This module contains the handlers for native platform events.
 * From here, the dispatcher is called to create unified pointer events.
 * Included are touch events (v1), mouse events, and MSPointerEvents.
 */
(function(scope) {
  var dispatcher = scope.dispatcher;
  var installer = scope.installer;

  // only activate if this platform does not have pointer events
  if (window.navigator.pointerEnabled === undefined) {

    if (window.navigator.msPointerEnabled) {
      var tp = window.navigator.msMaxTouchPoints;
      Object.defineProperty(window.navigator, 'maxTouchPoints', {
        value: tp,
        enumerable: true
      });
      dispatcher.registerSource('ms', scope.msEvents);
      dispatcher.registerTarget(document);
    } else {
      dispatcher.registerSource('mouse', scope.mouseEvents);
      if (window.ontouchstart !== undefined) {
        dispatcher.registerSource('touch', scope.touchEvents);
      }
      installer.enableOnSubtree(document);
    }

    Object.defineProperty(window.navigator, 'pointerEnabled', {value: true, enumerable: true});
  }
})(window.PointerEventsPolyfill);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var n = window.navigator;
  var s, r;
  function assertDown(id) {
    if (!dispatcher.pointermap.has(id)) {
      throw new Error('InvalidPointerId');
    }
  }
  if (n.msPointerEnabled) {
    s = function(pointerId) {
      assertDown(pointerId);
      this.msSetPointerCapture(pointerId);
    };
    r = function(pointerId) {
      assertDown(pointerId);
      this.msReleasePointerCapture(pointerId);
    };
  } else {
    s = function setPointerCapture(pointerId) {
      assertDown(pointerId);
      dispatcher.setCapture(pointerId, this);
    };
    r = function releasePointerCapture(pointerId) {
      assertDown(pointerId);
      dispatcher.releaseCapture(pointerId, this);
    };
  }
  if (!Element.prototype.setPointerCapture) {
    Object.defineProperties(Element.prototype, {
      'setPointerCapture': {
        value: s,
      },
      'releasePointerCapture': {
        value: r,
      }
    });
  }
})(window.PointerEventsPolyfill);
