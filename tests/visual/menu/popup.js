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
		this._close();
		
		this._bind(this.options.trigger, {
			click: function( event ) {
				event.preventDefault();
				var that = this;
				setTimeout(function() {
					that._open( event );
				}, 1);
			}
		});
		
		this._bind({
			keyup: function( event ) {
				if (event.keyCode == $.ui.keyCode.ESCAPE && this.element.is( ":visible" )) {
					this._close( event );
					this.options.trigger.focus();
				}
			}
		});
		
		this._bind(document, {
			click: function( event ) {
				if (this.open && !$(event.target).closest(".ui-popup").length) {
					this._close( event );
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
	
	_open: function( event ) {
		var position = $.extend( {}, {
			of: this.options.trigger
		}, this.options.position );

		this.element
			.show()
			.attr( "aria-hidden", false )
			.attr( "aria-expanded", true )
			.position( position )
			.focus();
		this.open = true;
		this._trigger( "open", event );
	},

	_close: function( event ) {
		this.element
			.hide()
			.attr( "aria-hidden", true )
			.attr( "aria-expanded", false );
		this.open = false;
		this._trigger( "close", event );
	}
	
	
});

}(jQuery));
