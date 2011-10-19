/*
 * jQuery UI Menu @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Menu
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function($) {

var idIncrement = 0;

$.widget( "ui.menu", {
	version: "@VERSION",
	defaultElement: "<ul>",
	delay: 150,
	options: {
		items: "ul",
		position: {
			my: "left top",
			at: "right top"
		},
		trigger: null
	},
	_create: function() {
		this.activeMenu = this.element;
		this.isScrolling = false;
		this.menuId = this.element.attr( "id" ) || "ui-menu-" + idIncrement++;
		if ( this.element.find( ".ui-icon" ).length ) {
			this.element.addClass( "ui-menu-icons" );
		}
		this.element
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.attr({
				id: this.menuId,
				role: "menu"
			})
			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			// If the link is clicked, redirect focus to the menu.
			// TODO move to _bind below
			.bind( "mousedown.menu", function( event ) {
				if ( $( event.target).is( "a" ) ) {
					event.preventDefault();
					$( this ).focus( 1 );
				}
			})
			// need to catch all clicks on disabled menu
			// not possible through _bind
			.bind( "click.menu", $.proxy( function( event ) {
				if ( this.options.disabled ) {
					event.preventDefault();
				}
			}, this));
		this._bind({
			"click .ui-menu-item:has(a)": function( event ) {
				event.stopImmediatePropagation();
				var target = $( event.currentTarget );
				// it's possible to click an item without hovering it (#7085)
				if ( !this.active || ( this.active[ 0 ] !== target[ 0 ] ) ) {
					this.focus( event, target );
				}
				this.select( event );
			},
			"mouseover .ui-menu-item": function( event ) {
				event.stopImmediatePropagation();
				if ( !this.isScrolling ) {
					var target = $( event.currentTarget );
					// Remove ui-state-active class from siblings of the newly focused menu item to avoid a jump caused by adjacent elements both having a class with a border
					target.siblings().children( ".ui-state-active" ).removeClass( "ui-state-active" );
					this.focus( event, target );
				}
				this.isScrolling = false;
			},
			"mouseleave": "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			"mouseout .ui-menu-item": "blur",
			"focus": function( event ) {
				this.focus( event, $( event.target ).children( ".ui-menu-item:first" ) );
			},
			blur: function( event ) {
				this._delay( function() {
					if ( ! $.contains( this.element[0], document.activeElement ) ) {
						this.collapseAll( event );
					}
				}, 0);
			},
			scroll: function( event ) {
				// Keep track of scrolling to prevent mouseover from firing inadvertently when scrolling the menu
				this.isScrolling = true;
			}
		});

		this.refresh();

		this.element.attr( "tabIndex", 0 );
		this._bind({
			"keydown": function( event ) {
				switch ( event.keyCode ) {
				case $.ui.keyCode.PAGE_UP:
					this.previousPage( event );
					event.preventDefault();
					event.stopImmediatePropagation();
					break;
				case $.ui.keyCode.PAGE_DOWN:
					this.nextPage( event );
					event.preventDefault();
					event.stopImmediatePropagation();
					break;
				case $.ui.keyCode.HOME:
					this._move( "first", "first", event );
					event.preventDefault();
					event.stopImmediatePropagation();
					break;
				case $.ui.keyCode.END:
					this._move( "last", "last", event );
					event.preventDefault();
					event.stopImmediatePropagation();
					break;
				case $.ui.keyCode.UP:
					this.previous( event );
					event.preventDefault();
					event.stopImmediatePropagation();
					break;
				case $.ui.keyCode.DOWN:
					this.next( event );
					event.preventDefault();
					event.stopImmediatePropagation();
					break;
				case $.ui.keyCode.LEFT:
					if (this.collapse( event )) {
						event.stopImmediatePropagation();
					}
					event.preventDefault();
					break;
				case $.ui.keyCode.RIGHT:
					if (this.expand( event )) {
						event.stopImmediatePropagation();
					}
					event.preventDefault();
					break;
				case $.ui.keyCode.ENTER:
					if ( this.active.children( "a[aria-haspopup='true']" ).length ) {
						if ( this.expand( event ) ) {
							event.stopImmediatePropagation();
						}
					}
					else {
						this.select( event );
						event.stopImmediatePropagation();
					}
					event.preventDefault();
					break;
				case $.ui.keyCode.ESCAPE:
					if ( this.collapse( event ) ) {
						event.stopImmediatePropagation();
					}
					event.preventDefault();
					break;
				default:
					event.stopPropagation();
					clearTimeout( this.filterTimer );
					var match,
						prev = this.previousFilter || "",
						character = String.fromCharCode( event.keyCode ),
						skip = false;

					if (character == prev) {
						skip = true;
					} else {
						character = prev + character;
					}
					function escape( value ) {
						return value.replace( /[-[\]{}()*+?.,\\^$|#\s]/g , "\\$&" );
					}
					match = this.activeMenu.children( ".ui-menu-item" ).filter( function() {
						return new RegExp("^" + escape(character), "i")
							.test( $( this ).children( "a" ).text() );
					});
					match = skip && match.index(this.active.next()) != -1 ? this.active.nextAll(".ui-menu-item") : match;
					if ( !match.length ) {
						character = String.fromCharCode(event.keyCode);
						match = this.activeMenu.children(".ui-menu-item").filter( function() {
							return new RegExp("^" + escape(character), "i")
								.test( $( this ).children( "a" ).text() );
						});
					}
					if ( match.length ) {
						this.focus( event, match );
						if (match.length > 1) {
							this.previousFilter = character;
							this.filterTimer = this._delay( function() {
								delete this.previousFilter;
							}, 1000 );
						} else {
							delete this.previousFilter;
						}
					} else {
						delete this.previousFilter;
					}
				}
			}
		});

		this._bind( document, {
			click: function( event ) {
				if ( !$( event.target ).closest( ".ui-menu" ).length ) {
					this.collapseAll( event );
				}
			}
		});

		if ( this.options.trigger ) {
			this.element.popup({
				trigger: this.options.trigger,
				managed: true,
				focusPopup: $.proxy( function( event, ui ) {
					this.focus( event, this.element.children( ".ui-menu-item" ).first() );
					this.element.focus( 1 );
				}, this)
			});
		}
	},

	_destroy: function() {
		//destroy (sub)menus
		if ( this.options.trigger ) {
			this.element.popup( "destroy" );
		}
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" )
			.andSelf()
			.removeClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "role" )
			.removeAttr( "tabIndex" )
			.removeAttr( "aria-labelledby" )
			.removeAttr( "aria-expanded" )
			.removeAttr( "aria-hidden" )
			.show();

		//destroy menu items
		this.element.find( ".ui-menu-item" )
			.unbind( ".menu" )
			.removeClass( "ui-menu-item" )
			.removeAttr( "role" )
			.children( "a" )
			.removeClass( "ui-corner-all ui-state-hover" )
			.removeAttr( "tabIndex" )
			.removeAttr( "role" )
			.removeAttr( "aria-haspopup" )
			.removeAttr( "id" )
			.children( ".ui-icon" )
			.remove();
	},

	refresh: function() {
		// initialize nested menus
		var submenus = this.element.find( this.options.items + ":not( .ui-menu )" )
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.attr( "role", "menu" )
			.hide()
			.attr( "aria-hidden", "true" )
			.attr( "aria-expanded", "false" );

		// don't refresh list items that are already adapted
		var menuId = this.menuId;
		submenus.add( this.element ).children( ":not( .ui-menu-item ):has( a )" )
			.addClass( "ui-menu-item" )
			.attr( "role", "presentation" )
			.children( "a" )
				.addClass( "ui-corner-all" )
				.attr( "tabIndex", -1 )
				.attr( "role", "menuitem" )
				.attr( "id", function( i ) {
					return menuId + "-" + i;
				});

		submenus.each( function() {
			var menu = $( this ),
				item = menu.prev( "a" );

			item.attr( "aria-haspopup", "true" )
				.prepend( '<span class="ui-menu-icon ui-icon ui-icon-carat-1-e"></span>' );
			menu.attr( "aria-labelledby", item.attr( "id" ) );
		});
	},

	focus: function( event, item ) {
		this.blur( event );

		if ( this._hasScroll() ) {
			var borderTop = parseFloat( $.curCSS( this.activeMenu[0], "borderTopWidth", true ) ) || 0,
				paddingTop = parseFloat( $.curCSS( this.activeMenu[0], "paddingTop", true ) ) || 0,
				offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop,
				scroll = this.activeMenu.scrollTop(),
				elementHeight = this.activeMenu.height(),
				itemHeight = item.height();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}

		this.active = item.first()
			.children( "a" )
				.addClass( "ui-state-focus" )
			.end();
		this.element.attr( "aria-activedescendant", this.active.children( "a" ).attr( "id" ) );

		// highlight active parent menu item, if any
		this.active.parent().closest( ".ui-menu-item" ).children( "a:first" ).addClass( "ui-state-active" );

		this.timer = this._delay( function() {
			this._close();
		}, this.delay );

		var nested = $( "> .ui-menu", item );
		if ( nested.length && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening(nested);
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	blur: function( event ) {
		if ( !this.active ) {
			return;
		}

		clearTimeout( this.timer );

		this.active.children( "a" ).removeClass( "ui-state-focus" );
		this.active = null;

		this._trigger( "blur", event, { item: this.active } );
	},

	_startOpening: function( submenu ) {
		clearTimeout( this.timer );

		// Don't open if already open fixes a Firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the carat icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay( function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		clearTimeout( this.timer );
		this.element
			.find( ".ui-menu" )
			.not( submenu.parents() )
			.hide()
			.attr( "aria-hidden", "true" );

		var position = $.extend({}, {
				of: this.active
			}, $.type(this.options.position) == "function"
				? this.options.position(this.active)
				: this.options.position
			);

		submenu.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {

		// if we were passed an event, look for the submenu that contains the event
		var currentMenu = all ? this.element :
			$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

		// if we found no valid submenu ancestor, use the main menu to close all sub menus anyway
		if ( !currentMenu.length ) {
			currentMenu = this.element;
		}

		this._close( currentMenu );

		this.blur( event );
		this.activeMenu = currentMenu;
	},

	// With no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  If passed an argument, it will search for menus BELOW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.active ? this.active.parent() : this.element;
		}

		startMenu
			.find( ".ui-menu" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( "a.ui-state-active" )
			.removeClass( "ui-state-active" );
	},

	collapse: function( event ) {
		var newItem = this.active && this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
			return true;
		}
	},

	expand: function( event ) {
		var newItem = this.active && this.active.children( ".ui-menu " ).children( ".ui-menu-item" ).first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			//timeout so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay( function() {
				this.focus( event, newItem );
			}, 20 );
			return true;
		}
	},

	next: function(event) {
		this._move( "next", "first", event );
	},

	previous: function(event) {
		this._move( "prev", "last", event );
	},

	first: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	last: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		if ( !this.active ) {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" )[ filter ]() );
			return;
		}

		var next;
		if ( direction === "first" || direction === "last" ) {
			next = this.active[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" ).eq( -1 );
		} else {
			next = this.active[ direction + "All" ]( ".ui-menu-item" ).eq( 0 );
		}

		if ( next.length ) {
			this.focus( event, next );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" )[ filter ]() );
		}
	},

	nextPage: function( event ) {
		if ( this._hasScroll() ) {
			if ( !this.active ) {
				this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
				return;
			}
			if ( this.last() ) {
				return;
			}

			var base = this.active.offset().top,
				height = this.element.height(),
				result;
			this.active.nextAll( ".ui-menu-item" ).each( function() {
				result = $( this );
				return $( this ).offset().top - base - height < 0;
			});

			this.focus( event, result );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		if ( this._hasScroll() ) {
			if ( !this.active ) {
				this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
				return;
			}
			if ( this.first() ) {
				return;
			}

			var base = this.active.offset().top,
				height = this.element.height(),
				result;
			this.active.prevAll( ".ui-menu-item" ).each( function() {
				result = $( this );
				return $(this).offset().top - base + height > 0;
			});

			this.focus( event, result );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.height() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {

		// save active reference before collapseAll triggers blur
		var ui = {
			item: this.active
		};
		this.collapseAll( event, true );
		if ( this.options.trigger ) {
			$( this.options.trigger ).focus( 1 );
			this.element.popup( "close" );
		}
		this._trigger( "select", event, ui );
	}
});

}( jQuery ));
