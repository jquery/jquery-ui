/*
 * jQuery UI History
 *
 * Copyright (c) 2008 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/History
 *
 * Revision: $Id: ui.history.js 5218 2008-04-09 20:08:24Z rdworth $
 */
;(function($) {

    // if the UI scope is not availalable, add it
    $.ui = $.ui || {};    
    
    // TODO lazy loading singleton
    $.ui.hmanager = new function() {
        var states = {}, def = function() {};
        
        var $window = $(window), hash = location.hash;        
   
        function getState() {
            return hash.replace('#', '');
        } 
        
        var iframe;
        // var keepHistoryIn = iframe || window;
            
        return {

            enable: function() {
                
                if ($.browser.msie && parseInt($.browser.version) < 8) {
                    $(function() {
                        // create hidden iframe for hash change tracking
                        iframe = $('<iframe id="ui-history-iframe" style="display: none;"></iframe>').
                                        prependTo(document.body)[0];
                        
                        // create initial history entry
                        iframe.contentWindow.document.open();
                        iframe.contentWindow.document.close();
                        
                        if (getState())
                            iframe.contentWindow.document.location.hash = getState();
                        
                    });
                }
                
                $window.bind('hashchange', function(e) {
                    // Prevent IE 8 from fireing an event twice,
                    // one from true event, one from trigger...
                    if (!iframe && hash == location.hash || iframe && hash == iframe.contentWindow.document.location.hash)
                        return false;

                    if ($.browser.msie && parseInt($.browser.version) < 8) {
                        hash = iframe.contentWindow.document.location.hash;
                    }
                    else
                        hash = location.hash;
                    
                    if (getState())
                        states[getState()]();
                    else
                        // TODO invoke default
                        ;
                });
                
                if (!($.browser.msie && parseInt($.browser.version) >= 8)) {
                    setInterval(
                        ($.browser.msie ?
                            function() {
                                if (hash != iframe.contentWindow.document.location.hash)
                                    $window.trigger('hashchange');
                            } : 
                            function() {
                                if (hash != location.hash)
                                    $window.trigger('hashchange');
                                else
                                    // Do the history.length check hack for Safari 2
                                    ;
                            }
                        )
                        , 200
                    );
                }
                
            },

            add: function(state, handler) {
                states[state] = handler;
            },
            
            go: function(state) {
                if (state) {
                    if ($.browser.msie && parseInt($.browser.version) < 8) {
                        iframe.contentWindow.document.open();
                        iframe.contentWindow.document.close();
                        iframe.contentWindow.document.location.hash = state;                        
                    }
                    location.hash = state;
                    $window.trigger('hashchange');
                }
                else 
                    console.log('TODO do default state');
            }

        }
        
    };

    $.ui.history = function() { 
        var args = Array.prototype.slice.call(arguments, 1);
        $.ui.hmanager[arguments[0]].apply($.ui.hmanager, args);
    };
    
})(jQuery);
