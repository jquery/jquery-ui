/*!
 * jQuery UI Menubar @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/menubar/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 *	jquery.ui.menu.js
 */
(function( $ ) {

$.widget( "ui.menubar", {
	version: "@VERSION",
	options: {
		items: "li",
		menus: "ul",
		icons: {
			dropdown: "ui-icon-triangle-1-s"
		},
		position: {
			my: "left top",
			at: "left bottom"
		},

		// callbacks
		select: null
	},

	_create: function() {
		// Top-level elements containing the submenu-triggering elem
		this.menuItems = this.element.children( this.options.items );

		// Links or buttons in menuItems, triggers of the submenus
		this.items = this.menuItems.children( "button, a" );

		// Keep track of open submenus
		this.openSubmenus = 0;

		this._initializeWidget();
		this._initializeMenuItems();
		this._initializeItems();
	},

	_initializeWidget: function() {
		this.element
			.addClass( "ui-menubar ui-widget-header ui-helper-clearfix" )
			.attr( "role", "menubar" );
		this._on({
			keydown: function( event ) {
				var active;

				// If we are in a nested sub-sub-menu and we see an ESCAPE
				// we must close recursively.
				if ( event.keyCode === $.ui.keyCode.ESCAPE &&
						this.active &&
						this.active.menu( "collapse", event ) !== true ) {
					active = this.active;
					this.active.blur();
					this._close( event );
					$( event.target ).blur().mouseleave();
					active.prev().focus();
				}
			},
			focusin: function() {
				clearTimeout( this.closeTimer );
			},
			focusout: function( event ) {
				this.closeTimer = this._delay( function() {
					this._close( event );
					this.items.attr( "tabIndex", -1 );
					this.lastFocused.attr( "tabIndex", 0 );
				}, 150 );
			},
			"mouseenter .ui-menubar-item": function() {
				clearTimeout( this.closeTimer );
			}
		} );
	},

	_initializeMenuItems: function() {
		var subMenus,
			menubar = this;

		this.menuItems
			.addClass( "ui-menubar-item" )
			.attr( "role", "presentation" )
			// TODO why do these not work when moved to CSS?
			.css({
				"border-width": "1px",
				"border-style": "hidden"
			});

		subMenus = this.menuItems.children( menubar.options.menus ).menu({
			position: {
				within: this.options.position.within
			},
			select: function( event, ui ) {
				// TODO don't hardcode markup selectors
				ui.item.parents( "ul.ui-menu:last" ).hide();
				menubar._close();
				ui.item.parents( ".ui-menubar-item" ).children().first().focus();
				menubar._trigger( "select", event, ui );
			},
			menus: this.options.menus
		})
			.hide()
			.attr({
				"aria-hidden": "true",
				"aria-expanded": "false"
			});

		this._on( subMenus, {
			keydown: function( event ) {
				// TODO why is this needed?
				$( event.target ).attr( "tabIndex", 0 );
				var parentButton,
					menu = $( this );
				// TODO why are there keydown events on a hidden menu?
				if ( menu.is( ":hidden" ) ) {
					return;
				}
				switch ( event.keyCode ) {
				case $.ui.keyCode.LEFT:
					// TODO why can't this call menubar.previous()?
					parentButton = menubar.active.prev( ".ui-button" );

					if ( this.openSubmenus ) {
						this.openSubmenus--;
					} else if ( this._hasSubMenu( parentButton.parent().prev() ) ) {
						menubar.active.blur();
						menubar._open( event, parentButton.parent().prev().find( ".ui-menu" ) );
					} else {
						parentButton.parent().prev().find( ".ui-button" ).focus();
						menubar._close( event );
						this.open = true;
					}

					event.preventDefault();
					// TODO same as above where it's set to 0
					$( event.target ).attr( "tabIndex", -1 );
					break;
				case $.ui.keyCode.RIGHT:
					this.next( event );
					event.preventDefault();
					break;
				}
			},
			focusout: function( event ) {
				// TODO why does this have to use event.target? Is that different from currentTarget?
				$( event.target ).removeClass( "ui-state-focus" );
			}
		});

		this.menuItems.each(function( index, menuItem ) {
			menubar._identifyMenuItemsNeighbors( $( menuItem ), menubar, index );
		});

	},

	_hasSubMenu: function( menuItem ) {
		return $( menuItem ).children( this.options.menus ).length > 0;
	},

	// TODO get rid of these - currently still in use in _move
	_identifyMenuItemsNeighbors: function( menuItem, menubar, index ) {
		var collectionLength = this.menuItems.length,
			isFirstElement = ( index === 0 ),
			isLastElement = ( index === ( collectionLength - 1 ) );

		if ( isFirstElement ) {
			menuItem.data( "prevMenuItem", $( this.menuItems[collectionLength - 1]) );
			menuItem.data( "nextMenuItem", $( this.menuItems[index+1]) );
		} else if ( isLastElement ) {
			menuItem.data( "nextMenuItem", $( this.menuItems[0]) );
			menuItem.data( "prevMenuItem", $( this.menuItems[index-1]) );
		} else {
			menuItem.data( "nextMenuItem", $( this.menuItems[index+1]) );
			menuItem.data( "prevMenuItem", $( this.menuItems[index-1]) );
		}
	},

	_initializeItems: function() {
		var menubar = this;

		this._focusable( this.items );
		this._hoverable( this.items );

		// let only the first item receive focus
		this.items.slice(1).attr( "tabIndex", -1 );

		this.items.each(function( index, item ) {
			menubar._initializeItem( $( item ), menubar );
		});
	},

	_initializeItem: function( anItem ) {
		var menuItemHasSubMenu = this._hasSubMenu( anItem.parent() );

		anItem
			.addClass( "ui-button ui-widget ui-button-text-only ui-menubar-link" )
			.attr( "role", "menuitem" )
			.wrapInner( "<span class='ui-button-text'></span>" );

		this._on( anItem, {
			focus:	function( event ){
				anItem.attr( "tabIndex", 0 );
				anItem.addClass( "ui-state-focus" );
				event.preventDefault();
			},
			focusout:  function( event ){
				anItem.attr( "tabIndex", -1 );
				this.lastFocused = anItem;
				anItem.removeClass( "ui-state-focus" );
				event.preventDefault();
			}
		} );

		if ( menuItemHasSubMenu ) {
			this._on( anItem, {
				click: this._mouseBehaviorForMenuItemWithSubmenu,
				focus: this._mouseBehaviorForMenuItemWithSubmenu,
				mouseenter: this._mouseBehaviorForMenuItemWithSubmenu
			});

			this._on( anItem, {
				keydown: function( event ) {
					switch ( event.keyCode ) {
					case $.ui.keyCode.SPACE:
					case $.ui.keyCode.UP:
					case $.ui.keyCode.DOWN:
						this._open( event, $( event.target ).next() );
						event.preventDefault();
						break;
					case $.ui.keyCode.LEFT:
						this.previous( event );
						event.preventDefault();
						break;
					case $.ui.keyCode.RIGHT:
						this.next( event );
						event.preventDefault();
						break;
					case $.ui.keyCode.TAB:
						break;
					}
				}
			});

			anItem.attr( "aria-haspopup", "true" );
			if ( this.options.icons ) {
				anItem.append( "<span class='ui-button-icon-secondary ui-icon " + this.options.icons.dropdown + "'></span>" );
				anItem.removeClass( "ui-button-text-only" ).addClass( "ui-button-text-icon-secondary" );
			}
		} else {
			this._on( anItem, {
				click: function() {
					if ( this.active ) {
						this._close();
					} else {
						this.open = true;
						this.active = $( anItem ).parent();
					}
				},
				mouseenter: function() {
					if ( this.open ) {
						this.stashedOpenMenu = this.active;
						this._close();
					}
				},
				keydown: function( event ) {
					if ( event.keyCode === $.ui.keyCode.LEFT ) {
						this.previous( event );
						event.preventDefault();
					} else if ( event.keyCode === $.ui.keyCode.RIGHT ) {
						this.next( event );
						event.preventDefault();
					}
				}
			});
		}
	},

	// TODO silly name, too much complexity
	// TODO why is this used for three types of events?
	_mouseBehaviorForMenuItemWithSubmenu: function( event ) {
		var isClickingToCloseOpenMenu, menu;

		// ignore triggered focus event
		if ( event.type === "focus" && !event.originalEvent ) {
			return;
		}
		event.preventDefault();

		menu = $(event.target).parents( ".ui-menubar-item" ).children( this.options.menus );

		// If we have an open menu and we see a click on the menuItem
		// and the menu thereunder is the same as the active menu, close it.
		// Succinctly: toggle menu open / closed  on the menuItem
		isClickingToCloseOpenMenu = event.type === "click" &&
			menu.is( ":visible" ) &&
			this.active &&
			this.active[0] === menu[0];

		if ( isClickingToCloseOpenMenu ) {
			this._close();
			return;
		}
		if ( event.type === "mouseenter" ) {
			this.element.find( ":focus" ).focusout();
			if ( this.stashedOpenMenu ) {
				this._open( event, menu);
			}
			this.stashedOpenMenu = undefined;
		}
		// If we already opened a menu and then changed to be "over" another MenuItem ||
		// we clicked on a new menuItem (whether open or not) or if we auto expand (i.e.
		// we expand regardless of click if there is a submenu
		if ( ( this.open && event.type === "mouseenter" ) || event.type === "click" ) {
			clearTimeout( this.closeTimer );
			this._open( event, menu );
			// Stop propagation so that menuItem mouseenter doesn't fire.  If it does it
			// takes the "selected" status off off of the first element of the submenu.
			event.stopPropagation();
		}
	},

	_destroy : function() {
		this.menuItems
			.removeClass( "ui-menubar-item" )
			.removeAttr( "role" )
			.css({
				"border-width": "",
				"border-style": ""
			});

		this.element
			.removeClass( "ui-menubar ui-widget-header ui-helper-clearfix" )
			.removeAttr( "role" )
			.unbind( ".menubar" );

		this.items
			.unbind( ".menubar" )
			.removeClass( "ui-button ui-widget ui-button-text-only ui-menubar-link ui-state-default" )
			.removeAttr( "role" )
			.removeAttr( "aria-haspopup" )
			.children( ".ui-icon" ).remove();

		// TODO fix this
		if ( false ) {
			// Does not unwrap
			this.items.children( "span.ui-button-text" ).unwrap();
		} else {
			// Does "unwrap"
			this.items.children( "span.ui-button-text" ).each( function(){
				var item = $( this );
				item.parent().html( item.html() );
			});
		}

		this.element.find( ":ui-menu" )
			.menu( "destroy" )
			.show()
			.removeAttr( "aria-hidden" )
			.removeAttr( "aria-expanded" )
			.removeAttr( "tabindex" )
			.unbind( ".menubar" );
	},

	_collapseActiveMenu: function() {
		if ( !this.active.is( ":ui-menu" ) ) {
			return;
		}
		this.active
			.menu( "collapseAll" )
			.hide()
			.attr({
				"aria-hidden": "true",
				"aria-expanded": "false"
			})
			.closest( this.options.items ).removeClass( "ui-state-active" );
	},

	_close: function() {
		if ( !this.active ) {
			return;
		}

		this._collapseActiveMenu();

		this.active = null;
		this.open = false;
		this.openSubmenus = 0;
	},

	_open: function( event, menu ) {
		var menuItem = menu.closest( ".ui-menubar-item" );

		if ( this.active && this.active.length &&
				this._hasSubMenu( this.active.closest( this.options.items ) ) ) {
					this._collapseActiveMenu();
		}

		menuItem.addClass( "ui-state-active" );
		// workaround when clicking a non-menu item, then hovering a menu, then going back
		// this way afterwards its still possible to tab back to a menubar, even if its
		// the wrong item
		// see also "click menu-less item, hover in and out of item with menu" test in menubar_core
		if ( !this.lastFocused ) {
			this.lastFocused = menu.prev();
		}

		this.active = menu
			.show()
			.position( $.extend({
				of: menuItem
			}, this.options.position ) )
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.menu( "focus", event, menu.children( ".ui-menu-item" ).first()  )
			.focus();

		this.open = true;
	},

	next: function( event ) {
		function shouldOpenNestedSubMenu() {
			return this.active &&
				this._hasSubMenu( this.active.closest( this.options.items ) ) &&
				this.active.data( "uiMenu" ) &&
				this.active.data( "uiMenu" ).active &&
				this.active.data( "uiMenu" ).active.has( ".ui-menu" ).length;
		}

		if ( this.open ) {
			if ( shouldOpenNestedSubMenu.call( this ) ) {
				// Track number of open submenus and prevent moving to next menubar item
				this.openSubmenus++;
				return;
			}
		}
		this.openSubmenus = 0;
		this._move( "next", event );
	},

	previous: function( event ) {
		if ( this.open && this.openSubmenus ) {
			// Track number of open submenus and prevent moving to previous menubar item
			this.openSubmenus--;
			return;
		}
		this.openSubmenus = 0;
		this._move( "prev", event );
	},

	_move: function( direction, event ) {
		var closestMenuItem = $( event.target ).closest( ".ui-menubar-item" ),
			nextMenuItem = closestMenuItem.data( direction + "MenuItem" ),
			focusableTarget = nextMenuItem.find( ".ui-button" );

		if ( this.open ) {
			if ( this._hasSubMenu( nextMenuItem ) ) {
				this._open( event, nextMenuItem.children( ".ui-menu" ) );
			} else {
				this._collapseActiveMenu();
				nextMenuItem.find( ".ui-button" ).focus();
				this.open = true;
			}
		} else {
			closestMenuItem.find( ".ui-button" );
			focusableTarget.focus();
		}
	}

});

}( jQuery ));
