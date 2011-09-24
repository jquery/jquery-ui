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

		iconWidth: 26,
		
		// callbacks
		open: null,
		focus: null,
		select: null,
		close: null,
		change: null
	},

	_create: function() {
		var self = this,
			options = this.options,
			tabindex = this.element.attr( 'tabindex' );
		
		// set a default id value, generate a new random one if not set by developer
		var selectmenuId = self.element.attr( 'id' ) || 'ui-selectmenu-' + Math.random().toString( 16 ).slice( 2, 10 );

		// quick array of button and menu id's
		self.ids = [ selectmenuId + '-button', selectmenuId + '-menu' ];
		
		// get options
		self.items = self.element.find( 'option' );
		
		// catch click event of the label
		self.element.bind( 'click.selectmenu',  function() {
			self.newelement.focus();			
			return false;
		});
		
		// create button
		self.newelement = $( '<a />', {
				href: '#' + selectmenuId,
				tabindex: ( tabindex ? tabindex : self.element.attr( 'disabled' ) ? 1 : 0 ),
				'aria-haspopup': true,
				'aria-owns': self.ids[ 1 ],
				css: {
					width: self.element.width()
				}				
			})
			.addClass( self.widgetBaseClass + '-button' )
			.button({
				label: self.items.eq( self.element[0].selectedIndex ).text(),
				icons: {
					primary: ( options.dropdown ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-2-n-s' )
				}
			});
						
		self.newelementWrap = $( options.wrapperElement )
			.append( self.newelement )
			.insertAfter( self.element );	
			
		self.newelement
			.bind( 'mousedown.selectmenu' , function(event) {
				self._toggle( event );
				return false;
			})
			.bind( 'click.selectmenu' , function() {
				return false;
			})
			.bind( 'keydown.selectmenu', function( event ) {
				var ret = false;
				switch (event.keyCode) {
					case $.ui.keyCode.TAB:
					case $.ui.keyCode.ENTER:
						ret = true;
						break;
					case $.ui.keyCode.SPACE:
						self._toggle(event);
						break;
					case $.ui.keyCode.UP:
						if (event.altKey) {
							self._toggle( event );
						} else {
							self._previous();
						}
						break;
					case $.ui.keyCode.DOWN:
						if (event.altKey) {
							self._toggle( event );
						} else {
							self._next();
						}
						break;
					case $.ui.keyCode.LEFT:
						self._previous();
						break;
					case $.ui.keyCode.RIGHT:
						self._next();
						break;
					default:
						self.list.trigger( event );
				}
				return ret;
			});
					
		// create menu portion, append to body		
		self.list = $( '<ul />', {
			'class': 'ui-widget ui-widget-content',
			'aria-hidden': true,
			'aria-labelledby': self.ids[0],
			role: 'listbox',
			id: self.ids[1],
		});
		
		self.listWrap = $( options.wrapperElement )
			.addClass( self.widgetBaseClass + '-menu' )
			.css("width", ( options.dropdown ) ? self.element.width() : self.element.width() - options.iconWidth)
			.append( self.list )
			.appendTo( options.appendTo );
		
		self._renderMenu( self.list, self._initSource() );
		
		self.list
			.data( 'element.selectelemenu', self.element )
			.menu({
				select: function( event, ui ) {
					var item = ui.item.data( "item.selectmenu" );
					console.log(item);
					
					self.newelement.children( 'span.ui-button-text' ).text( item.label );
					self._index( item.index );
					self.close( event, true);
				},
				focus: function( event, ui ) {
					var item = ui.item.data( "item.selectmenu" );
					if ( !self.opened ) {
						self.newelement.children( 'span.ui-button-text' ).text( item.label );
						self._index( item.index );
					}
				}		
			})			
			.bind( 'mouseenter.selectelemenu', function() {
				self.hover = true;
			})
			.bind( 'mouseleave .selectelemenu', function() {
				self.hover = false;
			});
		
		if ( options.dropdown ) {
			self.list
				.addClass( 'ui-corner-bottom' )
				.removeClass( 'ui-corner-all' );
		}
		
		// document click closes menu
		$( document ).bind( 'mousedown.selectmenu', function( event ) {
			if ( self.opened && !self.hover) {	
				window.setTimeout( function() {
					self.close( event );
				}, 200 );
			}
		});	
			
	},
	
	open: function( event ) {		
		var self = this,
			options = this.options;
			
		// close all other selectmenus		
		$( '.' + self.widgetBaseClass + '-open' ).not( self.newelement ).each( function() {
			$( this ).children( 'ul.ui-menu' ).data( 'element.selectelemenu' ).selectmenu( 'close' );
		});
					
		if ( options.dropdown ) {
			self.newelement
				.addClass( 'ui-corner-top' )
				.removeClass( 'ui-corner-all' );
		}		
					
		var currentItem = self._getCurrenItem();
			
		self.listWrap.addClass( self.widgetBaseClass + '-open' );
		
		self.list.focus().menu( "focus", null, currentItem );
	
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
	},
	
	_renderMenu: function( ul, items ) {
		var self = this,
			currentOptgroup = "";
			
		$.each( items, function( index, item ) {
			if ( item.optgroup != currentOptgroup ) {
				ul.append( "<li class='ui-selectmenu-optgroup'>" + item.optgroup + "</li>" );
				currentOptgroup = item.optgroup;
			}
			self._renderItem( ul, item );
		});
	},
	
	_renderItem: function( ul, item) {
		return $( "<li />" )
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
	
	_previous: function() {
		this.list.menu( "focus", null, this._getCurrenItem() );	
		this.list.menu("previous");
	},
	
	_next: function() {
		this.list.menu( "focus", null, this._getCurrenItem() );	
		this.list.menu("next");
	},
	
	_getCurrenItem: function() {
		return this.list.find( "li" ).not( '.ui-selectmenu-optgroup' ).eq( this._index() );	
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
	},
	
	_initSource: function() {
		var data = [];		
		
		$.each( this.items, function( index, item ) {
			var option = $( item );
			data.push({
				index: index,
				value: option.attr( 'value' ),
				label: option.text(),
				optgroup: option.parent("optgroup").attr("label") || false
			});
		});		
		
		// console.log(data);
		return data;
	},
	
	_destroy: function() {
	},
	
	_value: function( newValue ) {
		if (arguments.length) {
			this.element[0].value = newValue;
		} else {
			return this.element[0].value;
		}
	},
	
	_index: function( newIndex ) {
		if ( arguments.length ) {
				this.element[0].selectedIndex = newIndex;
		} else {
			return this.element[0].selectedIndex;
		}
	}
});

}( jQuery ));
