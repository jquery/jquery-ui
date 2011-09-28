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
			selectmenuId = that.element.attr( 'id' ) || 'ui-selectmenu-' + Math.random().toString( 16 ).slice( 2, 10 );
			
		// quick array of button and menu id's
		that.ids = [ selectmenuId + '-button', selectmenuId + '-menu' ];
		
		// save options
		that.items = that.element.find( 'option' );
		
		// set current value 
		if ( options.value ) {
			that.element[0].value = options.value;
		} else {
			options.value = that.element[0].value;
		}
		
		// catch click event of the label
		that.element.bind( 'click.selectmenu',  function() {
			that.newelement.focus();			
			return false;
		})
		.hide();
		
		// create button
		that.newelement = $( '<a />', {
				href: '#' + selectmenuId,
				tabindex: ( tabindex ? tabindex : that.element.attr( 'disabled' ) ? 1 : 0 ),
				id: that.ids[ 0 ],
				css: {
					width: that.element.outerWidth()
				},
				'aria-disabled': options.disabled,
				'aria-owns': that.ids[ 1 ],
				'aria-haspopup': true	
			})
			.addClass( that.widgetBaseClass + '-button' )
			.button({
				label: that.items.eq( this.element[0].selectedIndex ).text(),
				icons: {
					primary: ( options.dropdown ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-2-n-s' )
				}
			});
			
		// wrap and insert new button
		that.newelementWrap = $( options.wrapperElement )
			.append( that.newelement )
			.insertAfter( that.element );	
			
		that.newelement.bind({ 
			'mousedown.selectmenu': function( event ) {
				that._toggle( event );
				return false;
			},
			'click.selectmenu': function() {
				return false;
			},
			'keydown.selectmenu': function( event ) {
				switch (event.keyCode) {
					case $.ui.keyCode.TAB:
						if ( that.opened ) that.close();
						break;
					case $.ui.keyCode.ENTER:
						if ( that.opened ) that.list.menu( "select", that._getSelectedItem() );
						event.preventDefault();
						break;
					case $.ui.keyCode.SPACE:
						that._toggle(event);
						event.preventDefault();
						break;
					case $.ui.keyCode.UP:
						if ( event.altKey ) {
							that._toggle( event );
						} else {
							that._move( "previous", event );
						}
						event.preventDefault();
						break;
					case $.ui.keyCode.DOWN:
						if ( event.altKey ) {
							that._toggle( event );
						} else {
							that._move( "next", event );
						}
						event.preventDefault();
						break;
					case $.ui.keyCode.LEFT:
						that._move( "previous", event );
						event.preventDefault();
						break;
					case $.ui.keyCode.RIGHT:
						that._move( "next", event );
						event.preventDefault();
						break;
					default:
						that.list.trigger( event );
				}
			}
		});
		
		// built menu
		that.refresh();
		
		// document click closes menu
		$( document ).bind( 'mousedown.selectmenu', function( event ) {
			if ( that.opened && !that.hover) {	
				window.setTimeout( function() {
					that.close( event );
				}, 200 );
			}
		});			
	},
	
	// TODO update the value option
	refresh: function() {
		var that = this,
			options = this.options;
				
		// create menu portion, append to body		
		that.list = $( '<ul />', {
			'class': 'ui-widget ui-widget-content',
			'aria-hidden': true,
			'aria-labelledby': that.ids[0],
			role: 'listbox',
			id: that.ids[1]
		});
		
		// wrap list	
		if ( options.dropdown ) {
			var setWidth = that.newelement.outerWidth();
		} else {
			var text = that.newelement.find( "span.ui-button-text");
			var setWidth = text.width() + parseFloat( text.css( "padding-left" ) ) + parseFloat( text.css( "margin-left" ) );
		}		
		that.listWrap = $( options.wrapperElement )
			.addClass( that.widgetBaseClass + '-menu' )
			.width( setWidth )
			.append( that.list )
			.appendTo( options.appendTo );
		
		that._initSource();
		that._renderMenu( that.list, options.source );
		
		// init menu widget
		that.list
			.data( 'element.selectelemenu', that.element )
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
			})			
			.bind({
				'mouseenter.selectelemenu': function() {
					that.hover = true;
				},
				'mouseleave .selectelemenu': function() {
					that.hover = false;
				}
			});
			
		// adjust ARIA			
		that.list.find( "li" ).not( '.ui-selectmenu-optgroup' ).find( 'a' ).attr( 'role', 'option' );
		
		if ( options.dropdown ) {
			that.list
				.addClass( 'ui-corner-bottom' )
				.removeClass( 'ui-corner-all' );
		}
		
		// transfer disabled state
		if ( that.element.attr( 'disabled' ) ) {
			that.disable();
		} else {
			that.enable()
		}
	},
	
	open: function( event ) {		
		var that = this,
			options = this.options,
			currentItem = that._getSelectedItem();
			
		if ( !options.disabled ) {			
			// close all other selectmenus		
			$( '.' + that.widgetBaseClass + '-open' ).not( that.newelement ).each( function() {
				$( this ).children( 'ul.ui-menu' ).data( 'element.selectelemenu' ).selectmenu( 'close' );
			});
						
			if ( options.dropdown ) {
				that.newelement
					.addClass( 'ui-corner-top' )
					.removeClass( 'ui-corner-all' );
			}		
									
			that.listWrap.addClass( that.widgetBaseClass + '-open' );		
			that.list.menu( "focus", null, currentItem );
		
			if ( !options.dropdown ) {
				// center current item
				if ( that.list.css("overflow") == "auto" ) {
					that.list.scrollTop( that.list.scrollTop() + currentItem.position().top - that.list.outerHeight()/2 + currentItem.outerHeight()/2 );
				}			
				// calculate offset
				var _offset = (that.list.offset().top  - currentItem.offset().top + (that.newelement.outerHeight() - currentItem.outerHeight()) / 2);			
				$.extend( options.position, {
					my: "left top",
					at: "left top",
					offset: "0 " + _offset
				});
			}
			
			that.listWrap				
				.zIndex( that.element.zIndex() + 1 )
				.position( $.extend({
					of: that.newelementWrap
				}, options.position ));
			
			that.opened = true;
			that._trigger( "open", event );
		}
	},	
	
	close: function( event, focus ) {		
		var that = this,
			options = this.options;
			
		if ( that.opened ) {
			if ( options.dropdown ) {
				that.newelement
					.addClass( 'ui-corner-all' )
					.removeClass( 'ui-corner-top' );
			}
			
			that.listWrap.removeClass( that.widgetBaseClass + '-open' );
			this.opened = false;
			
			if (focus) that.newelement.focus();
			
			that._trigger( "close", event );
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
		this.element.show().unbind( '.selectmenu' );
		$( document ).unbind( '.selectmenu' );
	}
});

}( jQuery ));
