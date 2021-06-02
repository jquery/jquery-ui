define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/menu"
], function( QUnit, $, helper, testHelper ) {
"use strict";

var log = testHelper.log,
	logOutput = testHelper.logOutput,
	click = testHelper.click;

QUnit.module( "menu: events", {
	beforeEach: function() {
		testHelper.clearLog();
	},
	afterEach: helper.moduleAfterEach
} );

QUnit.test( "handle click on menu", function( assert ) {
	assert.expect( 1 );
	var element = $( "#menu1" ).menu( {
		select: function() {
			log();
		}
	} );
	log( "click", true );
	click( element, "1" );
	log( "afterclick" );
	click( element, "2" );
	click( element, "3" );
	click( element, "1" );
	assert.equal( logOutput(), "click,1,afterclick,2,3,1", "Click order not valid." );
} );

QUnit.test( "handle click on custom item menu", function( assert ) {
	assert.expect( 1 );
	var element = $( "#menu5" ).menu( {
		select: function() {
			log();
		},
		menus: ".menu"
	} );
	log( "click", true );
	click( element, "1" );
	log( "afterclick" );
	click( element, "2" );
	click( element, "3" );
	click( element, "1" );
	assert.equal( logOutput(), "click,1,afterclick,2,3,1", "Click order not valid." );
} );

QUnit.test( "handle blur", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var blurHandled = false,
		index = 1,
		element = $( "#menu1" ).menu( {
			blur: function( event, ui ) {

				// Ignore duplicate blur event fired by IE
				if ( !blurHandled ) {
					blurHandled = true;
					assert.equal( event.type, "menublur", "blur event.type is 'menublur'" );
					assert.strictEqual( ui.item[ 0 ], element.children()[ index ], "ui.item" );
				}
			}
		} );

	click( element, index );
	setTimeout( function() {
		element.trigger( "blur" );
		setTimeout( function() {
			ready();
		}, 350 );
	} );
} );

QUnit.test( "handle blur via click outside", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var blurHandled = false,
		index = 1,
		element = $( "#menu1" ).menu( {
			blur: function( event, ui ) {

				// Ignore duplicate blur event fired by IE
				if ( !blurHandled ) {
					blurHandled = true;
					assert.equal( event.type, "menublur", "blur event.type is 'menublur'" );
					assert.strictEqual( ui.item[ 0 ], element.children()[ index ], "ui.item" );
				}
			}
		} );

	click( element, index );
	setTimeout( function() {
		$( "<a>", { id: "remove" } ).appendTo( "body" ).trigger( "click" );
		setTimeout( function() {
			ready();
		}, 350 );
	} );
} );

QUnit.test( "handle focus of menu with active item", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	var element = $( "#menu1" ).menu( {
		focus: function( event ) {
			log( $( event.target ).find( ".ui-menu-item-wrapper.ui-state-active" ).parent().index() );
		}
	} );

	log( "focus", true );
	element[ 0 ].focus();
	setTimeout( function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element[ 0 ].blur();
		setTimeout( function() {
			element[ 0 ].focus();
			setTimeout( function() {
				assert.equal( logOutput(), "focus,0,1,2,2", "current active item remains active" );
				ready();
			} );
		} );
	} );
} );

QUnit.test( "handle mouseenter on nested menu item", function( assert ) {
	assert.expect( 8 );
	$.ui.menu.prototype.delay = 1;
	var activeItem,
		done = assert.async(),
		element = $( "#menu2" ).menu();

	element
		.menu( "previous" )
		.menu( "expand" );

	function checkSubmenus() {
		assert.equal( element.find( "ul[aria-expanded='true']" ).length, 2, "both submenus expanded" );
	}
	function menumouseenter1() {
		element.menu( "expand" );
		setTimeout( menumouseenter2, 25 );
	}
	function menumouseenter2() {
		checkSubmenus();
		activeItem = $( "#" + element.attr( "aria-activedescendant" ) );
		assert.hasClasses( activeItem, "ui-state-active" );
		activeItem.trigger( "mouseleave" );
		setTimeout( menumouseenter3, 25 );
	}
	function menumouseenter3() {
		checkSubmenus();
		assert.lacksClasses( activeItem, "ui-state-active" );
		activeItem.trigger( "mouseenter" );
		setTimeout( menumouseenter4, 25 );
	}
	function menumouseenter4() {
		checkSubmenus();
		activeItem.parents( ".ui-menu-item" ).each( function( index, item ) {
			assert.hasClasses( $( item ).children( ".ui-menu-item-wrapper" ), "ui-state-active" );
		} );
		$.ui.menu.prototype.delay = 300;
		done();
	}
	setTimeout( menumouseenter1, 25 );
} );

