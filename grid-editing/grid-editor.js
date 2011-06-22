/*
 * Grid Inline Editor
 *
 * Depends on:
 * widget
 * editor
 */
(function( $ ) {

$.widget( "ui.gridEditor", {
	_create: function() {
		this._bind({
			click: function( event ) {
				var that = this;
				var target = $( event.target ).closest( this.options.items );
				if ( target.length && !target.data( "editor" ) ) {
					target.editor({
						type: this.options.type( target ),
						submit: function( event, ui ) {
							that._trigger( "submit", event, $.extend( {
								item: target
							}, ui ));
						}
					}).editor("start");
				}
			}
		});
	}
});


})( jQuery );
