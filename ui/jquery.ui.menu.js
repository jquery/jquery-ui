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
	_create: function() {
		var self = this;
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
				if ( target.length && target.parent()[0] === self.element[0] ) {
					self.activate( event, target );
				}
			})
			.bind("mouseout.menu", function( event ) {
				if ( self.options.disabled ) {
					return;
				}
				var target = $( event.target ).closest( ".ui-menu-item" );
				if ( target.length && target.parent()[0] === self.element[0] ) {
					self.deactivate( event );
				}
			});
		this.refresh();
		
		if ( !this.options.input ) {
			this.options.input = this.element.attr( "tabIndex", 0 );
		}
		this.options.input.bind( "keydown.menu", function( event ) {
			if ( self.options.disabled ) {
				return;
			}
			switch ( event.keyCode ) {
			case $.ui.keyCode.PAGE_UP:
				self.previousPage();
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			case $.ui.keyCode.PAGE_DOWN:
				self.nextPage();
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			case $.ui.keyCode.UP:
				self.previous();
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			case $.ui.keyCode.DOWN:
				self.next();
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
			case $.ui.keyCode.ENTER:
				self.select();
				event.preventDefault();
				event.stopImmediatePropagation();
				break;
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
			.removeClass( "ui-corner-all" )
			.removeAttr( "tabIndex" )
			.unbind( ".menu" );
	},
	
	refresh: function() {
		// don't refresh list items that are already adapted
		var items = this.element.children( "li:not(.ui-menu-item):has(a)" )
			.addClass( "ui-menu-item" )
			.attr( "role", "menuitem" );
		
		items.children( "a" )
			.addClass( "ui-corner-all" )
			.attr( "tabIndex", -1 );
	},

	activate: function( event, item ) {
		var self = this;
		this.deactivate();
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
				.addClass( "ui-state-hover" )
				.attr( "id", function(index, id) {
					return (self.itemId = id || self.menuId + "-activedescendant");
				})
			.end();
		// need to remove the attribute before adding it for the screenreader to pick up the change
		// see http://groups.google.com/group/jquery-a11y/msg/929e0c1e8c5efc8f
		this.element.removeAttr("aria-activedescenant").attr("aria-activedescenant", self.itemId);
		this._trigger( "focus", event, { item: item } );
	},

	deactivate: function(event) {
		if (!this.active) {
			return;
		}

		var self = this;
		this.active.children( "a" ).removeClass( "ui-state-hover" );
		// remove only generated id
		$( "#" + self.menuId + "-activedescendant" ).removeAttr( "id" );
		this.element.removeAttr( "aria-activedescenant" );
		this._trigger( "blur", event );
		this.active = null;
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
			this.activate( event, this.element.children(edge)[filter]() );
			return;
		}
		var next = this.active[ direction + "All" ]( ".ui-menu-item" ).eq( 0 );
		if ( next.length ) {
			this.activate( event, next );
		} else {
			this.activate( event, this.element.children(edge)[filter]() );
		}
	},
	
	nextPage: function( event ) {
		if ( this._hasScroll() ) {
			if ( !this.active || this.last() ) {
				this.activate( event, this.element.children( ".ui-menu-item" ).first() );
				return;
			}
			var base = this.active.offset().top,
				height = this.element.height(),
				result;
			this.active.nextAll( ".ui-menu-item" ).each( function() {
				result = $( this );
				return $( this ).offset().top - base - height < 0;
			});

			this.activate( event, result );
		} else {
			this.activate( event, this.element.children( ".ui-menu-item" )
				[ !this.active || this.last() ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		if ( this._hasScroll() ) {
			if ( !this.active || this.first() ) {
				this.activate( event, this.element.children( ".ui-menu-item" ).last() );
				return;
			}

			var base = this.active.offset().top,
				height = this.element.height(),
				result;
			this.active.prevAll( ".ui-menu-item" ).each( function() {
				result = $( this );
				return $(this).offset().top - base + height > 0;
			});

			this.activate( event, result );
		} else {
			this.activate( event, this.element.children( ".ui-menu-item" )
				[ !this.active || this.first() ? ":last" : ":first" ]() );
		}
	},

	_hasScroll: function() {
		return this.element.height() < this.element.attr( "scrollHeight" );
	},

	select: function( event ) {
		this._trigger( "select", event, { item: this.active } );
	}
});

$.ui.menu.version = "@VERSION";

}( jQuery ));
