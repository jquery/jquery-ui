/*
 * jQuery UI Tooltip @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tooltip
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function($) {

var increments = 0;

$.widget("ui.tooltip", {
	options: {
		items: "[title]",
		content: function() {
			return $(this).attr("title");
		},
		position: {
			my: "left center",
			at: "right center",
			offset: "15 0"
		}
	},
	_create: function() {
		var self = this;
		this.tooltip = $("<div></div>")
			.attr("id", "ui-tooltip-" + increments++)
			.attr("role", "tooltip")
			.attr("aria-hidden", "true")
			.addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content")
			.appendTo(document.body)
			.hide();
		this.tooltipContent = $("<div></div>")
			.addClass("ui-tooltip-content")
			.appendTo(this.tooltip);
		this.opacity = this.tooltip.css("opacity");
		this.element
			.bind("focus.tooltip mouseover.tooltip", function(event) {
				self.open( event );
			})
			.bind("blur.tooltip mouseout.tooltip", function(event) {
				self.close( event );
			});
	},
	
	enable: function() {
		this.options.disabled = false;
	},
	
	disable: function() {
		this.options.disabled = true;
	},
	
	_destroy: function() {
		this.tooltip.remove();
	},
	
	widget: function() {
		return this.element.pushStack(this.tooltip.get());
	},
	
	open: function(event) {
		var target = $(event && event.target || this.element).closest(this.options.items);
		// already visible? possible when both focus and mouseover events occur
		if (this.current && this.current[0] == target[0])
			return;
		var self = this;
		this.current = target;
		this.currentTitle = target.attr("title");
		var content = this.options.content.call(target[0], function(response) {
			// IE may instantly serve a cached response, need to give it a chance to finish with _show before that
			setTimeout(function() {
				// ignore async responses that come in after the tooltip is already hidden
				if (self.current == target)
					self._show(event, target, response);
			}, 13);
		});
		if (content) {
			self._show(event, target, content);
		}
	},

	/**
	 * used function from this comment http://bugs.jqueryui.com/ticket/3772#comment:6
	 */
	_animate: function (effect, showing) {
		// Convert to array
		effect = ($.isArray(effect) ? effect : (typeof effect === 'string' ? [effect] :
			[effect.fx, effect.options, effect.speed, effect.callback]));
		// Check for options
		(effect[1] && typeof effect[1] !== 'object' ? effect.splice(1, 0, null) : effect);
		// Check for callback
		($.isFunction(effect[2]) ? effect.splice(2, 0, null) : effect);
		// Special case for 'show'
		effect = (effect[0] && effect[0] !== 'show' ? effect : effect.slice(2));
		(effect[0] === 'fade' ?
			// Special case for 'fade'
			this.tooltip[showing ? 'fadeIn' : 'fadeOut'].apply(this.tooltip, effect.slice(2)) :
			// Apply effect
			this.tooltip[showing ? 'show' : 'hide'].apply(this.tooltip, effect));
	},

	_show: function(event, target, content) {
		if (!content)
			return;
		
		target.attr("title", "");
		
		if (this.options.disabled)
			return;
			
		this.tooltipContent.html(content);
		this.tooltip.css({
			top: 0,
			left: 0
		}).show().position( $.extend({
			of: target
		}, this.options.position )).hide();
		
		this.tooltip.attr("aria-hidden", "false");
		target.attr("aria-describedby", this.tooltip.attr("id"));

		//move animation code apart, so will be no need to repeat stop in "if" closures
		this.tooltip.stop(false, true);

		//if show was not provided -> trigger default fadeIn animation
		this._animate( !this.options.show ? 'fade' : this.options.show, 1 );

		this._trigger( "open", event );
	},
	
	close: function(event) {
		if (!this.current)
			return;
		
		var current = this.current;
		this.current = null;
		current.attr("title", this.currentTitle);
		
		if (this.options.disabled)
			return;
		
		current.removeAttr("aria-describedby");
		this.tooltip.attr("aria-hidden", "true");
		
		//move animation code apart, so will be no need to repeat stop in "if" closures
		this.tooltip.stop(false, true);
		
		//trigger close event just before animation fired?
		this._trigger( "close", event );
		
		//show was not provided -> trigger default fadeIn animation
		this._animate( !this.options.hide ? 'fade' : this.options.hide, 0 );
	}
});

$.ui.tooltip.version = "@VERSION";

})(jQuery);