/*
 * Grid Inline Editor
 *
 * Depends on:
 * widget
 * editor
 * observable
 */
(function( $ ) {

$.widget( "ui.gridEditor", {
	options: {
		editor: function( cell, grid ) {
			return grid.options.columns[ cell[ 0 ].cellIndex ].editor;
		},
		editorOptions: function( cell, grid ) {
			return grid.options.columns[ cell[ 0 ].cellIndex ].editorOptions;
		},
		done: $.noop
	},
	_create: function() {
		var grid = this.element.data("grid");
		this._bind({
			dblclick: function( event ) {
				var that = this;
				var target = $( event.target ).closest( this.options.items );
				if ( target.length && !target.data( "editor" ) ) {
					target.editor({
						editor: this.options.editor( target, grid ),
						editorOptions: this.options.editorOptions( target, grid ),
						cancel: function( event, ui) {
							that._trigger( "done", event, ui );
						},
						submit: function( event, ui) {
							var object = target.closest("tr").data( "grid-item" ),
								property = grid.options.columns[ target[ 0 ].cellIndex ].property;
							$.observable( object ).property( property, ui.value );
							that._trigger( "done", event, ui );
						}
					}).editor("start");
				}
			}
		});
	}
});


})( jQuery );
