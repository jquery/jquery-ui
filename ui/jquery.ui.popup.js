/*
 * jQuery UI Popup @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Popup
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function($) {
	
var idIncrement = 0;

$.widget( "ui.popup", {
	options: {
		position: {
			my: "left top",
			at: "left bottom"
		}
	},
	_create: function() {
		if ( !this.options.trigger ) {
			this.options.trigger = this.element.prev();
		}
		
		if ( !this.element.attr( "id" ) ) {
			this.element.attr( "id", "ui-popup-" + idIncrement++ );
			this.generatedId = true;
		}
		
		if ( !this.element.attr( "role" ) ) {
			// TODO alternatives to tooltip are dialog and menu, all three aren't generic popups
			this.element.attr( "role", "dialog" );
			this.generatedRole = true;
		}
		
		this.options.trigger
			.attr( "aria-haspopup", true )
			.attr( "aria-owns", this.element.attr( "id" ) );
		
		this.element
			.addClass("ui-popup")
		this.close();

		this._bind(this.options.trigger, {
			keydown: function( event ) {
				// prevent space-to-open to scroll the page, only hapens for anchor ui.button
				if ( this.options.trigger.is( "a:ui-button" ) && event.keyCode == $.ui.keyCode.SPACE) {
					event.preventDefault()
				}
				// TODO handle SPACE to open popup? only when not handled by ui.button
				if ( event.keyCode == $.ui.keyCode.SPACE && this.options.trigger.is("a:not(:ui-button)") ) {
					this.options.trigger.trigger( "click", event );
				}
				// translate keydown to click
				// opens popup and let's tooltip hide itself
				if ( event.keyCode == $.ui.keyCode.DOWN ) {
					// prevent scrolling
					event.preventDefault();
					this.options.trigger.trigger( "click", event );
				}
			},
			click: function( event ) {
				event.preventDefault();
				if (this.isOpen) {
					// let it propagate to close
					return;
				}
				var that = this;
				clearTimeout( this.closeTimer );
				setTimeout(function() {
					that.open( event );
				}, 1);
			}
		});
		
		this._bind(this.element, {
			focusout: function( event ) {
				var that = this;
				// use a timer to allow click to clear it and letting that
				// handle the closing instead of opening again
				that.closeTimer = setTimeout( function() {
					that.close( event );
				}, 100);
			},
			focusin: function( event ) {
				var that = this;
				clearTimeout( that.closeTimer );
			}		
		});

		this._bind({
			// TODO only triggered on element if it can receive focus
			// bind to document instead?
			// either element itself or a child should be focusable
			keyup: function( event ) {
				if (event.keyCode == $.ui.keyCode.ESCAPE && this.element.is( ":visible" )) {
					this.close( event );
					// TODO move this to close()? would allow menu.select to call popup.close, and get focus back to trigger
					this.options.trigger.focus();
				}
			}
		});
		
		this._bind(document, {
			click: function( event ) {
				if (this.isOpen && !$(event.target).closest(".ui-popup").length) {
					this.close( event );
				}
			}
		})
	},
	
	_destroy: function() {
		this.element
			.show()
			.removeClass( "ui-popup" )
			.removeAttr( "aria-hidden" )
			.removeAttr( "aria-expanded" );

		this.options.trigger
			.removeAttr( "aria-haspopup" )
			.removeAttr( "aria-owns" );
			
		if ( this.generatedId ) {
			this.element.removeAttr( "id" );
		}
		if ( this.generatedRole ) {
			this.element.removeAttr( "role" );
		}
	},
	
	open: function( event ) {
		var position = $.extend( {}, {
			of: this.options.trigger
		}, this.options.position );

		this.element
			.show()
			.attr( "aria-hidden", false )
			.attr( "aria-expanded", true )
			.position( position );		
		
		if (this.element.is(":ui-menu")) { //popup is a menu
			this.element.focus();
			this.element.menu("focus", event, this.element.children( "li" ).first() );
			this.element.focus();
		}
		// TODO add other special use cases that differ from the default dialog style keyboard mechanism
		else {
			//default use case, popup could be anything (e.g. a form)
			this.element
				.bind( "keydown.ui-popup", function( event ) {
	                if ( event.keyCode !== $.ui.keyCode.TAB ) {
	                    return;
	                }
	                var tabbables = $( ":tabbable", this ),
	                    first = tabbables.filter( ":first" ),
	                    last  = tabbables.filter( ":last" );
	                if ( event.target === last[0] && !event.shiftKey ) {
	                    first.focus( 1 );
	                    return false;
	                } else if ( event.target === first[0] && event.shiftKey ) {
	                    last.focus( 1 );
	                    return false;
	                }
	            });
			
			// set focus to the first tabbable element in the popup container
	        // if there are no tabbable elements, set focus on the popup itself
	        var tabbables = this.element.find( ":tabbable" );
	        if (!tabbables.length) {
	        	this.element.attr("tabindex", "0");
	        	tabbables.add(this.element);
	        }
	        tabbables.eq( 0 ).focus(1);
		}
		
		// take trigger out of tab order to allow shift-tab to skip trigger
		this.options.trigger.attr("tabindex", -1);

		this.isOpen = true;
		this._trigger( "open", event );
	},

	close: function( event ) {
		this.element
			.hide()
			.attr( "aria-hidden", true )
			.attr( "aria-expanded", false )
			.unbind( "keypress.ui-popup");

		this.options.trigger.attr("tabindex", 0);

		this.isOpen = false;
		this._trigger( "close", event );
	}
	
	
});

}(jQuery));
