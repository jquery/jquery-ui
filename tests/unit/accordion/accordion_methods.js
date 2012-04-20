(function( $ ) {

var equalHeights = TestHelpers.accordion.equalHeights,
	setupTeardown = TestHelpers.accordion.setupTeardown,
	state = TestHelpers.accordion.state;

module( "accordion: methods", setupTeardown() );

test( "destroy", function() {
	expect( 1 );
	domEqual( "#list1", function() {
		$( "#list1" ).accordion().accordion( "destroy" );
	});
});

test( "enable/disable", function() {
	expect( 4 );
	var element = $( "#list1" ).accordion();
	state( element, 1, 0, 0 );
	element.accordion( "disable" );
	// event does nothing
	element.find( ".ui-accordion-header" ).eq( 1 ).trigger( "click" );
	state( element, 1, 0, 0 );
	// option still works
	element.accordion( "option", "active", 1 );
	state( element, 0, 1, 0 );
	element.accordion( "enable" );
	element.accordion( "option", "active", 2 );
	state( element, 0, 0, 1 );
});

test( "refresh", function() {
	expect( 6 );
	var element = $( "#navigation" )
		.parent()
			.height( 300 )
		.end()
		.accordion({
			heightStyle: "fill"
		});
	equalHeights( element, 246, 258 );

	element.parent().height( 500 );
	element.accordion( "refresh" );
	equalHeights( element, 446, 458 );
});

}( jQuery ) );
