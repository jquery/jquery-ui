(function( $ ) {

$.widget( "spf.slideshow", {
	options: {
		source: null,
		pageSize: 2
	},

	_create: function() {
		this.element.addClass( "spf-slideshow" );
		this._bind( this.options.source, {
			datasourceresponse: "refresh"
		});
	},

	refresh: function() {
		this.element.html( $.map( this.options.source.toArray(), function( photo ) {
			return kite( "#photo-tmpl", photo );
		}).join( "" ) );
	}
});

}( jQuery ) );
