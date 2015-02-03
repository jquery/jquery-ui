( function( QUnit ) {
	function inArray( haystack, needle ) {
		for ( var i = 0; i < haystack.length; i++ ) {
			if ( haystack[ i ] === needle ) {
				return true;
			}
		}
		return false;
	}
	function check( element, classes, stateVal, message ) {
		var i, result, classAttribute, elementClassArray,
			classArray = classes.split( " " ),
			missing = [],
			found = [];

		if ( element.jquery && element.length !== 1 ) {
			throw( "Class checks can only be performed on a single element on a collection" );
		}
		element = element.jquery ? element[ 0 ] : element;
		classAttribute = element.getAttribute( "class" );
		message = message || "Element must " + ( stateVal? "" : "not " ) + "have classes";
		if ( classAttribute ) {
			elementClassArray = classAttribute.split( " " );
			for( i = 0; i < classArray.length; i++ ) {
				if ( !inArray( elementClassArray, classArray[ i ] ) ) {
					missing.push( classArray[ i ] );
				} else {
					found.push( classArray[ i ] );
				}
			}
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