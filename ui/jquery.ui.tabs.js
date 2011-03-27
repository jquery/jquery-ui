/*
 * jQuery UI Tabs @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tabs
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var tabId = 0,
	listId = 0;

function getNextTabId() {
	return ++tabId;
}

function getNextListId() {
	return ++listId;
}

$.widget( "ui.tabs", {
	options: {
		beforeload: null,
		cookie: null, // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		collapsible: false,
		disabled: false,
		event: "click",
		fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }
		idPrefix: "ui-tabs-",
		load: null,
		panelTemplate: "<div></div>",
		select: null,
		show: null,
		tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
	},

	_create: function() {
		var self = this,
			o = this.options;

		this.element.addClass( "ui-tabs ui-widget ui-widget-content ui-corner-all" );

		this._processTabs();

		// Selected tab
		// use "selected" option or try to retrieve:
		// 1. from fragment identifier in url
		// 2. from cookie
		// 3. from selected class attribute on <li>
		if ( o.selected === undefined ) {
			if ( location.hash ) {
				this.anchors.each(function( i, a ) {
					if ( a.hash == location.hash ) {
						o.selected = i;
						return false;
					}
				});
			}
			if ( typeof o.selected !== "number" && o.cookie ) {
				o.selected = parseInt( self._cookie(), 10 );
			}
			if ( typeof o.selected !== "number" && this.lis.filter( ".ui-tabs-selected" ).length ) {
				o.selected = this.lis.index( this.lis.filter( ".ui-tabs-selected" ) );
			}
			o.selected = o.selected || ( this.lis.length ? 0 : -1 );
		} else if ( o.selected === null ) { // usage of null is deprecated, TODO remove in next release
			o.selected = -1;
		}

		// sanity check - default to first tab...
		o.selected = ( ( o.selected >= 0 && this.anchors[ o.selected ] ) || o.selected < 0 )
			? o.selected
			: 0;

		// Take disabling tabs via class attribute from HTML
		// into account and update option properly.
		if ( $.isArray( o.disabled ) ) {
			o.disabled = $.unique( o.disabled.concat(
				$.map( this.lis.filter( ".ui-state-disabled" ), function( n, i ) {
					return self.lis.index( n );
				})
			) ).sort();
		}

		this._setupFx( o.fx );

		this._refresh();

		// highlight selected tab
		this.panels.addClass( "ui-tabs-hide" );
		this.lis.removeClass( "ui-tabs-selected ui-state-active" );
		// check for length avoids error when initializing empty list
		if ( o.selected >= 0 && this.anchors.length ) {
			var temp = self.element.find( self._sanitizeSelector( self.anchors[ o.selected ].hash ) )
				.removeClass( "ui-tabs-hide" );

			this.lis.eq( o.selected ).addClass( "ui-tabs-selected ui-state-active" );

			// seems to be expected behavior that the show callback is fired
			self.element.queue( "tabs", function() {
				self._trigger( "show", null,
					self._ui( self.anchors[ o.selected ], self.element.find( self._sanitizeSelector( self.anchors[ o.selected ].hash ) )[ 0 ] ) );
			});

			this.load( o.selected );
		}

		// clean up to avoid memory leaks in certain versions of IE 6
		$( window ).bind( "unload.tabs", function() {
			self.lis.add( self.anchors ).unbind( ".tabs" );
			self.lis = self.anchors = self.panels = null;
		});
	},

	_setOption: function( key, value ) {
		if ( key == "selected" ) {
			if (this.options.collapsible && value == this.options.selected ) {
				return;
			}
			this.select( value );
		} else {
			this.options[ key ] = value;
			this.refresh();
		}
	},

	_tabId: function( a ) {
		return a.title && a.title.replace( /\s/g, "_" ).replace( /[^\w\u00c0-\uFFFF-]/g, "" ) ||
			this.options.idPrefix + getNextTabId();
	},

	_sanitizeSelector: function( hash ) {
		// we need this because an id may contain a ":"
		return hash.replace( /:/g, "\\:" );
	},

	_cookie: function() {
		var cookie = this.cookie ||
			( this.cookie = this.options.cookie.name || "ui-tabs-" + getNextListId() );
		return $.cookie.apply( null, [ cookie ].concat( $.makeArray( arguments ) ) );
	},

	_ui: function( tab, panel ) {
		return {
			tab: tab,
			panel: panel,
			index: this.anchors.index( tab )
		};
	},

	refresh: function() {
		var self = this;

		this._processTabs();

		this._refresh();

		// Remove panels that we created that are missing their tab
		this.element.find(".ui-tabs-panel:data(destroy.tabs)").each( function( index, panel ) {
			var anchor = self.anchors.filter( "[href$='#" + panel.id + "']");
			if ( !anchor.length ) {
				$( panel ).remove();
			}
		});
	},

	_refresh: function() {
		var self = this,
			o = this.options;

		this.element
			.toggleClass( "ui-tabs-collapsible", o.collapsible );

		this.list
			.addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" );

		this.lis
			.addClass( "ui-state-default ui-corner-top" );

		this.panels
			.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" );

		if ( !o.disabled.length ) {
			o.disabled = false;
		}

		// set or update cookie after init and add/remove respectively
		if ( o.cookie ) {
			this._cookie( o.selected, o.cookie );
		}

		// disable tabs
		for ( var i = 0, li; ( li = this.lis[ i ] ); i++ ) {
			$( li ).toggleClass( "ui-state-disabled", $.inArray( i, o.disabled ) != -1 );
		}

		this._setupEvents( o.event );

		// remove all handlers, may run on existing tabs
		this.lis.unbind( ".tabs" );


		this._focusable( this.lis );
		this._hoverable( this.lis );
	},

	_processTabs: function() {
		var self = this,
			fragmentId = /^#.+/; // Safari 2 reports '#' for an empty hash

		this.list = this.element.find( "ol,ul" ).eq( 0 );
		this.lis = $( " > li:has(a[href])", this.list );
		this.anchors = this.lis.map(function() {
			return $( "a", this )[ 0 ];
		});
		this.panels = $( [] );

		this.anchors.each(function( i, a ) {
			var href = $( a ).attr( "href" );
			// For dynamically created HTML that contains a hash as href IE < 8 expands
			// such href to the full page url with hash and then misinterprets tab as ajax.
			// Same consideration applies for an added tab with a fragment identifier
			// since a[href=#fragment-identifier] does unexpectedly not match.
			// Thus normalize href attribute...
			var hrefBase = href.split( "#" )[ 0 ],
				baseEl;
			if ( hrefBase && ( hrefBase === location.toString().split( "#" )[ 0 ] ||
					( baseEl = $( "base" )[ 0 ]) && hrefBase === baseEl.href ) ) {
				href = a.hash;
				a.href = href;
			}

			// inline tab
			if ( fragmentId.test( href ) ) {
				self.panels = self.panels.add( self.element.find( self._sanitizeSelector( href ) ) );
			// remote tab
			// prevent loading the page itself if href is just "#"
			} else if ( href && href !== "#" ) {
				// required for restore on destroy
				$.data( a, "href.tabs", href );

				// TODO until #3808 is fixed strip fragment identifier from url
				// (IE fails to load from such url)
				$.data( a, "load.tabs", href.replace( /#.*$/, "" ) );

				var id = self._tabId( a );
				a.href = "#" + id;
				var $panel = self.element.find( "#" + id );
				if ( !$panel.length ) {
					$panel = $( self.options.panelTemplate )
						.attr( "id", id )
						.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
						.insertAfter( self.panels[ i - 1 ] || self.list );
					$panel.data( "destroy.tabs", true );
				}
				self.panels = self.panels.add( $panel );
			// invalid tab href
			} else {
				self.options.disabled.push( i );
			}
		});
	},

	_setupFx: function( fx ) {
		// set up animations
		if ( fx ) {
			if ( $.isArray( fx ) ) {
				this.hideFx = fx[ 0 ];
				this.showFx = fx[ 1 ];
			} else {
				this.hideFx = this.showFx = fx;
			}
		}
	},

	// Reset certain styles left over from animation
	// and prevent IE's ClearType bug...
	_resetStyle: function ( $el, fx ) {
		$el.css( "display", "" );
		if ( !$.support.opacity && fx.opacity ) {
			$el[ 0 ].style.removeAttribute( "filter" );
		}
	},

	_showTab: function( clicked, show, event ) {
		var self = this;

		$( clicked ).closest( "li" ).addClass( "ui-tabs-selected ui-state-active" );

		if ( this.showFx ) {
			show.hide().removeClass( "ui-tabs-hide" ) // avoid flicker that way
				.animate( showFx, showFx.duration || "normal", function() {
					self._resetStyle( show, showFx );
					self._trigger( "show", event, self._ui( clicked, show[ 0 ] ) );
				});
		} else {
			show.removeClass( "ui-tabs-hide" );
			self._trigger( "show", event, self._ui( clicked, show[ 0 ] ) );
		}
	},

	_hideTab: function( clicked, $hide ) {
		var self = this;

		if ( this.hideFx ) {
			$hide.animate( hideFx, hideFx.duration || "normal", function() {
				self.lis.removeClass( "ui-tabs-selected ui-state-active" );
				$hide.addClass( "ui-tabs-hide" );
				self._resetStyle( $hide, hideFx );
				self.element.dequeue( "tabs" );
			});
		} else {
			self.lis.removeClass( "ui-tabs-selected ui-state-active" );
			$hide.addClass( "ui-tabs-hide" );
			self.element.dequeue( "tabs" );
		}
	},

	_setupEvents: function( event ) {
		// attach tab event handler, unbind to avoid duplicates from former tabifying...
		this.anchors.unbind( ".tabs" );

		if ( event ) {
			this.anchors.bind( event.split( " " ).join( ".tabs " ) + ".tabs",
				$.proxy( this, "_eventHandler" ) );
		}

		// disable click in any case
		this.anchors.bind( "click.tabs", function( event ){
			event.preventDefault();
		});
	},

	_eventHandler: function( event ) {
		event.preventDefault();
		var self = this,
			o = this.options,
			el = event.currentTarget,
			$li = $(el).closest( "li" ),
			$hide = self.panels.filter( ":not(.ui-tabs-hide)" ),
			$show = self.element.find( self._sanitizeSelector( el.hash ) );

		// If tab is already selected and not collapsible or tab disabled or
		// or is already loading or click callback returns false stop here.
		// Check if click handler returns false last so that it is not executed
		// for a disabled or loading tab!
		if ( ( $li.hasClass( "ui-tabs-selected" ) && !o.collapsible) ||
			$li.hasClass( "ui-state-disabled" ) ||
			$li.hasClass( "ui-state-processing" ) ||
			self.panels.filter( ":animated" ).length ||
			self._trigger( "select", event, self._ui( el, $show[ 0 ] ) ) === false ) {
			el.blur();
			return;
		}

		o.selected = self.anchors.index( el );

		if ( self.xhr ) {
			self.xhr.abort();
		}

		// if tab may be closed
		if ( o.collapsible ) {
			if ( $li.hasClass( "ui-tabs-selected" ) ) {
				o.selected = -1;

				if ( o.cookie ) {
					self._cookie( o.selected, o.cookie );
				}

				self.element.queue( "tabs", function() {
					self._hideTab( el, $hide );
				}).dequeue( "tabs" );

				el.blur();
				return;
			} else if ( !$hide.length ) {
				if ( o.cookie ) {
					self._cookie( o.selected, o.cookie );
				}

				self.element.queue( "tabs", function() {
					self._showTab( el, $show, event );
				});

				// TODO make passing in node possible, see also http://dev.jqueryui.com/ticket/3171
				self.load( self.anchors.index( el ) );

				el.blur();
				return;
			}
		}

		if ( o.cookie ) {
			self._cookie( o.selected, o.cookie );
		}

		// show new tab
		if ( $show.length ) {
			if ( $hide.length ) {
				self.element.queue( "tabs", function() {
					self._hideTab( el, $hide );
				});
			}
			self.element.queue( "tabs", function() {
				self._showTab( el, $show, event );
			});

			self.load( self.anchors.index( el ) );
		} else {
			throw "jQuery UI Tabs: Mismatching fragment identifier.";
		}

		// Prevent IE from keeping other link focussed when using the back button
		// and remove dotted border from clicked link. This is controlled via CSS
		// in modern browsers; blur() removes focus from address bar in Firefox
		// which can become a usability
		if ( $.browser.msie ) {
			el.blur();
		}
	},

    _getIndex: function( index ) {
		// meta-function to give users option to provide a href string instead of a numerical index.
		// also sanitizes numerical indexes to valid values.
		if ( typeof index == "string" ) {
			index = this.anchors.index( this.anchors.filter( "[href$=" + index + "]" ) );
		}

		return index;
	},

	_destroy: function() {
		var o = this.options;

		if ( this.xhr ) {
			this.xhr.abort();
		}

		this.element.removeClass( "ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible" );

		this.list.removeClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" );

		this.anchors.each(function() {
			var href = $.data( this, "href.tabs" );
			if ( href ) {
				this.href = href;
			}
			var $this = $( this ).unbind( ".tabs" );
			$.each( [ "href", "load" ], function( i, prefix ) {
				$this.removeData( prefix + ".tabs" );
			});
		});

		this.lis.unbind( ".tabs" ).add( this.panels ).each(function() {
			if ( $.data( this, "destroy.tabs" ) ) {
				$( this ).remove();
			} else {
				$( this ).removeClass([
					"ui-state-default",
					"ui-corner-top",
					"ui-tabs-selected",
					"ui-state-active",
					"ui-state-disabled",
					"ui-tabs-panel",
					"ui-widget-content",
					"ui-corner-bottom",
					"ui-tabs-hide"
				].join( " " ) );
			}
		});

		if ( o.cookie ) {
			this._cookie( null, o.cookie );
		}

		return this;
	},

	enable: function( index ) {
		if ( index === undefined ) {
			for ( var i = 0, len = this.lis.length; i < len; i++ ) {
				this.enable( i );
			}
			return this;
		}
		index = this._getIndex( index );
		var o = this.options;
		if ( !o.disabled || ($.isArray( o.disabled ) && $.inArray( index, o.disabled ) == -1 ) ) {
			return;
		}

		this.lis.eq( index ).removeClass( "ui-state-disabled" );
		o.disabled = this.lis.map( function( i ) {
			return $(this).is( ".ui-state-disabled" ) ? i : null;
		}).get();

		if ( !o.disabled.length ) {
			o.disabled = false;
		}

		return this;
	},

	disable: function( index ) {
		if ( index === undefined ) {
			for ( var i = 0, len = this.lis.length; i < len; i++ ) {
				this.disable( i );
			}
			return this;
		}
		index = this._getIndex( index );
		var o = this.options;
		if ( !o.disabled || ($.isArray( o.disabled ) && $.inArray( index, o.disabled ) == -1 ) ) {
			this.lis.eq( index ).addClass( "ui-state-disabled" );

			o.disabled = this.lis.map( function( i ) {
				return $(this).is( ".ui-state-disabled" ) ? i : null;
			}).get();
			
			if ( o.disabled.length === this.anchors.length ) {
				o.disabled = true;
			}

		}

		return this;
	},

	select: function( index ) {
		index = this._getIndex( index );
		if ( index == -1 ) {
			if ( this.options.collapsible && this.options.selected != -1 ) {
				index = this.options.selected;
			} else {
				return this;
			}
		}
		this.anchors.eq( index ).trigger( this.options.event + ".tabs" );
		return this;
	},

	load: function( index ) {
		index = this._getIndex( index );
		var self = this,
			o = this.options,
			a = this.anchors.eq( index )[ 0 ],
			url = $.data( a, "load.tabs" ),
			eventData = self._ui( self.anchors[ index ], self.panels[ index ] );

		if ( this.xhr ) {
			this.xhr.abort();
		}

		// not remote
		if ( !url ) {
			this.element.dequeue( "tabs" );
			return;
		}

		this.xhr = $.ajax({
			url: url,
			beforeSend: function( jqXHR, settings ) {
				return self._trigger( "beforeload", null,
						$.extend( { jqXHR: jqXHR, settings: settings }, eventData ) );
			}
		});

		if ( this.xhr ) {
			// load remote from here on
			this.lis.eq( index ).addClass( "ui-state-processing" );

			this.xhr
				.success( function( response ) {
					self.element.find( self._sanitizeSelector( a.hash ) ).html( response );
				})
				.complete( function( jqXHR, status ) {
					if ( status === "abort" ) {
						// stop possibly running animations
						self.element.queue( [] );
						self.panels.stop( false, true );

						// "tabs" queue must not contain more than two elements,
						// which are the callbacks for the latest clicked tab...
						self.element.queue( "tabs", self.element.queue( "tabs" ).splice( -2, 2 ) );

						delete this.xhr;
					}

					self.lis.eq( index ).removeClass( "ui-state-processing" );

					self._trigger( "load", null, eventData );
				});
		}

		// last, so that load event is fired before show...
		self.element.dequeue( "tabs" );

		return this;
	},

	url: function( index, url ) {
		this.anchors.eq( index ).data( "load.tabs", url );
		return this;
	}
});

$.extend( $.ui.tabs, {
	version: "@VERSION"
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {

	// ajaxOptions and cache options
	(function( $, prototype ) {
		$.extend( prototype.options, {
			ajaxOptions: null,
			cache: false
		});

		var _create = prototype._create,
			_setOption = prototype._setOption,
			_destroy = prototype._destroy,
			oldurl = prototype._url;

		$.extend( prototype, {
			_create: function() {
				_create.call( this );

				var self = this;

				this.element.bind( "tabsbeforeload", function( event, ui ) {
					// tab is already cached
					if ( $.data( ui.tab, "cache.tabs" ) ) {
						event.preventDefault();
						return;
					}

					$.extend( ui.settings, self.options.ajaxOptions, {
						error: function( xhr, s, e ) {
							try {
								// Passing index avoid a race condition when this method is
								// called after the user has selected another tab.
								// Pass the anchor that initiated this request allows
								// loadError to manipulate the tab content panel via $(a.hash)
								self.options.ajaxOptions.error( xhr, s, ui.index, ui.tab );
							}
							catch ( e ) {}
						}
					});

					ui.jqXHR.success( function() {
						if ( self.options.cache ) {
							$.data( ui.tab, "cache.tabs", true );
						}
					});
				});
			},

			_setOption: function( key, value ) {
				// reset cache if switching from cached to not cached
				if ( key === "cache" && value === false ) {
					this.anchors.removeData( "cache.tabs" );
				}
				_setOption.apply( this, arguments );
			},

			_destroy: function() {
				this.anchors.removeData( "cache.tabs" );
				_destroy.call( this );
			},

			url: function( index, url ){
				this.anchors.eq( index ).removeData( "cache.tabs" );
				oldurl.apply( this, arguments );
			}
		});
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// abort method
	(function( $, prototype ) {
		prototype.abort = function() {
			if ( this.xhr ) {
				this.xhr.abort();
			}
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// spinner
	(function( $, prototype ) {
		$.extend( prototype.options, {
			spinner: "<em>Loading&#8230;</em>"
		});

		var _create = prototype._create;
		prototype._create = function() {
			_create.call( this );
			var self = this;

			this.element.bind( "tabsbeforeload", function( event, ui ) {
				if ( self.options.spinner ) {
					var span = $( "span", ui.tab );
					if ( span.length ) {
						span.data( "label.tabs", span.html() ).html( self.options.spinner );
					}
				}
				ui.jqXHR.complete( function() {
					if ( self.options.spinner ) {
						var span = $( "span", ui.tab );
						if ( span.length ) {
							span.html( span.data( "label.tabs" ) ).removeData( "label.tabs" );
						}
					}
				});
			});
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// enable/disable events
	(function( $, prototype ) {
		$.extend( prototype.options, {
			enable: null,
			disable: null
		});

		var enable = prototype.enable,
			disable = prototype.disable;

		prototype.enable = function( index ) {
			var o = this.options,
				trigger;

			if ( index && o.disabled || ($.isArray( o.disabled ) && $.inArray( index, o.disabled ) !== -1 ) ) {
				trigger = true;
			}

			enable.apply( this, arguments );

			if ( trigger ) {
				this._trigger( "enable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			}
		};

		prototype.disable = function( index ) {
			var o = this.options,
				trigger;

			if ( index && !o.disabled || ($.isArray( o.disabled ) && $.inArray( index, o.disabled ) == -1 ) ) {
				trigger = true;
			}

			disable.apply( this, arguments );

			if ( trigger ) {
				this._trigger( "disable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			}
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// add/remove methods and events
	(function( $, prototype ) {
		$.extend( prototype.options, {
			add: null,
			remove: null
		});

		prototype.add = function( url, label, index ) {
			if ( index === undefined ) {
				index = this.anchors.length;
			}

			var self = this,
				o = this.options,
				$li = $( o.tabTemplate.replace( /#\{href\}/g, url ).replace( /#\{label\}/g, label ) ),
				id = !url.indexOf( "#" ) ? url.replace( "#", "" ) : this._tabId( $( "a", $li )[ 0 ] );

			$li.addClass( "ui-state-default ui-corner-top" ).data( "destroy.tabs", true );

			// try to find an existing element before creating a new one
			var $panel = self.element.find( "#" + id );
			if ( !$panel.length ) {
				$panel = $( o.panelTemplate )
					.attr( "id", id )
					.data( "destroy.tabs", true );
			}
			$panel.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide" );

			if ( index >= this.lis.length ) {
				$li.appendTo( this.list );
				$panel.appendTo( this.list[ 0 ].parentNode );
			} else {
				$li.insertBefore( this.lis[ index ] );
				$panel.insertBefore( this.panels[ index ] );
			}

			o.disabled = $.map( o.disabled, function( n, i ) {
				return n >= index ? ++n : n;
			});

			this.refresh();

			if ( this.anchors.length == 1 ) {
				o.selected = 0;
				$li.addClass( "ui-tabs-selected ui-state-active" );
				$panel.removeClass( "ui-tabs-hide" );
				this.element.queue( "tabs", function() {
					self._trigger( "show", null, self._ui( self.anchors[ 0 ], self.panels[ 0 ] ) );
				});

				this.load( 0 );
			}

			this._trigger( "add", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			return this;
		};

		prototype.remove = function( index ) {
			index = this._getIndex( index );
			var o = this.options,
				$li = this.lis.eq( index ).remove(),
				$panel = this.panels.eq( index ).remove();

			// If selected tab was removed focus tab to the right or
			// in case the last tab was removed the tab to the left.
			if ( $li.hasClass( "ui-tabs-selected" ) && this.anchors.length > 1) {
				this.select( index + ( index + 1 < this.anchors.length ? 1 : -1 ) );
			}

			o.disabled = $.map(
				$.grep( o.disabled, function(n, i) {
					return n != index;
				}),
				function( n, i ) {
					return n >= index ? --n : n;
				});

			this.refresh();

			this._trigger( "remove", null, this._ui( $li.find( "a" )[ 0 ], $panel[ 0 ] ) );
			return this;
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// length method
	(function( $, prototype ) {
		prototype.length = function() {
			return this.anchors.length;
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );
}

})( jQuery );
