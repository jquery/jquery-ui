(function($) {

	$.widget("ui.magnifier", {
		init: function() {

			var self = this, o = this.options;
			this.items = [];
			this.element.addClass("ui-magnifier");
			if(!(/^(r|a)/).test(this.element.css("position"))) this.element.css("position", "relative");
			
			this.pp = this.element.offset();
			
			$(o.items, this.element).each(function() {

				self.items.push([
					this,
					$(this).offset(),
					[$(this).width(),$(this).height()],
					(o.overlap ? $(this).position() : null)
				]);

				if(o.opacity)
					$(this).css('opacity', o.opacity.min);

			});
		
			if(o.overlap) {
				for(var i=0;i<this.items.length;i++) {
					//Absolutize
					$(this.items[i][0]).css({
						position: "absolute",
						top: this.items[i][3].top,
						left: this.items[i][3].left
					});
				};
			}
			
			this.identifier = ++$.ui.magnifier.counter;
			$(document).bind("mousemove.magnifier"+this.identifier, function(e) {
				if(!self.disabled) self.magnify.apply(self, [e]);
			});
			
			if(o.click) {
				this.element.bind('click.magnifier', function(e) {
					if(!self.disabled) o.click.apply(this, [e, { options: self.options, current: self.current[0], currentOffset: self.current[1] }]);
				});
			}

		},
		
		
		destroy: function() {
			this.reset();
			this.element
				.removeClass("ui-magnifier")
				.removeClass("ui-magnifier-disabled")
				.unbind(".magnifier");
			$(document).unbind("mousemove.magnifier"+this.identifier);
		},
		disable: function() {
			this.reset();
			this.element.addClass("ui-magnifier-disabled");
			this.options.disabled = true;
		},
		reset: function(e) {
			
			var o = this.options, c, distance = 1;
			
			for(var i=0; i < this.items.length; i++) {
	
				c = this.items[i];
				
				$(c[0]).css({
					width: c[2][0],
					height: c[2][1],
					top: (c[3] ? c[3].top : 0),
					left: (c[3] ? c[3].left : 0)
				});
				
				if(o.opacity)
					$(c[0]).css('opacity', o.opacity.min);
					
				if(o.zIndex)
					$(c[0]).css("z-index", "");
				
			}

		},
		magnify: function(e) {
			
			var p = [e.pageX,e.pageY], o = this.options, c, distance = 1;
			this.current = this.items[0];
	
			//Compute the parents distance, because we don't need to fire anything if we are not near the parent
			var overlap = ((p[0] > this.pp.left-o.distance && p[0] < this.pp.left + this.element[0].offsetWidth + o.distance) && (p[1] > this.pp.top-o.distance && p[1] < this.pp.top + this.element[0].offsetHeight + o.distance));
			if(!overlap) return false;
				
			for(var i=0;i<this.items.length;i++) {
				
				c = this.items[i];
				
				var olddistance = distance;
				if(!o.axis) {
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
				
				if(distance < o.distance) {
	
					this.current = distance < olddistance ? this.items[i] : this.current;
					
					if(!o.axis || o.axis != "y") {
						$(c[0]).css({
							width: c[2][0]+ (c[2][0] * (o.magnification-1)) - (((distance/o.distance)*c[2][0]) * (o.magnification-1)),
							left: (c[3] ? (c[3].left + o.verticalLine * ((c[2][1] * (o.magnification-1)) - (((distance/o.distance)*c[2][1]) * (o.magnification-1)))) : 0)
						});
					}
					
					if(!o.axis || o.axis != "x") {
						$(c[0]).css({
							height: c[2][1]+ (c[2][1] * (o.magnification-1)) - (((distance/o.distance)*c[2][1]) * (o.magnification-1)),
							top: (c[3] ? c[3].top : 0) + (o.baseline-0.5) * ((c[2][0] * (o.magnification-1)) - (((distance/o.distance)*c[2][0]) * (o.magnification-1)))
						});					
					}
					
					if(o.opacity)
						$(c[0]).css('opacity', o.opacity.max-(distance/o.distance) < o.opacity.min ? o.opacity.min : o.opacity.max-(distance/o.distance));
					
				} else {
					
					$(c[0]).css({
						width: c[2][0],
						height: c[2][1],
						top: (c[3] ? c[3].top : 0),
						left: (c[3] ? c[3].left : 0)
					});
					
					if(o.opacity)
						$(c[0]).css('opacity', o.opacity.min);
								
				}
				
				if(o.zIndex)
					$(c[0]).css("z-index", "");
	
			}
			
			if(this.options.zIndex)
				$(this.current[0]).css("z-index", this.options.zIndex);
			
		}		
		
		
	});
	
	$.extend($.ui.magnifier, {
		counter: 0,
		defaults: {
			distance: 150,
			magnification: 2,
			baseline: 0,
			verticalLine: -0.5,
			items: "> *"
		}	
	});

})(jQuery);
