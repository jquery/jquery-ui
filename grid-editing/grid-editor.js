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
		items: "td"
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
						submit: function( event, ui) {
							var object = target.closest("tr").data( "grid-item" ),
								property = grid.options.columns[ target[ 0 ].cellIndex ].property;
							$.observable( object ).property( property, ui.value );
							grid.element.focus();
						},
						cancel: function() {
							grid.element.focus();
						}
					}).editor("start");
				}
			}
		});
	}
});


})( jQuery );
