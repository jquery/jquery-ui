/*
 * Grid Selectable
 *
 * Depends on:
 *  jquery.ui.widget.js
 *  jquery.ui.selectable.js
 */
(function( $ ) {

	$.widget("ui.gridSelectable", {
		options: {
			selected: []
		},
		_create: function() {
			var that = this;
			this.element.selectable({
				filter: "tbody > tr",
				// TODO clear selection (on other pages) when starting from scratch
				selected: function( event, ui ) {
					var item = $( ui.selected ).data( "grid-item" );
					if ( $.inArray( item, that.options.selected ) === -1 ) {
						$.observable( that.options.selected ).insert( item );
					}
				},
				unselected: function( event, ui ) {
					var item = $( ui.selected ).data( "grid-item" );
					$.observable( that.options.selected ).remove( item );
				}
			});
		},
		destroy: function() {
			this.element.selectable( "destroy" );
		}
	});

}( jQuery ));
