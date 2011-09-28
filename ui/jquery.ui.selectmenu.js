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
		var self = this,
			options = this.options,
			tabindex = this.element.attr( 'tabindex' ),
			// set a default id value, generate a new random one if not set by developer
			selectmenuId = self.element.attr( 'id' ) || 'ui-selectmenu-' + Math.random().toString( 16 ).slice( 2, 10 );
			
		// quick array of button and menu id's
		self.ids = [ selectmenuId + '-button', selectmenuId + '-menu' ];
		
		// save options
		self.items = self.element.find( 'option' );
		
		// set current value 
		if ( options.value ) {
			self.element[0].value = options.value;
		} else {
			options.value = self.element[0].value;
		}
		
		// catch click event of the label
		self.element.bind( 'click.selectmenu',  function() {
			self.newelement.focus();			
			return false;
		})
		.hide();
		
		// create button
		self.newelement = $( '<a />', {
				href: '#' + selectmenuId,
				tabindex: ( tabindex ? tabindex : self.element.attr( 'disabled' ) ? 1 : 0 ),
				id: self.ids[ 0 ],
				css: {
					width: self.element.outerWidth()
				},
				'aria-disabled': options.disabled,
				'aria-owns': self.ids[ 1 ],
				'aria-haspopup': true	
			})
			.addClass( self.widgetBaseClass + '-button' )
			.button({
				label: self.items.eq( this.element[0].selectedIndex ).text(),
				icons: {
					primary: ( options.dropdown ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-2-n-s' )
				}
			});
			
		// wrap and insert new button
		self.newelementWrap = $( options.wrapperElement )
			.append( self.newelement )
			.insertAfter( self.element );	
			
		self.newelement.bind({ 
			'mousedown.selectmenu': function( event ) {
				self._toggle( event );
				return false;
			},
			'click.selectmenu': function() {
				return false;
			},
			'keydown.selectmenu': function( event ) {
				switch (event.keyCode) {
					case $.ui.keyCode.TAB:
						if ( self.opened ) self.close();
						break;
					case $.ui.keyCode.ENTER:
						if ( self.opened ) self.list.menu( "select", self._getSelectedItem() );
						event.preventDefault();
						break;
					case $.ui.keyCode.SPACE:
						self._toggle(event);
						event.preventDefault();
						break;
					case $.ui.keyCode.UP:
						if ( event.altKey ) {
							self._toggle( event );
						} else {
							self._move( "previous", event );
						}
						event.preventDefault();
						break;
					case $.ui.keyCode.DOWN:
						if ( event.altKey ) {
							self._toggle( event );
						} else {
							self._move( "next", event );
						}
						event.preventDefault();
						break;
					case $.ui.keyCode.LEFT:
						self._move( "previous", event );
						event.preventDefault();
						break;
					case $.ui.keyCode.RIGHT:
						self._move( "next", event );
						event.preventDefault();
						break;
					default:
						self.list.trigger( event );
				}
			}
		});
		
		// built menu
		self.refresh();
		
		// document click closes menu
		$( document ).bind( 'mousedown.selectmenu', function( event ) {
			if ( self.opened && !self.hover) {	
				window.setTimeout( function() {
					self.close( event );
				}, 200 );
			}
		});			
	},
	
	// TODO update the value option
	refresh: function() {
		var self = this,
			options = this.options;
				
		// create menu portion, append to body		
		self.list = $( '<ul />', {
			'class': 'ui-widget ui-widget-content',
			'aria-hidden': true,
			'aria-labelledby': self.ids[0],
			role: 'listbox',
			id: self.ids[1]
		});
		
		// wrap list	
		if ( options.dropdown ) {
			var setWidth = self.newelement.outerWidth();
		} else {
			var text = self.newelement.find( "span.ui-button-text");
			var setWidth = text.width() + parseFloat( text.css( "padding-left" ) ) + parseFloat( text.css( "margin-left" ) );
		}		
		self.listWrap = $( options.wrapperElement )
			.addClass( self.widgetBaseClass + '-menu' )
			.width( setWidth )
			.append( self.list )
			.appendTo( options.appendTo );
		
		self._initSource();
		self._renderMenu( self.list, options.source );
		
		// init menu widget
		self.list
			.data( 'element.selectelemenu', self.element )
			.menu({
				select: function( event, ui ) {
					var flag = false,
						item = ui.item.data( "item.selectmenu" );
						
					if ( item.index != self.element[0].selectedIndex ) flag = true;	
					
					self._setOption( "value", item.value );
					item.element = self.items[ item.index ];
					self._trigger( "select", event, { item: item } );
					
					if ( flag ) self._trigger( "change", event, { item: item } );
					
					self.close( event, true);
				},
				focus: function( event, ui ) {	
					self._trigger( "focus", event, { item: ui.item.data( "item.selectmenu" ) } );
				}
			})			
			.bind({
				'mouseenter.selectelemenu': function() {
					self.hover = true;
				},
				'mouseleave .selectelemenu': function() {
					self.hover = false;
				}
			});
			
		// adjust ARIA			
		self.list.find( "li" ).not( '.ui-selectmenu-optgroup' ).find( 'a' ).attr( 'role', 'option' );
		
		if ( options.dropdown ) {
			self.list
				.addClass( 'ui-corner-bottom' )
				.removeClass( 'ui-corner-all' );
		}
		
		// transfer disabled state
		if ( self.element.attr( 'disabled' ) ) {
			self.disable();
		} else {
			self.enable()
		}
	},
	
	open: function( event ) {		
		var self = this,
			options = this.options,
			currentItem = self._getSelectedItem();
			
		if ( !options.disabled ) {			
			// close all other selectmenus		
			$( '.' + self.widgetBaseClass + '-open' ).not( self.newelement ).each( function() {
				$( this ).children( 'ul.ui-menu' ).data( 'element.selectelemenu' ).selectmenu( 'close' );
			});
						
			if ( options.dropdown ) {
				self.newelement
					.addClass( 'ui-corner-top' )
					.removeClass( 'ui-corner-all' );
			}		
									
			self.listWrap.addClass( self.widgetBaseClass + '-open' );		
			self.list.menu( "focus", null, currentItem );
		
			if ( !options.dropdown ) {
				// center current item
				if ( self.list.css("overflow") == "auto" ) {
					self.list.scrollTop( self.list.scrollTop() + currentItem.position().top - self.list.outerHeight()/2 + currentItem.outerHeight()/2 );
				}			
				// calculate offset
				var _offset = (self.list.offset().top  - currentItem.offset().top + (self.newelement.outerHeight() - currentItem.outerHeight()) / 2);			
				$.extend( options.position, {
					my: "left top",
					at: "left top",
					offset: "0 " + _offset
				});
			}
			
			self.listWrap				
				.zIndex( self.element.zIndex() + 1 )
				.position( $.extend({
					of: self.newelementWrap
				}, options.position ));
			
			self.opened = true;
			self._trigger( "open", event );
		}
	},	
	
	close: function( event, focus ) {		
		var self = this,
			options = this.options;
			
		if ( self.opened ) {
			if ( options.dropdown ) {
				self.newelement
					.addClass( 'ui-corner-all' )
					.removeClass( 'ui-corner-top' );
			}
			
			self.listWrap.removeClass( self.widgetBaseClass + '-open' );
			this.opened = false;
			
			if (focus) self.newelement.focus();
			
			self._trigger( "close", event );
		}
	},
	
	_renderMenu: function( ul, items ) {
		var self = this,
			currentOptgroup = "";
			
		$.each( items, function( index, item ) {
			if ( item.optgroup != currentOptgroup ) {
				var optgroup = $( '<li class="ui-selectmenu-optgroup">' + item.optgroup + '</li>' );
				if ( $( self.items[ item.index ] ).parent( "optgroup" ).attr( "disabled" ) ) optgroup.addClass( 'ui-state-disabled' );
				ul.append( optgroup );
				currentOptgroup = item.optgroup;
			}
			self._renderItem( ul, item );
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
