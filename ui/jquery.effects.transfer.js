/*
 * jQuery UI Effects Transfer @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Transfer
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.transfer = function( o ) {
	
	return this.queue( function() {
		var elem = $( this ),
			target = $( o.to ),
			endPosition = target.offset(),
			animation = {
				top: endPosition.top,
				left: endPosition.left,
				height: target.innerHeight(),
				width: target.innerWidth()
			},
			startPosition = elem.offset(),
			transfer = $( '<div class="ui-effects-transfer"></div>' )
				.appendTo( document.body )
				.addClass( o.className )
				.css({
					top: startPosition.top,
					left: startPosition.left,
					height: elem.innerHeight(),
					width: elem.innerWidth(),
					position: 'absolute'
				})
				.animate( animation, o.duration, o.easing, function() {
					transfer.remove();
					$.isFunction( o.complete ) && o.complete.apply(elem[0], arguments);
					elem.dequeue();
				});
	});
};

})(jQuery);
