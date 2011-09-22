/*
 * oData Dataview
 *
 * Depends on:
 * dataview
 */
(function ($, undefined ) {

$.widget( "ui.odataDataview", $.ui.dataview, {
	// all dataview implementations share a common event prefix
	widgetEventPrefix: "dataview",
	options: {
		paging: {
			limit: 10
		},
		resource: null,
		source: function( request, response ) {
			var data = {
				"$format": "json",
				"$inlinecount": "allpages",
				"$skip": request.paging.offset,
				"$top": request.paging.limit
			};
			if (request.sort.length) {
				var sorts = [];
				$.each(request.sort, function (index, field) {
					sorts[sorts.length] = field.replace(/-(.+)/, "$1 desc");
				});
				data["$orderby"] = sorts.join(",");

			}
			if (request.filter) {
				var filters = [];
				$.each(request.filter, function (property, filter) {
					if (!filter.operator) {
						filter.operator = isNaN(filter.value) ? "like" : "==";
					}
					if (filter.operator == "like") {
						filters[filters.length] = "indexof(" + property + ", '" + filter.value + "') ge 0";
					} else {
						var operators = {
							"<": "lt",
							"<=": "le",
							">": "gt",
							">=": "ge",
							"==": "eq",
							"!=": "ne"
						};
						filters[filters.length] = property + " " + operators[filter.operator] + " " +
							(isNaN(filter.value) ? ("'" + filter.value + "'") : filter.value);
					}

				});
				data["$filter"] = filters.join(" and ");
			}
			$.ajax({
				url: request.resource,
				dataType: "jsonp",
				jsonp: "$callback",
				data: data,
				success: function( data ) {
					response( data.d.results, data.d.__count );
				}
			});
		}
	}
});

}( jQuery ) );
