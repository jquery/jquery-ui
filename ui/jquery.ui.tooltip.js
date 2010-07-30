/*
 * jQuery UI Tooltip @VERSION
 *
 * Copyright 2010, AUTHORS.txt
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

// role=application on body required for screenreaders to correctly interpret aria attributes
if( !$(document.body).is('[role]') ){
	$(document.body).attr('role','application');
} 

var increments = 0;

$.widget("ui.tooltip", {
	options: {
		tooltipClass: "ui-widget-content",
		content: function() {
			return $(this).attr("title");
		},
		position: {
			my: "left center",
			at: "right center",
			offset: "15 0"
		}
	},
	_init: function() {
		var self = this;
		this.tooltip = $("<div></div>")
			.attr("id", "ui-tooltip-" + increments++)
			.attr("role", "tooltip")
			.attr("aria-hidden", "true")
			.addClass("ui-tooltip ui-widget ui-corner-all")
			.addClass(this.options.tooltipClass)
			.appendTo(document.body)
			.hide();
		this.tooltipContent = $("<div></div>")
			.addClass("ui-tooltip-content")
			.appendTo(this.tooltip);
		this.opacity = this.tooltip.css("opacity");
		this.element
			.bind("focus.tooltip mouseenter.tooltip", function(event) {
				self.open( event );
			})
			.bind("blur.tooltip mouseleave.tooltip", function(event) {
				self.close( event );
			});
	},
	
	enable: function() {
		this.options.disabled = false;
	},
	
	disable: function() {
		this.options.disabled = true;
	},
	
	destroy: function() {
		this.tooltip.remove();
		$.Widget.prototype.destroy.apply(this, arguments);
	},
	
	widget: function() {
		return this.element.pushStack(this.tooltip.get());
	},
	
	open: function(event) {
		var target = this.element;
		// already visible? possible when both focus and mouseover events occur
		if (this.current && this.current[0] == target[0])
			return;
		var self = this;
		this.current = target;
		this.currentTitle = target.attr("title");
		var content = this.options.content.call(target[0], function(response) {
			// ignore async responses that come in after the tooltip is already hidden
			if (self.current == target)
				self._show(event, target, response);
		});
		if (content) {
			self._show(event, target, content);
		}
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

		if (this.tooltip.is(":animated"))
			this.tooltip.stop().show().fadeTo("normal", this.opacity);
		else
			this.tooltip.is(':visible') ? this.tooltip.fadeTo("normal", this.opacity) : this.tooltip.fadeIn();

		this._trigger( "open", event );
	},
	
	close: function(event) {
		if (!this.current)
			return;
		
		var current = this.current.attr("title", this.currentTitle);
		this.current = null;
		
		if (this.options.disabled)
			return;
		
		current.removeAttr("aria-describedby");
		this.tooltip.attr("aria-hidden", "true");
		
		if (this.tooltip.is(':animated'))
				this.tooltip.stop().fadeTo("normal", 0, function() {
					$(this).hide().css("opacity", "");
				});
			else
				this.tooltip.stop().fadeOut();
		
		this._trigger( "close", event );
	}
	
});

})(jQuery);