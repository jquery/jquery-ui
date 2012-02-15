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
 *	jquery.ui.button.js
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
		// set a default id value, generate a new random one if not set by developer
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

		this._drawMenu();
		this.refresh();

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
				href: '#' + this.ids.id,
				html: '&nbsp;',
				tabindex: ( tabindex ? tabindex : this.options.disabled ? -1 : 0 ),
				id: this.ids.button,
				width: this.element.outerWidth(),
				'aria-expanded': false,
				'aria-autocomplete': 'list',
				'aria-owns': this.ids.menu,
				'aria-haspopup': true
			})
			.button({
				icons: {
					primary: ( this.options.dropdown ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-2-n-s' )
				}
			})
			// change ARIA role
			.attr( 'role', 'combobox' );

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

		// set width
		if ( this.options.dropdown ) {
			var setWidth = this.button.outerWidth();
		} else {
			var text = this.button.find( "span.ui-button-text"),
				setWidth = text.width() + parseFloat( text.css( "padding-left" ) ) || 0 + parseFloat( text.css( "margin-left" ) || 0 );
		}

		// wrap menu
		this.menuWrap = $( '<div />', {
				'class': 'ui-selectmenu-menu',
				width: setWidth
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
					if ( item.index != that.focus ) {
						that._trigger( "focus", event, { item: item } );
					}
					if ( !that.isOpen ) {
						that._select( item, event );
					}
				}
				that.focus = item.index;
			}
		})
		// change ARIA role
		.attr( 'role', 'listbox' );

		// change menu styles?
		this._setOption( "dropdown", this.options.dropdown );

		// document click closes menu
		this._bind( document, {
			click: function( event ) {
				if ( this.isOpen && !$( event.target ).closest( "#" + this.ids.button).length ) {
					this.close( event );
				}
			}
		});
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

			this._toggleButtonStyle();

			this.menuWrap.addClass( 'ui-selectmenu-open' );
			this.menu.attr("aria-hidden", false);
			this.button.attr("aria-expanded", true);

			// check if menu has items
			if ( this.items ) {
				var currentItem = this._getSelectedItem();
				// needs to be fired after the document click event has closed all other Selectmenus
				// otherwise the current item is not indicated
				// TODO check if this should be handled by Menu
				this._delay( function(){
					this.menu.menu( "focus", event, currentItem );
				}, 1);

				if ( !this.options.dropdown ) {
					// center current item
					if ( this.menu.outerHeight() < this.menu.prop( "scrollHeight" ) ) {
						this.menuWrap.css( "left" , -10000 );
						this.menu.scrollTop( this.menu.scrollTop() + currentItem.position().top - this.menu.outerHeight()/2 + currentItem.outerHeight()/2 );
						this.menuWrap.css( "left" , "auto" );
					}

					$.extend( this.options.position, {
						my: "left top",
						at: "left top",
						// calculate offset
						offset: "0 " + ( this.menu.offset().top  - currentItem.offset().top + ( this.button.outerHeight() - currentItem.outerHeight() ) / 2 )
					});
				}
			}

			this.menuWrap
				.zIndex( this.element.zIndex() + 1 )
				.position( $.extend({
					of: this.button
				}, this.options.position ));

			this.isOpen = true;
			this._trigger( "open", event );
		}
	},

	close: function( event ) {
		if ( this.isOpen ) {
			this._toggleButtonStyle();

			this.menuWrap.removeClass( 'ui-selectmenu-open' );
			this.menu.attr( "aria-hidden", true );
			this.button.attr( "aria-expanded", false );

			this.isOpen = false;
			this._trigger( "close", event );
		}
	},

	widget: function() {
		return this.buttonWrap.add( this.menuWrap );
	},

	_renderMenu: function( ul, items ) {
		var that = this,
			currentOptgroup = "";

		$.each( items, function( index, item ) {
			if ( item.optgroup != currentOptgroup ) {
				var optgroup = $( '<li />', {
					'class': 'ui-selectmenu-optgroup',
					html: item.optgroup,
					click: function( event ){
						event.stopPropagation();
					}
				});
				if ( item.element.parent( "optgroup" ).attr( "disabled" ) ) optgroup.addClass( 'ui-state-disabled' );
				ul.append( optgroup );
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
		return this.menuItems.eq( this.element[0].selectedIndex );
	},

	_toggle: function( event ) {
		if ( this.isOpen ) {
			this.close( event );
		} else {
			this.open( event );
		}
	},

	_buttonEvents: {
		click: function( event ) {
			this._toggle( event );
			event.preventDefault();
		},
		keydown: function( event ) {
			var prevDef = true;
			switch (event.keyCode) {
				case $.ui.keyCode.TAB:
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
				case $.ui.keyCode.SPACE:
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
		var oldIndex = this.element[0].selectedIndex;
		// change native select element
		this.element[0].selectedIndex = item.index;
		this._setSelected( item );
		this._trigger( "select", event, { item: item } );

		if ( item.index != oldIndex ) {
			this._trigger( "change", event, { item: item } );
		}
	},

	_setSelected: function( item ) {
		var link = item.element.find("a");
		// update button text
		this.button.button( "option", "label", item.label );
		// change ARIA attr
		this.button.add( this.menu ).attr( "aria-activedescendant" , link.attr( "id" ) );
		this.menuItems.find("a").attr( "aria-selected", false );
		link.attr( "aria-selected", true );
	},

	_setOption: function( key, value ) {
		this._super( key, value );

		if ( key === "appendTo" ) {
			this.menuWrap.appendTo( $( value || "body", this.element[0].ownerDocument )[0] );
		}
		if ( key === "dropdown" ) {
			this.menu.toggleClass( 'ui-corner-bottom', value ).toggleClass( 'ui-corner-all', !value );
		}
		if ( key === "disabled" ) {
			this.button.button( "option", "disabled", value );
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

	_toggleButtonStyle: function() {
		if ( this.options.dropdown ) {
			this.button.toggleClass( 'ui-corner-top', !this.isOpen ).toggleClass( 'ui-corner-all', this.isOpen );
		}
	},

	_getCreateOptions: function() {
		return { disabled: ( this.element.attr( 'disabled' ) ) ? true : false };
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
