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

$.widget("ui.menu", {
	defaultElement: "<ul>",
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
		this.element
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.attr({
				id: this.menuId,
				role: "listbox"
			})
			.bind( "click.menu", function( event ) {
				if ( self.options.disabled ) {
					return false;
				}
				if ( !$( event.target ).closest( ".ui-menu-item a" ).length ) {
					return;
				}
				// temporary
				event.preventDefault();
				self.select( event );
			})
			.bind( "mouseover.menu", function( event ) {
				if ( self.options.disabled ) {
					return;
				}
				var target = $( event.target ).closest( ".ui-menu-item" );
				if ( target.length ) {
					self.focus( event, target );
				}
			})
			.bind("mouseout.menu", function( event ) {
				if ( self.options.disabled ) {
					return;
				}
				var target = $( event.target ).closest( ".ui-menu-item" );
				if ( target.length ) {
					self.blur( event );
				}
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
				if (self.left( event )) {
					event.stopImmediatePropagation();
				}
				event.preventDefault();
				break;
			case $.ui.keyCode.RIGHT:
				if (self.right( event )) {
					event.stopImmediatePropagation();
				}
				event.preventDefault();
				break;
			case $.ui.keyCode.ENTER:
				self.select();
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			default:
				event.stopPropagation();
				clearTimeout(self.filterTimer);
				var prev = self.previousFilter || "";
				var character = String.fromCharCode(event.keyCode);
				var skip = false;
				if (character == prev) {
					skip = true;
				} else {
					character = prev + character;
				}
				function escape(value) {
					return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
				}
				var match = self.widget().children(".ui-menu-item").filter(function() {
					return new RegExp("^" + escape(character), "i").test($(this).children("a").text());
				});
				var match = skip && match.index(self.active.next()) != -1 ? self.active.nextAll(".ui-menu-item") : match;
				if (!match.length) {
					character = String.fromCharCode(event.keyCode);
					match = self.widget().children(".ui-menu-item").filter(function() {
						return new RegExp("^" + escape(character), "i").test($(this).children("a").text());
					});
				}
				if (match.length) {
					self.focus(event, match);
					if (match.length > 1) {
						self.previousFilter = character;
						self.filterTimer = setTimeout(function() {
							delete self.previousFilter;
						}, 1000);
					} else {
						delete self.previousFilter;
					}
				} else {
					delete self.previousFilter;
				}
			}
		});
	},
	
	_destroy: function() {
		this.element
			.removeClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "tabIndex" )
			.removeAttr( "role" )
			.removeAttr( "aria-activedescendant" );
		
		this.element.children( ".ui-menu-item" )
			.removeClass( "ui-menu-item" )
			.removeAttr( "role" )
			.children( "a" )
			.removeClass( "ui-corner-all ui-state-hover" )
			.removeAttr( "tabIndex" )
			.unbind( ".menu" );
	},
	
	refresh: function() {
		// initialize nested menus
		// TODO add role=listbox to these, too? or just the top level menu?
		var submenus = this.element.find("ul:not(.ui-menu)")
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.hide()
		
		submenus
			.prev("a")
			.prepend('<span class="ui-icon ui-icon-carat-1-e"></span>');
		
		
		// don't refresh list items that are already adapted
		var items = submenus.add(this.element).children( "li:not(.ui-menu-item):has(a)" )
			.addClass( "ui-menu-item" )
			.attr( "role", "menuitem" );
		
		items.children( "a" )
			.addClass( "ui-corner-all" )
			.attr( "tabIndex", -1 );
	},

	focus: function( event, item ) {
		var self = this;
		
		this.blur();
		
		if ( this._hasScroll() ) {
			var borderTop = parseFloat( $.curCSS( this.element[0], "borderTopWidth", true) ) || 0,
				paddingtop = parseFloat( $.curCSS( this.element[0], "paddingTop", true) ) || 0,
				offset = item.offset().top - this.element.offset().top - borderTop - paddingtop,
				scroll = this.element.attr( "scrollTop" ),
				elementHeight = this.element.height(),
				itemHeight = item.height();
			if ( offset < 0 ) {
				this.element.attr( "scrollTop", scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.element.attr( "scrollTop", scroll + offset - elementHeight + itemHeight );
			}
		}
		
		this.active = item.first()
			.children( "a" )
				.addClass( "ui-state-focus" )
				.attr( "id", function(index, id) {
					return (self.itemId = id || self.menuId + "-activedescendant");
				})
			.end();
		// need to remove the attribute before adding it for the screenreader to pick up the change
		// see http://groups.google.com/group/jquery-a11y/msg/929e0c1e8c5efc8f
		this.element.removeAttr("aria-activedescendant").attr("aria-activedescendant", self.itemId)
		 		
		self._close();
		var nested = $(">ul", item);
		if (nested.length && /^mouse/.test(event.type)) {
			self._open(nested);
			this.active.find(">a:first").addClass("ui-state-active");
		}
		this.activeMenu = item.parent();
		
		this._trigger( "focus", event, { item: item } );
	},

	blur: function(event) {
		if (!this.active) {
			return;
		}
		
		this.active.children( "a" ).removeClass( "ui-state-focus" );
		// remove only generated id
		$( "#" + this.menuId + "-activedescendant" ).removeAttr( "id" );
		this.element.removeAttr( "aria-activedescenant" );
		this._trigger( "blur", event );
		this.active = null;
	},

	_open: function(submenu) {
		// TODO restrict to widget
		//only one menu can have items open at a time.
		//$(document).find(".ui-menu").not(submenu.parents()).hide().data("menu").blur();
		this.element.find(".ui-menu").not(submenu.parents()).hide();
		
		var position = $.extend({}, {
			of: this.active
		}, $.type(this.options.position) == "function"
			? this.options.position(this.active)
			: this.options.position
		);

		submenu.show().position(position);
	},
	
	closeAll: function() {
		this.element
		 .find("ul").hide().end()
		 .find("a.ui-state-active").removeClass("ui-state-active");
		this.blur();
		this.activeMenu = this.element;
	},
	
	_close: function() {
		this.active.parent()
		 .find("ul").hide().end()
		 .find("a.ui-state-active").removeClass("ui-state-active");
	},

	left: function(event) {
		var newItem = this.active && this.active.parents("li").first();
		if (newItem && newItem.length) {
			this.active.parent().hide();
			this.focus(event, newItem);
			return true;
		}
	},

	right: function(event) {
		var newItem = this.active && this.active.children("ul").children("li").first();
		if (newItem && newItem.length) {
			this._open(newItem.parent());
			var current = this.active;
			this.focus(event, newItem);
			return true;
		}
	},

	next: function(event) {
		this._move( "next", ".ui-menu-item", "first", event );
	},

	previous: function(event) {
		this._move( "prev", ".ui-menu-item", "last", event );
	},

	first: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	last: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function(direction, edge, filter, event) {
		if ( !this.active ) {
			this.focus( event, this.activeMenu.children(edge)[filter]() );
			return;
		}
		var next = this.active[ direction + "All" ]( ".ui-menu-item" ).eq( 0 );
		if ( next.length ) {
			this.focus( event, next );
		} else {
			this.focus( event, this.activeMenu.children(edge)[filter]() );
		}
	},
	
	nextPage: function( event ) {
		if ( this._hasScroll() ) {
			if ( !this.active || this.last() ) {
				this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
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
				[ !this.active || this.last() ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		if ( this._hasScroll() ) {
			if ( !this.active || this.first() ) {
				this.focus( event, this.activeMenu.children( ".ui-menu-item" ).last() );
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
			this.focus( event, this.activeMenu.children( ".ui-menu-item" )
				[ !this.active || this.first() ? ":last" : ":first" ]() );
		}
	},

	_hasScroll: function() {
		return this.element.height() < this.element.attr( "scrollHeight" );
	},

	select: function( event ) {
		// save active reference before closeAll triggers blur
		var ui = {
			item: this.active
		};
		this.closeAll();
		this._trigger( "select", event, ui );
	}
});

$.ui.menu.version = "@VERSION";

}( jQuery ));