QUnit.test( "handle submenu auto collapse: mouseleave, default markup", function( assert ) {
	var ready = assert.async();
	assert.expect( 4 );
	$.ui.menu.prototype.delay = 1;
	var element = $( "#menu2" ).menu(),
		event = $.Event( "mouseenter" );

	function menumouseleave1() {
		assert.equal( element.find( "ul[aria-expanded='true']" ).length, 1, "first submenu expanded" );
		element.menu( "focus", event, element.find( "li:nth-child(7) li" ).first() );
		setTimeout( menumouseleave2, 25 );
	}
	function menumouseleave2() {
		assert.equal( element.find( "ul[aria-expanded='true']" ).length, 2, "second submenu expanded" );
		element.find( "ul[aria-expanded='true']" ).first().trigger( "mouseleave" );
		setTimeout( menumouseleave3, 25 );
	}
	function menumouseleave3() {
		assert.equal( element.find( "ul[aria-expanded='true']" ).length, 1, "second submenu collapsed" );
		element.trigger( "mouseleave" );
		setTimeout( menumouseleave4, 25 );
	}
	function menumouseleave4() {
		assert.equal( element.find( "ul[aria-expanded='true']" ).length, 0, "first submenu collapsed" );
		$.ui.menu.prototype.delay = 300;
		ready();
	}

	element.find( "li:nth-child(7)" ).trigger( "mouseenter" );
	setTimeout( menumouseleave1, 25 );
} );

QUnit.test( "handle submenu auto collapse: mouseleave, custom markup", function( assert ) {
	var ready = assert.async();
	assert.expect( 4 );
	$.ui.menu.prototype.delay = 1;
	var element = $( "#menu5" ).menu( { menus: ".menu" } ),
		event = $.Event( "mouseenter" );

	function menumouseleave1() {
		assert.equal( element.find( "div[aria-expanded='true']" ).length, 1, "first submenu expanded" );
		element.menu( "focus", event, element.find( ":nth-child(7)" ).find( ".menu" ).eq( 0 ).children().eq( 0 ) );
		setTimeout( menumouseleave2, 25 );
	}
	function menumouseleave2() {
		assert.equal( element.find( "div[aria-expanded='true']" ).length, 2, "second submenu expanded" );
		element.find( "div[aria-expanded='true']" ).first().trigger( "mouseleave" );
		setTimeout( menumouseleave3, 25 );
	}
	function menumouseleave3() {
		assert.equal( element.find( "div[aria-expanded='true']" ).length, 1, "second submenu collapsed" );
		element.trigger( "mouseleave" );
		setTimeout( menumouseleave4, 25 );
	}
	function menumouseleave4() {
		assert.equal( element.find( "div[aria-expanded='true']" ).length, 0, "first submenu collapsed" );
		$.ui.menu.prototype.delay = 300;
		ready();
	}

	element.find( ":nth-child(7)" ).trigger( "mouseenter" );
	setTimeout( menumouseleave1, 25 );
} );

