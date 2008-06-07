/*
 * jQuery UI testMouse
 *
 * Copyright (c) 2008 Richard D. Worth (rdworth.org)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * Revision: $Id: $
 */
;(function($) {
	
	var mouseX = 0;
	var mouseY = 0;
	
	$(function() {
		$(document).mousemove(function(e) {
			if (e.isTrusted !== false) {
				mouseX = e.pageX;
				mouseY = e.pageY;
			}
		});
	});
	
	$.widget("ui.testMouse", {
		trackMouse: function() {},
		init: function() {
		},
		destroy: function() {
		},
		center: function(offset) {
			var o = this.element.offset();
			return {
				x: (o.left + (offset || [0, 0])[0] || 0) + this.element.width() / 2,
				y: (o.top + (offset || [0, 0])[1] || 0) + this.element.height() / 2
			};
		},
		drag: function(dx, dy) {
			var self = this;			

			var center = this.center();
			this.left = center.x;
			this.top = center.y;
		
			var OS = (/(win|mac|linux)/i.exec(navigator.platform) || ['other'])[0].toLowerCase();
		
			var defaultUrl = ['cursors', OS == 'other' ? 'win' : OS, 'default.png'].join('/');
			var cursorUrl = function() {
				return ['cursors', OS == 'other' ? 'win' : OS, self.element.css('cursor') + '.png'].join('/');
			}
			var noneUrl = ['cursors', OS == 'other' ? 'win' : OS, 'none' + ($.browser.safari ? '.png' : '.cur')].join('/');
		
			var fakemouse = $('<img src="' + defaultUrl + '" />');
			var realmouse = $('<img src="' + defaultUrl + '" />');
			if ($.browser.msie && $.browser.version == 6) {
				fakemouse = $('<div style="height:32;width:32;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + defaultUrl + '\', sizingMethod=\'scale\');" ></div>');
				realmouse = $('<div><div style="height:32;width:32;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + defaultUrl + '\', sizingMethod=\'scale\');" ></div></div>');
			}
			var mousescreen = $('<div/>');
		
			var updateCursor = function() {
				if ($.browser.msie && $.browser.version == 6) {
					fakemouse.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + cursorUrl() + '\', sizingMethod=\'scale\'');
				} else {
					fakemouse.attr('src', cursorUrl());
				}
			}
			var resetCursor = function() {
				if ($.browser.msie && $.browser.version == 6) {
					fakemouse.css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + defaultUrl + '\', sizingMethod=\'scale\'');
				} else {
					fakemouse.attr('src', defaultUrl);
				}
			}
			
			var testStart = function() {
				self.element.bind("mouseover", updateCursor).bind("mouseout", resetCursor);
				fakemouse.appendTo('body').css({ position: 'absolute', left: mouseX, top: mouseY, zIndex: 5000 });
				realmouse.appendTo('body').css({ position: 'absolute', left: mouseX, top: mouseY, zIndex: 5000, opacity: 0.1 });
				mousescreen.appendTo('body').css({ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5000 })
					.mousemove(function(e) { realmouse.css({ left: e.pageX, top: e.pageY }); return false; })
					.mousedown(function() { return false; })
					.mouseup(function() { return false; });
				mousescreen.css('cursor', 'url(' + noneUrl + '), crosshair');
				($.browser.opera && mousescreen.css('cursor', 'crosshair'));
			}
			var testStop = function() {
				self.element.unbind("mouseover", updateCursor).unbind("mouseout", resetCursor);
				mousescreen.remove();
				mouseX = realmouse.css("left");
				mouseY = realmouse.css("top");
				realmouse.remove();
				fakemouse.remove();
				self.options.complete.apply();
			}
			
			testStart();
		
			this.lastX = null;

			var before = function() {
				self.element.triggerHandler('mouseover');
				self.element.simulate("mousedown", { clientX: self.left, clientY: self.top });
				self.element.simulate("mousemove", { clientX: self.left, clientY: self.top });
			}

			var during = function(xory) {
				if (!self.lastX) {
					self.lastX = xory;
				} else {
					var x = self.lastX, y = xory;
					self.element.simulate("mousemove", { clientX: x, clientY: y });
					self.lastX = null;
				}				
			}

			var after = function() {
				self.element.triggerHandler('mouseout');
				self.element.simulate("mouseup", { clientX: 0, clientY: 0 });
				testStop();
			}
			
			fakemouse
				.animate({ left: this.left, top: this.top }, this.options.speed, before)
				.animate({ left: this.left + dx, top: this.top + dy }, {
					speed: this.options.speed,
					easing: "swing",
					step: during
				})
				.animate({ left: this.left + dx, top: this.top + dy }, {
					speed: this.options.speed,
					easing: "swing",
					complete: after
				});
		
		}
	});

	$.ui.testMouse.defaults = {
		speed: "slow"
	}

})(jQuery);
