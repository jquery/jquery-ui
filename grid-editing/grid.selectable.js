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
			var that = this,
				selected = this.options.selected;
			this.element.selectable({
				filter: "tbody > tr",
				start: function( event, ui ) {
					if ( !event.metaKey ) {
						$.observable( selected ).remove( 0, selected.length );
					}
				},
				selecting: function( event, ui ) {
					var item = $( ui.selecting ).data( "grid-item" );
					if ( $.inArray( item, selected ) === -1 ) {
						$.observable( selected ).insert( item );
					}
				},
				unselecting: function( event, ui ) {
					var item = $( ui.unselecting ).data( "grid-item" );
					$.observable( selected ).remove( item );
				}
			});
			this.element.bind( "gridrefresh", function() {
				that.element.find( "tbody > tr" ).each(function() {
					if ( $.inArray($(this).data("grid-item"), selected) !== -1 ) {
						$( this ).addClass( "ui-selected" );
					}
				});
			});
		},
		destroy: function() {
			this.element.selectable( "destroy" );
		}
	});

}( jQuery ));
