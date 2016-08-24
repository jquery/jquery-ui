/*!
 * jQuery UI Extension - Zoom @VERSION
 * https://github.com/GrayYoung/jQuery.UI.Extension
 *
 * Copyright Gray Young
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */


(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery', '../core', '../widget', '../position', '../effect', './draggable' ], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
	$.widget('ui.zoom', {
		version : '1.0.3',
		defaultElement : '<div />',
		options : {
			alwaysOn : false,
			center : true,
			extraClass : {
				frame : null,
				content : null,
				item : null
			},
			hide : {},
			height : null,
			position : {
				my : 'left top',
				at : 'right+30 top',
				collision : 'none'
			},
			preload : true,
			show : {},
			times : 0,
			type : 'standard',
			width : null,
			/* Callbacks */
			create : null
		},
		_type : {
			standard : true,
			inner : false,
			drag : false
		},
		_create : function() {
			var that = this;
			var options = that.options;
			
			this.zoomView = $('<div />').css({
				position : 'absolute',
				display : 'none',
				'overflow' : 'hidden'
			}).addClass('ui-zoom ui-widget-content').toggleClass(options.extraClass.frame, (options.extraClass.frame != null && options.extraClass.frame != ''));
			this.zoomImage = $('<img />').css({
				display : 'none',
				width : 'auto !important',
				height : 'auto !important'
			}).addClass('ui-zoom-content ui-widget-content').appendTo(this.zoomView);
			this.element.data('style.ui.zoom', this.element.attr('style'));			
			this.oimage = $('> img:first', this.element);
			this.oimage.data('style.ui.zoom', this.oimage.attr('style'));
			this.refresh();
		},
		_init : function() {
			var that = this;
			
			if(this.options.preload) {
				if(!this.zoomImage.data('loaded')) {
					var $loading = $('.ui-icon-loading', this.zoomView).size() < 1 ? $('<div class="ui-icon ui-icon-loading" />') : $('.ui-icon-loading', this.zoomView);
					
					this.zoomView.prepend($loading);
					this.zoomImage.load(function() {
						$loading.remove();
						$(this).show().data('loaded', true);
					});
				}
			} else {
				this.zoomImage.show();
			}
			this.element.not('.ui-zoom').addClass('ui-zoom').not('.ui-widget').addClass('ui-widget');
			for (u in this._type) {
				if (this.options.type === u) {
					this._type[u] = true;
					for (t in this._type) {
						if (t != u) {
							this._type[t] = false;
						}
					}

					break;
				}
			}

			if (this._type.standard) {
				this.zoomView.unbind('mouseover.ui.zoom mousemove.ui.zoom');
				if(this.cross) {
					this.cross.remove();
					this.cross = null;
				}
				this._zoomViewPosition();
				this.oimage.bind('mouseover.ui.zoom mousemove.ui.zoom', function(event) {
					that._zoom(event.pageX, event.pageY);
				});
			} else if (this._type.inner) {
				this.oimage.unbind('mouseover.ui.zoom mousemove.ui.zoom');
				if(this.cross) {
					this.cross.remove();
					this.cross = null;
				}
				this.zoomView.filter('.ui-front').removeClass('ui-front')
				this.zoomView.css({
					top : 0,
					left : 0,
					bottom : '',
					right : '',
					width : '100%',
					height : '100%'
				}).appendTo(this.element).bind('mouseover.ui.zoom mousemove.ui.zoom', function(event) {
					that._zoom(event.pageX, event.pageY);
				});
			} else if (this._type.drag) {
				this.oimage.unbind('mouseover.ui.zoom mousemove.ui.zoom');
				this.zoomView.unbind('mouseover.ui.zoom mousemove.ui.zoom');
				this._zoomViewPosition();
				if(!this.cross) {
					this.cross = $('<div />').addClass('ui-zoom-cross').appendTo(this.element).draggable({
						containment : 'parent',
						opacity : '0.35',
						drag : function(event, ui) {
							that._zoom(ui.offset.left + ui.helper.width() / 2, ui.offset.top + ui.helper.height() / 2);
						}
					}).css({
						position : 'absolute',
						display: 'none'
					});
				}
			}

			this.element.css({
				cursor : this._type.drag ? '' : 'crosshair'
			}).unbind('mouseover.ui.zoom').bind('mouseover.ui.zoom', function() {
				that._show(that.zoomView, that._type.inner ? null : that.options.show, function() {
					if(!that.zoomImage.attr('src')) {
						that.zoomImage.attr('src', that.element.attr('data-zoom-src'));
					}
					if (that.cross) {
						that.cross.show(0, function() {
							var $this = $(this);

							if(!that.cross.data('inited')) {
								$this.position({
									my : 'center center',
									at : 'center center',
									of : that.element,
									collision : 'none'
								});
								that.cross.data('inited', true);
							}
							that._zoom($this.offset().left + $this.width() / 2, $this.offset().top + $this.height() / 2);
						});
					}
					
					if(that.options.preload) {
						$('.ui-icon.ui-icon-loading', that.zoomView).position({
							my : 'center center',
							at : 'center center',
							of : that.zoomView,
							collision : 'none'
						});
					}
				});
			}).unbind('mouseleave.ui.zoom').bind('mouseleave.ui.zoom', function() {
				if (that.cross) {
					that.cross.hide();
				}
				if (!that.options.alwaysOn || that._type.inner) {
					that._hide(that.zoomView, that._type.inner ? null : that.options.hide);
				}
			});

			this._trigger('create');
		},
		_destroy : function() {
			this.element.filter('.ui-zoom').removeClass('ui-zoom').filter('.ui-widget').removeClass('ui-widget');
			if(this.element.data('style.ui.zoom')) {
				this.element.attr('style', this.element.data('style.ui.zoom'));
				this.element.removeData('style.ui.zoom');
			} else {
				this.element.removeAttr('style');
			}
			if(this.oimage.data('style.ui.zoom')) {
				this.oimage.attr('style', this.oimage.data('style.ui.zoom'));
				this.oimage.removeData('style.ui.zoom');
			} else {
				this.oimage.removeAttr('style');
			}
			this.zoomView.remove();
			if(this.cross) {
				this.cross.remove();
			}
		},
		_setOption : function(key, value) {
			this._super(key, value);

			if (key === 'width') {
				this.zoomView.width(value);
			}
			if (key === 'height') {
				this.zoomView.height(value);
			}
			if (key === 'center') {
				this._center();
			}
			if (key === 'alwaysOn' && !this._type.inner) {
				this.options.alwaysOn ? this._show(this.zoomView, this.options.show) : this._hide(this.zoomView, this.options.hide);
			}
		},
		refresh : function() {
			if(this.options.preload) {
				var $loading = $('.ui-icon-loading', this.zoomView).size() < 1 ? $('<div class="ui-icon ui-icon-loading" />') : $('.ui-icon-loading', this.zoomView);
					
				this.zoomView.prepend($loading);
				this.zoomImage.hide();
			}
			this.zoomImage.removeAttr('src');
			if(this.options.times !== 0) {
				this.zoomImage.css({
					width : this.oimage.width() * this.options.times,
					height : this.oimage.height() * this.options.times,
				});
			}
			this._center();
		},
		_center : function() {
			if (this.options.center) {
				this.oimage.position({
					my : 'center center',
					at : 'center center',
					of : this.element,
					collision : 'none'
				});
			} else {
				if(this.oimage.data('style.ui.zoom')) {
					this.oimage.attr('style', this.oimage.data('style.ui.zoom'));
					this.oimage.removeData('style.ui.zoom');
				} else {
					this.oimage.removeAttr('style');
				}
			}
		},
		_zoom : function(cx, cy) {
			var zw = this.zoomImage.width(), zh = this.zoomImage.height(), ow = this.oimage.width(), oh = this.oimage.height();
			var px = zw * ((cx - this.oimage.offset().left) / ow - 0.5), py = zh * ((cy - this.oimage.offset().top) / oh - 0.5);
			var pmx = px < 0 ? '+' : '-', pmy = py < 0 ? '+' : '-';
			px = Math.min(Math.abs(px), (zw - ow) / 2), py = Math.min(Math.abs(py), (zh - oh) / 2)

			this.zoomImage.position({
				my : 'center center',
				at : 'center' + pmx + px + ' center' + pmy + py,
				of : this.zoomView,
				collision : 'none'
			});
		},
		_zoomViewPosition : function() {
			this.zoomView.css({
				top : '',
				bottom : '',
				left : '',
				right : '',
				width : this.options.width ? this.options.width : this.element.width(),
				height : this.options.height ? this.options.height : this.element.height()
			}).appendTo('body').position($.extend({
				of : this.element
			}, this.options.position)).not('.ui-front').addClass('ui-front');
		}
	});
}));