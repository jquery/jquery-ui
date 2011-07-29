// demo helpers, may become part of some abstraction later

function serializeForm(form) {
	var result = {};
	// TODO flatten arrays (object.name occuring multiple times)
	$.each( $( form ).serializeArray(), function( index, object ) {
		// TODO get rid of event handlers props on data objects
		if ( /jQuery\d+/.test( object.name ) ) {
			return;
		}
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
		// TODO get rid of event handlers props on data objects
		if ( /jQuery\d+/.test( key ) ) {
			continue;
		}
		var field = {
			name: key,
			label: capitalize(key),
			value: input[ key ]
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
