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

var tabId = 0;
function getNextTabId() {
	return ++tabId;
}

var isLocal = (function() {
	var rhash = /#.*$/,
		currentPage = location.href.replace( rhash, "" );

	return function( anchor ) {
		// clone the node to work around IE 6 not normalizing the href property
		// if it's manually set, i.e., a.href = "#foo" kills the normalization
		anchor = anchor.cloneNode( false );
		return anchor.hash.length > 1 &&
			anchor.href.replace( rhash, "" ) === currentPage;
	};
})();

$.widget( "ui.tabs", {
	version: "@VERSION",
	options: {
		active: null,
		collapsible: false,
		event: "click",
		fx: null, // e.g. { height: 'toggle', opacity: 'toggle', duration: 200 }

		// callbacks
		activate: null,
		beforeActivate: null,
		beforeLoad: null,
		load: null
	},

	_create: function() {
		var that = this,
			options = that.options,
			active = options.active;

		that.running = false;

		that.element.addClass( "ui-tabs ui-widget ui-widget-content ui-corner-all" );

		that._processTabs();

		if ( active === null ) {
			// check the fragment identifier in the URL
			if ( location.hash ) {
				that.anchors.each(function( i, tab ) {
					if ( tab.hash === location.hash ) {
						active = i;
						return false;
					}
				});
			}

			// check for a tab marked active via a class
			if ( active === null ) {
				active = that.lis.filter( ".ui-tabs-active" ).index();
			}

			// no active tab, set to false
			if ( active === null || active === -1 ) {
				active = that.lis.length ? 0 : false;
			}
		}

		// handle numbers: negative, out of range
		if ( active !== false ) {
			active = this.lis.eq( active ).index();
			if ( active === -1 ) {
				active = options.collapsible ? false : 0;
			}
		}
		options.active = active;

		// don't allow collapsible: false and active: false
		if ( !options.collapsible && options.active === false && this.anchors.length ) {
			options.active = 0;
		}

		// Take disabling tabs via class attribute from HTML
		// into account and update option properly.
		if ( $.isArray( options.disabled ) ) {
			options.disabled = $.unique( options.disabled.concat(
				$.map( this.lis.filter( ".ui-state-disabled" ), function( n, i ) {
					return that.lis.index( n );
				})
			) ).sort();
		}

		this._setupFx( options.fx );

		this._refresh();

		// highlight selected tab
		this.panels.hide();
		this.lis.removeClass( "ui-tabs-active ui-state-active" );
		// check for length avoids error when initializing empty list
		if ( options.active !== false && this.anchors.length ) {
			this.active = this._findActive( options.active );
			var panel = that._getPanelForTab( this.active );

			panel.show();
			this.lis.eq( options.active ).addClass( "ui-tabs-active ui-state-active" );
			this.load( options.active );
		} else {
			this.active = $();
		}
	},

	_setOption: function( key, value ) {
		if ( key == "active" ) {
			// _activate() will handle invalid values and update this.options
			this._activate( value );
			return;
		}

		if ( key === "disabled" ) {
			// don't use the widget factory's disabled handling
			this._setupDisabled( value );
			return;
		}

		this._super( key, value);

		// setting collapsible: false while collapsed; open first panel
		if ( key === "collapsible" && !value && this.options.active === false ) {
			this._activate( 0 );
		}

		if ( key === "event" ) {
			this._setupEvents( value );
		}

		if ( key === "fx" ) {
			this._setupFx( value );
		}
	},

	_tabId: function( a ) {
		return $( a ).attr( "aria-controls" ) || "ui-tabs-" + getNextTabId();
	},

	_sanitizeSelector: function( hash ) {
		// we need this because an id may contain a ":"
		return hash ? hash.replace( /[!"$%&'()*+,.\/:;<=>?@[\]^`{|}~]/g, "\\$&" ) : "";
	},

	refresh: function() {
		var self = this,
			options = this.options,
			lis = this.list.children( ":has(a[href])" );

		// get disabled tabs from class attribute from HTML
		// this will get converted to a boolean if needed in _refresh()
		options.disabled = $.map( lis.filter( ".ui-state-disabled" ), function( tab ) {
			return lis.index( tab );
		});

		this._processTabs();
		this._refresh();
		this.panels.not( this._getPanelForTab( this.active ) ).hide();

		// was collapsed or no tabs
		if ( options.active === false || !this.anchors.length ) {
			options.active = false;
			this.active = $();
		// was active, but active tab is gone
		} else if ( this.active.length && !$.contains( this.list[ 0 ], this.active[ 0 ] ) ) {
			// activate previous tab
			var next = options.active - 1;
			this._activate( next >= 0 ? next : 0 );
		// was active, active tab still exists
		} else {
			// make sure active index is correct
			options.active = this.anchors.index( this.active );
		}
	},

	_refresh: function() {
		var options = this.options;

		this.element.toggleClass( "ui-tabs-collapsible", options.collapsible );
		this.list.addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" );
		this.lis.addClass( "ui-state-default ui-corner-top" );
		this.panels.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" );

		this._setupDisabled( options.disabled );
		this._setupEvents( options.event );

		// remove all handlers, may run on existing tabs
		this.lis.unbind( ".tabs" );
		this._focusable( this.lis );
		this._hoverable( this.lis );
	},

	_processTabs: function() {
		var self = this;

		this.list = this.element.find( "ol,ul" ).eq( 0 );
		this.lis = $( " > li:has(a[href])", this.list );
		this.anchors = this.lis.map(function() {
			return $( "a", this )[ 0 ];
		});
		this.panels = $( [] );

		this.anchors.each(function( i, a ) {
			var selector, panel;

			// inline tab
			if ( isLocal( a ) ) {
				selector = a.hash;
				panel = self.element.find( self._sanitizeSelector( selector ) );
			// remote tab
			} else {
				var id = self._tabId( a );
				selector = "#" + id;
				panel = self.element.find( selector );
				if ( !panel.length ) {
					panel = self._createPanel( id );
					panel.insertAfter( self.panels[ i - 1 ] || self.list );
				}
			}

			if ( panel.length) {
				self.panels = self.panels.add( panel );
			}
			$( a ).attr( "aria-controls", selector.substring( 1 ) );
		});
	},

	_createPanel: function( id ) {
		return $( "<div></div>" )
					.attr( "id", id )
					.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
					.data( "destroy.tabs", true );
	},

	_setupDisabled: function( disabled ) {
		if ( $.isArray( disabled ) ) {
			if ( !disabled.length ) {
				disabled = false;
			} else if ( disabled.length === this.anchors.length ) {
				disabled = true;
			}
		}

		// disable tabs
		for ( var i = 0, li; ( li = this.lis[ i ] ); i++ ) {
			$( li ).toggleClass( "ui-state-disabled", ( disabled === true || $.inArray( i, disabled ) !== -1 ) );
		}

		this.options.disabled = disabled;
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

	// TODO: remove once jQuery core properly removes filters - see #4621
	_resetStyle: function ( $el, fx ) {
		if ( !$.support.opacity && fx.opacity ) {
			$el[ 0 ].style.removeAttribute( "filter" );
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
		var that = this,
			options = that.options,
			active = that.active,
			clicked = $( event.currentTarget ),
			clickedIsActive = clicked[ 0 ] === active[ 0 ],
			collapsing = clickedIsActive && options.collapsible,
			toShow = collapsing ? $() : that._getPanelForTab( clicked ),
			toHide = !active.length ? $() : that._getPanelForTab( active ),
			tab = clicked.closest( "li" ),
			eventData = {
				oldTab: active,
				oldPanel: toHide,
				newTab: collapsing ? $() : clicked,
				newPanel: toShow
			};

		event.preventDefault();

		if ( tab.hasClass( "ui-state-disabled" ) ||
				// tab is already loading
				tab.hasClass( "ui-tabs-loading" ) ||
				// can't switch durning an animation
				that.running ||
				// click on active header, but not collapsible
				( clickedIsActive && !options.collapsible ) ||
				// allow canceling activation
				( that._trigger( "beforeActivate", event, eventData ) === false ) ) {
			clicked[ 0 ].blur();
			return;
		}

		options.active = collapsing ? false : that.anchors.index( clicked );

		that.active = clickedIsActive ? $() : clicked;
		if ( that.xhr ) {
			that.xhr.abort();
		}

		if ( !toHide.length && !toShow.length ) {
			throw "jQuery UI Tabs: Mismatching fragment identifier.";
		}

		if ( toShow.length ) {

			// TODO make passing in node possible
			that.load( that.anchors.index( clicked ), event );

			clicked[ 0 ].blur();
		}
		that._toggle( event, eventData );
	},

	// handles show/hide for selecting tabs
	_toggle: function( event, eventData ) {
		var that = this,
			options = that.options,
			toShow = eventData.newPanel,
			toHide = eventData.oldPanel;

		that.running = true;

		function complete() {
			that.running = false;
			that._trigger( "activate", event, eventData );
		}

		function show() {
			eventData.newTab.closest( "li" ).addClass( "ui-tabs-active ui-state-active" );

			if ( toShow.length && that.showFx ) {
				toShow
					.animate( that.showFx, that.showFx.duration || "normal", function() {
						that._resetStyle( $( this ), that.showFx );
						complete();
					});
			} else {
				toShow.show();
				complete();
			}
		}

		// start out by hiding, then showing, then completing
		if ( toHide.length && that.hideFx ) {
			toHide.animate( that.hideFx, that.hideFx.duration || "normal", function() {
				eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
				that._resetStyle( $( this ), that.hideFx );
				show();
			});
		} else {
			eventData.oldTab.closest( "li" ).removeClass( "ui-tabs-active ui-state-active" );
			toHide.hide();
			show();
		}
	},

	_activate: function( index ) {
		var active = this._findActive( index )[ 0 ];

		// trying to activate the already active panel
		if ( active === this.active[ 0 ] ) {
			return;
		}

		// trying to collapse, simulate a click on the current active header
		active = active || this.active[ 0 ];

		this._eventHandler({
			target: active,
			currentTarget: active,
			preventDefault: $.noop
		});
	},

	_findActive: function( selector ) {
		return typeof selector === "number" ? this.anchors.eq( selector ) :
				typeof selector === "string" ? this.anchors.filter( "[href$='" + selector + "']" ) : $();
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

		this.anchors
			.unbind( ".tabs" )
			.removeData( "href.tabs" )
			.removeData( "load.tabs" );

		this.lis.unbind( ".tabs" ).add( this.panels ).each(function() {
			if ( $.data( this, "destroy.tabs" ) ) {
				$( this ).remove();
			} else {
				$( this ).removeClass([
					"ui-state-default",
					"ui-corner-top",
					"ui-tabs-active",
					"ui-state-active",
					"ui-state-disabled",
					"ui-tabs-panel",
					"ui-widget-content",
					"ui-corner-bottom"
				].join( " " ) );
			}
		});

		return this;
	},

	enable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === false ) {
			return;
		}

		if ( index === undefined ) {
			disabled = false;
		} else {
			index = this._getIndex( index );
			if ( $.isArray( disabled ) ) {
				disabled = $.map( disabled, function( num ) {
					return num !== index ? num : null;
				});
			} else {
				disabled = $.map( this.lis, function( li, num ) {
					return num !== index ? num : null;
				});
			}
		}
		this._setupDisabled( disabled );
	},

	disable: function( index ) {
		var disabled = this.options.disabled;
		if ( disabled === true ) {
			return;
		}

		if ( index === undefined ) {
			disabled = true;
		} else {
			index = this._getIndex( index );
			if ( $.inArray( index, disabled ) !== -1 ) {
				return;
			}
			if ( $.isArray( disabled ) ) {
				disabled = $.merge( [ index ], disabled ).sort();
			} else {
				disabled = [ index ];
			}
		}
		this._setupDisabled( disabled );
	},

	load: function( index, event ) {
		index = this._getIndex( index );
		var self = this,
			options = this.options,
			anchor = this.anchors.eq( index ),
			panel = self._getPanelForTab( anchor ),
			eventData = {
				tab: anchor,
				panel: panel
			};

		// not remote
		if ( isLocal( anchor[ 0 ] ) ) {
			return;
		}

		this.xhr = $.ajax({
			url: anchor.attr( "href" ),
			beforeSend: function( jqXHR, settings ) {
				return self._trigger( "beforeLoad", event,
					$.extend( { jqXHR : jqXHR, ajaxSettings: settings }, eventData ) );
			}
		});

		if ( this.xhr ) {
			this.lis.eq( index ).addClass( "ui-tabs-loading" );

			this.xhr
				.success(function( response ) {
					// TODO: IE resolves cached XHRs immediately
					// remove when core #10467 is fixed
					setTimeout(function() {
						panel.html( response );
						self._trigger( "load", event, eventData );
					}, 1 );
				})
				.complete(function( jqXHR, status ) {
					// TODO: IE resolves cached XHRs immediately
					// remove when core #10467 is fixed
					setTimeout(function() {
						if ( status === "abort" ) {
							self.panels.stop( false, true );
						}

						self.lis.eq( index ).removeClass( "ui-tabs-loading" );

						if ( jqXHR === self.xhr ) {
							delete self.xhr;
						}
					}, 1 );
				});
		}

		return this;
	},

	_getPanelForTab: function( tab ) {
		var id = $( tab ).attr( "aria-controls" );
		return this.element.find( this._sanitizeSelector( "#" + id ) );
	}
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {

	// helper method for a lot of the back compat extensions
	$.ui.tabs.prototype._ui = function( tab, panel ) {
		return {
			tab: tab,
			panel: panel,
			index: this.anchors.index( tab )
		};
	};

	// url method
	(function( $, prototype ) {
		prototype.url = function( index, url ) {
			this.anchors.eq( index ).attr( "href", url );
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// ajaxOptions and cache options
	(function( $, prototype ) {
		$.extend( prototype.options, {
			ajaxOptions: null,
			cache: false
		});

		var _create = prototype._create,
			_setOption = prototype._setOption,
			_destroy = prototype._destroy,
			oldurl = prototype.url || $.noop;

		$.extend( prototype, {
			_create: function() {
				_create.call( this );

				var self = this;

				this.element.bind( "tabsbeforeload.tabs", function( event, ui ) {
					// tab is already cached
					if ( $.data( ui.tab[ 0 ], "cache.tabs" ) ) {
						event.preventDefault();
						return;
					}

					$.extend( ui.ajaxSettings, self.options.ajaxOptions, {
						error: function( xhr, s, e ) {
							try {
								// Passing index avoid a race condition when this method is
								// called after the user has selected another tab.
								// Pass the anchor that initiated this request allows
								// loadError to manipulate the tab content panel via $(a.hash)
								self.options.ajaxOptions.error( xhr, s, ui.tab.closest( "li" ).index(), ui.tab[ 0 ] );
							}
							catch ( e ) {}
						}
					});

					ui.jqXHR.success(function() {
						if ( self.options.cache ) {
							$.data( ui.tab[ 0 ], "cache.tabs", true );
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
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			spinner: "<em>Loading&#8230;</em>"
		},
		_create: function() {
			this._super();
			this._bind({
				tabsbeforeload: function( event, ui ) {
					if ( !this.options.spinner ) {
						return;
					}

					var span = ui.tab.find( "span" ),
						html = span.html();
					span.html( this.options.spinner );
					ui.jqXHR.complete(function() {
						span.html( html );
					});
				}
			});
		}
	});

	// enable/disable events
	(function( $, prototype ) {
		$.extend( prototype.options, {
			enable: null,
			disable: null
		});

		var enable = prototype.enable,
			disable = prototype.disable;

		prototype.enable = function( index ) {
			var options = this.options,
				trigger;

			if ( index && options.disabled === true ||
					( $.isArray( options.disabled ) && $.inArray( index, options.disabled ) !== -1 ) ) {
				trigger = true;
			}

			enable.apply( this, arguments );

			if ( trigger ) {
				this._trigger( "enable", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			}
		};

		prototype.disable = function( index ) {
			var options = this.options,
				trigger;

			if ( index && options.disabled === false ||
					( $.isArray( options.disabled ) && $.inArray( index, options.disabled ) === -1 ) ) {
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
			remove: null,
			tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
		});

		prototype.add = function( url, label, index ) {
			if ( index === undefined ) {
				index = this.anchors.length;
			}

			var options = this.options,
				li = $( options.tabTemplate
					.replace( /#\{href\}/g, url )
					.replace( /#\{label\}/g, label ) ),
				id = !url.indexOf( "#" ) ?
					url.replace( "#", "" ) :
					this._tabId( li.find( "a" )[ 0 ] );

			li.addClass( "ui-state-default ui-corner-top" ).data( "destroy.tabs", true );
			li.find( "a" ).attr( "aria-controls", id );

			var doInsertAfter = index >= this.lis.length;

			// try to find an existing element before creating a new one
			var panel = this.element.find( "#" + id );
			if ( !panel.length ) {
				panel = this._createPanel( id );
				if ( doInsertAfter ) {
					if ( index > 0 ) {
						panel.insertAfter( this.panels.eq( -1 ) );
					} else {
						panel.appendTo( this.element );
					}
				} else {
					panel.insertBefore( this.panels[ index ] );
				}
			}
			panel.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" ).hide();

			if ( doInsertAfter ) {
				li.appendTo( this.list );
			} else {
				li.insertBefore( this.lis[ index ] );
			}

			options.disabled = $.map( options.disabled, function( n ) {
				return n >= index ? ++n : n;
			});

			this.refresh();
			if ( this.lis.length === 1 && options.active === false ) {
				this.option( "active", 0 );
			}

			this._trigger( "add", null, this._ui( this.anchors[ index ], this.panels[ index ] ) );
			return this;
		};

		prototype.remove = function( index ) {
			index = this._getIndex( index );
			var options = this.options,
				tab = this.lis.eq( index ).remove(),
				panel = this._getPanelForTab( tab.find( "a[aria-controls]" ) ).remove();

			// If selected tab was removed focus tab to the right or
			// in case the last tab was removed the tab to the left.
			// We check for more than 2 tabs, because if there are only 2,
			// then when we remove this tab, there will only be one tab left
			// so we don't need to detect which tab to activate.
			if ( tab.hasClass( "ui-tabs-active" ) && this.anchors.length > 2 ) {
				this._activate( index + ( index + 1 < this.anchors.length ? 1 : -1 ) );
			}

			options.disabled = $.map(
				$.grep( options.disabled, function( n ) {
					return n !== index;
				}),
				function( n ) {
					return n >= index ? --n : n;
				});

			this.refresh();

			this._trigger( "remove", null, this._ui( tab.find( "a" )[ 0 ], panel[ 0 ] ) );
			return this;
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// length method
	(function( $, prototype ) {
		prototype.length = function() {
			return this.anchors.length;
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// panel ids (idPrefix option + title attribute)
	(function( $, prototype ) {
		$.extend( prototype.options, {
			idPrefix: "ui-tabs-"
		});

		var _tabId = prototype._tabId;
		prototype._tabId = function( a ) {
			return $( a ).attr( "aria-controls" ) ||
				a.title && a.title.replace( /\s/g, "_" ).replace( /[^\w\u00c0-\uFFFF-]/g, "" ) ||
				this.options.idPrefix + getNextTabId();
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// _createPanel method
	(function( $, prototype ) {
		$.extend( prototype.options, {
			panelTemplate: "<div></div>"
		});

		var _createPanel = prototype._createPanel;
		prototype._createPanel = function( id ) {
			return $( this.options.panelTemplate )
					.attr( "id", id )
					.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" )
					.data( "destroy.tabs", true );
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// selected option
	(function( $, prototype ) {
		var _create = prototype._create,
			_setOption = prototype._setOption,
			_eventHandler = prototype._eventHandler;

		prototype._create = function() {
			var options = this.options;
			if ( options.active === null && options.selected !== undefined ) {
				options.active = options.selected === -1 ? false : options.selected;
			}
			_create.call( this );
			options.selected = options.active;
			if ( options.selected === false ) {
				options.selected = -1;
			}
		};

		prototype._setOption = function( key, value ) {
			if ( key !== "selected" ) {
				return _setOption.apply( this, arguments );
			}

			var options = this.options;
			_setOption.call( this, "active", value === -1 ? false : value );
			options.selected = options.active;
			if ( options.selected === false ) {
				options.selected = -1;
			}
		};

		prototype._eventHandler = function( event ) {
			_eventHandler.apply( this, arguments );
			this.options.selected = this.options.active;
			if ( this.options.selected === false ) {
				this.options.selected = -1;
			}
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// show and select event
	(function( $, prototype ) {
		$.extend( prototype.options, {
			show: null,
			select: null
		});
		var _create = prototype._create,
			_trigger = prototype._trigger;

		prototype._create = function() {
			_create.call( this );
			if ( this.options.active !== false ) {
				this._trigger( "show", null, this._ui(
					this.active[ 0 ], this._getPanelForTab( this.active )[ 0 ] ) );
			}
		};
		prototype._trigger = function( type, event, data ) {
			var ret = _trigger.apply( this, arguments );
			if ( !ret ) {
				return false;
			}
			if ( type === "beforeActivate" && data.newTab.length ) {
				ret = _trigger.call( this, "select", event, {
					tab: data.newTab[ 0],
					panel: data.newPanel[ 0 ],
					index: data.newTab.closest( "li" ).index()
				});
			} else if ( type === "activate" && data.newTab.length ) {
				ret = _trigger.call( this, "show", event, {
					tab: data.newTab[ 0 ],
					panel: data.newPanel[ 0 ],
					index: data.newTab.closest( "li" ).index()
				});
			}
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// select method
	(function( $, prototype ) {
		prototype.select = function( index ) {
			index = this._getIndex( index );
			if ( index === -1 ) {
				if ( this.options.collapsible && this.options.selected !== -1 ) {
					index = this.options.selected;
				} else {
					return;
				}
			}
			this.anchors.eq( index ).trigger( this.options.event + ".tabs" );
		};
	}( jQuery, jQuery.ui.tabs.prototype ) );

	// cookie option
	var listId = 0;
	function getNextListId() {
		return ++listId;
	}
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			cookie: null // e.g. { expires: 7, path: '/', domain: 'jquery.com', secure: true }
		},
		_create: function() {
			var options = this.options,
				active;
			if ( options.active == null && options.cookie ) {
				active = parseInt( this._cookie(), 10 );
				if ( active === -1 ) {
					active = false;
				}
				options.active = active;
			}
			this._super();
		},
		_cookie: function( active ) {
			var cookie = [ this.cookie ||
				( this.cookie = this.options.cookie.name || "ui-tabs-" + getNextListId() ) ];
			if ( arguments.length ) {
				cookie.push( active === false ? -1 : active );
				cookie.push( this.options.cookie );
			}
			return $.cookie.apply( null, cookie );
		},
		_refresh: function() {
			this._super();
			if ( this.options.cookie ) {
				this._cookie( this.options.active, this.options.cookie );
			}
		},
		_eventHandler: function( event ) {
			this._superApply( arguments );
			if ( this.options.cookie ) {
				this._cookie( this.options.active, this.options.cookie );
			}
		},
		_destroy: function() {
			this._super();
			if ( this.options.cookie ) {
				this._cookie( null, this.options.cookie );
			}
		}
	});

	// load event
	$.widget( "ui.tabs", $.ui.tabs, {
		_trigger: function( type, event, data ) {
			var _data = $.extend( {}, data );
			if ( type === "load" ) {
				_data.panel = _data.panel[ 0 ];
				_data.tab = _data.tab[ 0 ];
			}
			return this._super( type, event, _data );
		}
	});
}

})( jQuery );
