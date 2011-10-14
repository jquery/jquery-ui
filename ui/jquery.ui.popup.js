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

var idIncrement = 0,
	suppressExpandOnFocus = false;

$.widget( "ui.popup", {
	version: "@VERSION",
	options: {
		position: {
			my: "left top",
			at: "left bottom"
		},
		managed: false,
		expandOnFocus : false
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
			if ( !this.options.managed  ) {
				this.element.attr( "role", "dialog" );
				this.generatedRole = true;
			}
		}

		this.options.trigger
			.attr( "aria-haspopup", true )
			.attr( "aria-owns", this.element.attr( "id" ) );

		this.element
			.addClass( "ui-popup" )
		this.close();

		this._bind(this.options.trigger, {
			keydown: function( event ) {
				switch ( event.keyCode ) {
					case $.ui.keyCode.TAB:
						// Waiting for close() will make popup hide too late, which breaks tab key behavior
						this.element.hide();
						this.close( event );
						break;
					case $.ui.keyCode.ESCAPE:
						if ( this.isOpen ) {
							this.close( event );
						}
						break;
					case $.ui.keyCode.SPACE:
						// prevent space-to-open to scroll the page, only happens for anchor ui.button
						if ( this.options.trigger.is( "a:ui-button" ) ) {
							event.preventDefault();
						}

						else if (this.options.trigger.is( "a:not(:ui-button)" ) ) {
							this.options.trigger.trigger( "click", event );
						}
						break;
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.UP:
						// prevent scrolling
						event.preventDefault();
						var that = this;
						clearTimeout( this.closeTimer );
						setTimeout(function() {
							that.open( event );
							that.focusPopup( event );
						}, 1);
						break;
				}
			},
			mousedown: function( event ) {
				var noFocus = false;
				/* TODO: Determine in which cases focus should stay on the trigger after the popup opens
				(should apply for any trigger that has other interaction besides opening the popup, e.g. a text field) */
				if ( $( event.target ).is( "input" ) ) {
					noFocus = true;
				}
				if (this.isOpen) {
					this.close();
					return;
				}
				this.open( event );
				var that = this;
				clearTimeout( this.closeTimer );
				setTimeout(function() {
					if ( !noFocus ) {
						that.focusPopup();
					}
				}, 1);
			}
		});

		if ( this.options.expandOnFocus ) {
			this._bind( this.options.trigger, {
				focus : function( event ) {
					if ( !suppressExpandOnFocus ) {
						var that = this;
						setTimeout(function() {
							if ( !that.isOpen ) {
								that.open( event );
							}
						}, 1);
					}
					setTimeout(function() {
						suppressExpandOnFocus = false;
					}, 100);
				}
			});
		}
		if ( !this.options.managed ) {
			//default use case, wrap tab order in popup
			this._bind({ keydown : function( event ) {
					if ( event.keyCode !== $.ui.keyCode.TAB ) {
						return;
					}
					var tabbables = $( ":tabbable", this.element ),
						first = tabbables.first(),
						last  = tabbables.last();
					if ( event.target === last[ 0 ] && !event.shiftKey ) {
						first.focus( 1 );
						event.preventDefault();
					} else if ( event.target === first[ 0 ] && event.shiftKey ) {
						last.focus( 1 );
						event.preventDefault();
					}
				}
			});
		}

		this._bind({
			focusout: function( event ) {
				var that = this;
				// use a timer to allow click to clear it and letting that
				// handle the closing instead of opening again
				that.closeTimer = setTimeout( function() {
					that.close( event );
				}, 100);
			},
			focusin: function( event ) {
				clearTimeout( this.closeTimer );
			},
			mouseup: function( event ) {
				clearTimeout( this.closeTimer );
			}
		});

		this._bind({
			keyup: function( event ) {
				if ( event.keyCode == $.ui.keyCode.ESCAPE && this.element.is( ":visible" ) ) {
					this.close( event );
					this.focusTrigger();
				}
			}
		});

		this._bind(document, {
			click: function( event ) {
				if ( this.isOpen && !$(event.target).closest(".ui-popup").length && this.options.trigger[0] != event.target ) {
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
			.removeAttr( "aria-expanded" )
			.unbind( "keypress.ui-popup");

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

		// take trigger out of tab order to allow shift-tab to skip trigger
		this.options.trigger.attr( "tabindex", -1 );
		this.isOpen = true;
		this._trigger( "open", event );
	},

	focusPopup: function( event ) {
		if ( !this.options.managed ) {
			// set focus to the first tabbable element in the popup container
			// if there are no tabbable elements, set focus on the popup itself
			var tabbables = this.element.find( ":tabbable" );
			this.removeTabIndex = false;
			if ( !tabbables.length ) {
				if ( !this.element.is(":tabbable") ) {
					this.element.attr("tabindex", "0");
					this.removeTabIndex = true;
				}
				tabbables = tabbables.add( this.element[ 0 ] );
			}
			tabbables.first().focus( 1 );
		}
		this._trigger( "focusPopup", event );
	},

	focusTrigger: function( event ) {
		suppressExpandOnFocus = true;
		this.options.trigger.focus();
		this._trigger( "focusTrigger", event );
	},

	close: function( event ) {
		this.element
			.hide()
			.attr( "aria-hidden", true )
			.attr( "aria-expanded", false );

		this.options.trigger.attr( "tabindex" , 0 );
		if ( this.removeTabIndex ) {
			this.element.removeAttr( "tabindex" );
		}
		this.isOpen = false;
		this._trigger( "close", event );
	}
});

}(jQuery));
