$.widget( "spf.slideshow", {
	options: {
		source: null,
		pageSize: 2
	},
	_create: function() {
		var that = this;

		this.element.addClass( "spf-slideshow" );
		$( this.options.source ).bind( "datasourceresponse", function() {
			that.refresh();
		});
	},
	refresh: function() {
		var photosHtml = [];

		$.each( this.options.source.toArray(), function( i, photo ) {
			var html = kite( "#photo-tmpl", photo );
			photosHtml.push( html );
		});

		this.element.empty();
		this.element.html( photosHtml.join("") );
	}
});