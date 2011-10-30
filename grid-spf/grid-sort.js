$.widget( "ui.gridSort", {
	_create: function() {
		var grid = this.element.data("grid");
		var headers = grid.uiGridHeadTable.find( "tr:first th" );
		this._hoverable( headers );
		headers.disableSelection().click( function() {
			headers.not( this ).removeClass( "sorted sorted-desc" );
			var column = grid.options.columns[ this.cellIndex ];
			var sorted = $(this).hasClass("sorted");
			$( this ).toggleClass("sorted", !sorted).toggleClass("sorted-desc", sorted);
			grid.options.source
				.option( "sort", ( sorted ? "-" : "" ) + column.property )
				.refresh();
		}).append( '<span class="ui-icon-asc ui-icon ui-icon-carat-1-n"></span><span class="ui-icon-desc ui-icon ui-icon-carat-1-s"></span>' );
	}
});
