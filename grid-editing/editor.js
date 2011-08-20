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
	options: {
		editor: null,
		editorOptions: null,

		// callbacks
		cancel: null,
		submit: null
	},
	_create: function() {
		this.inner = this.element.wrapInner( "<div class='editor-wrapper'></div>" ).children();
		this._bind({
			dblclick: function( event ) {
				if ( this.input.is(":visible") ) {
					return;
				}
				this.start( event );
			}
		});

		this.input = this.inputWrapper = $( "<input>" );
		// TODO improve this to match the actual available space
		// works only so-so for regular inputs, really bad for spinner
		this.input.width( this.inner.width() );
		if (this.options.editor in $.ui.editor.editors) {
			this.inputWrapper = $.ui.editor.editors[ this.options.editor ]( this.input, this.options.editorOptions );
		}
		this.inputWrapper.hide().appendTo( this.element );

		this._bind( this.inputWrapper, {
			focusin: function() {
				clearTimeout( this.timer );
			},
			focusout: function( event ) {
				var that = this;
				this.timer = setTimeout( function() {
					if ( !that.input.is(":visible") ) {
						return;
					}
					that.submit( event );
				}, 100 );
			},
			keydown: function( event ) {
				event.stopPropagation();
			},
			keyup: function( event ) {
				event.stopPropagation();
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
		this.input.blur();
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

$.ui.editor.editors = {
	spinner: function( input, options ) {
		return input.spinner( options ).spinner("widget");
	}
};

})( jQuery );
