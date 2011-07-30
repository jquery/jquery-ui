(function( $ ) {
	var countries;
	$.ajax({
		dataType: "json",
		url: "countries.json",
		async: false,
		success: function( result ) {
			countries = $.map( result, function( country ) {
				return country.n;
			});
		}
	});
	$.ui.editor.editors.countrycomplete = function( input ) {
		return input.autocomplete({
			source: countries
		});
	};
})( jQuery );
