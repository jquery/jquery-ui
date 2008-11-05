/*
 * jQuery UI Tabs @VERSION
 *
 * Copyright (c) 2007, 2008 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	ui.core.js
 */
(function($) {

$.widget("ui.tabs", {
	_init: function() {
		// create tabs
		this._tabify(true);
	},
	_setData: function(key, value) {
		if ((/^selected/).test(key))
			this.select(value);
		else {
			this.options[key] = value;
			this._tabify();
		}
	},
	length: function() {
		return this.$tabs.length;
	},
	_tabId: function(a) {
		return a.title && a.title.replace(/\s/g, '_').replace(/[^A-Za-z0-9\-_:\.]/g, '')
			|| this.options.idPrefix + $.data(a);
	},
	ui: function(tab, panel) {
		return {
			options: this.options,
			tab: tab,
			panel: panel,
			index: this.$tabs.index(tab)
		};
	},
	_sanitizeSelector: function(hash) {
		return hash.replace(/:/g, '\\:'); // we need this because an id may contain a ":"
	},
	_cookie: function() {
		var cookie = this.cookie || (this.cookie = 'ui-tabs-' + $.data(this.element[0]));
		return $.cookie.apply(null, [cookie].concat($.makeArray(arguments)));
	},
	_tabify: function(init) {
		
		this.$lis = $('li:has(a[href])', this.element);
		this.$tabs = this.$lis.map(function() { return $('a', this)[0]; });
		this.$panels = $([]);
		
		var self = this, o = this.options;
		
		this.$tabs.each(function(i, a) {
			// inline tab
			if (a.hash && a.hash.replace('#', '')) // Safari 2 reports '#' for an empty hash
				self.$panels = self.$panels.add(self._sanitizeSelector(a.hash));
			// remote tab
			else if ($(a).attr('href') != '#') { // prevent loading the page itself if href is just "#"
				$.data(a, 'href.tabs', a.href); // required for restore on destroy
				$.data(a, 'load.tabs', a.href); // mutable
				var id = self._tabId(a);
				a.href = '#' + id;
				var $panel = $('#' + id);
				if (!$panel.length) {
					$panel = $(o.panelTemplate).attr('id', id).addClass(o.panelClass)
						.insertAfter(self.$panels[i - 1] || self.element);
					$panel.data('destroy.tabs', true);
				}
				self.$panels = self.$panels.add($panel);
			}
			// invalid tab href
			else
				o.disabled.push(i + 1);
		});
		
		// initialization from scratch
		if (init) {
			
			// attach necessary classes for styling if not present
			this.element.addClass(o.navClass);
			this.$panels.addClass(o.panelClass);
			
			// Selected tab
			// use "selected" option or try to retrieve:
			// 1. from fragment identifier in url
			// 2. from cookie
			// 3. from selected class attribute on <li>
			if (o.selected === undefined) {
				if (location.hash) {
					this.$tabs.each(function(i, a) {
						if (a.hash == location.hash) {
							o.selected = i;
							return false; // break
						}
					});
				}
				else if (o.cookie) {
					var index = parseInt(self._cookie(), 10);
					if (index && self.$tabs[index]) o.selected = index;
				}
				else if (self.$lis.filter('.' + o.selectedClass).length)
					o.selected = self.$lis.index( self.$lis.filter('.' + o.selectedClass)[0] );
			}
			o.selected = o.selected === null || o.selected !== undefined ? o.selected : 0; // first tab selected by default
			
			// Take disabling tabs via class attribute from HTML
			// into account and update option properly.
			// A selected tab cannot become disabled.
			o.disabled = $.unique(o.disabled.concat(
				$.map(this.$lis.filter('.' + o.disabledClass),
					function(n, i) { return self.$lis.index(n); } )
			)).sort();
			if ($.inArray(o.selected, o.disabled) != -1)
				o.disabled.splice($.inArray(o.selected, o.disabled), 1);
			
			// highlight selected tab
			this.$panels.addClass(o.hideClass);
			this.$lis.removeClass(o.selectedClass);
			if (o.selected !== null) {
				this.$panels.eq(o.selected).removeClass(o.hideClass);
				var classes = [o.selectedClass];
				if (o.deselectable) classes.push(o.deselectableClass);
				this.$lis.eq(o.selected).addClass(classes.join(' '));
				
				// seems to be expected behavior that the show callback is fired
				var onShow = function() {
					self._trigger('show', null,
						self.ui(self.$tabs[o.selected], self.$panels[o.selected]));
				};
				
				// load if remote tab
				if ($.data(this.$tabs[o.selected], 'load.tabs'))
					this.load(o.selected, onShow);
				// just trigger show event
				else onShow();
			}
			
			// clean up to avoid memory leaks in certain versions of IE 6
			$(window).bind('unload', function() {
				self.$tabs.unbind('.tabs');
				self.$lis = self.$tabs = self.$panels = null;
			});
			
		}
		// update selected after add/remove
		else
			o.selected = this.$lis.index( this.$lis.filter('.' + o.selectedClass)[0] );
		
		// set or update cookie after init and add/remove respectively
		if (o.cookie) this._cookie(o.selected, o.cookie);
		
		// disable tabs
		for (var i = 0, li; li = this.$lis[i]; i++)
			$(li)[$.inArray(i, o.disabled) != -1 && !$(li).hasClass(o.selectedClass) ? 'addClass' : 'removeClass'](o.disabledClass);
		
		// reset cache if switching from cached to not cached
		if (o.cache === false) this.$tabs.removeData('cache.tabs');
		
		// set up animations
		var hideFx, showFx;
		if (o.fx) {
			if (o.fx.constructor == Array) {
				hideFx = o.fx[0];
				showFx = o.fx[1];
			}
			else hideFx = showFx = o.fx;
		}
		
		// Reset certain styles left over from animation
		// and prevent IE's ClearType bug...
		function resetStyle($el, fx) {
			$el.css({ display: '' });
			if ($.browser.msie && fx.opacity) $el[0].style.removeAttribute('filter');
		}

		// Show a tab...
		var showTab = showFx ?
			function(clicked, $show) {
				$show.animate(showFx, showFx.duration || 'normal', function() {
					$show.removeClass(o.hideClass);
					resetStyle($show, showFx);
					self._trigger('show', null, self.ui(clicked, $show[0]));
				});
			} :
			function(clicked, $show) {
				$show.removeClass(o.hideClass);
				self._trigger('show', null, self.ui(clicked, $show[0]));
			};
		
		// Hide a tab, $show is optional...
		var hideTab = hideFx ? 
			function(clicked, $hide, $show) {
				$hide.animate(hideFx, hideFx.duration || 'normal', function() {
					$hide.addClass(o.hideClass);
					resetStyle($hide, hideFx);
					if ($show) showTab(clicked, $show, $hide);
				});
			} :
			function(clicked, $hide, $show) {
				$hide.addClass(o.hideClass);
				if ($show) showTab(clicked, $show);
			};
		
		// Switch a tab...
		function switchTab(clicked, $li, $hide, $show) {
			var classes = [o.selectedClass];
			if (o.deselectable) classes.push(o.deselectableClass);
			$li.addClass(classes.join(' ')).siblings().removeClass(classes.join(' '));
			hideTab(clicked, $hide, $show);
		}
		
		// attach tab event handler, unbind to avoid duplicates from former tabifying...
		this.$tabs.unbind('.tabs').bind(o.event + '.tabs', function() {
			
			//var trueClick = e.clientX; // add to history only if true click occured, not a triggered click
			var $li = $(this).parents('li:eq(0)'),
				$hide = self.$panels.filter(':visible'),
				$show = $(self._sanitizeSelector(this.hash));
			
			// If tab is already selected and not deselectable or tab disabled or 
			// or is already loading or click callback returns false stop here.
			// Check if click handler returns false last so that it is not executed
			// for a disabled or loading tab!
			if (($li.hasClass(o.selectedClass) && !o.deselectable)
				|| $li.hasClass(o.disabledClass)
				|| $(this).hasClass(o.loadingClass)
				|| self._trigger('select', null, self.ui(this, $show[0])) === false
				) {
				this.blur();
				return false;
			}
			
			o.selected = self.$tabs.index(this);
			
			// if tab may be closed
			if (o.deselectable) {
				if ($li.hasClass(o.selectedClass)) {
					self.options.selected = null;
					$li.removeClass([o.selectedClass, o.deselectableClass].join(' '));
					self.$panels.stop();
					hideTab(this, $hide);
					this.blur();
					return false;
				} else if (!$hide.length) {
					self.$panels.stop();
					var a = this;
					self.load(self.$tabs.index(this), function() {
						$li.addClass([o.selectedClass, o.deselectableClass].join(' '));
						showTab(a, $show);
					});
					this.blur();
					return false;
				}
			}
			
			if (o.cookie) self._cookie(o.selected, o.cookie);
			
			// stop possibly running animations
			self.$panels.stop();
			
			// show new tab
			if ($show.length) {
				var a = this;
				self.load(self.$tabs.index(this), $hide.length ? 
					function() {
						switchTab(a, $li, $hide, $show);
					} :
					function() {
						$li.addClass(o.selectedClass);
						showTab(a, $show);
					}
				);
			} else
				throw 'jQuery UI Tabs: Mismatching fragment identifier.';
				
			// Prevent IE from keeping other link focussed when using the back button
			// and remove dotted border from clicked link. This is controlled via CSS
			// in modern browsers; blur() removes focus from address bar in Firefox
			// which can become a usability and annoying problem with tabs('rotate').
			if ($.browser.msie) this.blur();
			
			return false;
			
		});
		
		// disable click if event is configured to something else
		if (o.event != 'click') this.$tabs.bind('click.tabs', function(){return false;});
		
	},
	add: function(url, label, index) {
		if (index == undefined)
			index = this.$tabs.length; // append by default
		
		var o = this.options;
		var $li = $(o.tabTemplate.replace(/#\{href\}/g, url).replace(/#\{label\}/g, label));
		$li.data('destroy.tabs', true);
		
		var id = url.indexOf('#') == 0 ? url.replace('#', '') : this._tabId( $('a:first-child', $li)[0] );
		
		// try to find an existing element before creating a new one
		var $panel = $('#' + id);
		if (!$panel.length) {
			$panel = $(o.panelTemplate).attr('id', id)
				.addClass(o.hideClass)
				.data('destroy.tabs', true);
		}
		$panel.addClass(o.panelClass);
		if (index >= this.$lis.length) {
			$li.appendTo(this.element);
			$panel.appendTo(this.element[0].parentNode);
		} else {
			$li.insertBefore(this.$lis[index]);
			$panel.insertBefore(this.$panels[index]);
		}
		
		o.disabled = $.map(o.disabled,
			function(n, i) { return n >= index ? ++n : n });
		
		this._tabify();
		
		if (this.$tabs.length == 1) {
			$li.addClass(o.selectedClass);
			$panel.removeClass(o.hideClass);
			var href = $.data(this.$tabs[0], 'load.tabs');
			if (href)
				this.load(index, href);
		}
		
		// callback
		this._trigger('add', null, this.ui(this.$tabs[index], this.$panels[index]));
	},
	remove: function(index) {
		var o = this.options, $li = this.$lis.eq(index).remove(),
			$panel = this.$panels.eq(index).remove();
		
		// If selected tab was removed focus tab to the right or
		// in case the last tab was removed the tab to the left.
		if ($li.hasClass(o.selectedClass) && this.$tabs.length > 1)
			this.select(index + (index + 1 < this.$tabs.length ? 1 : -1));
		
		o.disabled = $.map($.grep(o.disabled, function(n, i) { return n != index; }),
			function(n, i) { return n >= index ? --n : n });
		
		this._tabify();
		
		// callback
		this._trigger('remove', null, this.ui($li.find('a')[0], $panel[0]));
	},
	enable: function(index) {
		var o = this.options;
		if ($.inArray(index, o.disabled) == -1)
			return;
		
		var $li = this.$lis.eq(index).removeClass(o.disabledClass);
		if ($.browser.safari) { // fix disappearing tab (that used opacity indicating disabling) after enabling in Safari 2...
			$li.css('display', 'inline-block');
			setTimeout(function() {
				$li.css('display', 'block');
			}, 0);
		}
		
		o.disabled = $.grep(o.disabled, function(n, i) { return n != index; });
		
		// callback
		this._trigger('enable', null, this.ui(this.$tabs[index], this.$panels[index]));
	},
	disable: function(index) {
		var self = this, o = this.options;
		if (index != o.selected) { // cannot disable already selected tab
			this.$lis.eq(index).addClass(o.disabledClass);
			
			o.disabled.push(index);
			o.disabled.sort();
			
			// callback
			this._trigger('disable', null, this.ui(this.$tabs[index], this.$panels[index]));
		}
	},
	select: function(index) {
		// TODO make null as argument work
		if (typeof index == 'string')
			index = this.$tabs.index( this.$tabs.filter('[href$=' + index + ']')[0] );
		this.$tabs.eq(index).trigger(this.options.event + '.tabs');
	},
	load: function(index, callback) { // callback is for internal usage only
		
		var self = this, o = this.options, $a = this.$tabs.eq(index), a = $a[0],
				bypassCache = callback == undefined || callback === false, url = $a.data('load.tabs');
		
		callback = callback || function() {};
		
		// no remote or from cache - just finish with callback
		if (!url || !bypassCache && $.data(a, 'cache.tabs')) {
			callback();
			return;
		}
		
		// load remote from here on
		
		var inner = function(parent) {
			var $parent = $(parent), $inner = $parent.find('*:last');
			return $inner.length && $inner.is(':not(img)') && $inner || $parent;
		};
		var cleanup = function() {
			self.$tabs.filter('.' + o.loadingClass).removeClass(o.loadingClass)
					.each(function() {
						if (o.spinner)
							inner(this).parent().html(inner(this).data('label.tabs'));
					});
			self.xhr = null;
		};
		
		if (o.spinner) {
			var label = inner(a).html();
			inner(a).wrapInner('<em></em>')
				.find('em').data('label.tabs', label).html(o.spinner);
		}
		
		var ajaxOptions = $.extend({}, o.ajaxOptions, {
			url: url,
			success: function(r, s) {
				$(self._sanitizeSelector(a.hash)).html(r);
				cleanup();
				
				if (o.cache)
					$.data(a, 'cache.tabs', true); // if loaded once do not load them again
				
				// callbacks
				self._trigger('load', null, self.ui(self.$tabs[index], self.$panels[index]));
				try {
					o.ajaxOptions.success(r, s);
				}
				catch (e) {}
				
				// This callback is required because the switch has to take
				// place after loading has completed. Call last in order to 
				// fire load before show callback...
				callback();
			}
		});
		if (this.xhr) {
			// terminate pending requests from other tabs and restore tab label
			this.xhr.abort();
			cleanup();
		}
		$a.addClass(o.loadingClass);
		self.xhr = $.ajax(ajaxOptions);
	},
	url: function(index, url) {
		this.$tabs.eq(index).removeData('cache.tabs').data('load.tabs', url);
	},
	destroy: function() {
		var o = this.options;
		this.element.unbind('.tabs')
			.removeClass(o.navClass).removeData('tabs');
		this.$tabs.each(function() {
			var href = $.data(this, 'href.tabs');
			if (href)
				this.href = href;
			var $this = $(this).unbind('.tabs');
			$.each(['href', 'load', 'cache'], function(i, prefix) {
				$this.removeData(prefix + '.tabs');
			});
		});
		this.$lis.add(this.$panels).each(function() {
			if ($.data(this, 'destroy.tabs'))
				$(this).remove();
			else
				$(this).removeClass([o.selectedClass, o.deselectableClass,
					o.disabledClass, o.panelClass, o.hideClass].join(' '));
		});
		if (o.cookie)
			this._cookie(null, o.cookie);
	}
});

$.extend($.ui.tabs, {
	version: '@VERSION',
	getter: 'length',
	defaults: {
		// basic setup
		deselectable: false,
		event: 'click',
		disabled: [],
		cookie: null, // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		// Ajax
		spinner: 'Loading&#8230;',
		cache: false,
		idPrefix: 'ui-tabs-',
		ajaxOptions: null,
		// animations
		fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
		// templates
		tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>',
		panelTemplate: '<div></div>',
		// CSS class names
		navClass: 'ui-tabs-nav',
		selectedClass: 'ui-tabs-selected',
		deselectableClass: 'ui-tabs-deselectable',
		disabledClass: 'ui-tabs-disabled',
		panelClass: 'ui-tabs-panel',
		hideClass: 'ui-tabs-hide',
		loadingClass: 'ui-tabs-loading'
	}
});

/*
 * Tabs Extensions
 */

/*
 * Rotate
 */
$.extend($.ui.tabs.prototype, {
	rotation: null,
	rotate: function(ms, continuing) {
		
		continuing = continuing || false;
		
		var self = this, t = this.options.selected;
		
		function start() {
			self.rotation = setInterval(function() {
				t = ++t < self.$tabs.length ? t : 0;
				self.select(t);
			}, ms);
		}
		
		function stop(e) {
			if (!e || e.clientX) { // only in case of a true click
				clearInterval(self.rotation);
			}
		}
		
		// start interval
		if (ms) {
			start();
			if (!continuing)
				this.$tabs.bind(this.options.event + '.tabs', stop);
			else
				this.$tabs.bind(this.options.event + '.tabs', function() {
					stop();
					t = self.options.selected;
					start();
				});
		}
		// stop interval
		else {
			stop();
			this.$tabs.unbind(this.options.event + '.tabs', stop);
		}
	}
});

})(jQuery);
