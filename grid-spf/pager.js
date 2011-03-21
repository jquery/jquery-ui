$.widget( "spf.pager", {
	options: {
		source: null,
		pageSize: 2
	},
	_create: function() {
		var that = this;

		// TODO add a datasource method for this
		$( this.options.source ).bind( "datasourcerefresh", function() {
			that.refresh();
		});
		
		this.buttons = this.element.delegate("button", "click", function() {
			var method = $(this).data("page");
			var source = that.options.source;
			source[method]();
			source.refresh();
		}).buttonset().find("button");
	},
	refresh: function() {	
		this.buttons.button("enable");
		
		var source = this.options.source;
		if (!source._skip) {
			this.buttons.slice(0, 2).button("disable")
		}
		if (source._skip + source._take >= source.totalCount) {
			this.buttons.slice(2, 4).button("disable")
		}
	}
});