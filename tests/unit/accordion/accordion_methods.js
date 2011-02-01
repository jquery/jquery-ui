(function( $ ) {

module( "accordion: methods", accordionSetupTeardown() );

test( "destroy", function() {
	var beforeHtml = $( "#list1" )
		.find( "div" )
			.css( "font-style", "normal" )
		.end()
		.parent()
			.html();
	var afterHtml = $( "#list1" )
		.accordion()
		.accordion( "destroy" )
		.parent()
			.html()
			// Opera 9 outputs role="" instead of removing the attribute like everyone else
			.replace( / role=""/g, "" );
	equal( afterHtml, beforeHtml );
});

test( "enable/disable", function() {
	var accordion = $('#list1').accordion();
	state( accordion, 1, 0, 0 );
	accordion.accordion( "disable" );
	accordion.accordion( "option", "active", 1 );
	state( accordion, 1, 0, 0 );
	accordion.accordion( "enable" );
	accordion.accordion( "option", "active", 1 );
	state( accordion, 0, 1, 0 );
});

test( "refresh", function() {
	var expected = $( "#navigation" )
		.parent()
			.height( 300 )
		.end()
		.accordion({
			heightStyle: "fill"
		});
	equalHeights( expected, 246, 258 );

	expected.parent().height( 500 );
	expected.accordion( "refresh" );
	equalHeights( expected, 446, 458 );
});

}( jQuery ) );
