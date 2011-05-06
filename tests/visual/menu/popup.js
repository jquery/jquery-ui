/*
 * jQuery UI popup utility
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
			this.element.attr( "role", "tooltip" );
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
				if ($( event.currentTarget ).is( "a:ui-button" ) && event.keyCode == $.ui.keyCode.SPACE) {
					event.preventDefault()
				}
				// TODO handle keydown to open popup? only when not handled by ui.button
				//if (event.keyCode == $.ui.keyCode.SPACE) {
				//}
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
			blur: function( event ) {
				var that = this;
				// use a timer to allow click to clear it and letting that
				// handle the closing instead of opening again
				that.closeTimer = setTimeout( function() {
					that.close( event );
				}, 100);
			}
		});

		this._bind({
			// TODO only triggerd on element if it can receive focus
			// bind to document instead?
			keyup: function( event ) {
				if (event.keyCode == $.ui.keyCode.ESCAPE && this.element.is( ":visible" )) {
					this.close( event );
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
			.position( position )
			.focus();

		if (this.element.is(":ui-menu")) {
			this.element.menu("focus", event, this.element.children( "li" ).first() );
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
			.attr( "aria-expanded", false );

		this.options.trigger.attr("tabindex", 0);

		this.isOpen = false;
		this._trigger( "close", event );
	}
	
	
});

}(jQuery));
