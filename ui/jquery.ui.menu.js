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
		position: {
			my: "left top",
			at: "right top"
		}
	},
	_create: function() {
		var self = this;
		this.activeMenu = this.element;
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
			.bind( "click.menu", function( event ) {
				var item = $( event.target ).closest( ".ui-menu-item:has(a)" );
				if ( self.options.disabled ) {
					return false;
				}
				if ( !item.length ) {
					return;
				}
				// it's possible to click an item without hovering it (#7085)
				if ( !self.active || ( self.active[ 0 ] !== item[ 0 ] ) ) {
					self.focus( event, item );
				}
				self.select( event );
			})
			.bind( "mouseover.menu", function( event ) {
				if ( self.options.disabled ) {
					return;
				}
				var target = $( event.target ).closest( ".ui-menu-item" );
				if ( target.length ) {
					//Remove ui-state-active class from siblings of the newly focused menu item to avoid a jump caused by adjacent elements both having a class with a border
					target.siblings().children( ".ui-state-active" ).removeClass( "ui-state-active" );
					self.focus( event, target );
				}
			})
			.bind( "mouseout.menu", function( event ) {
				if ( self.options.disabled ) {
					return;
				}
				var target = $( event.target ).closest( ".ui-menu-item" );
				if ( target.length ) {
					self.blur( event );
				}
			})
			.bind( "focus.menu", function( event ) {
				if ( self.options.disabled ) {
					return;
				}
				self.focus( event, $( event.target ).children( ".ui-menu-item:first" ) );
			})
			.bind( "blur.menu", function( event ) {
				if ( self.options.disabled ) {
					return;
				}
				self.collapseAll( event );
			});
		this.refresh();

		this.element.attr( "tabIndex", 0 ).bind( "keydown.menu", function( event ) {
			if ( self.options.disabled ) {
				return;
			}
			switch ( event.keyCode ) {
			case $.ui.keyCode.PAGE_UP:
				self.previousPage( event );
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			case $.ui.keyCode.PAGE_DOWN:
				self.nextPage( event );
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			case $.ui.keyCode.HOME:
				self._move( "first", "first", event );
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			case $.ui.keyCode.END:
				self._move( "last", "last", event );
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			case $.ui.keyCode.UP:
				self.previous( event );
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			case $.ui.keyCode.DOWN:
				self.next( event );
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			case $.ui.keyCode.LEFT:
				if (self.collapse( event )) {
					event.stopImmediatePropagation();
				}
				event.preventDefault();
				break;
			case $.ui.keyCode.RIGHT:
				if (self.expand( event )) {
					event.stopImmediatePropagation();
				}
				event.preventDefault();
				break;
			case $.ui.keyCode.ENTER:
				if ( self.active.children( "a[aria-haspopup='true']" ).length ) {
					if ( self.expand( event ) ) {
						event.stopImmediatePropagation();
					}
				}
				else {
					self.select( event );
					event.stopImmediatePropagation();
				}
				event.preventDefault();
				break;
			case $.ui.keyCode.ESCAPE:
				if ( self.collapse( event ) ) {
					event.stopImmediatePropagation();
				}
				event.preventDefault();
				break;
			default:
				event.stopPropagation();
				clearTimeout( self.filterTimer );
				var match,
					prev = self.previousFilter || "",
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
				match = self.activeMenu.children( ".ui-menu-item" ).filter( function() {
					return new RegExp("^" + escape(character), "i")
						.test( $( this ).children( "a" ).text() );
				});
				match = skip && match.index(self.active.next()) != -1 ? self.active.nextAll(".ui-menu-item") : match;
				if ( !match.length ) {
					character = String.fromCharCode(event.keyCode);
					match = self.activeMenu.children(".ui-menu-item").filter( function() {
						return new RegExp("^" + escape(character), "i")
							.test( $( this ).children( "a" ).text() );
					});
				}
				if ( match.length ) {
					self.focus( event, match );
					if (match.length > 1) {
						self.previousFilter = character;
						self.filterTimer = setTimeout( function() {
							delete self.previousFilter;
						}, 1000 );
					} else {
						delete self.previousFilter;
					}
				} else {
					delete self.previousFilter;
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
	},

	_destroy: function() {
		//destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( "ul" )
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
		var self = this,

			// initialize nested menus
			submenus = this.element.find( "ul:not(.ui-menu)" )
				.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
				.attr( "role", "menu" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" ),

		// don't refresh list items that are already adapted
			items = submenus.add( this.element ).children( "li:not(.ui-menu-item):has(a)" )
				.addClass( "ui-menu-item" )
				.attr( "role", "presentation" );

		items.children( "a" )
			.addClass( "ui-corner-all" )
			.attr( "tabIndex", -1 )
			.attr( "role", "menuitem" )
			.attr( "id", function( i ) {
				return self.element.attr( "id" ) + "-" + i;
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
		var nested,
			self = this;

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
		self.element.attr( "aria-activedescendant", self.active.children("a").attr("id") );

		// highlight active parent menu item, if any
		this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active");

		self.timer = setTimeout( function() {
			self._close();
		}, self.delay );

		nested = $( ">ul", item );
		if ( nested.length && ( /^mouse/.test( event.type ) ) ) {
			self._startOpening(nested);
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

		var self = this;
		self.timer = setTimeout( function() {
			self._close();
			self._open( submenu );
		}, self.delay );
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

	collapseAll: function( event ) {
		this.element
			.find( "ul" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( "a.ui-state-active" )
			.removeClass( "ui-state-active" );

		this.blur( event );
		this.activeMenu = this.element;
	},

	_close: function() {
		this.active.parent()
			.find( "ul" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( "a.ui-state-active" )
			.removeClass( "ui-state-active" );
	},

	collapse: function( event ) {
		var newItem = this.active && this.active.parents("li:not(.ui-menubar-item)").first();
		if ( newItem && newItem.length ) {
			this.active.parent()
				.attr("aria-hidden", "true")
				.attr("aria-expanded", "false")
				.hide();
			this.focus( event, newItem );
			return true;
		}
	},

	expand: function( event ) {
		var self = this,
			newItem = this.active && this.active.children("ul").children("li").first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			//timeout so Firefox will not hide activedescendant change in expanding submenu from AT
			setTimeout( function() {
				self.focus( event, newItem );
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
		this.collapseAll( event );
		this._trigger( "select", event, ui );
	}
});

}( jQuery ));
