/*
 * jQuery UI Color Picker
 *
 * Copyright (c) 2008 Stefan Petre, Paul Bakaus
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://docs.jquery.com/UI/ColorPicker
 *
 * Depends:
 *	ui.core.js
 */
(function ($) {

$.widget("ui.colorpicker", {
	
	init: function() {
		
		this.charMin = 65;
		var o = this.options, self = this,
		tpl = '<div class="ui-colorpicker clearfix"><div class="ui-colorpicker-color"><div><div></div></div></div><div class="ui-colorpicker-hue"><div></div></div><div class="ui-colorpicker-new-color"></div><div class="ui-colorpicker-current-color"></div><div class="ui-colorpicker-hex"><label for="ui-colorpicker-hex" title="hex">#</label><input type="text" maxlength="6" size="6" /></div><div class="ui-colorpicker-rgb-r ui-colorpicker-field"><label for="ui-colorpicker-rgb-r">R</label><input type="text" maxlength="3" size="3" /><span></span></div><div class="ui-colorpicker-rgb-g ui-colorpicker-field"><label for="ui-colorpicker-rgb-g">G</label><input type="text" maxlength="3" size="3" /><span></span></div><div class="ui-colorpicker-rgb-b ui-colorpicker-field"><label for="ui-colorpicker-rgb-b">B</label><input type="text" maxlength="3" size="3" /><span></span></div><div class="ui-colorpicker-hsb-h ui-colorpicker-field"><label for="ui-colorpicker-hsb-h">H</label><input type="text" maxlength="3" size="3" /><span></span></div><div class="ui-colorpicker-hsb-s ui-colorpicker-field"><label for="ui-colorpicker-hsb-s">S</label><input type="text" maxlength="3" size="3" /><span></span></div><div class="ui-colorpicker-hsb-b ui-colorpicker-field"><label for="ui-colorpicker-hsb-b">B</label><input type="text" maxlength="3" size="3" /><span></span></div><button class="ui-colorpicker-submit ui-default-state" name="submit" type="submit">Done</button></div>';

		if (typeof o.color == 'string') {
			this.color = this.HexToHSB(o.color);
		} else if (o.color.r != undefined && o.color.g != undefined && o.color.b != undefined) {
			this.color = this.RGBToHSB(o.color);
		} else if (o.color.h != undefined && o.color.s != undefined && o.color.b != undefined) {
			this.color = this.fixHSB(o.color);
		} else {
			return this;
		}
		
		this.origColor = this.color;
		this.picker = $(tpl);
				
		if (o.flat) {
			this.picker.appendTo(this.element).show();
		} else {
			this.picker.appendTo(document.body);
		}
				
		this.fields = this.picker.find('input')
						.bind('keydown', function(e) { return self.keyDown.call(self, e); })
						.bind('change', function(e) { return self.change.call(self, e); })
						.bind('blur', function(e) { return self.blur.call(self, e); })
						.bind('focus', function(e) { return self.focus.call(self, e); });
		
		this.picker.find('span').bind('mousedown', function(e) { return self.downIncrement.call(self, e); });
		
		this.selector = this.picker.find('div.ui-colorpicker-color').bind('mousedown', function(e) { return self.downSelector.call(self, e); });
		this.selectorIndic = this.selector.find('div div');
		this.hue = this.picker.find('div.ui-colorpicker-hue div');
		this.picker.find('div.ui-colorpicker-hue').bind('mousedown', function(e) { return self.downHue.call(self, e); });
				
		this.newColor = this.picker.find('div.ui-colorpicker-new-color');
		this.currentColor = this.picker.find('div.ui-colorpicker-current-color');
		
		this.picker.find('div.ui-colorpicker-submit')
			.bind('mouseenter', function(e) { return self.enterSubmit.call(self, e); })
			.bind('mouseleave', function(e) { return self.leaveSubmit.call(self, e); })
			.bind('click', function(e) { return self.clickSubmit.call(self, e); });
			
		this.fillRGBFields(this.color);
		this.fillHSBFields(this.color);
		this.fillHexFields(this.color);
		this.setHue(this.color);
		this.setSelector(this.color);
		this.setCurrentColor(this.color);
		this.setNewColor(this.color);
		
		if (o.flat) {
			this.picker.css({
				position: 'relative',
				display: 'block'
			});
		} else {
			$(this.element).bind(o.eventName+".colorpicker", function(e) { return self.show.call(self, e); });
		}

	},
	
	destroy: function() {
	
		this.picker.remove();
		this.element.removeData("colorpicker").unbind(".colorpicker");
		
	},
	
	fillRGBFields: function(hsb) {
		var rgb = this.HSBToRGB(hsb);
		this.fields
			.eq(1).val(rgb.r).end()
			.eq(2).val(rgb.g).end()
			.eq(3).val(rgb.b).end();
	},
	fillHSBFields: function(hsb) {
		this.fields
			.eq(4).val(hsb.h).end()
			.eq(5).val(hsb.s).end()
			.eq(6).val(hsb.b).end();
	},
	fillHexFields: function (hsb) {
		this.fields
			.eq(0).val(this.HSBToHex(hsb)).end();
	},
	setSelector: function(hsb) {
		this.selector.css('backgroundColor', '#' + this.HSBToHex({h: hsb.h, s: 100, b: 100}));
		this.selectorIndic.css({
			left: parseInt(150 * hsb.s/100, 10),
			top: parseInt(150 * (100-hsb.b)/100, 10)
		});
	},
	setHue: function(hsb) {
		this.hue.css('top', parseInt(150 - 150 * hsb.h/360, 10));
	},
	setCurrentColor: function(hsb) {
		this.currentColor.css('backgroundColor', '#' + this.HSBToHex(hsb));
	},
	setNewColor: function(hsb) {
		this.newColor.css('backgroundColor', '#' + this.HSBToHex(hsb));
	},
	keyDown: function(e) {
		var pressedKey = e.charCode || e.keyCode || -1;
		if ((pressedKey >= this.charMin && pressedKey <= 90) || pressedKey == 32) {
			return false;
		}
	},
	change: function(e, target) {
		
		var col;
		target = target || e.target;
		if (target.parentNode.className.indexOf('-hex') > 0) {
			this.color = col = this.HexToHSB(this.value);
			this.fillRGBFields(col.color);
			this.fillHSBFields(col);
		} else if (target.parentNode.className.indexOf('-hsb') > 0) {
			this.color = col = this.fixHSB({
				h: parseInt(this.fields.eq(4).val(), 10),
				s: parseInt(this.fields.eq(5).val(), 10),
				b: parseInt(this.fields.eq(6).val(), 10)
			});
			this.fillRGBFields(col);
			this.fillHexFields(col);
		} else {
			this.color = col = this.RGBToHSB(this.fixRGB({
				r: parseInt(this.fields.eq(1).val(), 10),
				g: parseInt(this.fields.eq(2).val(), 10),
				b: parseInt(this.fields.eq(3).val(), 10)
			}));
			this.fillHexFields(col);
			this.fillHSBFields(col);
		}
		this.setSelector(col);
		this.setHue(col);
		this.setNewColor(col);
		
		this.trigger('change', e, { options: this.options, hsb: col, hex: this.HSBToHex(col), rgb: this.HSBToRGB(col) });
	},
	blur: function(e) {
		
		var col = this.color;
		this.fillRGBFields(col);
		this.fillHSBFields(col);
		this.fillHexFields(col);
		this.setHue(col);
		this.setSelector(col);
		this.setNewColor(col);
		this.fields.parent().removeClass('ui-colorpicker-focus');
		
	},
	focus: function(e) {
		
		this.charMin = e.target.parentNode.className.indexOf('-hex') > 0 ? 70 : 65;
		this.fields.parent().removeClass('ui-colorpicker-focus');
		$(e.target.parentNode).addClass('ui-colorpicker-focus');
		
	},
	downIncrement: function(e) {
		
		var field = $(e.target).parent().find('input').focus(), self = this;
		this.currentIncrement = {
			el: $(e.target).parent().addClass('ui-colorpicker-slider'),
			max: e.target.parentNode.className.indexOf('-hsb-h') > 0 ? 360 : (e.target.parentNode.className.indexOf('-hsb') > 0 ? 100 : 255),
			y: e.pageY,
			field: field,
			val: parseInt(field.val(), 10)
		};
		$(document).bind('mouseup.cpSlider', function(e) { return self.upIncrement.call(self, e); });
		$(document).bind('mousemove.cpSlider', function(e) { return self.moveIncrement.call(self, e); });
		return false;
		
	},
	moveIncrement: function(e) {
		this.currentIncrement.field.val(Math.max(0, Math.min(this.currentIncrement.max, parseInt(this.currentIncrement.val + e.pageY - this.currentIncrement.y, 10))));
		this.change.apply(this, [e, this.currentIncrement.field.get(0)]);
		return false;
	},
	upIncrement: function(e) {
		this.currentIncrement.el.removeClass('ui-colorpicker-slider').find('input').focus();
		this.change.apply(this, [e, this.currentIncrement.field.get(0)]);
		$(document).unbind('mouseup.cpSlider');
		$(document).unbind('mousemove.cpSlider');
		return false;
	},
	downHue: function(e) {
		
		this.currentHue = {
			y: this.picker.find('div.ui-colorpicker-hue').offset().top
		};
		
		this.change.apply(this, [e, this
				.fields
				.eq(4)
				.val(parseInt(360*(150 - Math.max(0,Math.min(150,(e.pageY - this.currentHue.y))))/150, 10))
				.get(0)]);

		var self = this;
		$(document).bind('mouseup.cpSlider', function(e) { return self.upHue.call(self, e); });
		$(document).bind('mousemove.cpSlider', function(e) { return self.moveHue.call(self, e); });
		return false;
		
	},
	moveHue: function(e) {
		
		this.change.apply(this, [e, this
				.fields
				.eq(4)
				.val(parseInt(360*(150 - Math.max(0,Math.min(150,(e.pageY - this.currentHue.y))))/150, 10))
				.get(0)]);

		return false;
		
	},
	upHue: function(e) {
		$(document).unbind('mouseup.cpSlider');
		$(document).unbind('mousemove.cpSlider');
		return false;
	},
	downSelector: function(e) {
		
		var self = this;
		this.currentSelector = {
			pos: this.picker.find('div.ui-colorpicker-color').offset()
		};
				
		this.change.apply(this, [e, this
				.fields
				.eq(6)
				.val(parseInt(100*(150 - Math.max(0,Math.min(150,(e.pageY - this.currentSelector.pos.top))))/150, 10))
				.end()
				.eq(5)
				.val(parseInt(100*(Math.max(0,Math.min(150,(e.pageX - this.currentSelector.pos.left))))/150, 10))
				.get(0)
		]);
		$(document).bind('mouseup.cpSlider', function(e) { return self.upSelector.call(self, e); });
		$(document).bind('mousemove.cpSlider', function(e) { return self.moveSelector.call(self, e); });
		return false;
		
	},
	moveSelector: function(e) {
		
		this.change.apply(this, [e, this
				.fields
				.eq(6)
				.val(parseInt(100*(150 - Math.max(0,Math.min(150,(e.pageY - this.currentSelector.pos.top))))/150, 10))
				.end()
				.eq(5)
				.val(parseInt(100*(Math.max(0,Math.min(150,(e.pageX - this.currentSelector.pos.left))))/150, 10))
				.get(0)
		]);
		return false;
		
	},
	upSelector: function(e) {
		$(document).unbind('mouseup.cpSlider');
		$(document).unbind('mousemove.cpSlider');
		return false;
	},
	enterSubmit: function(e) {
		this.picker.find('div.ui-colorpicker-submit').addClass('ui-colorpicker-focus');
	},
	leaveSubmit: function(e) {
		this.picker.find('div.ui-colorpicker-submit').removeClass('ui-colorpicker-focus');
	},
	clickSubmit: function(e) {
		
		var col = this.color;
		this.origColor = col;
		this.setCurrentColor(col);
		
		this.trigger("submit", e, { options: this.options, hsb: col, hex: this.HSBToHex(col), rgb: this.HSBToRGB(col) });
		return false;
		
	},
	show: function(e) {
		
		this.trigger("beforeShow", e, { options: this.options, hsb: this.color, hex: this.HSBToHex(this.color), rgb: this.HSBToRGB(this.color) });
		
		var pos = this.element.offset();
		var viewPort = this.getScroll();
		var top = pos.top + this.element[0].offsetHeight;
		var left = pos.left;
		if (top + 176 > viewPort.t + Math.min(viewPort.h,viewPort.ih)) {
			top -= this.element[0].offsetHeight + 176;
		}
		if (left + 356 > viewPort.l + Math.min(viewPort.w,viewPort.iw)) {
			left -= 356;
		}
		this.picker.css({left: left + 'px', top: top + 'px'});
		if (this.trigger("show", e, { options: this.options, hsb: this.color, hex: this.HSBToHex(this.color), rgb: this.HSBToRGB(this.color) }) != false) {
			this.picker.show();
		}
		
		var self = this;
		$(document).bind('mousedown.colorpicker', function(e) { return self.hide.call(self, e); });
		return false;
		
	},
	hide: function(e) {
		
		if (!this.isChildOf(this.picker[0], e.target, this.picker[0])) {
			if (this.trigger("hide", e, { options: this.options, hsb: this.color, hex: this.HSBToHex(this.color), rgb: this.HSBToRGB(this.color) }) != false) {
				this.picker.hide();
			}
			$(document).unbind('mousedown.colorpicker');
		}
		
	},
	isChildOf: function(parentEl, el, container) {
		if (parentEl == el) {
			return true;
		}
		if (parentEl.contains && !$.browser.safari) {
			return parentEl.contains(el);
		}
		if ( parentEl.compareDocumentPosition ) {
			return !!(parentEl.compareDocumentPosition(el) & 16);
		}
		var prEl = el.parentNode;
		while(prEl && prEl != container) {
			if (prEl == parentEl)
				return true;
			prEl = prEl.parentNode;
		}
		return false;
	},
	getScroll: function() {
		var t,l,w,h,iw,ih;
		if (document.documentElement) {
			t = document.documentElement.scrollTop;
			l = document.documentElement.scrollLeft;
			w = document.documentElement.scrollWidth;
			h = document.documentElement.scrollHeight;
		} else {
			t = document.body.scrollTop;
			l = document.body.scrollLeft;
			w = document.body.scrollWidth;
			h = document.body.scrollHeight;
		}
		iw = self.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
		ih = self.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;
		return { t: t, l: l, w: w, h: h, iw: iw, ih: ih };
	},
	fixHSB: function(hsb) {
		return {
			h: Math.min(360, Math.max(0, hsb.h)),
			s: Math.min(100, Math.max(0, hsb.s)),
			b: Math.min(100, Math.max(0, hsb.b))
		};
	}, 
	fixRGB: function(rgb) {
		return {
			r: Math.min(255, Math.max(0, rgb.r)),
			g: Math.min(255, Math.max(0, rgb.g)),
			b: Math.min(255, Math.max(0, rgb.b))
		};
	}, 
	HexToRGB: function (hex) {
		var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
		return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
	},
	HexToHSB: function(hex) {
		return this.RGBToHSB(this.HexToRGB(hex));
	},
	RGBToHSB: function(rgb) {
		var hsb = {};
		hsb.b = Math.max(Math.max(rgb.r,rgb.g),rgb.b);
		hsb.s = (hsb.b <= 0) ? 0 : Math.round(100*(hsb.b - Math.min(Math.min(rgb.r,rgb.g),rgb.b))/hsb.b);
		hsb.b = Math.round((hsb.b /255)*100);
		if((rgb.r==rgb.g) && (rgb.g==rgb.b)) hsb.h = 0;
		else if(rgb.r>=rgb.g && rgb.g>=rgb.b) hsb.h = 60*(rgb.g-rgb.b)/(rgb.r-rgb.b);
		else if(rgb.g>=rgb.r && rgb.r>=rgb.b) hsb.h = 60  + 60*(rgb.g-rgb.r)/(rgb.g-rgb.b);
		else if(rgb.g>=rgb.b && rgb.b>=rgb.r) hsb.h = 120 + 60*(rgb.b-rgb.r)/(rgb.g-rgb.r);
		else if(rgb.b>=rgb.g && rgb.g>=rgb.r) hsb.h = 180 + 60*(rgb.b-rgb.g)/(rgb.b-rgb.r);
		else if(rgb.b>=rgb.r && rgb.r>=rgb.g) hsb.h = 240 + 60*(rgb.r-rgb.g)/(rgb.b-rgb.g);
		else if(rgb.r>=rgb.b && rgb.b>=rgb.g) hsb.h = 300 + 60*(rgb.r-rgb.b)/(rgb.r-rgb.g);
		else hsb.h = 0;
		hsb.h = Math.round(hsb.h);
		return hsb;
	},
	HSBToRGB: function(hsb) {
		var rgb = {};
		var h = Math.round(hsb.h);
		var s = Math.round(hsb.s*255/100);
		var v = Math.round(hsb.b*255/100);
		if(s == 0) {
			rgb.r = rgb.g = rgb.b = v;
		} else {
			var t1 = v;
			var t2 = (255-s)*v/255;
			var t3 = (t1-t2)*(h%60)/60;
			if(h==360) h = 0;
			if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3;}
			else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3;}
			else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3;}
			else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3;}
			else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3;}
			else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3;}
			else {rgb.r=0; rgb.g=0;	rgb.b=0;}
		}
		return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
	},
	RGBToHex: function(rgb) {
		var hex = [
			rgb.r.toString(16),
			rgb.g.toString(16),
			rgb.b.toString(16)
		];
		$.each(hex, function (nr, val) {
			if (val.length == 1) {
				hex[nr] = '0' + val;
			}
		});
		return hex.join('');
	},
	HSBToHex: function(hsb) {
		return this.RGBToHex(this.HSBToRGB(hsb));
	},
	setColor: function(col) {
		if (typeof col == 'string') {
			col = this.HexToHSB(col);
		} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
			col = this.RGBToHSB(col);
		} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
			col = this.fixHSB(col);
		} else {
			return this;
		}

		this.color = col;
		this.origColor = col;
		this.fillRGBFields(col);
		this.fillHSBFields(col);
		this.fillHexFields(col);
		this.setHue(col);
		this.setSelector(col);
		this.setCurrentColor(col);
		this.setNewColor(col);

	}
	
});

$.extend($.ui.colorpicker, {
	defaults: {
		eventName: 'click',
		color: 'ff0000',
		flat: false
	}
});

})(jQuery);