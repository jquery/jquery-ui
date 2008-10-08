/**
 * History/Remote - jQuery plugin for enabling history support and bookmarking
 * @requires jQuery v1.0.3
 *
 * http://stilbuero.de/jquery/history/
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.2.3
 */

(function($) { // block scope

/**
 * Initialize the history manager. Subsequent calls will not result in additional history state change 
 * listeners. Should be called soonest when the DOM is ready, because in IE an iframe needs to be added
 * to the body to enable history support.
 *
 * @example $.ajaxHistory.initialize();
 *
 * @param Function callback A single function that will be executed in case there is no fragment
 *                          identifier in the URL, for example after navigating back to the initial
 *                          state. Use to restore such an initial application state.
 *                          Optional. If specified it will overwrite the default action of 
 *                          emptying all containers that are used to load content into.
 * @type undefined
 *
 * @name $.ajaxHistory.initialize()
 * @cat Plugins/History
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
$.ajaxHistory = new function() {

    var RESET_EVENT = 'historyReset';

    var _currentHash = location.hash;
    var _intervalId = null;
    var _observeHistory; // define outside if/else required by Opera

    this.update = function() { }; // empty function body for graceful degradation

    // create custom event for state reset
    var _defaultReset = function() {
        $('.remote-output').empty();
    };
    $(document).bind(RESET_EVENT, _defaultReset);
    
    // TODO fix for Safari 3
    // if ($.browser.msie)
    // else if hash != _currentHash
    // else check history length

    if ($.browser.msie) {

        var _historyIframe, initialized = false; // for IE

        // add hidden iframe
        $(function() {
            _historyIframe = $('<iframe style="display: none;"></iframe>').appendTo(document.body).get(0);
            var iframe = _historyIframe.contentWindow.document;
            // create initial history entry
            iframe.open();
            iframe.close();
            if (_currentHash && _currentHash != '#') {
                iframe.location.hash = _currentHash.replace('#', '');
            }
        });

        this.update = function(hash) {
            _currentHash = hash;
            var iframe = _historyIframe.contentWindow.document;
            iframe.open();
            iframe.close();
            iframe.location.hash = hash.replace('#', '');
        };

        _observeHistory = function() {
            var iframe = _historyIframe.contentWindow.document;
            var iframeHash = iframe.location.hash;
            if (iframeHash != _currentHash) {
                _currentHash = iframeHash;
                if (iframeHash && iframeHash != '#') {
                    // order does matter, set location.hash after triggering the click...
                    $('a[@href$="' + iframeHash + '"]').click();
                    location.hash = iframeHash;
                } else if (initialized) {
                    location.hash = '';
                    $(document).trigger(RESET_EVENT);
                }
            }
            initialized = true;
        };

    } else if ($.browser.mozilla || $.browser.opera) {

        this.update = function(hash) {
            _currentHash = hash;
        };

        _observeHistory = function() {
            if (location.hash) {
                if (_currentHash != location.hash) {
                    _currentHash = location.hash;
                    $('a[@href$="' + _currentHash + '"]').click();
                }
            } else if (_currentHash) {
                _currentHash = '';
                $(document).trigger(RESET_EVENT);
            }
        };

    } else if ($.browser.safari) {

        var _backStack, _forwardStack, _addHistory; // for Safari

        // etablish back/forward stacks
        $(function() {
            _backStack = [];
            _backStack.length = history.length;
            _forwardStack = [];

        });
        var isFirst = false, initialized = false;
        _addHistory = function(hash) {
            _backStack.push(hash);
            _forwardStack.length = 0; // clear forwardStack (true click occured)
            isFirst = false;
        };

        this.update = function(hash) {
            _currentHash = hash;
            _addHistory(_currentHash);
        };

        _observeHistory = function() {
            var historyDelta = history.length - _backStack.length;
            if (historyDelta) { // back or forward button has been pushed
                isFirst = false;
                if (historyDelta < 0) { // back button has been pushed
                    // move items to forward stack
                    for (var i = 0; i < Math.abs(historyDelta); i++) _forwardStack.unshift(_backStack.pop());
                } else { // forward button has been pushed
                    // move items to back stack
                    for (var i = 0; i < historyDelta; i++) _backStack.push(_forwardStack.shift());
                }
                var cachedHash = _backStack[_backStack.length - 1];
                $('a[@href$="' + cachedHash + '"]').click();
                _currentHash = location.hash;
            } else if (_backStack[_backStack.length - 1] == undefined && !isFirst) {
                // back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
                // document.URL doesn't change in Safari
                if (document.URL.indexOf('#') >= 0) {
                    $('a[@href$="' + '#' + document.URL.split('#')[1] + '"]').click();
                } else if (initialized) {
                    $(document).trigger(RESET_EVENT);
                }
                isFirst = true;
            }
            initialized = true;
        };

    }

    this.initialize = function(callback) {
        // custom callback to reset app state (no hash in url)
        if (typeof callback == 'function') {
            $(document).unbind(RESET_EVENT, _defaultReset).bind(RESET_EVENT, callback);
        }
        // look for hash in current URL (not Safari)
        if (location.hash && typeof _addHistory == 'undefined') {
            $('a[@href$="' + location.hash + '"]').trigger('click');
        }
        // start observer
        if (_observeHistory && _intervalId == null) {
            _intervalId = setInterval(_observeHistory, 200); // Safari needs at least 200 ms
        }
    };

};

/**
 * Implement Ajax driven links in a completely unobtrusive and accessible manner (also known as "Hijax")
 * with support for the browser's back/forward navigation buttons and bookmarking.
 *
 * The link's href attribute gets altered to a fragment identifier, such as "#remote-1", so that the browser's
 * URL gets updated on each click, whereas the former value of that attribute is used to load content via
 * XmlHttpRequest from and update the specified element. If no target element is found, a new div element will be
 * created and appended to the body to load the content into. The link informs the history manager of the 
 * state change on click and adds an entry to the browser's history.
 *
 * jQuery's Ajax implementation adds a custom request header of the form "X-Requested-With: XmlHttpRequest"
 * to any Ajax request so that the called page can distinguish between a standard and an Ajax (XmlHttpRequest)
 * request.
 *
 * @example $('a.remote').remote('#output');
 * @before <a class="remote" href="/path/to/content.html">Update</a>
 * @result <a class="remote" href="#remote-1">Update</a>
 * @desc Alter a link of the class "remote" to an Ajax-enhanced link and let it load content from
 *       "/path/to/content.html" via XmlHttpRequest into an element with the id "output".
 * @example $('a.remote').remote('#output', {hashPrefix: 'chapter'});
 * @before <a class="remote" href="/path/to/content.html">Update</a>
 * @result <a class="remote" href="#chapter-1">Update</a>
 * @desc Alter a link of the class "remote" to an Ajax-enhanced link and let it load content from
 *       "/path/to/content.html" via XmlHttpRequest into an element with the id "output".
 *
 * @param String expr A string containing a CSS selector or basic XPath specifying the element to load
 *                    content into via XmlHttpRequest.
 * @param Object settings An object literal containing key/value pairs to provide optional settings.
 * @option String hashPrefix A String that is used for constructing the hash the link's href attribute
 *                           gets altered to, such as "#remote-1". Default value: "remote-".
 * @param Function callback A single function that will be executed when the request is complete. 
 * @type jQuery
 *
 * @name remote
 * @cat Plugins/Remote
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Implement Ajax driven links in a completely unobtrusive and accessible manner (also known as "Hijax")
 * with support for the browser's back/forward navigation buttons and bookmarking.
 *
 * The link's href attribute gets altered to a fragment identifier, such as "#remote-1", so that the browser's
 * URL gets updated on each click, whereas the former value of that attribute is used to load content via
 * XmlHttpRequest from and update the specified element. If no target element is found, a new div element will be
 * created and appended to the body to load the content into. The link informs the history manager of the 
 * state change on click and adds an entry to the browser's history.
 *
 * jQuery's Ajax implementation adds a custom request header of the form "X-Requested-With: XmlHttpRequest"
 * to any Ajax request so that the called page can distinguish between a standard and an Ajax (XmlHttpRequest)
 * request.
 *
 * @example $('a.remote').remote( $('#output > div')[0] );
 * @before <a class="remote" href="/path/to/content.html">Update</a>
 * @result <a class="remote" href="#remote-1">Update</a>
 * @desc Alter a link of the class "remote" to an Ajax-enhanced link and let it load content from
 *       "/path/to/content.html" via XmlHttpRequest into an element with the id "output".
 * @example $('a.remote').remote('#output', {hashPrefix: 'chapter'});
 * @before <a class="remote" href="/path/to/content.html">Update</a>
 * @result <a class="remote" href="#chapter-1">Update</a>
 * @desc Alter a link of the class "remote" to an Ajax-enhanced link and let it load content from
 *       "/path/to/content.html" via XmlHttpRequest into an element with the id "output".
 *
 * @param Element elem A DOM element to load content into via XmlHttpRequest.
 * @param Object settings An object literal containing key/value pairs to provide optional settings.
 * @option String hashPrefix A String that is used for constructing the hash the link's href attribute
 *                           gets altered to, such as "#remote-1". Default value: "remote-".
 * @param Function callback A single function that will be executed when the request is complete. 
 * @type jQuery
 *
 * @name remote
 * @cat Plugins/Remote
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
$.fn.remote = function(output, settings, callback) {

    callback = callback || function() {};
    if (typeof settings == 'function') { // shift arguments
        callback = settings;
    }
    
    settings = $.extend({
        hashPrefix: 'remote-'
    }, settings || {});

    var target = $(output).size() && $(output) || $('<div></div>').appendTo('body');
    target.addClass('remote-output');

    return this.each(function(i) {
        var href = this.href, hash = '#' + (this.title && this.title.replace(/\s/g, '_') || settings.hashPrefix + (i + 1)),
            a = this;
        this.href = hash;
        $(this).click(function(e) {
            // lock target to prevent double loading in Firefox
            if (!target['locked']) {
                // add to history only if true click occured, not a triggered click
                if (e.clientX) {
                    $.ajaxHistory.update(hash);
                }
                target.load(href, function() {
                    target['locked'] = null;
                    callback.apply(a);
                });
            }
        });
    });

};

/**
 * Provides the ability to use the back/forward navigation buttons in a DHTML application.
 * A change of the application state is reflected by a change of the URL fragment identifier.
 *
 * The link's href attribute needs to point to a fragment identifier within the same resource,
 * although that fragment id does not need to exist. On click the link changes the URL fragment
 * identifier, informs the history manager of the state change and adds an entry to the browser's
 * history.
 *
 * @param Function callback A single function that will be executed as the click handler of the 
 *                          matched element. It will be executed on click (adding an entry to 
 *                          the history) as well as in case the history manager needs to trigger 
 *                          it depending on the value of the URL fragment identifier, e.g. if its 
 *                          current value matches the href attribute of the matched element.
 *                           
 * @type jQuery
 *
 * @name history
 * @cat Plugins/History
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
$.fn.history = function(callback) {
    return this.click(function(e) {        
		// add to history only if true click occured,
		// not a triggered click...
        if (e.clientX) {
	        // ...and die if already active
			if (this.hash == location.hash) {
				return false;
			} 
           	$.ajaxHistory.update(this.hash);
        }
		if (typeof callback == 'function') {
			callback.call(this);
		}
    });
};

})(jQuery);

/*
var logger;
$(function() {
    logger = $('<div style="position: fixed; top: 0; overflow: hidden; border: 1px solid; padding: 3px; width: 120px; height: 150px; background: #fff; color: red;"></div>').appendTo(document.body);
});
function log(m) {    
    logger.prepend(m + '<br />');
};
*/

