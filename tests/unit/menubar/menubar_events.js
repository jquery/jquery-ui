(function( $ ) {

var log = TestHelpers.menubar.log,
	logOutput = TestHelpers.menubar.logOutput,
	click = TestHelpers.menubar.click;

module( "menubar: events", {
	setup: function() {
		TestHelpers.menubar.clearLog();
	}
});

test( "handle click on menu item", function() {
	expect( 1 );
	var element = $( "#bar1" ).menubar({
		select: function( event, ui ) {
			log();
		}
	});

	log( "click", true );
	click( element, "1", "2" );
	log( "afterclick" );
	click( element, "2", "1" );
	click( $( "#bar1" ), "3", "3" );
	click( element, "1", "2" );
	equal( logOutput(), "click,(1,2),afterclick,(2,1),(3,3),(1,2)", "Click order not valid." );
});

})( jQuery );
