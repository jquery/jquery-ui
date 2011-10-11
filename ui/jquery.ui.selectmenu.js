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
		this.ids = [ selectmenuId, selectmenuId + '-button', selectmenuId + '-menu' ];
				
		// set current value
		if ( this.options.value ) {
			this.element[0].value = this.options.value;
		} else {
			this.options.value = this.element[0].value;
		}
		
		// catch click event of the label
		this._bind({
			'click':  function( event ) {
				this.newelement.focus();
				event.preventDefault();
			}
		});
		
		this._addNewelement();
		this._bind( this.newelement, this._newelementEvents );
				
		this._addList();
		this.refresh();			
	},
	
	_addNewelement: function() {
		var tabindex = this.element.attr( 'tabindex' );		
				
		// hide original select tag
		this.element.hide();
		
		// create button
		this.newelement = $( '<a />', {
				href: '#' + this.ids[ 0 ],
				tabindex: ( tabindex ? tabindex : this.element.attr( 'disabled' ) ? 1 : 0 ),
				id: this.ids[ 1 ],
				css: {
					width: this.element.outerWidth()
				},
				'aria-disabled': this.options.disabled,
				'aria-owns': this.ids[ 2 ],
				'aria-haspopup': true	
			})
			.button({
				label: this.element.find( "option:selected" ).text(),
				icons: {
					primary: ( this.options.dropdown ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-2-n-s' )
				}
			});
			
		// wrap and insert new button
		this.newelementWrap = $( '<span />' )
			.addClass( 'ui-selectmenu-button' )
			.append( this.newelement )
			.insertAfter( this.element );	
	},
	
	_addList: function() {
		var that = this;
			
		// create menu portion, append to body		
		this.list = $( '<ul />', {
			'class': 'ui-widget ui-widget-content',
			'aria-hidden': true,
			'aria-labelledby': this.ids[1],
			role: 'listbox',
			id: this.ids[2]
		});
		
		// set width
		if ( this.options.dropdown ) {
			var setWidth = this.newelement.outerWidth();
		} else {
			var text = this.newelement.find( "span.ui-button-text");
			var setWidth = text.width() + parseFloat( text.css( "padding-left" ) ) + parseFloat( text.css( "margin-left" ) );
		}

		// wrap list	
		this.listWrap = $( '<div />' )
			.addClass( 'ui-selectmenu-menu' )
			.width( setWidth )
			.append( this.list )
			.appendTo( this.options.appendTo );
				
		// init menu widget
		this.list
			.data( 'element.selectelemenu', this.element )
			.menu({
				select: function( event, ui ) {
					var flag = false,
						item = ui.item.data( "item.selectmenu" );
						
					if ( item.index != that.element[0].selectedIndex ) flag = true;	
					
					that._setOption( "value", item.value );
					that._trigger( "select", event, { item: item } );
					
					if ( flag ) that._trigger( "change", event, { item: item } );
					
					if ( that.opened ) {
						event.preventDefault();
						that.close( event, true);
					}
				},
				focus: function( event, ui ) {
					var item = ui.item.data( "item.selectmenu" );
					if ( that.focus !== undefined && item.index != that.focus ) that._trigger( "focus", event, { item: item } );
					that.focus = item.index;
				}
			});
		
		// document click closes menu
		this._bind( document, {
			'mousedown': function( event ) {
				if ( this.opened && !$( event.target ).is( this.list ) ) {	
					window.setTimeout( function() {
						this.close( event );
					}, 200 );
				}
			}
		});			
	},
	
	refresh: function() {
		this.list.empty();
		
		this._initSource();
		this._renderMenu( this.list, this.items );
		
		this.list.menu( "refresh" );
					
		// adjust ARIA			
		this.list.find( "li" ).not( '.ui-selectmenu-optgroup' ).find( 'a' ).attr( 'role', 'option' );
		
		if ( this.options.dropdown ) {
			this.list
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
			$( '.ui-selectmenu-open' ).not( this.newelement ).each( function() {
				$( this ).children( 'ul.ui-menu' ).data( 'element.selectelemenu' ).selectmenu( 'close' );
			});
						
			if ( this.options.dropdown ) {
				this.newelement
					.addClass( 'ui-corner-top' )
					.removeClass( 'ui-corner-all' );
			}		
									
			this.listWrap.addClass( 'ui-selectmenu-open' );		
			this.list.menu( "focus", null, currentItem );
		
			if ( !this.options.dropdown ) {
				// center current item
				if ( this.list.css("overflow") == "auto" ) {
					this.list.scrollTop( this.list.scrollTop() + currentItem.position().top - this.list.outerHeight()/2 + currentItem.outerHeight()/2 );
				}			
				// calculate offset
				var _offset = ( this.list.offset().top  - currentItem.offset().top + ( this.newelement.outerHeight() - currentItem.outerHeight() ) / 2);			
				$.extend( this.options.position, {
					my: "left top",
					at: "left top",
					offset: "0 " + _offset
				});
			}
			
			this.listWrap				
				.zIndex( this.element.zIndex() + 1 )
				.position( $.extend({
					of: this.newelement
				}, this.options.position ));
			
			this.opened = true;
			this._trigger( "open", event );
		}
	},	
	
	close: function( event, focus ) {
		if ( this.opened ) {
			if ( this.options.dropdown ) {
				this.newelement
					.addClass( 'ui-corner-all' )
					.removeClass( 'ui-corner-top' );
			}
			
			this.listWrap.removeClass( 'ui-selectmenu-open' );
			this.opened = false;
			
			if (focus) this.newelement.focus();
			
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
		if ( !this.opened )	this.list.menu( "focus", event, this._getSelectedItem() );
		this.list.menu( key, event );
		if ( !this.opened ) this.list.menu( "select", event  );
	},
	
	_getSelectedItem: function() {
		return this.list.find( "li" ).not( '.ui-selectmenu-optgroup' ).eq( this.element[0].selectedIndex );	
	},
	
	_toggle: function( event ) {
		if ( this.opened ) {	
			this.close( event );
		} else {	
			this.open( event );
		}
	},
	
	_newelementEvents: {		
		mousedown: function( event ) {
			this._toggle( event );
			event.stopImmediatePropagation();
		},
		click: function( event ) {
			// return false needed to prevent browser from following the anchor
			return false;
		},
		keydown: function( event ) {
			switch (event.keyCode) {
				case $.ui.keyCode.TAB:
					if ( this.opened ) this.close( event );
					break;
				case $.ui.keyCode.ENTER:
					if ( this.opened ) {
						this.list.menu( "select", this._getSelectedItem() );					
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
					this.list.trigger( event );
			}
		}
	},	
	
	_setOption: function( key, value ) {
		this._super( "_setOption", key, value );
		
		if ( key === "appendTo" ) {
			this.listWrap.appendTo( $( value || "body", this.element[0].ownerDocument )[0] );
		}
		if ( key === "value" && value !== undefined ) {
			this.element[0].value = value;
			this.newelement.children( '.ui-button-text' ).text( this.items[ this.element[0].selectedIndex ].label );
		}
		if ( key === "disabled" ) {
			this.newelement.button( "option", "disabled", value );
			if ( value ) {
				this.element.attr( "disabled", "disabled" );
				this.newelement.attr( "tabindex", -1 );
			} else {
				this.element.removeAttr( "disabled" );
				this.newelement.attr( "tabindex", 1 );
			}
			this.list.attr( "aria-disabled", value );
			this.close();
		}
	},
	
	widget: function() {
		return this.newelementWrap.add( this.listWrap );
	},

	_initSource: function() {
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
		this.listWrap.remove();
		this.newelementWrap.remove();
		this.element.show();
	}
});

}( jQuery ));
