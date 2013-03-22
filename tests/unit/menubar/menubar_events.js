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

test( "hover over a menu item with no sub-menu should close open menu", function() {
	expect( 2 );

	var element = $("#bar1").menubar(),
		links = $("#bar1 > li a"),
		menuItemWithDropdown = links.eq(1),
		menuItemWithoutDropdown = links.eq(0);

	menuItemWithDropdown.trigger("click");
	menuItemWithoutDropdown.trigger("mouseenter");

	equal($(".ui-menu:visible").length, 0, "After triggering a sub-menu, a mouseenter on a peer menu item should close the opened sub-menu");

	menuItemWithDropdown.trigger("click");
	menuItemWithoutDropdown.trigger("click");

	equal($(".ui-menu:visible").length, 0,  "After triggering a sub-menu, a click on a peer menu item should close the opened sub-menu");
});

})( jQuery );
