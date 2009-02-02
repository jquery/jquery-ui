/*
 * jQuery UI Tabs @VERSION
 *
 * Copyright (c) 2009 AUTHORS.txt (http://ui.jquery.com/about)
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
		if (this.options.deselectable !== undefined)
			this.options.collapsible = this.options.deselectable;
		this._tabify(true);
	},

	_setData: function(key, value) {
		if ((/^selected/).test(key))
			this.select(value);
		else {
			this.options[key] = value;
			if (key == 'deselectable')
				this.options.collapsible = value;
			
			this._tabify();
		}
	},

	_tabId: function(a) {
		return a.title && a.title.replace(/\s/g, '_').replace(/[^A-Za-z0-9\-_:\.]/g, '')
			|| this.options.idPrefix + $.data(a);
	},

	_sanitizeSelector: function(hash) {
		return hash.replace(/:/g, '\\:'); // we need this because an id may contain a ":"
	},

	_cookie: function() {
		var cookie = this.cookie || (this.cookie = this.options.cookie.name || 'ui-tabs-' + $.data(this.list[0]));
		return $.cookie.apply(null, [cookie].concat($.makeArray(arguments)));
	},

	_ui: function(tab, panel) {
		return {
			tab: tab,
			panel: panel,
			index: this.$tabs.index(tab)
		};
	},

	_tabify: function(init) {

		this.list = this.element.is('div') ? this.element.children('ul:first, ol:first').eq(0) : this.element;
		this.$lis = $('li:has(a[href])', this.list);
		this.$tabs = this.$lis.map(function() { return $('a', this)[0]; });
		this.$panels = $([]);

		var self = this, o = this.options;

		var fragmentId = /^#.+/; // Safari 2 reports '#' for an empty hash
		this.$tabs.each(function(i, a) {
			var href = $(a).attr('href');
			
			// For dynamically created HTML that contains a hash as href IE expands
			// such href to the full page url with hash and then misinterprets tab as ajax...
			if (href.split('#')[0] == location.toString().split('#')[0]) href = a.hash;

			// inline tab
			if (fragmentId.test(href))
				self.$panels = self.$panels.add(self._sanitizeSelector(href));

			// remote tab
			else if (href != '#') { // prevent loading the page itself if href is just "#"
				$.data(a, 'href.tabs', href); // required for restore on destroy

				// TODO until #3808 is fixed strip fragment identifier from url
				// (IE fails to load from such url)
				$.data(a, 'load.tabs', href.replace(/#.*$/, '')); // mutable data

				var id = self._tabId(a);
				a.href = '#' + id;
				var $panel = $('#' + id);
				if (!$panel.length) {
					$panel = $(o.panelTemplate).attr('id', id).addClass('ui-tabs-panel ui-widget-content ui-corner-bottom')
						.insertAfter(self.$panels[i - 1] || self.list);
					$panel.data('destroy.tabs', true);
				}
				self.$panels = self.$panels.add($panel);
			}

			// invalid tab href
			else
				o.disabled.push(i);
		});

		// initialization from scratch
		if (init) {

			// attach necessary classes for styling
			if (this.element.is('div')) {
				this.element.addClass('ui-tabs ui-widget ui-widget-content ui-corner-all');
			}
			this.list.addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
			this.$lis.addClass('ui-state-default ui-corner-top');
			this.$panels.addClass('ui-tabs-panel ui-widget-content ui-corner-bottom');

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
				else if (o.cookie)
					o.selected = parseInt(self._cookie(), 10);

				else if (this.$lis.filter('.ui-tabs-selected').length)
					o.selected = this.$lis.index(this.$lis.filter('.ui-tabs-selected'));

				else
				 	o.selected = 0;

			}
			else if (o.selected === null)
				o.selected = -1;

			// sanity check
			o.selected = ((o.selected >= 0 && this.$tabs[o.selected]) || o.selected < 0) ? o.selected : 0; // default to first tab

			// Take disabling tabs via class attribute from HTML
			// into account and update option properly.
			// A selected tab cannot become disabled.
			o.disabled = $.unique(o.disabled.concat(
				$.map(this.$lis.filter('.ui-state-disabled'),
					function(n, i) { return self.$lis.index(n); } )
			)).sort();
			if ($.inArray(o.selected, o.disabled) != -1)
				o.disabled.splice($.inArray(o.selected, o.disabled), 1);

			// highlight selected tab
			this.$panels.addClass('ui-tabs-hide');
			this.$lis.removeClass('ui-tabs-selected ui-state-active');
			if (o.selected >= 0 && this.$tabs.length) { // check for length avoids error when initializing empty list
				this.$panels.eq(o.selected).removeClass('ui-tabs-hide');
				var classes = ['ui-tabs-selected ui-state-active'];
				this.$lis.eq(o.selected).addClass(classes.join(' '));

				// seems to be expected behavior that the show callback is fired
				var onShow = function() {
					self._trigger('show', null,
						self._ui(self.$tabs[o.selected], self.$panels[o.selected]));
				};

				// load if remote tab
				if ($.data(this.$tabs[o.selected], 'load.tabs'))
					this.load(o.selected, onShow);
				// just trigger show event
				else onShow();
			}

			// states
			if (o.event != 'mouseover') {
				var handleState = function(state, el) {
					if (el.is(':not(.ui-state-disabled)')) el.toggleClass('ui-state-' + state);
				};
				this.$lis.bind('mouseover.tabs mouseout.tabs', function() {
					handleState('hover', $(this));
				});
				// TODO focus/blur don't seem to work with namespace
				this.$tabs.bind('focus.tabs blur.tabs', function() {
					handleState('focus', $(this).parents('li:first'));
				});
			}

			// clean up to avoid memory leaks in certain versions of IE 6
			$(window).bind('unload', function() {
				self.$lis.add(self.$tabs).unbind('.tabs');
				self.$lis = self.$tabs = self.$panels = null;
			});

		}
		// update selected after add/remove
		else
			o.selected = this.$lis.index(this.$lis.filter('.ui-tabs-selected'));

		// update collapsible
		this.element[o.collapsible ? 'addClass' : 'removeClass']('ui-tabs-collapsible');
		
		// set or update cookie after init and add/remove respectively
		if (o.cookie) this._cookie(o.selected, o.cookie);

		// disable tabs
		for (var i = 0, li; li = this.$lis[i]; i++)
			$(li)[$.inArray(i, o.disabled) != -1 && !$(li).hasClass('ui-tabs-selected') ? 'addClass' : 'removeClass']('ui-state-disabled');

		// reset cache if switching from cached to not cached
		if (o.cache === false) this.$tabs.removeData('cache.tabs');

		// set up animations
		var hideFx, showFx;
		if (o.fx) {
			if ($.isArray(o.fx)) {
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
				$show.hide().removeClass('ui-tabs-hide') // avoid flicker that way
					.animate(showFx, 500, function() {
						resetStyle($show, showFx);
						self._trigger('show', null, self._ui(clicked, $show[0]));
					});
			} :
			function(clicked, $show) {
				$show.removeClass('ui-tabs-hide');
				self._trigger('show', null, self._ui(clicked, $show[0]));
			};

		// Hide a tab, $show is optional...
		var hideTab = hideFx ?
			function(clicked, $hide, $show) {
				$hide.animate(hideFx, hideFx.duration || 'normal', function() {
					$hide.addClass('ui-tabs-hide');
					resetStyle($hide, hideFx);
					if ($show) showTab(clicked, $show);
				});
			} :
			function(clicked, $hide, $show) {
				$hide.addClass('ui-tabs-hide');
				if ($show) showTab(clicked, $show);
			};

		// Switch a tab...
		function switchTab(clicked, $li, $hide, $show) {
			var classes = ['ui-tabs-selected ui-state-active'];
			$li.removeClass('ui-state-default').addClass(classes.join(' '))
				.siblings().removeClass(classes.join(' ')).addClass('ui-state-default');
			hideTab(clicked, $hide, $show);
		}

		// attach tab event handler, unbind to avoid duplicates from former tabifying...
		this.$tabs.unbind('.tabs').bind(o.event + '.tabs', function() {
			var $li = $(this).parents('li:eq(0)'),
				$hide = self.$panels.filter(':visible'),
				$show = $(self._sanitizeSelector(this.hash));

			// If tab is already selected and not collapsible or tab disabled or
			// or is already loading or click callback returns false stop here.
			// Check if click handler returns false last so that it is not executed
			// for a disabled or loading tab!
			if (($li.hasClass('ui-state-active') && !o.collapsible)
				|| $li.hasClass('ui-state-disabled')
				|| $(this).hasClass('ui-tabs-loading')
				|| self._trigger('select', null, self._ui(this, $show[0])) === false
				) {
				this.blur();
				return false;
			}

			o.selected = self.$tabs.index(this);

			// if tab may be closed TODO avoid redundant code in this block
			if (o.collapsible) {
				if ($li.hasClass('ui-state-active')) {
					o.selected = -1;
					if (o.cookie) self._cookie(o.selected, o.cookie);
					$li.removeClass('ui-tabs-selected ui-state-active')
						.addClass('ui-state-default');
					self.$panels.stop();
					hideTab(this, $hide);
					this.blur();
					return false;
				} else if (!$hide.length) {
					if (o.cookie) self._cookie(o.selected, o.cookie);
					self.$panels.stop();
					var a = this;
					self.load(self.$tabs.index(this), function() {
						$li.addClass('ui-tabs-selected ui-state-active')
							.removeClass('ui-state-default');
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
						$li.addClass('ui-tabs-selected ui-state-active').removeClass('ui-state-default');
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

		});

		// disable click in any case
		this.$tabs.bind('click.tabs', function(){return false;});

	},

	destroy: function() {
		var o = this.options;

		this.element.unbind('.tabs')
			.removeClass('ui-tabs ui-widget ui-widget-content ui-corner-all')
			.removeData('tabs');

		this.list.unbind('.tabs')
			.removeClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all')
			.removeData('tabs');

		this.$tabs.each(function() {
			var href = $.data(this, 'href.tabs');
			if (href)
				this.href = href;
			var $this = $(this).unbind('.tabs');
			$.each(['href', 'load', 'cache'], function(i, prefix) {
				$this.removeData(prefix + '.tabs');
			});
		});

		this.$lis.unbind('.tabs').add(this.$panels).each(function() {
			if ($.data(this, 'destroy.tabs'))
				$(this).remove();
			else
				$(this).removeClass(
					'ui-state-default ' +
					'ui-corner-top ' +
					'ui-tabs-selected ' +
					'ui-state-active ' +
					'ui-state-hover ' +
					'ui-tabs-collapsible ' +
					'ui-state-disabled ' +
					'ui-tabs-panel ' +
					'ui-widget-content ' +
					'ui-corner-bottom ' +
					'ui-tabs-hide');
		});

		if (o.cookie)
			this._cookie(null, o.cookie);
	},

	add: function(url, label, index) {
		if (index == undefined)
			index = this.$tabs.length; // append by default

		var self = this, o = this.options;
		var $li = $(o.tabTemplate.replace(/#\{href\}/g, url).replace(/#\{label\}/g, label));
		$li.addClass('ui-state-default ui-corner-top').data('destroy.tabs', true);

		var id = url.indexOf('#') == 0 ? url.replace('#', '') : this._tabId( $('a:first-child', $li)[0] );

		// try to find an existing element before creating a new one
		var $panel = $('#' + id);
		if (!$panel.length) {
			$panel = $(o.panelTemplate).attr('id', id).data('destroy.tabs', true);
		}
		$panel.addClass('ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide');
		if (index >= this.$lis.length) {
			$li.appendTo(this.list);
			$panel.appendTo(this.list[0].parentNode);
		}
		else {
			$li.insertBefore(this.$lis[index]);
			$panel.insertBefore(this.$panels[index]);
		}

		o.disabled = $.map(o.disabled,
			function(n, i) { return n >= index ? ++n : n });

		this._tabify();

		if (this.$tabs.length == 1) { // after tabify
			$li.addClass('ui-tabs-selected ui-state-active');
			$panel.removeClass('ui-tabs-hide');
			var href = $.data(this.$tabs[0], 'load.tabs');
			if (href) this.load(0, function() {
				self._trigger('show', null,
					self._ui(self.$tabs[0], self.$panels[0]));
			});
		}

		// callback
		this._trigger('add', null, this._ui(this.$tabs[index], this.$panels[index]));
	},

	remove: function(index) {
		var o = this.options, $li = this.$lis.eq(index).remove(),
			$panel = this.$panels.eq(index).remove();

		// If selected tab was removed focus tab to the right or
		// in case the last tab was removed the tab to the left.
		if ($li.hasClass('ui-tabs-selected') && this.$tabs.length > 1)
			this.select(index + (index + 1 < this.$tabs.length ? 1 : -1));

		o.disabled = $.map($.grep(o.disabled, function(n, i) { return n != index; }),
			function(n, i) { return n >= index ? --n : n });

		this._tabify();

		// callback
		this._trigger('remove', null, this._ui($li.find('a')[0], $panel[0]));
	},

	enable: function(index) {
		var o = this.options;
		if ($.inArray(index, o.disabled) == -1)
			return;

		this.$lis.eq(index).removeClass('ui-state-disabled');
		o.disabled = $.grep(o.disabled, function(n, i) { return n != index; });

		// callback
		this._trigger('enable', null, this._ui(this.$tabs[index], this.$panels[index]));
	},

	disable: function(index) {
		var self = this, o = this.options;
		if (index != o.selected) { // cannot disable already selected tab
			this.$lis.eq(index).addClass('ui-state-disabled');

			o.disabled.push(index);
			o.disabled.sort();

			// callback
			this._trigger('disable', null, this._ui(this.$tabs[index], this.$panels[index]));
		}
	},

	select: function(index) {
		if (typeof index == 'string')
			index = this.$tabs.index(this.$tabs.filter('[href$=' + index + ']'));
		this.$tabs.eq(index).trigger(this.options.event + '.tabs');
	},

	load: function(index, callback) { // callback is for internal usage only

		var self = this, o = this.options, $a = this.$tabs.eq(index), a = $a[0],
				bypassCache = callback == undefined, url = $a.data('load.tabs');

		callback = callback || function() {};

		// no remote or from cache - just finish with callback
		// TODO in any case: insert cancel running load here..!

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
			self.$tabs.filter('.ui-tabs-loading').removeClass('ui-tabs-loading')
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
				self._trigger('load', null, self._ui(self.$tabs[index], self.$panels[index]));
				try {
					o.ajaxOptions.success(r, s);
				}
				catch (er) {}

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
		$a.addClass('ui-tabs-loading');
		self.xhr = $.ajax(ajaxOptions);
	},

	url: function(index, url) {
		this.$tabs.eq(index).removeData('cache.tabs').data('load.tabs', url);
	},

	length: function() {
		return this.$tabs.length;
	}

});

$.extend($.ui.tabs, {
	version: '@VERSION',
	getter: 'length',
	defaults: {
		ajaxOptions: null,
		cache: false,
		cookie: null, // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		collapsible: false,
		disabled: [],
		event: 'click',
		fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
		idPrefix: 'ui-tabs-',
		panelTemplate: '<div></div>',
		spinner: 'Loading&#8230;',
		tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>'
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

		var self = this, o = this.options, t = o.selected;

		function rotate() {
			clearTimeout(self.rotation);
			self.rotation = setTimeout(function() {
				t = ++t < self.$tabs.length ? t : 0;
				self.select(t);
			}, ms);
		}

		// start rotation
		if (ms) {
			this.element.bind('tabsshow', rotate); // will not be attached twice
			this.$tabs.bind(o.event + '.tabs', !continuing ?
				function(e) {
					if (e.clientX) { // in case of a true click
						clearTimeout(self.rotation);
						self.element.unbind('tabsshow', rotate);
					}
				} :
				function(e) {
					t = o.selected;
					rotate();
				}
			);
			rotate();
		}
		// stop rotation
		else {
			clearTimeout(self.rotation);
			this.element.unbind('tabsshow', rotate);
			this.$tabs.unbind(o.event + '.tabs', stop);
		}
	}
});

})(jQuery);
