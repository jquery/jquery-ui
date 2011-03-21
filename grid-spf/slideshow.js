$.widget( "spf.slideshow", {
	options: {
		source: null,
		pageSize: 2
	},
	_create: function() {
		var that = this;

		this.element.addClass( "spf-slideshow" );
		$( this.options.source ).bind( "datasourcerefresh", function() {
			that.refresh();
		});
		
		this.buttons = $( kite( "#controls-tmpl" )() ).insertBefore( this.element ).delegate("button", "click", function() {
			var method = $(this).data("page");
			var source = that.options.source;
			source[method]();
			source.refresh();
		}).buttonset().find("button");

		this.options.source.refresh();
	},
	refresh: function() {
		var photosHtml = [];

		$.each( this.options.source.toArray(), function( i, photo ) {
			var html = kite( "#photo-tmpl", photo );
			photosHtml.push( html );
		});

		this.element.empty();
		this.element.html( photosHtml.join("") );
		
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