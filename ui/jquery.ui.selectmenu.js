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
		wrapperElement: "<div />",
		appendTo: "body",
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,
		value: null,
		// callbacks
		open: null,
		focus: null,
		select: null,
		close: null
		// change: null
	},

	_create: function() {
		var that = this,
			options = this.options,
			tabindex = this.element.attr( 'tabindex' ),
			// set a default id value, generate a new random one if not set by developer
			selectmenuId = this.element.attr( 'id' ) || 'ui-selectmenu-' + Math.random().toString( 16 ).slice( 2, 10 );
			
		// quick array of button and menu id's
		this.ids = [ selectmenuId + '-button', selectmenuId + '-menu' ];
		
		// save options
		this.items = this.element.find( 'option' );
		
		// set current value 
		if ( options.value ) {
			this.element[0].value = options.value;
		} else {
			options.value = this.element[0].value;
		}
		
		// catch click event of the label
		this._bind({
			'click': function( event ) {
				event.preventDefault();
				this.newelement.focus();
			}
		});

		this.element.hide();
		
		// create button
		this.newelement = $( '<a />', {
				href: '#' + selectmenuId,
				tabindex: ( tabindex ? tabindex : this.element.attr( 'disabled' ) ? 1 : 0 ),
				id: this.ids[ 0 ],
				css: {
					width: this.element.outerWidth()
				},
				'aria-disabled': options.disabled,
				'aria-owns': this.ids[ 1 ],
				'aria-haspopup': true	
			})
			.addClass( this.widgetBaseClass + '-button' )
			.button({
				label: this.items.eq( this.element[0].selectedIndex ).text(),
				icons: {
					primary: ( options.dropdown ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-2-n-s' )
				}
			});
			
		// wrap and insert new button
		this.newelementWrap = $( options.wrapperElement )
			.append( this.newelement )
			.insertAfter( this.element );
			
		this._bind( this.newelement, {
			'mousedown': function( event ) {
				event.stopImmediatePropagation();
				this._toggle( event );
			},
			'click': function( event ) {
				event.stopImmediatePropagation();
			},
			'keydown': function( event ) {
				switch (event.keyCode) {
					case $.ui.keyCode.TAB:
						if ( this.opened ) this.close();
						break;
					case $.ui.keyCode.ENTER:
						if ( this.opened ) this.list.menu( "select", this._getSelectedItem() );
						event.preventDefault();
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
		});
		
		// built menu
		this.refresh();
		
		// document click closes menu
		this._bind( document, {
			'mousedown': function( event ) {
				if ( this.opened && !this.hover) {
					window.setTimeout( function() {
						that.close( event );
					}, 200 );
				}
			}
		});
	},
	
	// TODO update the value option
	refresh: function() {
		var that = this,
			options = this.options;
				
		// create menu portion, append to body		
		this.list = $( '<ul />', {
			'class': 'ui-widget ui-widget-content',
			'aria-hidden': true,
			'aria-labelledby': this.ids[0],
			role: 'listbox',
			id: this.ids[1]
		});
		
		// wrap list	
		if ( options.dropdown ) {
			var setWidth = this.newelement.outerWidth();
		} else {
			var text = this.newelement.find( "span.ui-button-text");
			var setWidth = text.width() + parseFloat( text.css( "padding-left" ) ) + parseFloat( text.css( "margin-left" ) );
		}		
		this.listWrap = $( options.wrapperElement )
			.addClass( this.widgetBaseClass + '-menu' )
			.width( setWidth )
			.append( this.list )
			.appendTo( options.appendTo );
		
		this._initSource();
		this._renderMenu( this.list, options.source );
		
		// init menu widget
		this.list
			.data( 'element.selectelemenu', this.element )
			.menu({
				select: function( event, ui ) {
					var flag = false,
						item = ui.item.data( "item.selectmenu" );
						
					if ( item.index != that.element[0].selectedIndex ) flag = true;	
					
					that._setOption( "value", item.value );
					item.element = that.items[ item.index ];
					that._trigger( "select", event, { item: item } );
					
					if ( flag ) that._trigger( "change", event, { item: item } );
					
					that.close( event, true);
				},
				focus: function( event, ui ) {	
					that._trigger( "focus", event, { item: ui.item.data( "item.selectmenu" ) } );
				}
			});

		this._bind( this.list, {
			'mouseenter': function() {
				this.hover = true;
			},
			'mouseleave': function() {
				this.hover = false;
			}
		});
			
		// adjust ARIA			
		this.list.find( "li" ).not( '.ui-selectmenu-optgroup' ).find( 'a' ).attr( 'role', 'option' );
		
		if ( options.dropdown ) {
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
		var options = this.options,
			currentItem = this._getSelectedItem();
			
		if ( !options.disabled ) {			
			// close all other selectmenus		
			$( '.' + this.widgetBaseClass + '-open' ).not( this.newelement ).each( function() {
				$( this ).children( 'ul.ui-menu' ).data( 'element.selectelemenu' ).selectmenu( 'close' );
			});
						
			if ( options.dropdown ) {
				this.newelement
					.addClass( 'ui-corner-top' )
					.removeClass( 'ui-corner-all' );
			}		
									
			this.listWrap.addClass( this.widgetBaseClass + '-open' );
			this.list.menu( "focus", null, currentItem );
		
			if ( !options.dropdown ) {
				// center current item
				if ( this.list.css("overflow") == "auto" ) {
					this.list.scrollTop( this.list.scrollTop() + currentItem.position().top - this.list.outerHeight()/2 + currentItem.outerHeight()/2 );
				}			
				// calculate offset
				var _offset = (this.list.offset().top  - currentItem.offset().top + (this.newelement.outerHeight() - currentItem.outerHeight()) / 2);
				$.extend( options.position, {
					my: "left top",
					at: "left top",
					offset: "0 " + _offset
				});
			}
			
			this.listWrap
				.zIndex( this.element.zIndex() + 1 )
				.position( $.extend({
					of: this.newelementWrap
				}, options.position ));
			
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
			
			this.listWrap.removeClass( this.widgetBaseClass + '-open' );
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
				if ( $( that.items[ item.index ] ).parent( "optgroup" ).attr( "disabled" ) ) optgroup.addClass( 'ui-state-disabled' );
				ul.append( optgroup );
				currentOptgroup = item.optgroup;
			}
			that._renderItem( ul, item );
		});
	},
	
	_renderItem: function( ul, item) {
		return $( "<li />" )
			.addClass( ( item.disabled ) ? 'ui-state-disabled' : '' )
			.data( "item.selectmenu", item )
			.append( $( "<a />", {
					text: item.label,
					href: '#',
					click: function( event ) {
						event.preventDefault();
					}
				}) 
			).appendTo( ul );
	},
	
	_move: function( key, event ) {
		// TODO this focus is needed to make the select below work, 
		// but should be removed as its fires an unwanted focus event
		if ( !this.opened ) {
			this.list.menu( "focus", event, this._getSelectedItem() );	
		}
		this.list.menu( key, event );
		if ( !this.opened ) {
			this.list.menu( "select", event  );
		}
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
	
	_setOption: function( key, value ) {
		this._super( "_setOption", key, value );
		
		if ( key === "appendTo" ) {
			this.listWrap.appendTo( $( value || "body", this.element[0].ownerDocument )[0] );
		}
		if ( key === "value" && value !== undefined ) {
			this.element[0].value = value;
			this.newelement.children( '.ui-button-text' ).text( this.items.eq( this.element[0].selectedIndex ).text() );
		}
		if ( key === "disabled" ) {
			this.newelement.button( "option", "disabled", value );
			if ( value ) {
				this.element.attr( "disabled", "disabled" );
			} else {
				this.element.removeAttr( "disabled" );
			}
			this.list.attr( "aria-disabled", value );
			this.close();
		}
	},
	
	_initSource: function() {
		if ( !$.isArray( this.options.source ) ) {
			var data = [];		
			$.each( this.items, function( index, item ) {
				var option = $( item ),
					optgroup = option.parent( "optgroup" );
				data.push({
					index: index,
					value: option.attr( 'value' ),
					label: option.text(),
					optgroup: optgroup.attr( "label" ) || false,
					disabled: optgroup.attr( "disabled" ) || option.attr( "disabled" )
				});
			});
			this.options.source = data;
		}
	},
	
	_destroy: function() {
		this.listWrap.remove();
		this.newelementWrap.remove();
		this.element.show();
		$( document ).unbind( '.selectmenu' );
	}
});

}( jQuery ));
