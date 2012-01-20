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
		
		if ( this.element.attr( 'disabled' ) ) {
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
				tabindex: ( tabindex ? tabindex : this.element.attr( 'disabled' ) ? -1 : 0 ),
				id: this.ids.button,
				css: {
					width: this.element.outerWidth()
				},
				'aria-owns': this.ids.menu,
				'aria-haspopup': true
			})
			.button({
				label: this.element.find( "option:selected" ).text(),
				icons: {
					primary: ( this.options.dropdown ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-2-n-s' )
				}
			});

		// wrap and insert new button
		this.buttonWrap = $( '<span />' )
			.addClass( 'ui-selectmenu-button' )
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
		this.menuWrap = $( '<div />' )
			.addClass( 'ui-selectmenu-menu' )
			.width( setWidth )
			.append( this.menu )
			.appendTo( this.options.appendTo );

		// init menu widget
		this.menu.menu({
			select: function( event, ui ) {
				var item = ui.item.data( "item.selectmenu" ),
					oldIndex = that.element[0].selectedIndex;

				that._setIndex( item.index );
				that._trigger( "select", event, { item: item } );

				if ( item.index != oldIndex ) {
					that._trigger( "change", event, { item: item } );
				}

				if ( that.isOpen ) {
					event.preventDefault();
					that.close( event, true);
				}
			},
			focus: function( event, ui ) {
				var item = ui.item.data( "item.selectmenu" );

				if ( that.focus !== undefined && item.index != that.focus ) {
					that._trigger( "focus", event, { item: item } );
				}

				that.focus = item.index;
			}
		})
		// change ARIA role
		.attr( 'role', 'menubox' );
		
		// change menu styles?
		this._setOption( "dropdown", this.options.dropdown );

		// document click closes menu
		this._bind( document, {
			'click': function( event ) {
				if ( this.isOpen && !$( event.target ).closest( "#" + this.ids.button).length ) {
					this.close( event );
				}
			}
		});
	},

	refresh: function() {
		this.menu.empty();

		this._readOptions();
		this._renderMenu( this.menu, this.items );

		this.menu.menu( "refresh" );
		// button option label wont work here
		this.button.children( '.ui-button-text' ).text( this.items[ this.element[0].selectedIndex ].label );

		// adjust ARIA
		this.menu.find( "li" ).not( '.ui-selectmenu-optgroup' ).find( 'a' ).attr( 'role', 'option' );
		this.menu.attr( "aria-activedescendant" , this.menu.find( "li.ui-menu-item a" ).eq( this.element[0].selectedIndex ).attr( "id" ) );
		
		// transfer disabled state
		if ( this.element.attr( 'disabled' ) ) {
			this.disable();
		} else {
			this.enable()
		}
	},

	open: function( event ) {
		if ( !this.options.disabled ) {
			var currentItem = this._getSelectedItem();
			
			this._toggleButtonStyle();

			this.menuWrap.addClass( 'ui-selectmenu-open' );
			this.menu.attr("aria-hidden", false);
			// needs to be fired after the document click event has closed all other Selectmenus
			// otherwise the current item is not indicated
			// TODO check if this should be handled by Menu
			this._delay( function(){
				this.menu.menu( "focus", event, currentItem );
			}, 1);

			if ( !this.options.dropdown ) {
				$.extend( this.options.position, {
					my: "left top",
					at: "left top",
					// calculate offset
					offset: "0 " + ( this.menu.offset().top  - currentItem.offset().top + ( this.button.outerHeight() - currentItem.outerHeight() ) / 2 )
				});
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

	close: function( event, focus ) {
		if ( this.isOpen ) {
			this._toggleButtonStyle();

			this.menuWrap.removeClass( 'ui-selectmenu-open' );
			this.menu.attr("aria-hidden", true);
			this.isOpen = false;

			if ( focus ) {
				this.button.focus();
			}

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
				var optgroup = $( '<li class="ui-selectmenu-optgroup">' + item.optgroup + '</li>' );
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
			li.addClass( 'ui-state-disabled' ).text( item.label );
		} else {
			li.append( $( "<a />", {
					text: item.label,
					href: '#'
				})
			);
		}

		return li.appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( direction == "first" || direction == "last" ) {
			// set focus manually for first or last item
			this.menu.menu( "focus", event, this.menu.find( "li" ).not( '.ui-selectmenu-optgroup' )[ direction ]() );
		} else {
			// if menu is closed we need to focus the element first to indicate correct element
			if ( !this.isOpen ) {
				this.menu.menu( "focus", event, this._getSelectedItem() );
			}
			// move to and focus next or prev item
			this.menu.menu( direction, event );		
		}
		
		// select if selectmenu is closed
		if ( !this.isOpen ) {
			this.menu.menu( "select", event );
		}
	},

	_getSelectedItem: function() {
		return this.menu.find( "li" ).not( '.ui-selectmenu-optgroup' ).eq( this.element[0].selectedIndex );
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
			this.button.unbind( "focus." + this.widgetName )
		},
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
	
	_setIndex: function( index ) {
		this.element[0].selectedIndex = index;
		this.button.button( "option", "label", this.items[ index ].label );
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

	_readOptions: function() {
		var data = [];
		$.each( this.element.find( 'option' ), function( index, item ) {
			var option = $( item ),
				optgroup = option.parent( "optgroup" );
			data.push({
				element: option,
				index: index,
				value: option.attr( 'value' ),
				label: option.text(),
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
