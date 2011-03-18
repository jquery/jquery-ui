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
		
		this.element.delegate("button", "click", function() {
			var method = $(this).data("page");
			var source = that.options.source;
			source[method]();
			source.refresh();
		});

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
		
		var buttons = this.element.prepend( kite( "#controls-tmpl" ) ).find(".controls").buttonset().find("button");
		buttons.button("enable");
		
		var source = this.options.source;
		if (!source._skip) {
			buttons.slice(0, 2).button("disable")
		}
		if (source._skip + source._take >= source.totalCount) {
			buttons.slice(2, 4).button("disable")
		}
	}
});