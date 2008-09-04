/*
 * jQuery UI Magnifier @VERSION
 *
 * Copyright (c) 2008 jQuery
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Magnifier
 *
 * Depends:
 *  ui.core.js
 */
(function($) {

var counter = 0;

$.widget("ui.magnifier", {
	_init: function() {
		var self = this,
			o = this.options;
		
		this.element
			.addClass("ui-magnifier")
			.bind('click.magnifier', function(e) {
				(!self.disabled && o.click && o.click.apply(this, [e, {
					options: self.options,
					current: self.current[0],
					currentOffset: self.current[1]
				}]));
			});
		
		// the element must have relative or absolute positioning
		if (!(/^(r|a)/).test(this.element.css("position"))) {
			this.element.css("position", "relative");
		}
		
		this.items = [];
		this.element.find(o.items).each(function() {
			var $this = $(this);
			// TODO: use a hash so references to this data is readable
			self.items.push([
				this,
				$this.offset(),
				[$this.width(),$this.height()],
				(o.overlap ? $this.position() : null)
			]);
			
			(o.opacity && $this.css('opacity', o.opacity.min));
		});
		
		// absolutize
		(o.overlap && $.each(this.items, function() {
			$(this[0]).css({
				position: "absolute",
				top: this[3].top,
				left: this[3].left
			});
		}));
		
		this.identifier = ++counter;
		$(document).bind("mousemove.magnifier"+this.identifier, function(e) {
			(self.disabled || self._magnify.apply(self, [e]));
		});
		
		this.pp = this.element.offset();
	},
	
	destroy: function() {
		this.reset();
		this.element
			.removeClass("ui-magnifier ui-magnifier-disabled")
			.unbind(".magnifier");
		$(document).unbind("mousemove.magnifier"+this.identifier);
	},
	
	disable: function() {
		this.reset();
		$.widget.prototype.disable.apply(this, arguments);
	},
	
	reset: function(e) {
		var o = this.options;
		
		$.each(this.items, function() {
			var item = this;
			$(item[0]).css({
				width: item[2][0],
				height: item[2][1],
				top: (item[3] ? item[3].top : 0),
				left: (item[3] ? item[3].left : 0)
			});
			
			(o.opacity && $(item[0]).css('opacity', o.opacity.min));
			(o.zIndex && $(item[0]).css("z-index", ""));
		});
	},
	
	_magnify: function(e) {
		var p = [e.pageX,e.pageY], o = this.options, c, distance = 1;
		this.current = this.items[0];
		
		// Compute the parent's distance
		// we don't need to fire anything if we are not near the parent
		var overlap = ((p[0] > this.pp.left-o.distance) &&
			(p[0] < this.pp.left + this.element[0].offsetWidth + o.distance) &&
			(p[1] > this.pp.top-o.distance) &&
			(p[1] < this.pp.top + this.element[0].offsetHeight + o.distance));
		if (!overlap) { return false; }
		
		for (var i=0; i<this.items.length; i++) {
			c = this.items[i];
			
			var olddistance = distance;
			if (!o.axis) {
				distance = Math.sqrt(
					  Math.pow(p[0] - ((c[3] ? this.pp.left : c[1].left) + parseInt(c[0].style.left,10)) - (c[0].offsetWidth/2), 2)
					+ Math.pow(p[1] - ((c[3] ? this.pp.top  : c[1].top ) + parseInt(c[0].style.top,10)) - (c[0].offsetHeight/2), 2)
				);
			} else {
				if(o.axis == "y") {
					distance = Math.abs(p[1] - ((c[3] ? this.pp.top  : c[1].top ) + parseInt(c[0].style.top,10)) - (c[0].offsetHeight/2));
				} else {
					distance = Math.abs(p[0] - ((c[3] ? this.pp.left : c[1].left) + parseInt(c[0].style.left,10)) - (c[0].offsetWidth/2));
				}
			}
			
			if (distance < o.distance) {
				this.current = distance < olddistance ? c : this.current;
				
				if (!o.axis || o.axis != "y") {
					$(c[0]).css({
						width: c[2][0]+ (c[2][0] * (o.magnification-1)) - (((distance/o.distance)*c[2][0]) * (o.magnification-1)),
						left: (c[3] ? (c[3].left + o.verticalLine * ((c[2][1] * (o.magnification-1)) - (((distance/o.distance)*c[2][1]) * (o.magnification-1)))) : 0)
					});
				}
				
				if (!o.axis || o.axis != "x") {
					$(c[0]).css({
						height: c[2][1]+ (c[2][1] * (o.magnification-1)) - (((distance/o.distance)*c[2][1]) * (o.magnification-1)),
						top: (c[3] ? c[3].top : 0) + (o.baseline-0.5) * ((c[2][0] * (o.magnification-1)) - (((distance/o.distance)*c[2][0]) * (o.magnification-1)))
					});
				}
				
				if (o.opacity) {
					$(c[0]).css('opacity', o.opacity.max-(distance/o.distance) < o.opacity.min ? o.opacity.min : o.opacity.max-(distance/o.distance));
				}
			} else {
				$(c[0]).css({
					width: c[2][0],
					height: c[2][1],
					top: (c[3] ? c[3].top : 0),
					left: (c[3] ? c[3].left : 0)
				});
				
				(o.opacity && $(c[0]).css('opacity', o.opacity.min));
			}
			
			(o.zIndex && $(c[0]).css("z-index", ""));
		}
		
		(o.zIndex && $(this.current[0]).css("z-index", o.zIndex));
	}
});

$.extend($.ui.magnifier, {
	defaults: {
		distance: 150,
		magnification: 2,
		baseline: 0,
		verticalLine: -0.5,
		items: "> *"
	}
});

})(jQuery);