QUnit.test( "handle keyboard navigation on menu without scroll and without submenus", function( assert ) {
	var ready = assert.async();
	assert.expect( 12 );
	var element = $( "#menu1" ).menu( {
		select: function( event, ui ) {
			log( $( ui.item[ 0 ] ).text() );
		},
		focus: function( event ) {
			log( $( event.target ).find( ".ui-menu-item-wrapper.ui-state-active" ).parent().index() );
		}
	} );

	log( "keydown", true );
	element[ 0 ].focus();
	setTimeout( function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		assert.equal( logOutput(), "keydown,0,1,2", "Keydown DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		assert.equal( logOutput(), "keydown,1", "Keydown UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		assert.equal( logOutput(), "keydown", "Keydown LEFT (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
		assert.equal( logOutput(), "keydown", "Keydown RIGHT (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( logOutput(), "keydown,4", "Keydown PAGE_DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( logOutput(), "keydown", "Keydown PAGE_DOWN (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( logOutput(), "keydown,0", "Keydown PAGE_UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( logOutput(), "keydown", "Keydown PAGE_UP (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
		assert.equal( logOutput(), "keydown,4", "Keydown END" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
		assert.equal( logOutput(), "keydown,0", "Keydown HOME" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		assert.equal( logOutput(), "keydown", "Keydown ESCAPE (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		assert.equal( logOutput(), "keydown,Aberdeen", "Keydown ENTER" );

		ready();
	} );
} );

QUnit.test( "handle keyboard navigation on menu without scroll and with submenus", function( assert ) {
	var ready = assert.async();
	assert.expect( 16 );
	var element = $( "#menu2" ).menu( {
		select: function( event, ui ) {
			log( $( ui.item[ 0 ] ).text() );
		},
		focus: function( event ) {
			log( $( event.target ).find( ".ui-menu-item-wrapper.ui-state-active" ).last().parent().index() );
		}
	} );

	log( "keydown", true );
	element.one( "menufocus", function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		assert.equal( logOutput(), "keydown,1,2", "Keydown DOWN" );
		setTimeout( menukeyboard1 );
	} );
	element.trigger( "focus" );

	function menukeyboard1() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		assert.equal( logOutput(), "keydown,1,0", "Keydown UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		assert.equal( logOutput(), "keydown", "Keydown LEFT (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

		setTimeout( function() {
			assert.equal( logOutput(), "keydown,1,2,3,4,0", "Keydown RIGHT (open submenu)" );
			setTimeout( menukeyboard2 );
		} );
	}

	function menukeyboard2() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		assert.equal( logOutput(), "keydown,4", "Keydown LEFT (close submenu)" );

		// Re-open submenu
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
		setTimeout( menukeyboard3 );
	}

	function menukeyboard3() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( logOutput(), "keydown,2", "Keydown PAGE_DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( logOutput(), "keydown", "Keydown PAGE_DOWN (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( logOutput(), "keydown,0", "Keydown PAGE_UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( logOutput(), "keydown", "Keydown PAGE_UP (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
		assert.equal( logOutput(), "keydown,2", "Keydown END" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
		assert.equal( logOutput(), "keydown,0", "Keydown HOME" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		assert.equal( logOutput(), "keydown,4", "Keydown ESCAPE (close submenu)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.SPACE } );
		setTimeout( menukeyboard4 );
	}

	function menukeyboard4() {
		assert.equal( logOutput(), "keydown,0", "Keydown SPACE (open submenu)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		assert.equal( logOutput(), "keydown,4", "Keydown ESCAPE (close submenu)" );

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
				assert.equal( logOutput(), "keydown,5,6,0,1,0,2,4,0", "Keydown skip dividers" );

				log( "keydown", true );
				element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				setTimeout( menukeyboard6 );
			} );
		} );
	}

	function menukeyboard6() {
		assert.equal( logOutput(), "keydown,Ada", "Keydown ENTER (open submenu)" );
		ready();
	}
} );

QUnit.test( "handle keyboard navigation on menu with scroll and without submenus", function( assert ) {
	var ready = assert.async();
	assert.expect( 14 );
	var element = $( "#menu3" ).menu( {
		select: function( event, ui ) {
			log( $( ui.item[ 0 ] ).text() );
		},
		focus: function( event ) {
			log( $( event.target ).find( ".ui-menu-item-wrapper.ui-state-active" ).last().parent().index() );
		}
	} );

	log( "keydown", true );
	element[ 0 ].focus();
	setTimeout( function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		assert.equal( logOutput(), "keydown,0,1,2", "Keydown DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		assert.equal( logOutput(), "keydown,1,0", "Keydown UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		assert.equal( logOutput(), "keydown", "Keydown LEFT (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
		assert.equal( logOutput(), "keydown", "Keydown RIGHT (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( logOutput(), "keydown,17", "Keydown PAGE_DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( logOutput(), "keydown,34", "Keydown PAGE_DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( logOutput(), "keydown,17", "Keydown PAGE_UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( logOutput(), "keydown,0", "Keydown PAGE_UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( logOutput(), "keydown", "Keydown PAGE_UP (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
		assert.equal( logOutput(), "keydown,37", "Keydown END" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( logOutput(), "keydown", "Keydown PAGE_DOWN (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
		assert.equal( logOutput(), "keydown,0", "Keydown HOME" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		assert.equal( logOutput(), "keydown", "Keydown ESCAPE (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		assert.equal( logOutput(), "keydown,Aberdeen", "Keydown ENTER" );

		ready();
	} );
} );

QUnit.test( "handle keyboard navigation on menu with scroll and with submenus", function( assert ) {
	var ready = assert.async();
	assert.expect( 14 );
	var element = $( "#menu4" ).menu( {
		select: function( event, ui ) {
			log( $( ui.item[ 0 ] ).text() );
		},
		focus: function( event ) {
			log( $( event.target ).find( ".ui-menu-item-wrapper.ui-state-active" ).last().parent().index() );
		}
	} );

	log( "keydown", true );
	element.one( "menufocus", function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		assert.equal( logOutput(), "keydown,1,2", "Keydown DOWN" );
		setTimeout( menukeyboard1 );
	} );
	element.trigger( "focus" );

	function menukeyboard1() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		assert.equal( logOutput(), "keydown,1,0", "Keydown UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		assert.equal( logOutput(), "keydown", "Keydown LEFT (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

		setTimeout( function() {
			assert.equal( logOutput(), "keydown,1,0", "Keydown RIGHT (open submenu)" );
		}, 50 );
		setTimeout( menukeyboard2, 50 );
	}

	function menukeyboard2() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		assert.equal( logOutput(), "keydown,1", "Keydown LEFT (close submenu)" );

		// Re-open submenu
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
		setTimeout( menukeyboard3, 50 );
	}

	function menukeyboard3() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( logOutput(), "keydown,17", "Keydown PAGE_DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( logOutput(), "keydown,27", "Keydown PAGE_DOWN" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( logOutput(), "keydown,10", "Keydown PAGE_UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( logOutput(), "keydown,0", "Keydown PAGE_UP" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
		assert.equal( logOutput(), "keydown,27", "Keydown END" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
		assert.equal( logOutput(), "keydown,0", "Keydown HOME" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		assert.equal( logOutput(), "keydown,1", "Keydown ESCAPE (close submenu)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		setTimeout( menukeyboard4, 50 );
	}

	function menukeyboard4() {
		assert.equal( logOutput(), "keydown,0", "Keydown ENTER (open submenu)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		assert.equal( logOutput(), "keydown,Aberdeen", "Keydown ENTER (select item)" );

		ready();
	}
} );

QUnit.test( "handle keyboard navigation and mouse click on menu with disabled items", function( assert ) {
	var ready = assert.async();
	assert.expect( 6 );
	var element = $( "#menu6" ).menu( {
		select: function( event, ui ) {
			log( $( ui.item[ 0 ] ).text() );
		},
		focus: function( event ) {
			log( $( event.target ).find( ".ui-menu-item-wrapper.ui-state-active" ).parent().index() );
		}
	} );

	log( "keydown", true );
	element.one( "menufocus", function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		assert.equal( logOutput(), "keydown,1", "Keydown focus but not select disabled item" );
		setTimeout( menukeyboard1, 50 );
	} );
	element.trigger( "focus" );

	function menukeyboard1() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		assert.equal( logOutput(), "keydown,2,3,4", "Keydown focus disabled item with submenu" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		assert.equal( logOutput(), "keydown", "Keydown LEFT (no effect)" );

		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

		setTimeout( function() {
			assert.equal( logOutput(), "keydown", "Keydown RIGHT (no effect on disabled sub-menu)" );

			log( "keydown", true );
			element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );

			setTimeout( function() {
				assert.equal( logOutput(), "keydown", "Keydown ENTER (no effect on disabled sub-menu)" );
				log( "click", true );
				click( element, "1" );
				assert.equal( logOutput(), "click", "Click disabled item (no effect)" );
				ready();
			}, 50 );
		}, 50 );
	}
} );

QUnit.test( "handle keyboard navigation and mouse click on menu with dividers and group labels", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var element = $( "#menu7" ).menu( {
		items: "> :not('.ui-menu-group')",
		select: function( event, ui ) {
			log( $( ui.item[ 0 ] ).text() );
		},
		focus: function( event ) {
			log( $( event.target ).find( ".ui-menu-item-wrapper.ui-state-active" ).parent().index() );
		}
	} );

	log( "keydown", true );
	element.one( "menufocus", function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		assert.equal( logOutput(), "keydown,2,Ada", "Keydown skips initial group label" );
		setTimeout( menukeyboard1, 50 );
	} );
	element.trigger( "focus" );

	function menukeyboard1() {
		log( "keydown", true );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		assert.equal( logOutput(), "keydown,1,2,3,4,7", "Keydown focus skips divider and group label" );
		ready();
	}
} );

QUnit.test( "handle keyboard navigation with spelling of menu items", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );
	var element = $( "#menu2" ).menu( {
		focus: function( event ) {
			log( $( event.target ).find( ".ui-menu-item-wrapper.ui-state-active" ).parent().index() );
		}
	} );

	log( "keydown", true );
	element.one( "menufocus", function() {
		element.simulate( "keydown", { keyCode: 65 } );
		element.simulate( "keydown", { keyCode: 68 } );
		element.simulate( "keydown", { keyCode: 68 } );
		assert.equal( logOutput(), "keydown,0,1,3", "Keydown focus Addyston by spelling the first 3 letters" );
		element.simulate( "keydown", { keyCode: 68 } );
		assert.equal( logOutput(), "keydown,0,1,3,4", "Keydown focus Delphi by repeating the 'd' again" );
		element.simulate( "keydown", { keyCode: 83 } );
		assert.equal( logOutput(), "keydown,0,1,3,4,5", "Keydown focus Saarland ignoring leading space" );
		ready();
	} );
	element[ 0 ].focus();
} );

QUnit.test( "Keep focus on selected item (see #10644)", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	var element = $( "#menu2" ).menu( {
		focus: function( event ) {
			log( $( event.target ).find( ".ui-menu-item-wrapper.ui-state-active" ).parent().index() );
		}
	} );

	log( "keydown", true );
	element.one( "menufocus", function() {
		element.simulate( "keydown", { keyCode: 65 } );
		element.simulate( "keydown", { keyCode: 68 } );
		element.simulate( "keydown", { keyCode: 68 } );
		element.simulate( "keydown", { keyCode: 89 } );
		element.simulate( "keydown", { keyCode: 83 } );
		assert.equal( logOutput(), "keydown,0,1,3,3,3",
			"Focus stays on 'Addyston', even after other options are eliminated" );
		ready();
	} );
	element[ 0 ].focus();
} );

QUnit.test( "#9469: Stopping propagation in a select event should not suppress subsequent select events.", function( assert ) {
	assert.expect( 1 );
	var element = $( "#menu1" ).menu( {
		select: function( event ) {
			log();
			event.stopPropagation();
		}
	} );

	click( element, "1" );
	click( element, "2" );

	assert.equal( logOutput(), "1,2", "Both select events were not triggered." );
} );

QUnit.test( "#10571: When typing in a menu, only menu-items should be focused", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );

	var element = $( "#menu8" ).menu( {
		focus: function( event, ui ) {
			assert.equal( ui.item.length, 1, "There should only be one match when filtering" );
			assert.hasClasses( ui.item, "ui-menu-item" );
			assert.equal( ui.item.text(), "-Saarland", "element has correct text" );
		}
	} );

	setTimeout( function() {
		element.menu( "widget" ).simulate( "keydown", { keyCode: "-".charCodeAt( 0 ) } );
		ready();
	} );
} );

QUnit.test( "#15157: Must not focus menu dividers with the keyboard", function( assert ) {
	var ready = assert.async();
	assert.expect( 6 );

	var element = $( "#menu-with-dividers" ).menu( {
		focus: function( event, ui ) {
			assert.hasClasses( ui.item, "ui-menu-item", "Should have menu item class" );
			log( ui.item.text() );
		}
	} );

	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	setTimeout( function() {
		assert.equal( logOutput(), "beginning,middle,end,beginning,end", "Should wrap around items" );
		ready();
	} );
} );

} );
