/*
 * grid.js
 */
(function( $ ) {

$.widget( "ui.grid", {
	options: {},
	_create: function() {

		var totalWidth = 0,
			colWidths = this.element.find("td:eq(0)").parent("tr").children().map(function() {
				var width = $(this).outerWidth();
				totalWidth += width
				return width;
			});

		// Create the grid
		var uiGrid = ( this.uiGrid = $("<div class='ui-widget ui-grid'></div>") )
				.insertBefore( this.element ),

			// Add grid head and grid body
			uiGridHead = ( this.uiGridHead = $("<div class='ui-widget-header ui-grid-head'></div>") )
				.appendTo( uiGrid ),
			uiGridBody = ( this.uiGridBody = $("<div class='ui-widget-content ui-grid-body'></div>") )
				.appendTo( uiGrid ),

			// New table in grid head for column headers
			uiGridHeadTable = ( this.uiGridHeadTable = $("<table class='ui-grid-head-table'></table>") )
				.appendTo( uiGridHead );

			// Existing table in grid body for the body table
			uiGridBodyTable = ( this.uiGridBodyTable = this.element )
				.addClass( "ui-grid-body-table" )
				.appendTo( uiGridBody );

		// Move table CAPTION to grid head
		uiGridBodyTable.find("caption")
			.prependTo( uiGridHeadTable );

		if ( !uiGridBodyTable.find("colgroup").length ) {
			// TODO: Consider adding support for existing COL elements not inside COLGROUP
			uiGridBodyTable.find("col").remove();
			var colgroup = $("<colgroup></colgroup>").insertBefore( uiGridBodyTable.find("thead") );
			uiGridBodyTable.find("tr:eq(0)").children().each(function(i) {
				colgroup.append("<col>");
			});
		}

		uiGridBody.find("colgroup").children().each(function(i) {
			$(this).css("width", ( colWidths[i] / totalWidth * 100 ) + '%' );
		});

		// Copy table COLGROUP to grid head
		uiGridBodyTable.find("colgroup")
			.clone()
			.appendTo( uiGridHeadTable );

		// TODO: handle case of no COLs existing
		// Set head col widths equal to body col widths
		var headCols = uiGridHeadTable.find("col");
		uiGridBodyTable.find("col").each(function(i, a) {
			headCols.eq(i).width( $(this).width() );
		});

		// Move table THEAD to grid head for fixed column headers
		uiGridBodyTable.find("thead")
			.appendTo( uiGridHeadTable );

		// Give head rows a clickable state
		uiGridHeadTable.find("tr").addClass("ui-state-default");

		// Give head cells a clickable state
		uiGridHeadTable.find("th").addClass("ui-state-default");

		// Give body rows a clickable state
		uiGridBodyTable.find("tr").addClass("ui-state-default");

		// Give body cells a clickable state
		uiGridBodyTable.find("td").addClass("ui-state-default");

	}
});

}( jQuery ));
