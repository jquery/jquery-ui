// demo helpers, may become part of some abstraction later

function serializeForm(form) {
	var result = {};
	// TODO flatten arrays (object.name occuring multiple times)
	$.each( $( form ).serializeArray(), function( index, object ) {
		result[ object.name ] = object.value;
	});
	return result;
}

function deserializeForm( form, source ) {
	var observable = $.observable( source );
	$( form ).find("input:text").each(function() {
		$( this ).val( observable.property( this.name ) );
	});
}

function capitalize( value ) {
	return value.replace(/^(.)(.*)$/, function(match, first, rest) {
		return first.toUpperCase() + rest.toLowerCase();
	});
}
function meta( input ) {
	var output = [];
	for ( key in input ) {
		var value = input[ key ];
		// replicate behaviour of JSON.stringify to skip entries
		if ( value && value.toJSON && value.toJSON() === undefined ) {
			continue;
		}
		var field = {
			name: key,
			label: capitalize(key),
			value: value
		};
		if ( $.isPlainObject(field.value) ) {
			for (subkey in field.value) {
				field.name += "." + subkey;
				field.value = field.value[ subkey ];
			}
		}
		output.push(field);
	}
	return output;
}
