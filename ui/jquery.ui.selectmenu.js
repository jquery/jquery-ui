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
		value: null,
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
			
		// quick array of button and menu id's
		this.ids = { id: selectmenuId, button: selectmenuId + '-button', menu: selectmenuId + '-menu' };
				
		// set current value
		if ( this.options.value ) {
			this.element[0].value = this.options.value;
		} else {
			this.options.value = this.element[0].value;
		}
		
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
				'aria-disabled': this.options.disabled,
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
			'class': 'ui-widget ui-widget-content',
			'aria-hidden': true,
			'aria-labelledby': this.ids.button,
			role: 'menubox',
			id: this.ids.menu
		});
		
		// set width
		if ( this.options.dropdown ) {
			var setWidth = this.button.outerWidth();
		} else {
			var text = this.button.find( "span.ui-button-text");
			var setWidth = text.width() + parseFloat( text.css( "padding-left" ) ) + parseFloat( text.css( "margin-left" ) );
		}

		// wrap menu	
		this.menuWrap = $( '<div />' )
			.addClass( 'ui-selectmenu-menu' )
			.width( setWidth )
			.append( this.menu )
			.appendTo( this.options.appendTo );
				
		// init menu widget
		this.menu
			.data( 'element.selectelemenu', this.element )
			.menu({
				select: function( event, ui ) {
					var flag = false,
						item = ui.item.data( "item.selectmenu" ),
						oldIndex = that.element[0].selectedIndex;
											
					that._setOption( "value", item.value );
					that._trigger( "select", event, { item: item } );
					
					if ( item.index != oldIndex ) {
						that._trigger( "change", event, { item: item } );
					}
					
					if ( that.opened ) {
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
			});
		
		// document click closes menu
		this._bind( document, {
			'mousedown': function( event ) {
				if ( this.opened && !$( event.target ).is( this.menu ) ) {	
					this._delay( function() {
						this.close( event );
					}, 200);
				}
			}
		});			
	},
	
	refresh: function() {
		this.menu.empty();
		
		this._readOptions();
		this._renderMenu( this.menu, this.items );
		
		this.menu.menu( "refresh" );
					
		// adjust ARIA			
		this.menu.find( "li" ).not( '.ui-selectmenu-optgroup' ).find( 'a' ).attr( 'role', 'option' );
		
		if ( this.options.dropdown ) {
			this.menu
				.addClass( 'ui-corner-bottom' )
				.removeClass( 'ui-corner-all' );
		}
		
		// transfer disabled state
		if ( this.element.attr( 'disabled' ) ) {
			this.disable();
		} else {
			this.enable()
		}
	},	
	
	open: function( event ) {		
		var currentItem = this._getSelectedItem();
			
		if ( !this.options.disabled ) {			
			// close all other selectmenus		
			$( '.ui-selectmenu-open' ).not( this.button ).each( function() {
				$( this ).children( 'ul.ui-menu' ).data( 'element.selectelemenu' ).selectmenu( 'close' );
			});
						
			if ( this.options.dropdown ) {
				this.button
					.addClass( 'ui-corner-top' )
					.removeClass( 'ui-corner-all' );
			}		
									
			this.menuWrap.addClass( 'ui-selectmenu-open' );		
			this.menu.menu( "focus", null, currentItem );
		
			if ( !this.options.dropdown ) {
				// center current item
				if ( this.menu.css("overflow") == "auto" ) {
					this.menu.scrollTop( this.menu.scrollTop() + currentItem.position().top - this.menu.outerHeight()/2 + currentItem.outerHeight()/2 );
				}			
				// calculate offset
				var _offset = ( this.menu.offset().top  - currentItem.offset().top + ( this.button.outerHeight() - currentItem.outerHeight() ) / 2);			
				$.extend( this.options.position, {
					my: "left top",
					at: "left top",
					offset: "0 " + _offset
				});
			}
			
			this.menuWrap				
				.zIndex( this.element.zIndex() + 1 )
				.position( $.extend({
					of: this.button
				}, this.options.position ));
			
			this.opened = true;
			this._trigger( "open", event );
		}
	},	
	
	close: function( event, focus ) {
		if ( this.opened ) {
			if ( this.options.dropdown ) {
				this.button
					.addClass( 'ui-corner-all' )
					.removeClass( 'ui-corner-top' );
			}
			
			this.menuWrap.removeClass( 'ui-selectmenu-open' );
			this.opened = false;
			
			if ( focus ) {
				this.button.focus();
			}
			
			this._trigger( "close", event );
		}
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
	
	_move: function( key, event ) {
		if ( !this.opened )	{
			this.menu.menu( "focus", event, this._getSelectedItem() );
		}
		
		this.menu.menu( key, event );		
		
		if ( !this.opened ) {
			this.menu.menu( "select", event  );
		}
	},
	
	_getSelectedItem: function() {
		return this.menu.find( "li" ).not( '.ui-selectmenu-optgroup' ).eq( this.element[0].selectedIndex );	
	},
	
	_toggle: function( event ) {
		if ( this.opened ) {	
			this.close( event );
		} else {	
			this.open( event );
		}
	},
	
	_buttonEvents: {		
		mousedown: function( event ) {
			this._toggle( event );
			event.stopImmediatePropagation();
		},
		click: function( event ) {
			event.preventDefault();
		},
		keydown: function( event ) {
			switch (event.keyCode) {
				case $.ui.keyCode.TAB:
					if ( this.opened ) {
						this.close( event );
					}
					break;
				case $.ui.keyCode.ENTER:
					if ( this.opened ) {
						this.menu.menu( "select", this._getSelectedItem() );					
						event.preventDefault();
					}
					break;
				case $.ui.keyCode.SPACE:
					this._toggle(event);
					event.preventDefault();
					break;
				case $.ui.keyCode.UP:
					if ( event.altKey ) {
						this._toggle( event );
					} else {
						this._move( "previous", event );
					}
					event.preventDefault();
					break;
				case $.ui.keyCode.DOWN:
					if ( event.altKey ) {
						this._toggle( event );
					} else {
						this._move( "next", event );
					}
					event.preventDefault();
					break;
				case $.ui.keyCode.LEFT:
					this._move( "previous", event );
					event.preventDefault();
					break;
				case $.ui.keyCode.RIGHT:
					this._move( "next", event );
					event.preventDefault();
					break;
				default:
					this.menu.trigger( event );
			}
		}
	},	
	
	_setOption: function( key, value ) {
		this._super( "_setOption", key, value );
		
		if ( key === "appendTo" ) {
			this.menuWrap.appendTo( $( value || "body", this.element[0].ownerDocument )[0] );
		}
		if ( key === "value" && value !== undefined ) {
			this.element[0].value = value;
			this.button.children( '.ui-button-text' ).text( this.items[ this.element[0].selectedIndex ].label );
		}
		if ( key === "disabled" ) {
			this.button.button( "option", "disabled", value );
			if ( value ) {
				this.element.attr( "disabled", "disabled" );
				this.button.attr( "tabindex", -1 );
			} else {
				this.element.removeAttr( "disabled" );
				this.button.attr( "tabindex", 0 );
			}
			this.menu.attr( "aria-disabled", value );
			this.close();
		}
	},
	
	widget: function() {
		return this.buttonWrap.add( this.menuWrap );
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
