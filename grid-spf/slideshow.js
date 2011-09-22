(function( $ ) {

$.widget( "spf.slideshow", {
	options: {
		source: null,
		pageSize: 2
	},

	_create: function() {
		this.element.addClass( "spf-slideshow" );
		this._bind( this.options.source, {
			dataviewresponse: "refresh"
		});
		$.template('photo-tmpl', '<a href="${href}" title="${title}"><img src="${src}" alt="${alt}" /></a>');
	},

	refresh: function() {
		this.element.html( $.tmpl( 'photo-tmpl', this.options.source.result ) );
	}
});

}( jQuery ) );
