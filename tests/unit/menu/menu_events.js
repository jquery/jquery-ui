(function( $ ) {

var log = TestHelpers.menu.log,
	logOutput = TestHelpers.menu.logOutput,
	click = TestHelpers.menu.click;

module( "menu: events", {
	setup: function() {
		TestHelpers.menu.clearLog();
	}
});

test( "handle click on menu", function() {
	expect( 1 );
	var menu = $( "#menu1" ).menu({
		select: function( event, ui ) {
			log();
		}
	});
	log( "click", true );
	click( $( "#menu1" ), "1" );
	log( "afterclick" );
	click( menu, "2" );
	click( $( "#menu1" ), "3" );
	click( menu, "1" );
	equal( logOutput(), "1,3,2,afterclick,1,click,", "Click order not valid." );
});

test( "handle click on custom item menu", function() {
	expect( 1 );
	var menu = $( "#menu5" ).menu({
		select: function( event, ui ) {
			log();
		},
		menus: "div"
	});
	log( "click", true );
	click( $( "#menu5" ), "1" );
	log( "afterclick" );
	click( menu, "2" );
	click( $( "#menu5" ), "3" );
	click( menu, "1" );
	equal( logOutput(), "1,3,2,afterclick,1,click,", "Click order not valid." );
});

asyncTest( "handle blur", function() {
	expect( 1 );
	var blurHandled = false,
		menu = $( "#menu1" ).menu({
			blur: function( event, ui ) {
				// Ignore duplicate blur event fired by IE
				if ( !blurHandled ) {
					blurHandled = true;
					equal( event.type, "menublur", "blur event.type is 'menublur'" );
				}
			}
		});

	click( menu, "1" );
	setTimeout( function() {
		menu.blur();
		start();
	}, 350 );
});

asyncTest( "handle blur on click", function() {
	expect( 1 );
	var blurHandled = false,
		menu = $( "#menu1" ).menu({
			blur: function( event, ui ) {
				// Ignore duplicate blur event fired by IE
				if ( !blurHandled ) {
					blurHandled = true;
					equal( event.type, "menublur", "blur event.type is 'menublur'" );
				}
			}
		});

	click( menu, "1" );
	setTimeout( function() {
		$( "<a>", { id: "remove"} ).appendTo( "body" ).trigger( "click" );
		start();
	}, 350 );
});

test( "handle focus of menu with active item", function() {
	expect( 1 );
	var element = $( "#menu1" ).menu({
		focus: function( event, ui ) {
			log( $( event.target ).find( ".ui-state-focus" ).parent().index() );
		}
	});

	log( "focus", true );
	element.focus();
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.focus();
	equal( logOutput(), "2,2,1,0,focus,", "current active item remains active" );
});

asyncTest( "handle submenu auto collapse: mouseleave", function() {
	expect( 4 );
	var menu = $( "#menu2" ).menu(),
		event = $.Event( "mouseenter" );

	function menumouseleave1() {
		equal( menu.find( "ul[aria-expanded='true']" ).length, 1, "first submenu expanded" );
		menu.menu( "focus", event, menu.find( "li:nth-child(7) li:first" ) );
		setTimeout( menumouseleave2, 350 );
	}
	function menumouseleave2() {
		equal( menu.find( "ul[aria-expanded='true']" ).length, 2, "second submenu expanded" );
		menu.find( "ul[aria-expanded='true']:first" ).trigger( "mouseleave" );
		setTimeout( menumouseleave3, 350 );
	}
	function menumouseleave3() {
		equal( menu.find( "ul[aria-expanded='true']" ).length, 1, "second submenu collapsed" );
		menu.trigger( "mouseleave" );
		setTimeout( menumouseleave4, 350 );
	}
	function menumouseleave4() {
		equal( menu.find( "ul[aria-expanded='true']" ).length, 0, "first submenu collapsed" );
		start();
	}

	menu.find( "li:nth-child(7)" ).trigger( "mouseenter" );
	setTimeout( menumouseleave1, 350 );
});

asyncTest( "handle submenu auto collapse: mouseleave", function() {
	expect( 4 );
	var menu = $( "#menu5" ).menu({ menus: "div" }),
		event = $.Event( "mouseenter" );

	function menumouseleave1() {
		equal( menu.find( "div[aria-expanded='true']" ).length, 1, "first submenu expanded" );
		menu.menu( "focus", event, menu.find( ":nth-child(7)" ).find( "div" ).eq( 0 ).children().eq( 0 ) );
		setTimeout( menumouseleave2, 350 );
	}
	function menumouseleave2() {
		equal( menu.find( "div[aria-expanded='true']" ).length, 2, "second submenu expanded" );
		menu.find( "div[aria-expanded='true']:first" ).trigger( "mouseleave" );
		setTimeout( menumouseleave3, 350 );
	}
	function menumouseleave3() {
		equal( menu.find( "div[aria-expanded='true']" ).length, 1, "second submenu collapsed" );
		menu.trigger( "mouseleave" );
		setTimeout( menumouseleave4, 350 );
	}
	function menumouseleave4() {
		equal( menu.find( "div[aria-expanded='true']" ).length, 0, "first submenu collapsed" );
		start();
	}

	menu.find( ":nth-child(7)" ).trigger( "mouseenter" );
	setTimeout( menumouseleave1, 350 );
});


test( "handle keyboard navigation on menu without scroll and without submenus", function() {
	expect( 12 );
	var element = $( "#menu1" ).menu({
		select: function( event, ui ) {
			log( $( ui.item[0] ).text() );
		},
		focus: function( event, ui ) {
			log( $( event.target ).find( ".ui-state-focus" ).parent().index() );
		}
	});

	log( "keydown", true );
	element.focus();
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal( logOutput(), "2,1,0,keydown,", "Keydown DOWN" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equal( logOutput(), "1,keydown,", "Keydown UP" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equal( logOutput(), "keydown,", "Keydown LEFT (no effect)" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equal( logOutput(), "keydown,", "Keydown RIGHT (no effect)" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equal( logOutput(), "4,keydown,", "Keydown PAGE_DOWN" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equal( logOutput(), "keydown,", "Keydown PAGE_DOWN (no effect)" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equal( logOutput(), "0,keydown,", "Keydown PAGE_UP" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equal( logOutput(), "keydown,", "Keydown PAGE_UP (no effect)" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
	equal( logOutput(), "4,keydown,", "Keydown END" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
	equal( logOutput(), "0,keydown,", "Keydown HOME" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	equal( logOutput(), "keydown,", "Keydown ESCAPE (no effect)" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	equal( logOutput(), "Aberdeen,keydown,", "Keydown ENTER" );
});

asyncTest( "handle keyboard navigation on menu without scroll and with submenus", function() {
	expect( 16 );
	var element = $( "#menu2" ).menu({
		select: function( event, ui ) {
			log( $( ui.item[0] ).text() );
		},
		focus: function( event, ui ) {
			log( $( event.target ).find( ".ui-state-focus" ).parent().index() );
		}
	});

	log( "keydown", true );
	element.one( "menufocus", function( event, ui ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equal( logOutput(), "2,1,keydown,", "Keydown DOWN" );
		setTimeout( menukeyboard1, 50 );
	});
	element.focus();

	function menukeyboard1() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		equal( logOutput(), "0,1,keydown,", "Keydown UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equal( logOutput(), "keydown,", "Keydown LEFT (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

		setTimeout(function() {
			equal( logOutput(), "0,4,3,2,1,keydown,", "Keydown RIGHT (open submenu)" );
			setTimeout( menukeyboard2, 50 );
		}, 50 );
	}

	function menukeyboard2() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equal( logOutput(), "4,keydown,", "Keydown LEFT (close submenu)" );

		// re-open submenu
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
		setTimeout( menukeyboard3, 50 );
	}

	function menukeyboard3() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		equal( logOutput(), "2,keydown,", "Keydown PAGE_DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		equal( logOutput(), "keydown,", "Keydown PAGE_DOWN (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal( logOutput(), "0,keydown,", "Keydown PAGE_UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal( logOutput(), "keydown,", "Keydown PAGE_UP (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
		equal( logOutput(), "2,keydown,", "Keydown END" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
		equal( logOutput(), "0,keydown,", "Keydown HOME" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		equal( logOutput(), "4,keydown,", "Keydown ESCAPE (close submenu)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.SPACE } );
		setTimeout( menukeyboard4, 50 );
	}

	function menukeyboard4() {
		equal( logOutput(), "0,keydown,", "Keydown SPACE (open submenu)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		equal( logOutput(), "4,keydown,", "Keydown ESCAPE (close submenu)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
		setTimeout( function() {
			element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
			setTimeout( function() {
				element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
				element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
				element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
				equal( logOutput(), "0,4,2,0,1,0,6,5,keydown,", "Keydown skip dividers and items without anchors" );

				log( "keydown", true );
				element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				setTimeout( menukeyboard6, 50 );
			}, 50 );
		}, 50 );
	}

	function menukeyboard6() {
		equal( logOutput(), "Ada,keydown,", "Keydown ENTER (open submenu)" );
		start();
	}
});

test( "handle keyboard navigation on menu with scroll and without submenus", function() {
	expect( 14 );
	var element = $( "#menu3" ).menu({
		select: function( event, ui ) {
			log( $( ui.item[0] ).text() );
		},
		focus: function( event, ui ) {
			log( $( event.target ).find( ".ui-state-focus" ).parent().index());
		}
	});

	log( "keydown", true );
	element.focus();
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal( logOutput(), "2,1,0,keydown,", "Keydown DOWN" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equal( logOutput(), "0,1,keydown,", "Keydown UP" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equal( logOutput(), "keydown,", "Keydown LEFT (no effect)" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equal( logOutput(), "keydown,", "Keydown RIGHT (no effect)" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equal( logOutput(), "10,keydown,", "Keydown PAGE_DOWN" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equal( logOutput(), "20,keydown,", "Keydown PAGE_DOWN" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equal( logOutput(), "10,keydown,", "Keydown PAGE_UP" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equal( logOutput(), "0,keydown,", "Keydown PAGE_UP" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equal( logOutput(), "keydown,", "Keydown PAGE_UP (no effect)" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
	equal( logOutput(), "37,keydown,", "Keydown END" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equal( logOutput(), "keydown,", "Keydown PAGE_DOWN (no effect)" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
	equal( logOutput(), "0,keydown,", "Keydown HOME" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	equal( logOutput(), "keydown,", "Keydown ESCAPE (no effect)" );

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	equal( logOutput(), "Aberdeen,keydown,", "Keydown ENTER" );
});

asyncTest( "handle keyboard navigation on menu with scroll and with submenus", function() {
	expect( 14 );
	var element = $( "#menu4" ).menu({
		select: function( event, ui ) {
			log( $( ui.item[0] ).text() );
		},
		focus: function( event, ui ) {
			log( $( event.target ).find( ".ui-state-focus" ).parent().index());
		}
	});

	log( "keydown", true );
	element.one( "menufocus", function( event, ui ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equal( logOutput(), "2,1,keydown,", "Keydown DOWN" );
		setTimeout( menukeyboard1, 50 );
	});
	element.focus();

	function menukeyboard1() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		equal( logOutput(), "0,1,keydown,", "Keydown UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equal( logOutput(), "keydown,", "Keydown LEFT (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

		setTimeout( function() {
			equal( logOutput(), "0,1,keydown,", "Keydown RIGHT (open submenu)" );
		}, 50 );
		setTimeout( menukeyboard2, 50 );
	}

	function menukeyboard2() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equal( logOutput(), "1,keydown,", "Keydown LEFT (close submenu)" );

		// re-open submenu
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
		setTimeout( menukeyboard3, 50 );
	}

	function menukeyboard3() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		equal( logOutput(), "10,keydown,", "Keydown PAGE_DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		equal( logOutput(), "20,keydown,", "Keydown PAGE_DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal( logOutput(), "10,keydown,", "Keydown PAGE_UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal( logOutput(), "0,keydown,", "Keydown PAGE_UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
		equal( logOutput(), "27,keydown,", "Keydown END" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
		equal( logOutput(), "0,keydown,", "Keydown HOME" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		equal( logOutput(), "1,keydown,", "Keydown ESCAPE (close submenu)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		setTimeout( menukeyboard4, 50 );
	}

	function menukeyboard4() {
		equal( logOutput(), "0,keydown,", "Keydown ENTER (open submenu)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		equal( logOutput(), "Aberdeen,keydown,", "Keydown ENTER (select item)" );

		start();
	}
});

asyncTest( "handle keyboard navigation and mouse click on menu with disabled items", function() {
	expect( 6 );
	var element = $( "#menu6" ).menu({
		select: function( event, ui ) {
			log( $( ui.item[0] ).text() );
		},
		focus: function( event, ui ) {
			log( $( event.target ).find( ".ui-state-focus" ).parent().index());
		}
	});

	log( "keydown", true );
	element.one( "menufocus", function( event, ui ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		equal( logOutput(), "1,keydown,", "Keydown focus but not select disabled item" );
		setTimeout( menukeyboard1, 50 );
	});
	element.focus();

	function menukeyboard1() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equal( logOutput(), "4,3,2,keydown,", "Keydown focus disabled item with submenu" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equal( logOutput(), "keydown,", "Keydown LEFT (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

		setTimeout( function() {
			equal( logOutput(), "keydown,", "Keydown RIGHT (no effect on disabled sub-menu)" );

			log( "keydown", true );
			element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );

			setTimeout( function() {
				equal( logOutput(), "keydown,", "Keydown ENTER (no effect on disabled sub-menu)" );
				log( "click", true );
				click( element, "1" );
				equal( logOutput(), "click,", "Click disabled item (no effect)" );
				start();
			}, 50 );
		}, 50 );
	}
});

test( "handle keyboard navigation with spelling of menu items", function() {
	expect( 2 );
	var element = $( "#menu2" ).menu({
		focus: function( event, ui ) {
			log( $( event.target ).find( ".ui-state-focus" ).parent().index() );
		}
	});

	log( "keydown", true );
	element.one( "menufocus", function( event, ui ) {
		element.simulate( "keydown", { keyCode: 65 } );
		element.simulate( "keydown", { keyCode: 68 } );
		element.simulate( "keydown", { keyCode: 68 } );
		equal( logOutput(), "3,1,0,keydown,", "Keydown focus Addyston by spelling the first 3 letters" );
		element.simulate( "keydown", { keyCode: 68 } );
		equal( logOutput(), "4,3,1,0,keydown,", "Keydown focus Delphi by repeating the 'd' again" );
	});
	element.focus();
});

asyncTest( "handle page up and page down before the menu has focus", function() {
	expect( 1 );
	var element = $( "#menu1" ).menu({
		focus: function( event, ui ) {
			log( $( event.target ).find( ".ui-state-focus" ).parent().index() );
		}
	});

	log( "keydown", true );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	element.blur();
	setTimeout( function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal( logOutput(), "0,0,keydown,", "Page Up and Page Down bring initial focus to first item" );
		start();
	}, 500 );
});

})( jQuery );
