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

	equal($(".ui-menu:visible").length, 0,	"After triggering a sub-menu, a click on a peer menu item should close the opened sub-menu");
});

test( "Cursor keys should move focus within the menu items", function() {
	expect( 6 );

	var element = $( "#bar1" ).menubar(),
		firstMenuItem = $( "#bar1 .ui-menubar-item .ui-button:first" ),
		nextLeftwardMenuElement = firstMenuItem.parent().siblings().last().children().eq( 0 );

	equal( element.find( ":tabbable" ).length, 1, "A Menubar should have 1 tabbable element on init." );
	firstMenuItem[ 0 ].focus();

	ok( firstMenuItem.hasClass( "ui-state-focus" ), "After a focus event, the first element should have the focus class." );
	$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );


	ok( !firstMenuItem.hasClass( "ui-state-focus" ), "After a keypress event, the first element, should no longer have the focus class." );
	ok( nextLeftwardMenuElement.hasClass( "ui-state-focus" ), "After a LEFT cursor event from  the first element, the last element should have focus." );
	equal( element.find( ":tabbable" ).length, 1, "A Menubar, after a cursor key action, should have 1 tabbable." );
	equal( element.find( ":tabbable" )[ 0 ], nextLeftwardMenuElement[ 0 ], "A Menubar, after a cursor key action, should have 1 tabbable." );

} );


})( jQuery );
