/*
 * oData Dataview
 *
 * Depends on:
 * dataview
 */
(function ($, undefined ) {

function format(string, object) {
	return string.replace(/\$\{(.+?)\}/g, function(match, key) { return object[key]; });
}

$.widget( "ui.flickrDataview", $.ui.dataview, {
	// all dataview implementations share a common event prefix
	widgetEventPrefix: "dataview",
	options: {
		paging: {
			limit: 10
		},
		resource: "http://api.flickr.com/services/rest/",
		source: function( request, response ) {
			$.ajax({
				url: request.resource,
				dataType: "jsonp",
				jsonpCallback: "jsonFlickrApi",
				data: {
					format: "json",
					api_key: "d86848d57cb3f7ad94f2ee9a3c90eff1",
					method: "flickr.photos.search",
					tags: request.filter,
					sort: "relevance",
					per_page: request.paging.limit,
					page: request.page
				},
				success: function( data ) {
					var result = $.map( data.photos.photo, function( photo ) {
						return {
							src: format("http://farm${farm}.static.flickr.com/${server}/${id}_${secret}_m.jpg", photo),
							href: format("http://www.flickr.com/photos/${owner}/${id}/", photo)
						};
					});
					response( result, data.photos.total );
				}
			});
		}
	}
});

}( jQuery ) );
