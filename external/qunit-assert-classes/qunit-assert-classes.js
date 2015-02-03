( function( QUnit ) {
	function check( element, classes, stateVal, message ) {
		var result,
			classArray = classes.split( " " ),
			missing = [],
			found = [];

		if ( element.jquery && element.length > 1 ) {
			$.error( "Class checks can only be performed on a single element on a collection" );
		}
		element = element.jquery ? element[ 0 ] : element;
		message = message || "Element must " + ( stateVal ? "" : "not " ) + "have classes";
		if ( element.getAttribute( "class") ) {
			classArray.forEach( function( value ) {
				if ( element.getAttribute( "class" ).split( " " ).indexOf( value ) === -1 ) {
					missing.push( value );
				} else {
					found.push( value );
				}
			});
		} else {
			missing = classArray;
		}

		result = stateVal ? !missing.length : !found.length;
		QUnit.push( result, classes, result ? classes : found.join( " " ), message );
	}

	QUnit.extend( QUnit.assert, {
		hasClasses: function( element, classes, message ) {
			check( element, classes, true, message );
		},
		lacksClasses: function( element, classes, message ) {
			check( element, classes, false, message );
		}
	});
})( QUnit );