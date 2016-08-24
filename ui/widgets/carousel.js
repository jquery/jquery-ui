/*!
 * jQuery UI Extendtion - Elements 1.0.6
 * https://github.com/GrayYoung/jQuery.UI.Extension
 *
 * Copyright Gray Young
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */


(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery', '../core', '../widget', '../effect', './button' ], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
	return $.widget('ui.carousel', {
		version : '1.0.3',
		defaultElement : '<ol />',
		options : {
			active : -1,
			easing : 'swing',
			extraClass : {
				frame : null,
				content : null,
				item : null
			},
			height : 'auto',
			items : '> *',
			keepButtons : false,
			orientation : 'horizontal',
			speed : 'normal',
			width : 'auto',
			// callbacks
			select : null
		},
		_orientation : [ 'horizontal', 'vertical' ],
		_create : function() {
			var that = this;
			var options = this.options;
			var buttons = options.buttons;

			this.element.data({
				oClass : this.element.attr('class'),
				oStyle : this.element.attr('style')
			});
			if ($.inArray(options.orientation, that._orientation) < 0) {
				options.orientation = that._orientation[0];
			}
			this.uiFrame = $('<div />').insertAfter(this.element);
			this.uiFrame.css({
				'overflow' : 'hidden'
			}).wrapAll($('<div />').addClass('ui-carousel ui-widget').toggleClass(options.extraClass.frame, (options.extraClass.frame != null && options.extraClass.frame != '')).attr({
				role : 'carousel'
			})).append(this.element.addClass('ui-carousel-content')).addClass('ui-widget-content ui-corner-all').toggleClass(options.extraClass.content, (options.extraClass.content != null && options.extraClass.content != ''));
			this._on({
				'click .ui-carousel-item' : function(event) {
					this.active = $(event.target).closest('.ui-carousel-item');
					var ui = {
						item : this.active
					};
					this.active.addClass('ui-state-active').siblings('.ui-state-active').removeClass('ui-state-active');
					this._trigger('select', event, ui);
				}
			});
			this.btnPrev = $('<a>Prev</a>').button({
				text : false
			}).addClass('ui-role-prev');
			this.btnNext = $('<a>Next</a>').button({
				text : false
			}).addClass('ui-role-next');
			this.btnNext.add(this.btnPrev).attr({
				tabIndex : 1
			}).click(function(event) {
				if ($(this).is(that.btnPrev)) {
					that.previous(event);
				} else if ($(this).is(that.btnNext)) {
					that.next(event);
				}
			});
		},
		_init : function() {
			this.refresh();
		},
		_buttons : function() {
			var isHoriz = (this.options.orientation === this._orientation[0]);
			
			this.btnPrev.button('option', {
				disabled : true,
				icons : {
					primary : isHoriz ? 'ui-icon-carat-1-w' : 'ui-icon-carat-1-n'
				}
			});
			this.btnNext.button('option', {
				disabled : false,
				icons : {
					primary : isHoriz ? 'ui-icon-carat-1-e' : 'ui-icon-carat-1-s'
				}
			});
		},
		_inprogress : function() {
			var that = this;
			
			this.uiFrame.parent('.ui-carousel').toggleClass(function() {
				return 'ui-' + that._orientation[0];
			}, this.options.orientation === this._orientation[0]).toggleClass(function() {
				return 'ui-' + that._orientation[1];
			}, this.options.orientation === this._orientation[1]);
		},
		refresh : function() {
			var carousel = this.element, items;

			items = carousel.find(this.options.items);
			items.not('.ui-carousel-item').addClass('ui-carousel-item').attr({
				tabIndex : 1
			});
			this._setOption('active', this.options.active);
			this._inprogress();
			this._buttons();
			this._calculate();
		},
		_calculate : function() {
			if (this.options.orientation === this._orientation[0]) {
				var twidth = 0;

				this.element.children('.ui-carousel-item').each(function() {
					twidth += $(this).outerWidth(true);
				});
				this.element.css({
					width : Math.ceil(twidth),
					top : 'auto',
					left : 0
				});
			} else if (this.options.orientation === this._orientation[1]) {
				this.element.css({
					width : 'auto',
					top : 0,
					left : 0
				});
			}
			if (this.options.keepButtons) {
				this.btnPrev.insertBefore(this.uiFrame);
				this.btnNext.insertAfter(this.uiFrame);
			} 
			var pWidth = this.options.width !== 'auto' ? this.options.width : this.uiFrame.parent().parent().width(), pHeight = this.options.height !== 'auto' ? this.options.height : this.uiFrame.parent().height();
			if ((pWidth < this.element.width() && this.options.orientation === this._orientation[0]) || (pHeight < this.element.height() && this.options.orientation === this._orientation[1])) {
				if(!this.options.keepButtons){
					this.btnPrev.insertBefore(this.uiFrame);
					this.btnNext.insertAfter(this.uiFrame);
				}
			} else {
				this.btnNext.button('option', {
					disbled : true
				});
				if(this.options.keepButtons){
					/*this.btnPrev.add(this.btnNext).button('option', {
						disabled : true
					});*/
				} else {
					this.btnPrev.add(this.btnNext).detach();
				}
			}
			this._wh(true, this.options.width);
			this._wh(false, this.options.height);
		},
		_destroy : function() {
			if(!this.element.data('oStyle')) {
				this.element.removeAttr('style');
			} else {
				this.element.attr('style', this.element.data('oStyle'));
			}
			this.element.removeClass().addClass(this.element.data('oClass')).children('.ui-carousel-item').removeClass('ui-carousel-item ui-state-active');
			this.element.removeData([ 'oClass', 'oStyle' ]);
			this.btnPrev.add(this.btnNext).remove();
			this.element.insertBefore(this.uiFrame.parent());
			this.uiFrame.parent().andSelf().remove();
		},
		_setOption : function(key, value) {
			this._super(key, value);

			if (key === 'active') {
				if(value > -1) {
					this.element.find('.ui-carousel-item').eq(value).click();
				}
			}
		},
		_wh : function(w, value) {
			if(w) {
				var val = 0;

				if (this.options.orientation === this._orientation[0]) {
					val = this.uiFrame.parent().width(value === 'auto' ? this.uiFrame.parent().parent().width() : value).width();
					this.uiFrame.width(Math.floor(val - (this.uiFrame.outerWidth(true) - this.uiFrame.width())));
				} else {
					val = this.uiFrame.parent().width(value === 'auto' ? this.element.children().outerWidth(true) + this.uiFrame.outerWidth(true) - this.uiFrame.innerWidth() : value);
					this.uiFrame.css({
						width : ''
					});
				}
			} else {
				var val = this.uiFrame.parent().height(value).height();

				if(value === 'auto') {
					this.uiFrame.css({
						height : ''
					});
				} else {			
					this.uiFrame.height(Math.floor(val - (this.uiFrame.outerHeight(true) - this.uiFrame.height())));
				}
			}
		},
		previous : function(event) {
			this._move(event, 'prev');
		},
		next : function(event) {
			this._move(event, 'next');
		},
		_move : function(event, direction) {	
			var cssOptions = {};
			var moveStep = 1, distance = 0, gap = 0;
			var $standardItem = this.element.find('.ui-carousel-item:eq(1)');
			
			if($standardItem.length < 1) {
				$standardItem = this.element.find('.ui-carousel-item:first');
			}
			if (this.options.orientation === this._orientation[1]) {
				distance = parseInt(this.element.css('top'), 10);
				moveStep = $standardItem.outerHeight(true);
				gap = this.uiFrame.height() - this.element.height();
			} else if (this.options.orientation === this._orientation[0]) {
				distance = parseInt(this.element.css('left'), 10);
				moveStep = $standardItem.outerWidth(true);
				gap = this.uiFrame.width() - this.element.width();
			}
			distance = direction === 'prev' ? distance + moveStep : direction === 'next' ? distance - moveStep : 0;
			if (Math.abs(distance) > Math.abs(gap)) {
				distance = gap;
				this.btnNext.button('option', {
					disabled : true
				});
			} else {
				this.btnNext.button('option', {
					disabled : false
				});
			}
			if (this.options.orientation === this._orientation[0]) {
				if(-distance > this.element.width()) {
					distance = -(this.element.width() + distance)
				}
			} else {
				if(-distance > this.element.height()) {
					distance = -(this.element.height() + distance)
				}
			}
			if (distance > 0) {
				distance = 0;
				this.btnPrev.button('option', {
					disabled : true
				});
			} else {
				this.btnPrev.button('option', {
					disabled : false
				});
			}
			if (this.options.orientation === this._orientation[0]) {
				cssOptions.left = distance;
			} else {
				cssOptions.top = distance;
			}
			this.element.stop(false, true).animate(cssOptions, this.options.speed, this.options.easing);
		}
	});
}));