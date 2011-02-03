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
			uiGridFoot = ( this.uiGridFoot = $("<div class='ui-widget-header ui-grid-foot'></div>") )
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

		// Create COLGROUP and COLs if missing
		if ( !uiGridBodyTable.find("colgroup").length ) {
			// TODO: Consider adding support for existing COL elements not inside COLGROUP
			// TODO: ... in the meantime, remove any that might exist
			uiGridBodyTable.find("col").remove();
			var colgroup = $("<colgroup></colgroup>").insertBefore( uiGridBodyTable.find("thead") );
			uiGridBodyTable.find("tr:eq(0)").children().each(function(i) {
				colgroup.append("<col>");
			});
		}

		// Auto-size columns based on relative widths of pre-grid table column widths
		uiGridBody.find("colgroup").children().each(function(i) {
			$(this).css("width", ( colWidths[i] / totalWidth * 100 ) + '%' );
		});

		// Copy table COLGROUP to grid head
		uiGridBodyTable.find("colgroup")
			.clone()
			.appendTo( uiGridHeadTable );

		// Move table THEAD to grid head for fixed column headers
		uiGridBodyTable.find("thead")
			.appendTo( uiGridHeadTable );

		// Give head rows a clickable state
		uiGridHeadTable.find("tr").addClass("ui-state-default");

		// Give head cells a clickable state
		this._hoverable( uiGridHeadTable.find("th").addClass("ui-state-default") );

		// Give body rows a clickable state
		uiGridBodyTable.find("tr").addClass("ui-state-default");

		// Give body cells a clickable state
		uiGridBodyTable.find("td").addClass("ui-state-default");

		this.refresh();

	},

	widget: function() {
		return this.uiGrid;
	},

	refresh: function() {
		var gridHeight = this.uiGrid.height(),
			headHeight = this.uiGridHead.height(),
			footHeight = this.uiGridFoot.height();

		// Adjust body height to fill
		this.uiGridBody.height( gridHeight - headHeight - footHeight );

		// Adjust head in case of visible scrollbar on body to keep columns aligned
		var vertScrollbar = ( this.uiGridBody[0].scrollHeight !== this.uiGridBody[0].clientHeight );
		if ( vertScrollbar ) {
			this.uiGridHead.css("padding-right", ( this.uiGridBody.width() - this.uiGridBodyTable.width() ) + "px" );
		} else {
			this.uiGridHead.css("padding-right", 0);
		}
		
	}
});

}( jQuery ));
