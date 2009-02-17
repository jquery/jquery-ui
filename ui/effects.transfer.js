/*
 * jQuery UI Effects Transfer @VERSION
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Effects/Transfer
 *
 * Depends:
 *	effects.core.js
 */
(function($) {

$.effects.transfer = function(o) {

	return this.queue(function() {

		// Create element
		var el = $(this);

		// Set options
		var mode = $.effects.setMode(el, o.options.mode || 'effect'); // Set Mode
		var target = $(o.options.to); // Find Target
		var position = el.offset();
		var transfer = $('<div class="ui-effects-transfer"></div>').appendTo(document.body);
		if(o.options.className) transfer.addClass(o.options.className);

		// Set target css
		transfer.addClass(o.options.className);
		transfer.css({
			top: position.top,
			left: position.left,
			height: el.innerHeight(),
			width: el.innerWidth(),
			position: 'absolute'
		});

		// Animation
		position = target.offset();
		animation = {
			top: position.top,
			left: position.left,
			height: target.innerHeight(),
			width: target.innerWidth()
		};

		// Animate
		transfer.animate(animation, o.duration, o.options.easing, function() {
			transfer.remove(); // Remove div
			if(o.callback) o.callback.apply(el[0], arguments); // Callback
			el.dequeue();
		});

	});

};

})(jQuery);
