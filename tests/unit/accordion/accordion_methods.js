(function( $ ) {

module( "accordion: methods", accordion_setupTeardown() );

test( "destroy", function() {
	expect( 1 );
	domEqual( "#list1", function() {
		$( "#list1" ).accordion().accordion( "destroy" );
	});
});

test( "enable/disable", function() {
	expect( 3 );
	var element = $( "#list1" ).accordion();
	accordion_state( element, 1, 0, 0 );
	element.accordion( "disable" );
	element.accordion( "option", "active", 1 );
	accordion_state( element, 1, 0, 0 );
	element.accordion( "enable" );
	element.accordion( "option", "active", 1 );
	accordion_state( element, 0, 1, 0 );
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
	accordion_equalHeights( element, 246, 258 );

	element.parent().height( 500 );
	element.accordion( "refresh" );
	accordion_equalHeights( element, 446, 458 );
});

}( jQuery ) );
