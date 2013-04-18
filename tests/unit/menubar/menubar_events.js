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

test ( "_findNextFocusableTarget should find one and only one item", function() {
	expect(2);

	var element = $("#bar1").menubar(),
		menubarWidget = element.data( "ui-menubar" ),
		firstMenuItem = $( "#bar1 .ui-menubar-item" ).eq( 0 ),
		expectedFocusableTarget = $("#bar1 .ui-menubar-item .ui-widget").eq( 0 ),
		result = menubarWidget._findNextFocusableTarget( firstMenuItem );

  equal( expectedFocusableTarget[0], result[0], "_findNextFocusableTarget should return the focusable element underneath the menuItem" );
	equal( 1, result.length, "One and only one item should be returned." );
});

asyncTest( "TAB order should be sane mirroring dialog's test", function() {
	expect( 3 );

	var element = $( "#bar1" ).menubar(),
		firstMenuItem = $( "#bar1 .ui-menubar-item .ui-button:first" );

	function checkTab() {
		setTimeout( start );
		ok( !firstMenuItem.hasClass( "ui-state-focus" ), "The manually focused item should no longer have focus after TAB" );
		//setTimeout( start );
	}

	firstMenuItem[ 0 ].focus();
	ok( $( firstMenuItem ).hasClass( "ui-state-focus" ), "Should have focus class" );

	setTimeout(function() {
		equal( document.activeElement, firstMenuItem[0], "Focus set on first menuItem" );
		$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB } );
		setTimeout( checkTab );
	})

} );

asyncTest( "TAB order should be sane", function() {
	expect( 3 );


	var element = $( "#bar1" ).menubar(),
		debugDelay = 0,
		firstMenuItem = $( "#bar1 .ui-menubar-item .ui-button:first" );

	/* Make the qunit fixture visible if we're debugging this test*/
  if ( debugDelay ) {
		$('<link rel="stylesheet" href="../../../themes/base/jquery.ui.all.css" />').appendTo("head");
		$( "#qunit-fixture" ).css({ right: "300px", top: "300px", left:0 });
	}

	setTimeout(function(){
		firstMenuItem[ 0 ].focus();

		function postFocus(){
			ok( !firstMenuItem.hasClass( "ui-state-focus" ), "The manually focused item should no longer have focus after TAB" );
			setTimeout( start );
		};

		setTimeout(function() {
			ok( firstMenuItem.hasClass( "ui-state-focus" ), "Should have focus class" );
			equal( document.activeElement, firstMenuItem, "Focus set on first menuItem" );
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB } );
			setTimeout( postFocus );
		});

	}, debugDelay );

} );


})( jQuery );
