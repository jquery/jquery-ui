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
		var that = this,
			options = this.options,
			// set a default id value, generate a new random one if not set by developer
			selectmenuId = that.element.attr( 'id' ) || 'ui-selectmenu-' + Math.random().toString( 16 ).slice( 2, 10 );
			
		// quick array of button and menu id's
		that.ids = [ selectmenuId, selectmenuId + '-button', selectmenuId + '-menu' ];
				
		// set current value
		if ( options.value ) {
			that.element[0].value = options.value;
		} else {
			options.value = that.element[0].value;
		}
		
		that._addNewelement();		
		that._addList();
		
		// built menu
		that.refresh();		
			
		that._bind( that.newelement, that._newelementEvents );
		
		// document click closes menu
		that._bind( document, {
			'mousedown': function( event ) {
				if ( that.opened && !that.hover) {	
					window.setTimeout( function() {
						that.close( event );
					}, 200 );
				}
			}
		});			
	},
	
	_addNewelement: function() {
		var that = this,
			options = this.options,
			tabindex = this.element.attr( 'tabindex' );		
		
		// catch click event of the label
		that._bind({
			'click':  function( event ) {
				that.newelement.focus();
				event.preventDefault();
			}
		});
		
		// hide original select tag
		that.element.hide();
		
		// create button
		that.newelement = $( '<a />', {
				href: '#' + that.ids[ 0 ],
				tabindex: ( tabindex ? tabindex : that.element.attr( 'disabled' ) ? 1 : 0 ),
				id: that.ids[ 1 ],
				css: {
					width: that.element.outerWidth()
				},
				'aria-disabled': options.disabled,
				'aria-owns': that.ids[ 2 ],
				'aria-haspopup': true	
			})
			.addClass( that.widgetBaseClass + '-button' )
			.button({
				label: this.element.find( "option:selected" ).text(),
				icons: {
					primary: ( options.dropdown ? 'ui-icon-triangle-1-s' : 'ui-icon-triangle-2-n-s' )
				}
			});
			
		// wrap and insert new button
		that.newelementWrap = $( '<div />' )
			.append( that.newelement )
			.insertAfter( that.element );	
	},
	
	_addList: function() {
		var that = this,
			options = this.options;
			
		// create menu portion, append to body		
		that.list = $( '<ul />', {
			'class': 'ui-widget ui-widget-content',
			'aria-hidden': true,
			'aria-labelledby': that.ids[1],
			role: 'listbox',
			id: that.ids[2]
		});
		
		// set width
		if ( options.dropdown ) {
			var setWidth = that.newelement.outerWidth();
		} else {
			var text = that.newelement.find( "span.ui-button-text");
			var setWidth = text.width() + parseFloat( text.css( "padding-left" ) ) + parseFloat( text.css( "margin-left" ) );
		}
		
		that._bind( that.list, {
			'click': function( event ) {
				event.preventDefault();
			},
			// namespacing is needed (_bind should do the trick, but it doesnt)
			'mouseenter.selectmenu': function() {
				that.hover = true;
			},
			'mouseleave.selectmenu': function() {
				that.hover = false;
			}
		});

		// wrap list	
		that.listWrap = $( '<div />' )
			.addClass( that.widgetBaseClass + '-menu' )
			.width( setWidth )
			.append( that.list )
			.appendTo( options.appendTo );
				
		// init menu widget
		that.list
			.data( 'element.selectelemenu', that.element )
			.menu({
				select: function( event, ui ) {
					var flag = false,
						item = ui.item.data( "item.selectmenu" );
						
					if ( item.index != that.element[0].selectedIndex ) flag = true;	
					
					that._setOption( "value", item.value );
					that._trigger( "select", event, { item: item } );
					
					if ( flag ) that._trigger( "change", event, { item: item } );
					
					that.close( event, true);
				},
				focus: function( event, ui ) {	
					that._trigger( "focus", event, { item: ui.item.data( "item.selectmenu" ) } );
				}
			});
	},
	
	// TODO update the value option
	refresh: function() {
		var that = this,
			options = this.options;		
		
		that.list.empty();
		
		that._initSource();
		that._renderMenu( that.list, that.items );
		
		// this.menu.blur();
		that.list.menu( "refresh" );
					
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
					if ( this.opened ) this.close();
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
	}
});

}( jQuery ));
