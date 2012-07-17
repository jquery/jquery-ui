/*
 * jQuery UI Menubar @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Menubar
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 *	jquery.ui.menu.js
 */
(function( $ ) {

// TODO when mixing clicking menus and keyboard navigation, focus handling is broken
// there has to be just one item that has tabindex
$.widget( "ui.menubar", {
	version: "@VERSION",
	options: {
		autoExpand: false,
		buttons: false,
		items: "li",
		menuElement: "ul",
		menuIcon: false,
		position: {
			my: "left top",
			at: "left bottom"
		}
	},
	_create: function() {
		var that = this;
		this.menuItems = this.element.children( this.options.items );
		this.items = this.menuItems.children( "button, a" );

		this.menuItems
			.addClass( "ui-menubar-item" )
			.attr( "role", "presentation" );
		// let only the first item receive focus
		this.items.slice(1).attr( "tabIndex", -1 );

		this.element
			.addClass( "ui-menubar ui-widget-header ui-helper-clearfix" )
			.attr( "role", "menubar" );
		this._focusable( this.items );
		this._hoverable( this.items );
		this.items.siblings( this.options.menuElement )
			.menu({
				position: {
					within: this.options.position.within
				},
				select: function( event, ui ) {
					ui.item.parents( "ul.ui-menu:last" ).hide();
					that._close();
					// TODO what is this targetting? there's probably a better way to access it
					$(event.target).prev().focus();
					that._trigger( "select", event, ui );
				},
				menus: that.options.menuElement
			})
			.hide()
			.attr({
				"aria-hidden": "true",
				"aria-expanded": "false"
			})
			.bind( "keydown.menubar", function( event ) {
				var menu = $( this );
				if ( menu.is( ":hidden" ) ) {
					return;
				}
				switch ( event.keyCode ) {
				case $.ui.keyCode.LEFT:
					that.previous( event );
					event.preventDefault();
					break;
				case $.ui.keyCode.RIGHT:
					that.next( event );
					event.preventDefault();
					break;
				}
			});
		this.items.each(function() {
			var input = $(this),
				// TODO menu var is only used on two places, doesn't quite justify the .each
				menu = input.next( that.options.menuElement );

			// might be a non-menu button
			if ( menu.length ) {
				input.bind( "click.menubar focus.menubar mouseenter.menubar", function( event ) {
					// ignore triggered focus event
					if ( event.type === "focus" && !event.originalEvent ) {
						return;
					}
					event.preventDefault();
					// TODO can we simplify or extractthis check? especially the last two expressions
					// there's a similar active[0] == menu[0] check in _open
					if ( event.type === "click" && menu.is( ":visible" ) && that.active && that.active[0] === menu[0] ) {
						that._close();
						return;
					}
					if ( ( that.open && event.type === "mouseenter" ) || event.type === "click" || that.options.autoExpand ) {
						if( that.options.autoExpand ) {
							clearTimeout( that.closeTimer );
						}

						that._open( event, menu );
					}
				})
				.bind( "keydown", function( event ) {
					switch ( event.keyCode ) {
					case $.ui.keyCode.SPACE:
					case $.ui.keyCode.UP:
					case $.ui.keyCode.DOWN:
						that._open( event, $( this ).next() );
						event.preventDefault();
						break;
					case $.ui.keyCode.LEFT:
						that.previous( event );
						event.preventDefault();
						break;
					case $.ui.keyCode.RIGHT:
						that.next( event );
						event.preventDefault();
						break;
					}
				})
				.attr( "aria-haspopup", "true" );

				// TODO review if these options (menuIcon and buttons) are a good choice, maybe they can be merged
				if ( that.options.menuIcon ) {
					input.addClass( "ui-state-default" ).append( "<span class='ui-button-icon-secondary ui-icon ui-icon-triangle-1-s'></span>" );
					input.removeClass( "ui-button-text-only" ).addClass( "ui-button-text-icon-secondary" );
				}
			}

			input
				.addClass( "ui-button ui-widget ui-button-text-only ui-menubar-link" )
				.attr( "role", "menuitem" )
				.wrapInner( "<span class='ui-button-text'></span>" );

			if ( that.options.buttons ) {
				input.removeClass( "ui-menubar-link" ).addClass( "ui-state-default" );
			}
		});
		that._on( {
			keydown: function( event ) {
				if ( event.keyCode === $.ui.keyCode.ESCAPE && that.active && that.active.menu( "collapse", event ) !== true ) {
					var active = that.active;
					that.active.blur();
					that._close( event );
					active.prev().focus();
				}
			},
			focusin: function( event ) {
				clearTimeout( that.closeTimer );
			},
			focusout: function( event ) {
				that.closeTimer = setTimeout( function() {
					that._close( event );
				}, 150);
			},
			"mouseleave .ui-menubar-item": function( event ) {
				if ( that.options.autoExpand ) {
					that.closeTimer = setTimeout( function() {
						that._close( event );
					}, 150);
				}
			},
			"mouseenter .ui-menubar-item": function( event ) {
				clearTimeout( that.closeTimer );
			}
		});

		// Keep track of open submenus
		this.openSubmenus = 0;
	},

	_destroy : function() {
		this.menuItems
			.removeClass( "ui-menubar-item" )
			.removeAttr( "role" );

		this.element
			.removeClass( "ui-menubar ui-widget-header ui-helper-clearfix" )
			.removeAttr( "role" )
			.unbind( ".menubar" );

		this.items
			.unbind( ".menubar" )
			.removeClass( "ui-button ui-widget ui-button-text-only ui-menubar-link ui-state-default" )
			.removeAttr( "role" )
			.removeAttr( "aria-haspopup" )
			// TODO unwrap?
			.children( "span.ui-button-text" ).each(function( i, e ) {
				var item = $( this );
				item.parent().html( item.html() );
			})
			.end()
			.children( ".ui-icon" ).remove();

		this.element.find( ":ui-menu" )
			.menu( "destroy" )
			.show()
			.removeAttr( "aria-hidden" )
			.removeAttr( "aria-expanded" )
			.removeAttr( "tabindex" )
			.unbind( ".menubar" );
	},

	_close: function() {
		if ( !this.active || !this.active.length ) {
			return;
		}
		this.active
			.menu( "collapseAll" )
			.hide()
			.attr({
				"aria-hidden": "true",
				"aria-expanded": "false"
			});
		this.active
			.prev()
			.removeClass( "ui-state-active" )
			.removeAttr( "tabIndex" );
		this.active = null;
		this.open = false;
		this.openSubmenus = 0;
	},

	_open: function( event, menu ) {
		// on a single-button menubar, ignore reopening the same menu
		if ( this.active && this.active[0] === menu[0] ) {
			return;
		}
		// TODO refactor, almost the same as _close above, but don't remove tabIndex
		if ( this.active ) {
			this.active
				.menu( "collapseAll" )
				.hide()
				.attr({
					"aria-hidden": "true",
					"aria-expanded": "false"
				});
			this.active
				.prev()
				.removeClass( "ui-state-active" );
		}
		// set tabIndex -1 to have the button skipped on shift-tab when menu is open (it gets focus)
		var button = menu.prev().addClass( "ui-state-active" ).attr( "tabIndex", -1 );
		this.active = menu
			.show()
			.position( $.extend({
				of: button
			}, this.options.position ) )
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.menu("focus", event, menu.children( ".ui-menu-item" ).first() )
			// TODO need a comment here why both events are triggered
			.focus()
			.focusin();
		this.open = true;
	},

	next: function( event ) {
		if ( this.open && this.active.data( "menu" ).active.has( ".ui-menu" ).length ) {
			// Track number of open submenus and prevent moving to next menubar item
			this.openSubmenus++;
			return;
		}
		this.openSubmenus = 0;
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		if ( this.open && this.openSubmenus ) {
			// Track number of open submenus and prevent moving to previous menubar item
			this.openSubmenus--;
			return;
		}
		this.openSubmenus = 0;
		this._move( "prev", "last", event );
	},

	_move: function( direction, filter, event ) {
		var next,
			wrapItem;
		if ( this.open ) {
			next = this.active.closest( ".ui-menubar-item" )[ direction + "All" ]( this.options.items ).first().children( ".ui-menu" ).eq( 0 );
			wrapItem = this.menuItems[ filter ]().children( ".ui-menu" ).eq( 0 );
		} else {
			if ( event ) {
				next = $( event.target ).closest( ".ui-menubar-item" )[ direction + "All" ]( this.options.items ).children( ".ui-menubar-link" ).eq( 0 );
				wrapItem = this.menuItems[ filter ]().children( ".ui-menubar-link" ).eq( 0 );
			} else {
				next = wrapItem = this.menuItems.children( "a" ).eq( 0 );
			}
		}

		if ( next.length ) {
			if ( this.open ) {
				this._open( event, next );
			} else {
				next.removeAttr( "tabIndex")[0].focus();
			}
		} else {
			if ( this.open ) {
				this._open( event, wrapItem );
			} else {
				wrapItem.removeAttr( "tabIndex")[0].focus();
			}
		}
	}
});

}( jQuery ));
