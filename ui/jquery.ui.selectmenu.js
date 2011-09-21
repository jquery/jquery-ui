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

// used to prevent race conditions with remote data sources
var requestIndex = 0;

$.widget( "ui.selectmenu", {
	version: "@VERSION",
	defaultElement: "<select>",
	options: {
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
				tabindex: (tabindex ? tabindex : self.element.attr( 'disabled' ) ? 1 : 0),
				'aria-haspopup': true,
				'aria-owns': self.ids[ 1 ],
				css: {
					width: self.element.width()
				}				
			}).button({
				label: self.items.eq( self.element[0].selectedIndex ).text(),
				icons: {
					primary: "ui-icon-triangle-2-n-s"
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
							self.list.trigger( event );
							if ( options.open ) self.list.focus();
						}
						break;
					case $.ui.keyCode.DOWN:
						if (event.altKey) {
							self._toggle( event );
						} else {
							self.list.trigger( event );
							if ( options.open ) self.list.focus();
						}
						break;
					case $.ui.keyCode.LEFT:
						// event.which = 40;
						event.keyCode = 40;
						self.list.trigger( event );
						break;
					case $.ui.keyCode.RIGHT:
						// event.which = 38;
						event.keyCode = 38;
						self.list.trigger( event );
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
			css: {
				// width: self.element.width() - options.iconWidth
				width: self.element.width()
			}
		});
		
		self.listWrap = $( options.wrapperElement )
			.addClass( self.widgetBaseClass + '-menu' )
			.append( self.list )
			.appendTo( options.appendTo );
		
		self._renderMenu( self.list, self._initSource() );
		
		self.list.menu({
			select: function( event, ui ) {
				var item = ui.item.data( "item.selectmenu" );
				console.log(item);
				
				self.newelement.children( 'span.ui-button-text' ).text( item.label );					
				self.value( item.value );
				self.close( event, true);
			},
			focus: function( event, ui ) {
				var item = ui.item.data( "item.selectmenu" );
				if ( !options.open ) self.newelement.children( 'span.ui-button-text' ).text( item.label );
			}		
		});

		// document click closes menu
		$( document ).bind( 'mousedown.selectmenu', function( event ) {
			if ( self.options.open ) {	
				window.setTimeout( function() {
					self.close( event );
				}, 200 );
			}
		});	
			
	},
	
	_toggle: function( event ) {
		if ( this.options.open ) {	
			this.close( event );
		} else {	
			this.open( event );
		}
	},
	
	open: function( event ) {		
		var self = this,
			options = this.options;
			
		self.listWrap.addClass( self.widgetBaseClass + '-open' );
		this.options.open = true;
	
		self.listWrap.position( $.extend({
			of: this.newelementWrap
		}, options.position ));
	},
	
	
	close: function( event, focus ) {		
		var self = this,
			options = this.options;
	
		self.listWrap.removeClass( self.widgetBaseClass + '-open' );
		this.options.open = false;
		
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
					href: '#nogo'
				}) 
			).appendTo( ul );
	},
	
	_destroy: function() {
		clearTimeout( this.searching );
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" )
			.removeAttr( "role" )
			.removeAttr( "aria-autocomplete" )
			.removeAttr( "aria-haspopup" );
		this.menu.element.remove();
	},

	_setOption: function( key, value ) {
		this._super( "_setOption", key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.listWrap.appendTo( $( value || "body", this.element[0].ownerDocument )[0] )
		}
		// if ( key === "disabled" && value && this.xhr ) {
			// this.xhr.abort();
		// }
	},
	
	_initSource: function() {
		var data = [];
		// data = [
			// { label: "anders", optgroup: "" },
			// { label: "andreas", optgroup: "" },
			// { label: "antal", optgroup: "" },
			// { label: "annhhx10", optgroup: "Products" },
			// { label: "annk K12", optgroup: "Products" },
			// { label: "annttop C13", optgroup: "Products" },
			// { label: "anders andersson", optgroup: "People" },
			// { label: "andreas andersson", optgroup: "People" },
			// { label: "andreas johnson", optgroup: "People" }
		// ];
		
		$.each( this.items, function( index, item ) {
			var option = $( item );
			data.push({
				value: option.attr( 'value' ),
				label: option.text(),
				optgroup: option.parent("optgroup").attr("label") || false
			});
		});
		// console.log(data);
		return data;
	},

	value: function( newValue ) {
		if (arguments.length) {
			this.element[0].value = newValue;
		} else {
			return this.element[0].value;
		}
	}
	
	// index: function( newValue ) {
		// if ( arguments.length ) {
				// this.element[0].selectedIndex = newValue;
		// } else {
			// return this.element[0].selectedIndex;
		// }
	// }
});

}( jQuery ));
