/*!
 * jQuery UI Menu @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)
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

var idIncrement = 0,
	currentEventTarget = null;

$.widget( "ui.menu", {
	version: "@VERSION",
	defaultElement: "<ul>",
	delay: 300,
	options: {
		menus: "ul",
		position: {
			my: "left top",
			at: "right top"
		},

		// callbacks
		blur: null,
		focus: null,
		select: null
	},
	_create: function() {
		this.activeMenu = this.element;
		this.menuId = this.element.attr( "id" ) || "ui-menu-" + idIncrement++;
		if ( this.element.find( ".ui-icon" ).length ) {
			this.element.addClass( "ui-menu-icons" );
		}
		this.element
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.attr({
				id: this.menuId,
				role: "menu",
				tabIndex: 0
			})
			// need to catch all clicks on disabled menu
			// not possible through _bind
			.bind( "click.menu", $.proxy(function( event ) {
				if ( this.options.disabled ) {
					event.preventDefault();
				}
			}, this ));

		if ( this.options.disabled ) {
			this.element
				.addClass( "ui-state-disabled" )
				.attr( "aria-disabled", "true" );
		}

		this._bind({
			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			"mousedown .ui-menu-item > a": function( event ) {
				event.preventDefault();
			},
			"click .ui-state-disabled > a": function( event ) {
				event.preventDefault();
			},
			"click .ui-menu-item:has(a)": function( event ) {
				var target = $( event.target );
				if ( target[0] !== currentEventTarget ) {
					currentEventTarget = target[0];
					target.one( "click.menu", function( event ) {
						currentEventTarget = null;
					});
					// Don't select disabled menu items
					if ( !target.closest( ".ui-menu-item" ).is( ".ui-state-disabled" ) ) {
						this.select( event );
						// Redirect focus to the menu with a delay for firefox
						this._delay(function() {
							if ( !this.element.is(":focus") ) {
								this.element.focus();
							}
						}, 20 );
					}
				}
			},
			"mouseenter .ui-menu-item": function( event ) {
				var target = $( event.currentTarget );
				// Remove ui-state-active class from siblings of the newly focused menu item
				// to avoid a jump caused by adjacent elements both having a class with a border
				target.siblings().children( ".ui-state-active" ).removeClass( "ui-state-active" );
				this.focus( event, target );
			},
			"mouseleave": "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			"focus": function( event ) {
				var menu = this.element,
					firstItem = menu.children( ".ui-menu-item" ).eq( 0 );
				if ( this._hasScroll() && !this.active ) {
					menu.children().each(function() {
						var currentItem = $( this );
						if ( currentItem.offset().top - menu.offset().top >= 0 ) {
							firstItem = currentItem;
							return false;
						}
					});
				} else if ( this.active ) {
					firstItem = this.active;
				}
				this.focus( event, firstItem );
			},
			blur: function( event ) {
				this._delay(function() {
					if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
						this.collapseAll( event );
					}
				});
			},
			"keydown": "_keydown"
		});

		this.refresh();

		this._bind( this.document, {
			click: function( event ) {
				if ( !$( event.target ).closest( ".ui-menu" ).length ) {
					this.collapseAll( event );
				}
			}
		});
	},

	_destroy: function() {
		// destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" ).andSelf()
				.removeClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
				.removeAttr( "role" )
				.removeAttr( "tabIndex" )
				.removeAttr( "aria-labelledby" )
				.removeAttr( "aria-expanded" )
				.removeAttr( "aria-hidden" )
				.show();

		// destroy menu items
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

		// unbind currentEventTarget click event handler
		$( currentEventTarget ).unbind( "click.menu" );
	},

	_keydown: function( event ) {
		switch ( event.keyCode ) {
		case $.ui.keyCode.PAGE_UP:
			this.previousPage( event );
			event.preventDefault();
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.nextPage( event );
			event.preventDefault();
			break;
		case $.ui.keyCode.HOME:
			this._move( "first", "first", event );
			event.preventDefault();
			break;
		case $.ui.keyCode.END:
			this._move( "last", "last", event );
			event.preventDefault();
			break;
		case $.ui.keyCode.UP:
			this.previous( event );
			event.preventDefault();
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			event.preventDefault();
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			event.preventDefault();
			break;
		case $.ui.keyCode.RIGHT:
			if ( !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			event.preventDefault();
			break;
		case $.ui.keyCode.ENTER:
			if ( !this.active.is( ".ui-state-disabled" ) ) {
				if ( this.active.children( "a[aria-haspopup='true']" ).length ) {
					this.expand( event );
				} else {
					this.select( event );
				}
			}
			event.preventDefault();
			break;
		case $.ui.keyCode.ESCAPE:
			this.collapse( event );
			event.preventDefault();
			break;
		default:
			clearTimeout( this.filterTimer );
			var match,
				prev = this.previousFilter || "",
				character = String.fromCharCode( event.keyCode ),
				skip = false;

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}
			function escape( value ) {
				return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
			}
			match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
				return new RegExp( "^" + escape( character ), "i" )
					.test( $( this ).children( "a" ).text() );
			});
			match = skip && match.index(this.active.next()) !== -1 ?
				this.active.nextAll(".ui-menu-item") :
				match;
			if ( !match.length ) {
				character = String.fromCharCode(event.keyCode);
				match = this.activeMenu.children(".ui-menu-item").filter(function() {
					return new RegExp( "^" + escape(character), "i" )
						.test( $( this ).children( "a" ).text() );
				});
			}
			if ( match.length ) {
				this.focus( event, match );
				if ( match.length > 1 ) {
					this.previousFilter = character;
					this.filterTimer = this._delay(function() {
						delete this.previousFilter;
					}, 1000 );
				} else {
					delete this.previousFilter;
				}
			} else {
				delete this.previousFilter;
			}
		}
	},

	refresh: function() {
		// initialize nested menus
		var menus,
			menuId = this.menuId,
			submenus = this.element.find( this.options.menus + ":not(.ui-menu)" )
				.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
				.hide()
				.attr({
					role: "menu",
					"aria-hidden": "true",
					"aria-expanded": "false"
				});

		// don't refresh list items that are already adapted
		menus = submenus.add( this.element );

		menus.children( ":not( .ui-menu-item ):has( a )" )
			.addClass( "ui-menu-item" )
			.attr( "role", "presentation" )
			.children( "a" )
				.addClass( "ui-corner-all" )
				.attr( "tabIndex", -1 )
				.attr( "role", "menuitem" )
				.attr( "id", function( i ) {
					return menuId + "-" + i;
				});

		// initialize unlinked menu-items as dividers
		menus.children( ":not(.ui-menu-item)" ).addClass( "ui-widget-content ui-menu-divider" );

		// add aria-disabled attribute to any disabled menu item
		menus.children( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		submenus.each(function() {
			var menu = $( this ),
				item = menu.prev( "a" );

			item.attr( "aria-haspopup", "true" )
				.prepend( '<span class="ui-menu-icon ui-icon ui-icon-carat-1-e"></span>' );
			menu.attr( "aria-labelledby", item.attr( "id" ) );
		});
	},

	focus: function( event, item ) {
		var nested, borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
		this.blur( event, event && event.type === "focus" );

		if ( this._hasScroll() ) {
			borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
			paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
			offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop();
			elementHeight = this.activeMenu.height();
			itemHeight = item.height();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}

		this.active = item.first();
		this.element.attr( "aria-activedescendant",
			this.active.children( "a" )
				.addClass( "ui-state-focus" )
				.attr( "id" ) );

		// highlight active parent menu item, if any
		this.active.parent().closest( ".ui-menu-item" ).children( "a:first" ).addClass( "ui-state-active" );

		if ( event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay(function() {
				this._close();
			}, this.delay );
		}

		nested = $( "> .ui-menu", item );
		if ( nested.length && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening(nested);
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	blur: function( event, fromFocus ) {
		if ( !fromFocus ) {
			clearTimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

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

		this.timer = this._delay(function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		clearTimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents() )
			.hide()
			.attr( "aria-hidden", "true" );

		var position = $.extend( {}, {
				of: this.active
			}, $.type(this.options.position) === "function" ?
				this.options.position(this.active) :
				this.options.position
			);

		submenu
			.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {
		clearTimeout( this.timer );
		this.timer = this._delay(function() {
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
		}, this.delay );
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
		var newItem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
			return true;
		}
	},

	expand: function( event ) {
		var newItem = this.active &&
			this.active
				.children( ".ui-menu " )
				.children( ".ui-menu-item" )
				.first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			//timeout so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay(function() {
				this.focus( event, newItem );
			}, 20 );
			return true;
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isFirstItem: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	isLastItem: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
					.eq( -1 );
			} else {
				next = this.active
					[ direction + "All" ]( ".ui-menu-item" )
					.eq( 0 );
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this.activeMenu.children( ".ui-menu-item" )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPage: function( event ) {
		if ( !this.active ) {
			this._move( "next", "first", event );
			return;
		}
		if ( this.isLastItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			var base = this.active.offset().top,
				height = this.element.height(),
				result;
			this.active.nextAll( ".ui-menu-item" ).each(function() {
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
		if ( !this.active ) {
			this._move( "next", "first", event );
			return;
		}
		if ( this.isFirstItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			var base = this.active.offset().top,
				height = this.element.height(),
				result;
			this.active.prevAll( ".ui-menu-item" ).each(function() {
				result = $( this );
				return $(this).offset().top - base + height > 0;
			});

			this.focus( event, result );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.outerHeight() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {
		// save active reference before collapseAll triggers blur
		var ui = {
			item: this.active
		};
		this.collapseAll( event, true );
		this._trigger( "select", event, ui );
	}
});

}( jQuery ));
