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
// A POJsO used for initializing menuItems so that we can be more OO

$.widget( "ui.menubarMenuItem", {
	version: "@VERSION",

	/* Public API */
	hasSubmenu: function() {
		return this.element.data("hasSubMenu");
	},

	/* jquery.Widget internals */
	_create: function() {
		this._initializeElementAttributes()
		this._initializeMenuItem();
	},

	/* Auxiliary Methods */
	_initializeElementAttributes: function(){
		this.element
		.addClass("ui-menubar-item")
		.attr( "role", "presentation" )
		.css({
			"border-width" : "1px",
			"border-style" : "hidden"
		});
	},

	_initializeMenuItem: function() {
		var $menuItem = this.element,
			menubar = this.options.parentMenubar,
			$item = $menuItem.children("button, a");

		this._determineSubmenuStatus();
		$menuItem.data( "name", $item.text() );

		if ( this.hasSubmenu() ) {
			this._initializeSubMenus();
		}

		this._initializeItem( $item );
	},

	_initializeItem: function ( $item ) {
		var menubar = this.options.parentMenubar;

		$item
		.addClass("ui-button ui-widget ui-button-text-only ui-menubar-link")
		.attr( "role", "menuitem" )
		.wrapInner("<span class='ui-button-text'></span>");

		if ( this.options.position === 0 ) {
			$item.attr( "tabindex", 1 );
		} else {
			$item.attr( "tabIndex", -1 );
		}

		if ( menubar.options.buttons ) {
			$item.removeClass("ui-menubar-link").addClass("ui-state-default");
		}

		this._on( $item, {
			focus:  function(){
				$item.addClass("ui-state-focus");
			},
			focusout:  function(){
				$item.removeClass("ui-state-focus");
			}
		});

		$item.data( "parentMenuItem", this.element );
		menubar.applyItemEventHandling( $item, this.hasSubmenu() );
	},

	_applyMenuWidgetToSubMenus: function( subMenus, options ) {
		return subMenus
			.menu({
				position: {
					within: options.position.within
				},
				select: function( event, ui ) {
					ui.item.parents("ul.ui-menu:last").hide();
					menubar._close();
					// TODO what is this targetting? there's probably a better way to access it
					$( event.target ).prev().focus();
					menubar._trigger( "select", event, ui );
				},
				menus: options.menuElement
			})
	},

	_initializeSubMenus: function(){
		var menubar = this.options.parentMenubar,
			subMenus = this.element.children( menubar.options.menuElement );

		this._applyMenuWidgetToSubMenus( subMenus, menubar.options )
		.hide()
		.attr({
			"aria-hidden": "true",
			"aria-expanded": "false"
		});

		/* Throw this back to the macro element:
		* 1) the this context for options is correct
		* 2) Knowing how to move between menuItems is a menubar concern
		*/
		menubar.applySubmenuEventHandling( subMenus );
	},

	_determineSubmenuStatus: function () {
		var subMenus = this.element.children( this._parentMenubarsMenuElementOption() ),
			hasSubMenu = subMenus.length > 0;
		this.element.data( "hasSubMenu", hasSubMenu );
	},

	_parentMenubarsMenuElementOption: function() {
		var menubar = this.options.parentMenubar;

		return menubar.options.menuElement;
	},

});

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
		// Top-level elements containing the submenu-triggering elem
		this.menuItems = this.element.children( this.options.items );

		// Links or buttons in menuItems, triggers of the submenus
		this.items = [];

		this._initializeMenubarsBoundElement();
		this._initializeWidgetEvents();
		this._initializeMenuItems();

		// Keep track of open submenus
		this.openSubmenus = 0;
	},

	_initializeMenubarsBoundElement: function() {
		this.element
			.addClass("ui-menubar ui-widget-header ui-helper-clearfix")
			.attr( "role", "menubar" );
	},

	_initializeWidgetEvents: function() {
		this._on( {
			keydown: function( event ) {
				var closeActionResult, stashActive,
					isEscape = ( event.keyCode === $.ui.keyCode.ESCAPE );

				if ( isEscape ) {
					closeActionResult = this.active &&
						this.active.menu( "collapse", event ) !== true;
					if ( closeActionResult ) {
						stashActive = this.active;
						this._close( event );
						stashActive.prev().focus();
					}
				}
			},
			focusin: function() {
				clearTimeout( this.closeTimer );
			},
			focusout: function( event ) {
				var menubar = this;

				this.closeTimer = setTimeout (function() {
					menubar._close( event );
					menubar._reenableTabIndexOnFirstMenuItem();
				}, 150 );
			},
			"mouseleave .ui-menubar-item": function( event ) {
				var menubar = this;

				if ( this.options.autoExpand ) {
					this.closeTimer = setTimeout( function() {
						menubar._close( event );
					}, 150 );
				}
			},
			"mouseenter .ui-menubar-item": function() {
				clearTimeout( this.closeTimer );
			}
		});
	},

	_initializeMenuItems: function() {
		var menubar = this;

		$.each( this.menuItems, function( index, menuItem ){
			$( menuItem ).menubarMenuItem({
				parentMenubar: menubar,
				position: index
			});
			menubar._identifyMenuItemsNeighbors( $( menuItem ), menubar, index );
		} );
	},

	_identifyMenuItemsNeighbors: function( $menuItem, menubar, index ) {
		var collectionLength = this.menuItems.toArray().length,
			isFirstElement = ( index === 0 ),
			isLastElement = ( index === ( collectionLength - 1 ) );

		if ( isFirstElement ) {
			$menuItem.data( "prevMenuItem", $( this.menuItems[collectionLength - 1])  );
			$menuItem.data( "nextMenuItem", $( this.menuItems[index+1])  );
		} else if ( isLastElement ) {
			$menuItem.data( "nextMenuItem", $( this.menuItems[0])  );
			$menuItem.data( "prevMenuItem", $( this.menuItems[index-1])  );
		} else {
			$menuItem.data( "nextMenuItem", $( this.menuItems[index+1])  );
			$menuItem.data( "prevMenuItem", $( this.menuItems[index-1])  );
		}
	},


	applyItemEventHandling: function( $anItem, hasSubMenu ) {
		this.items.push( $anItem );

		this._focusable( this.items );
		this._hoverable( this.items );

		if ( hasSubMenu ) {
			this.__applyMouseBehaviorForSubmenuHavingMenuItem( $anItem );
			this.__applyKeyboardBehaviorForSubmenuHavingMenuItem( $anItem );

			$anItem.attr( "aria-haspopup", "true" );
			if ( this.options.menuIcon ) {
				$anItem.addClass("ui-state-default").append("<span class='ui-button-icon-secondary ui-icon ui-icon-triangle-1-s'></span>");
				$anItem.removeClass("ui-button-text-only").addClass("ui-button-text-icon-secondary");
			}
		} else {
			this.__applyMouseBehaviorForSubmenulessMenuItem( $anItem );
			this.__applyKeyboardBehaviorForSubmenulessMenuItem( $anItem );
		}
	},


	__applyMouseBehaviorForSubmenuHavingMenuItem: function ( input ) {
			menu = input.next( this.options.menuElement ),
			mouseBehaviorCallback = function( event ) {
				// ignore triggered focus event
				if ( event.type === "focus" && !event.originalEvent ) {
					return;
				}
				event.preventDefault();
				// TODO can we simplify or extract this check? especially the last two expressions
				// there's a similar active[0] == menu[0] check in _open
				if ( event.type === "click" && menu.is(":visible") && this.active && this.active[0] === menu[0] ) {
					this._close();
					return;
				}
				if ( event.type === "mouseenter" ) {
					this.element.find(":focus").focusout();
					if ( this.stashedOpenMenu ) {
						this._open( event, menu);
					}
					this.stashedOpenMenu = undefined;
				}
				if ( ( this.open && event.type === "mouseenter" ) || event.type === "click" || this.options.autoExpand ) {
					if ( this.options.autoExpand ) {
						clearTimeout( this.closeTimer );
					}
					this._open( event, menu );
				}
			};

		this._on( input, {
			click: mouseBehaviorCallback,
			focus: mouseBehaviorCallback,
			mouseenter: mouseBehaviorCallback
		});
	},

	__applyKeyboardBehaviorForSubmenuHavingMenuItem: function( input ) {
		this._on( input, {
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
				}
			}
		} );
	},

	__applyMouseBehaviorForSubmenulessMenuItem: function( $anItem ) {
		this._off( $anItem, "click mouseenter" );
		this._hoverable( $anItem );
		this._on( $anItem, {
			click: function() {
				if ( this.active ) {
					this._close();
				} else {
					this.open = true;
					this.active = $( $anItem ).parent();
				}
			},
			mouseenter: function() {
				if ( this.open ) {
					this.stashedOpenMenu = this.active;
					this._close();
				}
			}
		});
	},

	__applyKeyboardBehaviorForSubmenulessMenuItem: function( $anItem ) {
		this._on( $anItem, {
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
	},

	_destroy : function() {
		this.menuItems
			.removeClass("ui-menubar-item")
			.removeAttr("role");

		this.element
			.removeClass("ui-menubar ui-widget-header ui-helper-clearfix")
			.removeAttr("role")
			.unbind(".menubar");

		this.items
			.unbind(".menubar")
			.removeClass("ui-button ui-widget ui-button-text-only ui-menubar-link ui-state-default")
			.removeAttr("role")
			.removeAttr("aria-haspopup")
			// TODO unwrap?
			.children("span.ui-button-text").each(function() {
				var item = $( this );
				item.parent().html( item.html() );
			})
			.end()
			.children(".ui-icon").remove();

		this.element.find(":ui-menu")
			.menu("destroy")
			.show()
			.removeAttr("aria-hidden")
			.removeAttr("aria-expanded")
			.removeAttr("tabindex")
			.unbind(".menubar");
	},

	_close: function() {
		if ( !this.active || !this.active.length ) {
			return;
		}

		if ( this.active.closest( this.options.items ).data("hasSubMenu") ) {
			this.active
				.menu("collapseAll")
				.hide()
				.attr({
					"aria-hidden": "true",
					"aria-expanded": "false"
				});
			this.active
				.prev()
				.removeClass("ui-state-active");
			this.active.closest( this.options.items ).removeClass("ui-state-active");
		} else {
			this.active
				.attr({
					"aria-hidden": "true",
					"aria-expanded": "false"
				});
		}

		this.active = null;
		this.open = false;
		this.openSubmenus = 0;
	},

	_open: function( event, menu ) {
		var button,
			menuItem = menu.closest(".ui-menubar-item");

		if ( this.active && this.active.length ) {
		// TODO refactor, almost the same as _close above, but don't remove tabIndex
			if ( this.active.closest( this.options.items ).data("hasSubMenu")  ) {
				this.active
					.menu("collapseAll")
					.hide()
					.attr({
						"aria-hidden": "true",
						"aria-expanded": "false"
					});
				this.active.closest(this.options.items)
					.removeClass("ui-state-active");
			} else {
				this.active.removeClass("ui-state-active");
			}
		}

		// set tabIndex -1 to have the button skipped on shift-tab when menu is open (it gets focus)
		button = menuItem.addClass("ui-state-active").attr( "tabIndex", -1 );

		this.active = menu
			.show()
			.position( $.extend({
				of: button
			}, this.options.position ) )
			.removeAttr("aria-hidden")
			.attr("aria-expanded", "true")
			.menu("focus", event, menu.children(".ui-menu-item").first() )
			.focus() // Establish focus on the submenu item
			.focusin(); // Move focus within the containing submenu


		this.open = true;
	},

	_shouldOpenNestedSubMenu: function() {
		return this.open &&
			this.active &&
			this.active.closest( this.options.items ).data("hasSubMenu") &&
			this.active.data("uiMenu") &&
			this.active.data("uiMenu").active &&
			this.active.data("uiMenu").active.has(".ui-menu").length;
	},

	next: function( event ) {
		if ( this._shouldOpenNestedSubMenu() ) {
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

	_findNextFocusableTarget: function( menuItem ) {
		return menuItem.find(".ui-button");
	},

	_move: function( direction, filter, event ) {
		var closestMenuItem = $( event.target ).closest(".ui-menubar-item"),
			nextMenuItem = closestMenuItem.data( direction + "MenuItem" ),
			focusableTarget = this._findNextFocusableTarget( nextMenuItem );

		if ( this.open ) {
			if ( nextMenuItem.data("hasSubMenu") ) {
				this._open( event, nextMenuItem.children(".ui-menu") );
			} else {
				this._submenuless_open( event, nextMenuItem );
			}
		} else {
			closestMenuItem.find(".ui-button").attr( "tabindex", -1 );
			focusableTarget.focus();
		}
	},

	_submenuless_open: function( event, nextMenuItem) {
		var menuItem = $(event.target).closest(".ui-menubar-item");

		if ( this.active && this.active.length && menuItem.data("hasSubMenu")  ) {
				this.active
					.menu("collapseAll")
					.hide()
					.attr({
						"aria-hidden": "true",
						"aria-expanded": "false"
					});
				menuItem.removeClass("ui-state-active");
		}

		nextMenuItem.find(".ui-button").focus();

		this.open = true;
	},

	_closeOpenMenu: function( menu ) {
		menu
		.menu("collapseAll")
		.hide()
		.attr({
			"aria-hidden": "true",
			"aria-expanded": "false"
		});
	},

	_deactivateMenusParentButton: function( menu ) {
		menu.parent(".ui-menubar-item").removeClass("ui-state-active");
	},

	_reenableTabIndexOnFirstMenuItem: function() {
		$(this.menuItems[0]).find(".ui-widget").attr( "tabindex", 1 );
	},

	applySubmenuEventHandling: function( subMenus ) {
		this._on( subMenus, {
			keydown: function( event ) {
				var parentButton,
				menu = $( this );
				if ( menu.is(":hidden") ) {
					return;
				}
				switch ( event.keyCode ) {
					case $.ui.keyCode.LEFT:
						parentButton = this.active.prev(".ui-button");

					if ( this.openSubmenus ) {
						this.openSubmenus--;
					} else if ( parentButton.parent().prev().data("hasSubMenu") ) {
						this.active.blur();
						this._open( event, parentButton.parent().prev().find(".ui-menu") );
					} else {
						parentButton.parent().prev().find(".ui-button").focus();
						this._close( event );
						this.open = true;
					}

					event.preventDefault();
					break;
					case $.ui.keyCode.RIGHT:
						this.next( event );
					event.preventDefault();
					break;
				}
			},
			focusout: function( event ) {
				$(event.target).removeClass("ui-state-focus");
			}
		});
	}

});

}( jQuery ));

/* vim: set fdm=indent foldlevel=1: */
