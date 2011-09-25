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
		iconWidth: 26,
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
			tabindex = this.element.attr( 'tabindex' )
			// set a default id value, generate a new random one if not set by developer
			selectmenuId = self.element.attr( 'id' ) || 'ui-selectmenu-' + Math.random().toString( 16 ).slice( 2, 10 );
			
		// quick array of button and menu id's
		self.ids = [ selectmenuId + '-button', selectmenuId + '-menu' ];
		
		// get options
		self.items = self.element.find( 'option' );
		
		// set options 		
		options.value = self.element[0].value;
		options.disabled = ( self.element.attr( 'disabled' ) ) ? true : false;
		
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
					width: self.element.width()
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
				var ret = true;
				switch (event.keyCode) {
					case $.ui.keyCode.TAB:
						if ( self.opened ) self.close();
						break;
					case $.ui.keyCode.ENTER:
						if ( self.opened ) self.list.menu( "select", self._getSelectedItem() );
						ret = false;
						break;
					case $.ui.keyCode.SPACE:
						self._toggle(event);
						ret = false;
						break;
					case $.ui.keyCode.UP:
						if ( event.altKey ) {
							self._toggle( event );
						} else {
							self._move( "previous", event );
						}
						ret = false;
						break;
					case $.ui.keyCode.DOWN:
						if ( event.altKey ) {
							self._toggle( event );
						} else {
							self._move( "next", event );
						}
						ret = false;
						break;
					case $.ui.keyCode.LEFT:
						self._move( "previous", event );
						ret = false;
						break;
					case $.ui.keyCode.RIGHT:
						self._move( "next", event );
						ret = false;
						break;
					default:
						self.list.trigger( event );
						ret = false;
				}
				return ret;
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
		
		self.listWrap = $( options.wrapperElement )
			.addClass( self.widgetBaseClass + '-menu' )
			.css( "width", ( options.dropdown ) ? self.element.width() : self.element.width() - options.iconWidth )
			.append( self.list )
			.appendTo( options.appendTo );
		
		self._initSource();
		self._renderMenu( self.list, options.source );
		
		self.list
			.data( 'element.selectelemenu', self.element )
			.menu({
				select: function( event, ui ) {
					var item = ui.item.data( "item.selectmenu" );
					self._setSelected( event, item );
					item.element = $ ( self.items[ item.index ] );
					self._trigger( "select", event, { item: item } );
					self.close( event, true);
				},
				focus: function( event, ui ) {	
					var item = ui.item.data( "item.selectmenu" );
					if ( !self.opened ) self._setSelected( event, item );
					self._trigger( "focus", event, { item: item } );
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
				
			self.listWrap.position( $.extend({
				of: this.newelementWrap
			}, options.position ));
			
			this.opened = true;
			self._trigger( "open", event );
		}
	},	
	
	close: function( event, focus ) {		
		var self = this,
			options = this.options;
	
		if ( options.dropdown ) {
			self.newelement
				.addClass( 'ui-corner-all' )
				.removeClass( 'ui-corner-top' );
		}
		
		self.listWrap.removeClass( self.widgetBaseClass + '-open' );
		this.opened = false;
		
		if (focus) self.newelement.focus();
		
		self._trigger( "close", event );
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
	
	_setSelected: function( event, item ) {				
		this.newelement.children( '.ui-button-text' ).text( item.label );
		this.element[0].selectedIndex = item.index;
		this.options.value = item.value;
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
		if ( key === "value" && value) {
			this.element[0].value = value;
		}
		if ( key === "disabled" ) {
			this.newelement.button( "option", "disabled", value );
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
					optgroup: optgroup.attr("label") || false,
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
