/*
 * Inline Editor
 *
 * Depends on:
 * widget
 *
 * Optional:
 * spinner
 */
(function( $ ) {

$.widget( "ui.editor", {
	_create: function() {
		this.inner = this.element.wrapInner("<div class='editor-wrapper'></div>").children();
		this._bind({
			click: function( event ) {
				if (this.input.is(":visible")) {
					return;
				}
				this.start( event );
			}
		});

		this.input = this.inputWrapper = $( "<input>" );
		this.input.width( this.inner.width() );
		if ( this.options.type === "number" ) {
			this.input = this.input.spinner();
			this.inputWrapper = this.input.spinner("widget");
		}
		this.inputWrapper.hide().appendTo( this.element )

		this._bind( this.inputWrapper, {
			focusin: function() {
				clearTimeout( this.timer );
			},
			focusout: function( event ) {
				if (!this.input.is(":visible")) {
					return;
				}
				var that = this;
				this.timer = setTimeout( function() {
					that.submit( event );
				}, 100 );
			},
			keyup: function( event ) {
				if ( event.keyCode === $.ui.keyCode.ENTER || event.keyCode === $.ui.keyCode.NUMPAD_ENTER ) {
					this.submit( event );
				} else if ( event.keyCode === $.ui.keyCode.ESCAPE ) {
					this.cancel( event );
				}
			}
		});
	},
	start: function( event ) {
		this.inner.hide();
		this.inputWrapper.show();
		this.input.val( this.inner.text() ).focus();
		this._trigger("start", event );
	},
	_hide: function( event ) {
		this.inputWrapper.hide();
		this.inner.show();
	},
	submit: function( event ) {
		var newValue = this.input.val(),
			ui = {
				value: newValue
			};
		if ( this._trigger( "submit", event, ui ) !== false ) {
			this.inner.text( newValue );
		}
		this._hide();
	},
	cancel: function( event ) {
		this._hide();
		this._trigger( "cancel", event );
	}
});


})( jQuery );
