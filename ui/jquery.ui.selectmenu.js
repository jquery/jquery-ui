/*!
 * jQuery UI Selectmenu @VERSION
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/selectmenu
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 *	jquery.ui.menu.js
 */
(function( $, undefined ) {

$.widget( "ui.selectmenu", {
	version: "@VERSION",
	defaultElement: "<select>",
	options: {
		appendTo: null,
		dropdown: true,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		select: null
	},

	_create: function() {
		var selectmenuId = this.element.uniqueId().attr( "id" );
		this.ids = { id: selectmenuId, button: selectmenuId + "-button", menu: selectmenuId + "-menu" };

		this._drawButton();
		this._drawMenu();

		this._on( document, this._documentClick );

		if ( this.options.disabled ) {
			this.disable();
		}
	},

	_drawButton: function() {
		var tabindex = this.element.attr( "tabindex" );

		// fix existing label
		this.label = $( "label[for='" + this.ids.id + "']" ).attr( "for", this.ids.button );
		this._on( this.label, {
			"click":  function( event ) {
				this.button.focus();
				event.preventDefault();
			}
		});

		// hide original select tag
		this.element.hide();

		// create button
		this.button = $( "<a>", {
			"class": "ui-button ui-widget ui-state-default ui-corner-all",
			href: "#" + this.ids.id,
			tabindex: ( tabindex ? tabindex : this.options.disabled ? -1 : 0 ),
			id: this.ids.button,
			width: this.element.outerWidth(),
			role: "combobox",
			"aria-expanded": false,
			"aria-autocomplete": "list",
			"aria-owns": this.ids.menu,
			"aria-haspopup": true
		});

		this.button.prepend( $( "<span>", {
			"class": "ui-icon " + ( ( this.options.dropdown ) ? "ui-icon-triangle-1-s" : "ui-icon-triangle-2-n-s" )
		}));

		this.buttonText = $( "<span>", {
				"class": "ui-selectmenu-text"
			})
			.appendTo( this.button );
		this._setText( this.buttonText, this.element.find( "option:selected" ).text() );

		// wrap and insert new button
		this.buttonWrap = $( "<span>", {
				"class": "ui-selectmenu-button"
			})
			.append( this.button )
			.insertAfter( this.element );

		this._on( this.button, this._buttonEvents );
		this._hoverable( this.button );
		this._focusable( this.button );
	},

	_drawMenu: function() {
		var menuInstance,
			that = this;

		// create menu portion, append to body
		this.menu = $( "<ul>", {
			"aria-hidden": true,
			"aria-labelledby": this.ids.button,
			id: this.ids.menu
		});

		// wrap menu
		this.menuWrap = $( "<div>", {
				"class": "ui-selectmenu-menu",
				width: ( this.options.dropdown ) ? this.button.outerWidth() : this.buttonText.width() + parseFloat( this.buttonText.css( "padding-left" ) ) || 0 + parseFloat( this.buttonText.css( "margin-left") ) || 0
			})
			.append( this.menu )
			.appendTo( this._appendTo() );

		// init menu widget
		menuInstance = this.menu.menu({
			select: function( event, ui ) {
				var item = ui.item.data( "ui-selectmenu-item" );

				that._select( item, event );

				if ( that.isOpen ) {
					event.preventDefault();
					that.close( event );
				}
			},
			focus: function( event, ui ) {
				var item = ui.item.data( "ui-selectmenu-item" );
				// prevent inital focus from firing and checks if its a newly focused item
				if ( that.focus !== undefined && item.index !== that.focus ) {
					that._trigger( "focus", event, { item: item } );
					if ( !that.isOpen ) {
						that._select( item, event );
					}
				}
				that.focus = item.index;

				// Set ARIA active descendant
				that.button.attr( "aria-activedescendant", that.menuItems.eq( item.index ).find( "a" ).attr( "id" ) );
			},
			// set ARIA role
			role: "listbox"
		})
		.data( "ui-menu" );

		// dropdown style needs border on bottom only
		if ( this.options.dropdown ) {
			this.menu.addClass( "ui-corner-bottom" ).removeClass( "ui-corner-all" );
		}

		// make sure focus stays on selected item
		menuInstance.delay = 999999999;
		// unbind uneeded Menu events
		menuInstance._off( this.menu, "mouseleave" );
	},

	refresh: function() {
		this.menu.empty();

		var item,
			options = this.element.find( "option" );
		if ( options.length ) {
			this._readOptions( options );
			this._renderMenu( this.menu, this.items );

			this.menu.menu( "refresh" );
			this.menuItems = this.menu.find( "li" ).not( ".ui-selectmenu-optgroup" );

			// select current item
			item = this._getSelectedItem();
			// make sure menu is selected item aware
			this.menu.menu( "focus", null, item );
			this._setSelected( item.data( "ui-selectmenu-item" ) );

			// set disabled state
			this._setOption( "disabled", this._getCreateOptions().disabled );
		}
	},

	open: function( event ) {
		if ( this.options.disabled ) {
			return;
		}

		var currentItem,
			_position = {
			of: this.button
		};

		this.isOpen = true;
		this._toggleAttr();

		// do not change position if non default position options are set (needed for custom positioned popup menus)
		if ( this.items && !this.options.dropdown && this.options.position.my === "left top" && this.options.position.at === "left bottom" ) {
			currentItem = this._getSelectedItem();
			// center current item
			if ( this.menu.outerHeight() < this.menu.prop( "scrollHeight" ) ) {
				this.menuWrap.css( "left" , -10000 );
				this.menu.scrollTop( this.menu.scrollTop() + currentItem.position().top - this.menu.outerHeight() / 2 + currentItem.outerHeight() / 2 );
				this.menuWrap.css( "left" , "auto" );
			}
			_position.my = "left top" + ( this.menu.offset().top  - currentItem.offset().top + ( this.button.outerHeight() - currentItem.outerHeight() ) / 2 );
			_position.at = "left top";
		}

		this.menuWrap.position( $.extend( {}, this.options.position, _position ) );

		this._trigger( "open", event );
	},

	close: function( event ) {
		if ( !this.isOpen ) {
			return;
		}

		this.isOpen = false;
		this._toggleAttr();

		// check if we have an item to select
		if ( this.menuItems ) {
			var id = this._getSelectedItem().find( "a" ).attr( "id" );
			this.button.attr( "aria-activedescendant", id );
			this.menu.attr( "aria-activedescendant", id );
		}

		this._trigger( "close", event );
	},

	widget: function() {
		return this.button;
	},

	menuWidget: function() {
		return this.menu;
	},

	_renderMenu: function( ul, items ) {
		var that = this,
			currentOptgroup = "";

		$.each( items, function( index, item ) {
			if ( item.optgroup !== currentOptgroup ) {
				$( "<li />", {
					"class": "ui-selectmenu-optgroup" + ( item.element.parent( "optgroup" ).attr( "disabled" ) ? " ui-state-disabled" : "" ),
					text: item.optgroup
				}).appendTo( ul );
				currentOptgroup = item.optgroup;
			}
			that._renderItem( ul, item );
		});
	},

	_renderItem: function( ul, item ) {
		var li = $( "<li />" ).data( "ui-selectmenu-item", item ),
			a = $( "<a />", { href: "#" });

		if ( item.disabled ) {
			li.addClass( "ui-state-disabled" );
		}
		this._setText( a, item.label );

		return li.append( a ).appendTo( ul );
	},

	_setText: function( element, value ) {
		if ( value ) {
			element.text( value );
		} else {
			element.html( "&#160;" );
		}
	},

	_move: function( direction, event ) {
		if ( direction === "first" || direction === "last" ) {
			// set focus manually for first or last item
			this.menu.menu( "focus", event, this.menuItems[ direction ]() );
		} else {
			// move to and focus next or prev item
			this.menu.menu( direction, event );
		}
	},

	_getSelectedItem: function() {
		return this.menuItems.eq( this.element[ 0 ].selectedIndex );
	},

	_toggle: function( event ) {
		if ( this.isOpen ) {
			this.close( event );
		} else {
			this.open( event );
		}
	},

	_documentClick: {
		click: function( event ) {
			if ( this.isOpen && !$( event.target ).closest( "li.ui-state-disabled, li.ui-selectmenu-optgroup, #" + this.ids.button ).length ) {
				this.close( event );
			}
		}
	},

	_buttonEvents: {
		focus: function() {
			// init Menu on first focus
			this.refresh();
			// reset focus class as its removed by ui.widget._setOption
			this.button.addClass( "ui-state-focus" );
			this._off( this.button, "focus" );
		},
		click: function( event ) {
			this._toggle( event );
			event.preventDefault();
		},
		keydown: function( event ) {
			var prevDef = true;
			switch ( event.keyCode ) {
				case $.ui.keyCode.TAB:
				case $.ui.keyCode.ESCAPE:
					if ( this.isOpen ) {
						this.close( event );
					}
					prevDef = false;
					break;
				case $.ui.keyCode.ENTER:
					if ( this.isOpen ) {
						this.menu.menu( "select", event );
					}
					break;
				case $.ui.keyCode.UP:
					if ( event.altKey ) {
						this._toggle( event );
					} else {
						this._move( "previous", event );
					}
					break;
				case $.ui.keyCode.DOWN:
					if ( event.altKey ) {
						this._toggle( event );
					} else {
						this._move( "next", event );
					}
					break;
				case $.ui.keyCode.SPACE:
					if ( this.isOpen ) {
						this.menu.menu( "select", event );
					} else {
						this._toggle( event );
					}
					break;
				case $.ui.keyCode.LEFT:
					this._move( "previous", event );
					break;
				case $.ui.keyCode.RIGHT:
					this._move( "next", event );
					break;
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.PAGE_UP:
					this._move( "first", event );
					break;
				case $.ui.keyCode.END:
				case $.ui.keyCode.PAGE_DOWN:
					this._move( "last", event );
					break;
				default:
					this.menu.trigger( event );
					prevDef = false;
			}
			if ( prevDef ) {
				event.preventDefault();
			}
		}
	},

	_select: function( item, event ) {
		var oldIndex = this.element[ 0 ].selectedIndex;
		// change native select element
		this.element[ 0 ].selectedIndex = item.index;
		this._setSelected( item );
		this._trigger( "select", event, { item: item } );

		if ( item.index !== oldIndex ) {
			this._trigger( "change", event, { item: item } );
		}
	},

	_setSelected: function( item ) {
		this._setText( this.buttonText, item.label );
		// change ARIA attr
		this.menuItems.find( "a" ).attr( "aria-selected", false );
		this.menuItems.eq( item.index ).find( "a" ).attr( "aria-selected", true );
		this.button.attr( "aria-labelledby", this.menuItems.eq( item.index ).find( "a" ).attr( "id" ) );
	},

	_setOption: function( key, value ) {
		this._super( key, value );

		if ( key === "appendTo" ) {
			this.menuWrap.appendTo( this._appendTo() );
		}
		if ( key === "disabled" ) {
			this.menu.menu( "option", "disabled", value );
			if ( value ) {
				this.element.attr( "disabled", "disabled" );
				this.button.attr( "tabindex", -1 );
				this.close();
			} else {
				this.element.removeAttr( "disabled" );
				this.button.attr( "tabindex", 0 );
			}
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[0].body;
		}

		return element;
	},

	_toggleAttr: function(){
		if ( this.options.dropdown ) {
			this.button.toggleClass( "ui-corner-top", this.isOpen ).toggleClass( "ui-corner-all", !this.isOpen );
		}
		this.menuWrap.toggleClass( "ui-selectmenu-open", this.isOpen );
		this.menu.attr( "aria-hidden", !this.isOpen);
		this.button.attr( "aria-expanded", this.isOpen);
	},

	_getCreateOptions: function() {
		return { disabled: !!this.element.attr( "disabled" ) };
	},

	_readOptions: function( options ) {
		var data = [];
		options.each( function( index, item ) {
			var option = $( item ),
				optgroup = option.parent( "optgroup" );
			data.push({
				element: option,
				index: index,
				value: option.attr( "value" ),
				label: option.text(),
				optgroup: optgroup.attr( "label" ) || "",
				disabled: optgroup.attr( "disabled" ) || option.attr( "disabled" )
			});
		});
		this.items = data;
	},

	_destroy: function() {
		this.menuWrap.remove();
		this.buttonWrap.remove();
		this.element.show();
		this.element.removeUniqueId();
		this.label.attr( "for", this.ids.id );
	}
});

}( jQuery ));
