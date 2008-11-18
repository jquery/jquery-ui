$(document).ready(function() {

	// link demos

	$(".demoflow div.wrapper").click(function() {

		var demo = $(this).children('img').attr('_demo');

		if (demo) {
			location.href = '/repository/real-world/' + demo;
		}else {
			//alert('Under construction!');
		}

	});

	if ($("div.demoflow").size()) {

		var inst = new $.ui.carousel($("div.demoflow")[0], { height: 200, width: 310 });

		$("div.demoflow-button-left, div.demoflow-button-right").bind("mousedown", function() {
			var right = this.className.indexOf("right") == -1;
			if(inst.autoRotator) window.clearInterval(inst.autoRotator);
			inst.timer = window.setInterval(function() { inst.rotate(right ? "right" : null); }, 13);
		})
		.bind("mouseup", function() {
			window.clearInterval(inst.timer);
		});

		$('.demoflow div.shadow').hover(function() {
			this._lastopacity = $(this).css('opacity');
			$(this).stop().animate({opacity: 0 }, 300); 
		}, function() {
			$(this).stop().animate({opacity: this._lastopacity }, 300);
		});


		window.setTimeout(function() {
			inst.element.animate({ opacity: 1 },2000); inst.rotate(0,2000,0.45);
			window.setTimeout(function() {
				inst.autoRotator = window.setInterval(function() { inst.rotate(0,2000,0.45); },5000);
			},3000);
		},0);

	}

	$('a').click(function(){
		this.blur();
	});

	// smooth hover effects by DragonInteractive
	var hover = hoverEffects();
	hover.init();

});

	$.ui.carousel = function(element, options) {

		this.element = $(element);
		this.options = $.extend({}, options);
		var self = this;

		$.extend(this, {
			start: Math.PI/2,
			step: 2*Math.PI/$("> *", this.element).length,
			radiusX: 400,
			radiusY: -45,
			paddingX: this.element.outerWidth() / 2,
			paddingY: this.element.outerHeight() / 2
		});

		$("> *", this.element).css({ position: "absolute", top: 0, left: 0, zIndex: 1 });
		this.rotate();
		this.rotate("right");

		this.element.parent().bind("mousewheel", function(event ,delta) {
			if(self.autoRotator) window.clearInterval(self.autoRotator);
			self.rotate(delta < 0 ? "right" : "left");
			return false;
		});

	};

	$.ui.carousel.prototype.rotate = function(d,ani,speed) {

		this.start = this.start + (d == "right" ? -(speed || 0.03) : (speed || 0.03));
		var o = this.options;
		var self = this;

		setTimeout(function(){
			$("> *", self.element).each(function(i) {
				var angle = self.start + i * self.step;
				var x = self.radiusX * Math.cos(angle);
				var y = self.radiusY * Math.sin(angle);
				var _self = this;

				var width = o.width * ((self.radiusY+y) / (2 * self.radiusY));
				width = (width * width * width) / (o.width * o.width); //This makes the pieces smaller
				var height = parseInt(width * o.height / o.width);

				//This is highly custom - it will hide the elements at the back
				$(_self).css({ visibility: height < 30 ? "hidden" : "visible" });
				if(height < 30 && !ani) return; //This imrpoves the speed, but cannot be used with animation


				if(ani) {
					$(_self).animate({
						top: Math.round(self.paddingY + y - height/2) + "px",
						left: Math.round(self.paddingX + x - width/2) + "px",
						width: Math.round(width) + "px",
						height: Math.round(height) + "px"
					},{ duration: ani, easing: "easeOutQuad" });
				$(_self).css({ zIndex: Math.round(parseInt(100 * (self.radiusY+y) / (2 * self.radiusY))) });
				} else {
					$(_self).css({
						top: self.paddingY + y - height/2 + "px",
						left: self.paddingX + x - width/2 + "px",
						width: width + "px",
						height: height + "px",
						zIndex: parseInt(100 * (self.radiusY+y) / (2 * self.radiusY))
					});
				}

				$("div.shadow",_self).css({ opacity: 1 - (width / o.width) });

			});
		}, 0);
	}


/**
 * All credit here goes to DragonInteractive and Yuri Vishnevsky
 */
var hoverEffects = function() {
	var me = this;
	var args = arguments;
	var self = {
		c: {
			navItems: '.download .click-to-download, #launch-pad .launch-pad-button, div.demoflow-button-left, div.demoflow-button-right',
			navSpeed: ($.browser.safari ? 600: 350),
			snOpeningSpeed: ($.browser.safari ? 400: 250),
			snOpeningTimeout: 150,
			snClosingSpeed: function() {
				if (self.subnavHovered()) return 123450;
				return 150
			},
			snClosingTimeout: 700
		},
		init: function() {
			//$('.bg', this.c.navItems).css({
			//	'opacity': 0
			//});
			this.initHoverFades()
		},
		subnavHovered: function() {
			var hovered = false;
			$(self.c.navItems).each(function() {
				if (this.hovered) hovered = true
			});
			return hovered
		},
		initHoverFades: function() {
			//$('#navigation .bg').css('opacity', 0);
			$(self.c.navItems).hover(function() {
				self.fadeNavIn.apply(this)
			},
			function() {
				var el = this;
				setTimeout(function() {
					if (!el.open) self.fadeNavOut.apply(el)
				},
				10)
			})
		},
		fadeNavIn: function() {
			$('.bg', this).stop().animate({
				'opacity': 1
			},
			self.c.navSpeed)
		},
		fadeNavOut: function() {
			$('.bg', this).stop().animate({
				'opacity': 0
			},
			self.c.navSpeed)
		},
		initSubmenus: function() {
			$(this.c.navItems).hover(function() {
				$(self.c.navItems).not(this).each(function() {
					self.fadeNavOut.apply(this);
				});
				this.hovered = true;
				var el = this;
				self.fadeNavIn.apply(el);
			},
			function() {
				this.hovered = false;
				var el = this;
				if (!el.open) self.fadeNavOut.apply(el);
			})
		}
	};

	return self;
};