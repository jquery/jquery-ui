/*!
 * jQuery UI Extendtion - Endless Scroll @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Endless Scroll
//>>group: Widgets
// jscs:disable maximumLineLength
//>>description: Displays a status indicator for loading state, standard percentage, and other progress indicators.
// jscs:enable maximumLineLength
//>>docs: http://api.jqueryui.com/endlessscroll/
//>>demos: http://jqueryui.com/endlessscroll/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../version",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

return $.widget( "ui.endlessscroll", {
	version: "@VERSION",
	defaultElement: '.ui-endlessscroll',
	options: {
		items: '> *',
		directions: 'top bottom',
		loader: '<div>Loading</div>',
		disableURL: false,
		param: 'page',
		source: null,

		// Callbacks
		response: null,
		scroll: null,
		stop: null,
		end: null
	},

	_create: function() {
		var _this = this, $document = this.document;

		if(this.options.loader instanceof $) {
			this._$loader = this.options.loader;
		} else if(typeof this.options.loader === 'string') {
			this._$loader = $(this.options.loader);
		}
		$document.on('mousewheel.ui.endlessscroll', function(event) {
			var $document = $(this);

			if(event.deltaY > 0 && $document.scrollTop() <= 0) {
				_this.element.trigger('update', 'top');
			} else if(event.deltaY < 0 && $document.scrollTop() >= $document.height() - $(window).height()) {
				_this.element.trigger('update', 'bottom');
			}
		}).on('touchstart.ui.endlessscroll', function(event) {
			var $document = $(this);

			$document.data('touch', {
				pageX : event.originalEvent.changedTouches[0].pageX,
				pageY : event.originalEvent.changedTouches[0].pageY,
				startTime : new Date().getTime()
			});
		}).on('touchend.ui.endlessscroll', function(event) {
			var $document = $(this);
			var touchData = $document.data('touch');
			var distance = event.originalEvent.changedTouches[0].pageY - touchData.pageY;

			if(new Date().getTime() - touchData.startTime <= 300) {
				if(distance >= 60 && $document .scrollTop() <= 0) {
					_this.element.trigger('update', 'top');
				} else if(distance <= 60 && $document .scrollTop() >= $document .height() - $(window).height()) {
					_this.element.trigger('update', 'bottom');
				}
				//event.preventDefault();
			}
		}).data('ui.oddScrollTop.endlessscroll', $document.scrollTop()).on('scroll.ui.endlessscroll', function(event) {
			_this._throttle(_this._updateURL, _this);
		});
		this.element.attr({
			role: 'status',
			'aria-live': 'assertive',
			'aria-relevant': 'additions'
		}).bind('load.ui.endlessscroll', function() {
			_this._throttle(_this._loadItems, _this);
		});
	},

	_destroy: function() {
		if(this._$loader) {
			this._$loader.remove();
		}
		this.element.unbind('load.ui.endlessscroll');
		this.document.off('mousewheel.ui.endlessscroll touchstart.ui.endlessscroll touchend.ui.endlessscroll');
	},

	_initSource: function() {
		var array, url,
			that = this;
		if ( $.isArray( this.options.source ) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response(array);
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax( {
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response( [] );
					}
				} );
			};
		} else {
			this.source = this.options.source;
		}
	},

	_setOptions: function( options ) {
		this._super( options );
	},

	_setOption: function( key, value ) {
		this._super( key, value );
	},

	_loadItems: function() {
		var _this = this, $loadBtn = $('.load-more').addClass('hidden');
		var updatingData = $container.data('updating'), mostPage;

		// When User Skip Main Content to Footer, Prevent Load Items Automatically.
		if($container.data('preventLoading') || (direction === 'bottom' && $('#footer:focus, #footer :focus').size() > 0)) {
			$loadBtn.removeClass('hidden');

			return false;
		}
		if(updatingData.totalPages <= 1) {
			$(document).off('scroll.listing mousewheel.listing touchstart.listing touchend.listing');
		}
		if($.type(this.element.data('mostTopPage')) === 'undefined') {
			this.element.data('mostTopPage', updatingData.page);
		}
		if($.type($container.data('mostBottomPage')) === 'undefined') {
			this.element.data('mostBottomPage', updatingData.page);
		}
		if($.type(arguments[2]) === 'undefined') {
			if(direction === 'top') {
				mostPage = this.element.data('mostTopPage');
				mostPage--;
			} else {
				mostPage = this.element.data('mostBottomPage');
				mostPage++;
			}
		} else if($.type(arguments[2]) === 'number') {
			mostPage = arguments[2];
		} else {
			throw new Error('Argument must be a valid number');
		}
		if(mostPage <= 0 || mostPage > updatingData.totalPages || this.element.data('loading') === true) {
			return false;
		}
		this.element.data('loading', true);
		if(direction === 'top') {
			this.element.data('mostTopPage', mostPage);
			if(this._$loader) {
				this.element.before(this._$loader);
			}
		} else {
			this.element.data('mostBottomPage', mostPage);
			if(this._$loader) {
				this.element.after(this._$loader);
			}
		}
		$.ajax($.extend({
			cache: false,
			success: function(data){
				var $items = $(data).find('.product-listing > .item');
				var $anchor = _this.element.children('.item:first');
				var pageY = $(document).scrollTop(), oldAnchor = $anchor.offset().top;

				$items.data('page', mostPage);
				if(direction === 'top') {
					_this.element.prepend($items);
					$('body, html').scrollTop(pageY + $anchor.offset().top - oldAnchor - _this._$loader.outerHeight(true));
				} else {
					_this.element.append($items);
				}
				$items.find('.choices-color').each(function() {
					var $this = $(this), isFull = $this.find('.color-item').size() > 4;

					if(isFull) {
						$('.carousel', $this).slick({
							slidesToShow : 4,
							slidesToScroll : 4,
							prevArrow : null,
							nextArrow : $('.btn-next', $this).removeClass('hidden')
						});
					} else {
						$this.find(".carousel").removeClass('carousel');
					}
				});
				_this.element.data('ui.loading', false);
				_this._$loader.remove();
				$('.jq-product-listing').trigger('CriteoPLPTag', data);
			},
			complete: function() {
				_this.element.data('ui.loading', false);
				_this._$loader.remove();
			}
		}, $.isPlainObject(this.options.ajax) && this.options.ajax || {}));
	},

	_updateURL: function () {
		var $document = this.document, $container = this.element;
		var newScrollTop = $document.scrollTop(), oddScrollTop = $document.data('oddScrollTop'), 
			wHeight = $(window).height(), containerTop = $container.offset().top, containerHeight = $container.height(), el_top, el_height;

		if(isNaN(currentPage)) {
			currentPage = 0;
		}
		if(newScrollTop < oddScrollTop && newScrollTop <= containerTop - Math.min(wHeight, containerTop) / 2) {
			this.element.trigger('update', 'top');
		} else if(newScrollTop > oddScrollTop && newScrollTop >= containerTop + containerHeight - wHeight + Math.min(wHeight, $document.height() - containerTop - containerHeight) / 2) {
			this.element.trigger('update', 'bottom');
		}
		$document.data('oddScrollTop', newScrollTop);

		if(this.options.disableURL === true) {
			return;
		}

		var options = this.options, updatedURL = location.search.substr(1), 
			page = 1, currentPage = parseInt(this._getUrlParam(this.options.param)), 
			pattern = new RegExp('(^|\&)(' + this.options.param + '=[^\&]*)(\&|$)', 'gi'), $item;

		$document.find(this.options.items).each(function() {
			$item = $(this);
			el_top = $item.offset().top, el_height = $item.height();

			if((el_top + el_height * 0.75 > newScrollTop) && (el_top < (newScrollTop + el_height))) {
				page = $item.data('page') || $container.data('originalpage');
				if(updatedURL !== '') {
					if(pattern.test(updatedURL)){
						updatedURL = updatedURL.replace(pattern, '$1' + options.param + '=' + page + '$3');
					} else {
						updatedURL += '&' + options.param + '=' + page;
					}
				} else {
					updatedURL = 'page=' + page;
				}
				history.replaceState(null, null, location.pathname + '?' + updatedURL.replace(pattern, '$3').replace(/^\&+/g, ''));

				return false;
			}
		});
	},

	_getUrlParam : function(name, ignoreCase) {
		var pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'), match, value, finalValue;

		if (ignoreCase === true) {
			pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		}
		match = window.location.search.substr(1).match(pattern);
		if (match !== null) {
			finalValue = value = decodeURIComponent(match[2]);
		}
		if(value === 'true') {
			finalValue = true;
		} else if(value === 'false') {
			finalValue = false;
		} else if(value !== '') {
			value = Number(value);
			if(!isNaN(value)) {
				finalValue = value;
			}
		}

		return finalValue;
	},

	_throttle: function(method, context, interval) {
		if(typeof interval != 'number') {
			interval = 100;
		}
		clearTimeout(method.timeoutId);
		method.timeoutId = setTimeout(function() {
			method.call(context);
		}, interval);
	}
} );

} ) );