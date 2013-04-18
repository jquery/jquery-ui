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
		// Top-level elements containing the submenu-triggering elem
		this.menuItems = this.element.children( this.options.items );
		// Links or buttons in menuItems, triggers of the submenus
		this.items = [];

		this._initializeMenubarsBoundElement();
		this._initializeWidget();
		this._initializeMenuItems();

		// Keep track of open submenus
		this.openSubmenus = 0;

		// Scorched earth: NOTHING can be tabbed to
		this.menuItems.find("*").slice(1).attr("tabindex", -1);
	},

	_initializeMenubarsBoundElement: function() {
		this.element
			.addClass("ui-menubar ui-widget-header ui-helper-clearfix")
			.attr( "role", "menubar" );
	},

	_initializeWidget: function() {
		var menubar = this;

		this._on( {
			keydown: function( event ) {
				if ( event.keyCode === $.ui.keyCode.ESCAPE && menubar.active && menubar.active.menu( "collapse", event ) !== true ) {
					var active = menubar.active;
					menubar.active.blur();
					menubar._close( event );
					$( event.target ).blur().mouseleave();
					active.prev().focus();
				}
			},
			focusin: function() {
        this._disableTabIndexOnFirstMenuItem();
				clearTimeout( menubar.closeTimer );
			},
			focusout: function( event ) {
				menubar.closeTimer = setTimeout (function() {
					menubar._close( event );
					menubar._reenableTabIndexOnFirstMenuItem();
				}, 150 );
			},
			"mouseleave .ui-menubar-item": function( event ) {
				if ( menubar.options.autoExpand ) {
					menubar.closeTimer = setTimeout( function() {
						menubar._close( event );
					}, 150 );
				}
			},
			"mouseenter .ui-menubar-item": function() {
				clearTimeout( menubar.closeTimer );
			}
		});
	},

	_initializeMenuItems: function() {
		var menubar = this;

		this.menuItems
			.addClass("ui-menubar-item")
			.attr( "role", "presentation" );

		$.each( this.menuItems, function( index, menuItem ){
			menubar._initializeMenuItem( $( menuItem ), menubar );
			menubar._identifyMenuItemsNeighbors( $( menuItem ), menubar, index );
		} );
	},

	_identifyMenuItemsNeighbors: function( $menuItem, menubar, index ) {
		var collectionLength = this.menuItems.toArray().length,
			isFirstElement = ( index === 0 ),
			isLastElement = ( index === ( collectionLength - 1 ) );

		if ( isFirstElement ) {
			$menuItem.data( "prevMenuItem", $( this.menuItems[collectionLength - 1]) );
			$menuItem.data( "nextMenuItem", $( this.menuItems[index+1])  );
		} else if ( isLastElement ) {
			$menuItem.data( "nextMenuItem", $( this.menuItems[0])  );
			$menuItem.data( "prevMenuItem", $( this.menuItems[index-1])  );
		} else {
			$menuItem.data( "nextMenuItem", $( this.menuItems[index+1])  );
			$menuItem.data( "prevMenuItem", $( this.menuItems[index-1])  );
		}
	},

	_initializeMenuItem: function( $menuItem, menubar ) {
			var $item = $menuItem.children("button, a");

			menubar._determineSubmenuStatus( $menuItem, menubar );
			menubar._styleMenuItem( $menuItem, menubar );

			$menuItem.data( "name", $item.text() );

			if ( $menuItem.data("hasSubMenu") ) {
				menubar._initializeSubMenu( $menuItem, menubar );
			}

			$item.data( "parentMenuItem", $menuItem );
			menubar.items.push( $item );
			menubar._initializeItem( $item, menubar );
	},

	_determineSubmenuStatus: function ( $menuItem, menubar ) {
		var subMenus = $menuItem.children( menubar.options.menuElement ),
			hasSubMenu = subMenus.length > 0;
		$menuItem.data( "hasSubMenu", hasSubMenu );
	},

	_styleMenuItem: function( $menuItem ) {
		$menuItem.css({
			"border-width" : "1px",
			"border-style" : "hidden"
		});
	},

	_initializeSubMenu: function( $menuItem, menubar ){
		var subMenus = $menuItem.children( menubar.options.menuElement );

		subMenus
			.menu({
				position: {
					within: this.options.position.within
				},
				select: function( event, ui ) {
					ui.item.parents("ul.ui-menu:last").hide();
					menubar._close();
					// TODO what is this targetting? there's probably a better way to access it
					$( event.target ).prev().focus();
					menubar._trigger( "select", event, ui );
				},
				menus: this.options.menuElement
			})
			.hide()
			.attr({
				"aria-hidden": "true",
				"aria-expanded": "false"
			});

		this._on( subMenus, {
			keydown: function( event ) {
        $(event.target).attr("tabIndex", 1);
				var parentButton,
					menu = $( this );
				if ( menu.is(":hidden") ) {
					return;
				}
				switch ( event.keyCode ) {
				case $.ui.keyCode.LEFT:
					parentButton = menubar.active.prev(".ui-button");

					if ( this.openSubmenus ) {
						this.openSubmenus--;
					} else if ( parentButton.parent().prev().data("hasSubMenu") ) {
						menubar.active.blur();
						menubar._open( event, parentButton.parent().prev().find(".ui-menu") );
					} else {
						parentButton.parent().prev().find(".ui-button").focus();
						menubar._close( event );
						this.open = true;
					}

					event.preventDefault();
        $(event.target).attr("tabIndex", -1);
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
	},

	_initializeItem: function( $anItem, menubar ) {
		var menuItemHasSubMenu = $anItem.data("parentMenuItem").data("hasSubMenu");


		this._focusable( this.items );
		this._hoverable( this.items );
		this._applyDOMPropertiesOnItem( $anItem, menubar);

		this.__applyMouseAndKeyboardBehaviorForMenuItem ( $anItem, menubar );

		if ( menuItemHasSubMenu ) {
			this.__applyMouseBehaviorForSubmenuHavingMenuItem( $anItem, menubar );
			this.__applyKeyboardBehaviorForSubmenuHavingMenuItem( $anItem, menubar );

			$anItem.attr( "aria-haspopup", "true" );
			if ( menubar.options.menuIcon ) {
				$anItem.addClass("ui-state-default").append("<span class='ui-button-icon-secondary ui-icon ui-icon-triangle-1-s'></span>");
				$anItem.removeClass("ui-button-text-only").addClass("ui-button-text-icon-secondary");
			}
		} else {
			this.__applyMouseBehaviorForSubmenulessMenuItem( $anItem, menubar );
			this.__applyKeyboardBehaviorForSubmenulessMenuItem( $anItem, menubar );
		}
	},

	__applyMouseAndKeyboardBehaviorForMenuItem: function( $anItem, menubar ) {
		menubar._on( $anItem, {
			focus:	function(){
        $anItem.attr("tabIndex", 1);
				$anItem.addClass("ui-state-focus");
			},
			focusout:  function(){
        $anItem.attr("tabIndex", -1);
				$anItem.removeClass("ui-state-focus");
			}
		} );
	},

	_applyDOMPropertiesOnItem: function( $item, menubar) {
		$item
			.addClass("ui-button ui-widget ui-button-text-only ui-menubar-link")
			.attr( "role", "menuitem" )
			.wrapInner("<span class='ui-button-text'></span>");

		if ( menubar.options.buttons ) {
			$item.removeClass("ui-menubar-link").addClass("ui-state-default");
		}
	},

	__applyMouseBehaviorForSubmenuHavingMenuItem: function ( input, menubar ) {
		var menu = input.next( menubar.options.menuElement ),
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
		menubar._on( input, {
			click: mouseBehaviorCallback,
			focus: mouseBehaviorCallback,
			mouseenter: mouseBehaviorCallback
		});
	},

	__applyKeyboardBehaviorForSubmenuHavingMenuItem: function( input, menubar ) {
		var keyboardBehaviorCallback = function( event ) {
			switch ( event.keyCode ) {
			case $.ui.keyCode.SPACE:
			case $.ui.keyCode.UP:
			case $.ui.keyCode.DOWN:
				menubar._open( event, $( event.target ).next() );
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
        event.stopPropagation();
				break;
			}
		};

		menubar._on( input, {
			keydown: keyboardBehaviorCallback
		});
	},

	__applyMouseBehaviorForSubmenulessMenuItem: function( $anItem, menubar ) {
		menubar._off( $anItem, "click mouseenter" );
		menubar._hoverable( $anItem );
		menubar._on( $anItem, {
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
	__applyKeyboardBehaviorForSubmenulessMenuItem: function( $anItem, menubar ) {
		var behavior = function( event ) {
			if ( event.keyCode === $.ui.keyCode.LEFT ) {
				this.previous( event );
				event.preventDefault();
			} else if ( event.keyCode === $.ui.keyCode.RIGHT ) {
				this.next( event );
				event.preventDefault();
			}
		};
		menubar._on( $anItem, {
			keydown: behavior
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
		button = menuItem.addClass("ui-state-active");

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
			closestMenuItem.find(".ui-button");
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

  _disableTabIndexOnFirstMenuItem: function() {
    this.items[0].attr( "tabIndex", -1 );
  },

	_reenableTabIndexOnFirstMenuItem: function() {
    this.items[0].attr( "tabIndex", 1 );
	}

});

}( jQuery ));
