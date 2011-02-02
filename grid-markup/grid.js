/*
 * grid.js
 */
(function( $ ) {

$.widget( "ui.grid", {
	options: {},
	_create: function() {
		var uiGrid = ( this.uiDialog = $("<div class='ui-widget ui-grid'></div>") )
				.insertBefore( this.element ),

			uiGridHead = ( this.uiGridHead = $("<div class='ui-widget-header ui-grid-head'></div>") )
				.appendTo( uiGrid ),

			uiGridBody = ( this.uiGridBody = $("<div class='ui-widget-content ui-grid-body'></div>") )
				.appendTo( uiGrid ),

			uiGridBodyTable = ( this.uiGridBodyTable = $("<table></table") )
				.appendTo( uiGridBody ),

			uiGridHeadTable = this.element
				.appendTo( uiGridHead );

		uiGridHeadTable.find("tbody")
			.appendTo( uiGridBodyTable );
		
	}
});

}( jQuery ));
