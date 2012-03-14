function accordion_state( accordion ) {
	var expected = $.makeArray( arguments ).slice( 1 );
	var actual = accordion.find( ".ui-accordion-content" ).map(function() {
		return $( this ).css( "display" ) === "none" ? 0 : 1;
	}).get();
	QUnit.push( QUnit.equiv(actual, expected), actual, expected );
}

function accordion_equalHeights( accordion, min, max ) {
	var sizes = [];
	accordion.find( ".ui-accordion-content" ).each(function() {
		sizes.push( $( this ).outerHeight() );
	});
	ok( sizes[ 0 ] >= min && sizes[ 0 ] <= max,
		"must be within " + min + " and " + max + ", was " + sizes[ 0 ] );
	deepEqual( sizes[ 0 ], sizes[ 1 ] );
	deepEqual( sizes[ 0 ], sizes[ 2 ] );
}

function accordion_setupTeardown() {
	var animate = $.ui.accordion.prototype.options.animate;
	return {
		setup: function() {
			$.ui.accordion.prototype.options.animate = false;
		},
		teardown: function() {
			$.ui.accordion.prototype.options.animate = animate;
		}
	};
}
