/*
 * jQuery UI Selectmenu @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Selectmenu
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
		dropdown: true,
		appendTo: "body",
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		// callbacks
		open: null,
		focus: null,
		select: null,
		close: null,
		change: null
	},

	_create: function() {
		// get / make unique id
		var selectmenuId = this.element.attr( 'id' ) || 'ui-selectmenu-' + Math.random().toString( 16 ).slice( 2, 10 );

		// array of button and menu id's
		this.ids = { id: selectmenuId, button: selectmenuId + '-button', menu: selectmenuId + '-menu' };

		// catch click event of the label
		this._bind({
			'click':  function( event ) {
				this.button.focus();
				event.preventDefault();
			}
		});

		this._drawButton();
		this._bind( this.button, this._buttonEvents );
		this._hoverable( this.button );
		this._focusable( this.button );

		this._drawMenu();

		// document click closes menu
		this._bind( document, {
			click: function( event ) {
				if ( this.isOpen && !$( event.target ).closest( "li.ui-state-disabled, li.ui-selectmenu-optgroup, #" + this.ids.button ).length ) {
					this.close( event );
				}
			}
		});

		if ( this.options.disabled ) {
			this.disable();
		}
	},

	_drawButton: function() {
		var tabindex = this.element.attr( 'tabindex' );

		// hide original select tag
		this.element.hide();

		// create button
		this.button = $( '<a />', {
			'class': 'ui-button ui-widget ui-state-default ui-corner-all',
			href: '#' + this.ids.id,
			tabindex: ( tabindex ? tabindex : this.options.disabled ? -1 : 0 ),
			id: this.ids.button,
			width: this.element.outerWidth(),
			role: 'combobox',
			'aria-expanded': false,
			'aria-autocomplete': 'list',
			'aria-owns': this.ids.menu,
			'aria-haspopup': true
		});

		this.button.prepend( $( '<span class="ui-icon ' + ( this.options.dropdown ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-2-n-s' ) + '"/>' ) );

		this.buttonText = $( '<span />', {
				'class': 'ui-selectmenu-text' ,
				html: this.element.find( "option:selected" ).text() || '&nbsp;'
			})
			.appendTo( this.button );

		// wrap and insert new button
		this.buttonWrap = $( '<span />', {
				'class': 'ui-selectmenu-button'
			})
			.append( this.button )
			.insertAfter( this.element );
	},

	_drawMenu: function() {
		var that = this;

		// create menu portion, append to body
		this.menu = $( '<ul />', {
			'aria-hidden': true,
			'aria-labelledby': this.ids.button,
			id: this.ids.menu
		});

		// wrap menu
		this.menuWrap = $( '<div />', {
				'class': 'ui-selectmenu-menu',
				width: ( this.options.dropdown ) ? this.button.outerWidth() : this.buttonText.width() + parseFloat( this.buttonText.css( "padding-left" ) ) || 0 + parseFloat( this.buttonText.css( "margin-left" ) ) || 0
			})
			.append( this.menu )
			.appendTo( this.options.appendTo );

		// init menu widget
		this.menu.menu({
			select: function( event, ui ) {
				var item = ui.item.data( "item.selectmenu" );

				that._select( item, event );

				if ( that.isOpen ) {
					event.preventDefault();
					that.close( event );
				}
			},
			focus: function( event, ui ) {
				var item = ui.item.data( "item.selectmenu" );

				if ( that.focus !== undefined ) {
					if ( item.index !== that.focus ) {
						that._trigger( "focus", event, { item: item } );
						if ( !that.isOpen ) {
							that._select( item, event );
						}
					}
				}
				that.focus = item.index;
			}
		})
		// change ARIA role
		.attr( 'role', 'listbox' );

		// change menu styles?
		if ( this.options.dropdown ) {
			this.menu.addClass( 'ui-corner-bottom' ).removeClass( 'ui-corner-all' );
		}

		// unbind uneeded Menu events
		this.menu.unbind ( "mouseleave.menu" );
		$( document ).unbind( "click.menu" );
	},

	refresh: function() {
		this.menu.empty();

		var options = this.element.find( 'option' );
		if ( options.length ) {
			this._readOptions( options );
			this._renderMenu( this.menu, this.items );

			this.menu.menu( "refresh" );
			this.menuItems = this.menu.find( "li" ).not( '.ui-selectmenu-optgroup' );

			// adjust ARIA
			this.menuItems.find( 'a' ).attr( 'role', 'option' );

			// select current item
			var item = this._getSelectedItem();
			this.menu.menu( "focus", null, item );
			this._setSelected( item.data( "item.selectmenu" ) );

			// set disabled state
			this._setOption( "disabled", this._getCreateOptions()[ 'disabled' ] );
		}
	},

	open: function( event ) {
		if ( !this.options.disabled ) {
			// make sure menu is refreshed on first init (needed at least for IE9)
			if ( this.isOpen === undefined ) {
				this.button.trigger( "focus" );
			}

			this.isOpen = true;
			this._toggleAttr();

			if ( this.items && !this.options.dropdown ) {
				var currentItem = this._getSelectedItem();
				// center current item
				if ( this.menu.outerHeight() < this.menu.prop( "scrollHeight" ) ) {
					this.menuWrap.css( "left" , -10000 );
					this.menu.scrollTop( this.menu.scrollTop() + currentItem.position().top - this.menu.outerHeight() / 2 + currentItem.outerHeight() / 2 );
					this.menuWrap.css( "left" , "auto" );
				}

				$.extend( this.options.position, {
					my: "left top",
					at: "left top",
					// calculate offset
					offset: "0 " + ( this.menu.offset().top  - currentItem.offset().top + ( this.button.outerHeight() - currentItem.outerHeight() ) / 2 )
				});
			}
			
			this.options.position.of = this.button;
			this.menuWrap
				.zIndex( this.element.zIndex() + 1 )
				.position( this.options.position );

			this._trigger( "open", event );
		}
	},

	close: function( event ) {
		if ( this.isOpen ) {
			this.isOpen = false;
			this._toggleAttr();
			this._trigger( "close", event );
		}
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
				$( '<li />', {
					'class': 'ui-selectmenu-optgroup' + ( item.element.parent( "optgroup" ).attr( "disabled" ) ? ' ui-state-disabled' : '' ),
					html: item.optgroup
				}).appendTo( ul );
				currentOptgroup = item.optgroup;
			}
			that._renderItem( ul, item );
		});
	},

	_renderItem: function( ul, item) {
		var li = $( "<li />" ).data( "item.selectmenu", item );
		if ( item.disabled ) {
			li.addClass( 'ui-state-disabled' ).html( item.label );
		} else {
			li.append( $( "<a />", {
					html: item.label,
					href: '#'
				})
			);
		}

		return li.appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( direction == "first" || direction == "last" ) {
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

	_buttonEvents: {
		focus: function( event ) {
			// init Menu on first focus
			this.refresh();
			this.button.unbind( "focus." + this.widgetName );
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

		if ( item.index != oldIndex ) {
			this._trigger( "change", event, { item: item } );
		}
	},

	_setSelected: function( item ) {
		// update button text
		this.buttonText.html( item.label );
		// change ARIA attr
		this.menuItems.find( "a" ).attr( "aria-selected", false );
		this._getSelectedItem().find( "a" ).attr( "aria-selected", true );
	},

	_setOption: function( key, value ) {
		this._super( key, value );

		if ( key === "appendTo" ) {
			this.menuWrap.appendTo( $( value || "body", this.element[ 0 ].ownerDocument )[ 0 ] );
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

	_toggleAttr: function(){
		if ( this.options.dropdown ) {
			this.button.toggleClass( 'ui-corner-top', this.isOpen ).toggleClass( 'ui-corner-all', !this.isOpen );
		}
		this.menuWrap.toggleClass( 'ui-selectmenu-open', this.isOpen );
		this.menu.attr("aria-hidden", !this.isOpen);
		this.button.attr("aria-expanded", this.isOpen);
	},

	_getCreateOptions: function() {
		return { disabled: !!this.element.attr( 'disabled' ) };
	},

	_readOptions: function( options ) {
		var data = [];
		$.each( options, function( index, item ) {
			var option = $( item ),
				optgroup = option.parent( "optgroup" );
			data.push({
				element: option,
				index: index,
				value: option.attr( 'value' ),
				label: option.text() || '&nbsp;',
				optgroup: optgroup.attr( "label" ) || false,
				disabled: optgroup.attr( "disabled" ) || option.attr( "disabled" )
			});
		});
		this.items = data;
	},

	_destroy: function() {
		this.menuWrap.remove();
		this.buttonWrap.remove();
		this.element.show();
	}
});

}( jQuery ));
