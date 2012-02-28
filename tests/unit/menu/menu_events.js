/*
 * menu_events.js
 */
(function($) {

module("menu: events");

test("handle click on menu", function() {
	expect(1);
	var menu = $('#menu1').menu({
		select: function(event, ui) {
			menu_log();
		}
	});
	menu_log("click",true);
	menu_click($('#menu1'),"1");
	menu_log("afterclick");
	menu_click( menu,"2");
	menu_click($('#menu1'),"3");
	menu_click( menu,"1");
	equal( $("#log").html(), "1,3,2,afterclick,1,click,", "Click order not valid.");
});

test("handle click on custom item menu", function() {
	expect(1);
	var menu = $('#menu5').menu({
		select: function(event, ui) {
			menu_log();
		},
		menus: "div"
	});
	menu_log("click",true);
	menu_click($('#menu5'),"1");
	menu_log("afterclick");
	menu_click( menu,"2");
	menu_click($('#menu5'),"3");
	menu_click( menu,"1");
	equal( $("#log").html(), "1,3,2,afterclick,1,click,", "Click order not valid.");
});

/*	Commenting out these tests until a way to handle the extra focus and blur events
	fired by IE is found
test( "handle blur: click", function() {
	expect( 4 );
	var $menu = $( "#menu1" ).menu({
		focus: function( event, ui ) {
			equal( event.originalEvent.type, "click", "focus triggered 'click'" );
			equal( event.type, "menufocus", "focus event.type is 'menufocus'" );

		},
		blur: function( event, ui ) {
			equal( event.originalEvent.type, "click", "blur triggered 'click'" );
			equal( event.type, "menublur", "blur event.type is 'menublur'" );
		}
	});

	$menu.find( "li a:first" ).trigger( "click" );
	$( "<a>", { id: "remove"} ).appendTo("body").trigger( "click" );

	$("#remove").remove();
});

test( "handle blur on custom item menu: click", function() {
	expect( 4 );
	var $menu = $( "#menu5" ).menu({
		focus: function( event, ui ) {
			equal( event.originalEvent.type, "click", "focus triggered 'click'" );
			equal( event.type, "menufocus", "focus event.type is 'menufocus'" );

		},
		blur: function( event, ui ) {
			equal( event.originalEvent.type, "click", "blur triggered 'click'" );
			equal( event.type, "menublur", "blur event.type is 'menublur'" );
		},
		items: "div"
	});

	menu_click($('#menu5'),"1");
	$( "<a>", { id: "remove"} ).appendTo("body").trigger( "click" );

	$("#remove").remove();
});
*/

asyncTest( "handle submenu auto collapse: mouseleave", function() {
	expect( 4 );
	var $menu = $( "#menu2" ).menu();

	$menu.find( "li:nth-child(7)" ).trigger( "mouseover" );
	setTimeout( menumouseleave1, 350 );

	function menumouseleave1() {
		equal( $menu.find( "ul[aria-expanded='true']" ).length, 1, "first submenu expanded" );
		$menu.find( "li:nth-child(7) li:first" ).trigger( "mouseover" );
		setTimeout( menumouseleave2, 350 );
	}
	function menumouseleave2() {
		equal( $menu.find( "ul[aria-expanded='true']" ).length, 2, "second submenu expanded" );
		$menu.find( "ul[aria-expanded='true']:first" ).trigger( "mouseleave" );
		setTimeout( menumouseleave3, 350 );
	}
	function menumouseleave3() {
		equal( $menu.find( "ul[aria-expanded='true']" ).length, 1, "second submenu collapsed" );
		$menu.trigger( "mouseleave" );
		setTimeout( menumouseleave4, 350 );
	}
	function menumouseleave4() {
		equal( $menu.find( "ul[aria-expanded='true']" ).length, 0, "first submenu collapsed" );
		start();
	}
});

asyncTest( "handle submenu auto collapse: mouseleave", function() {
	expect( 4 );
	var $menu = $( "#menu5" ).menu( { menus: "div" } );

	$menu.find( ":nth-child(7)" ).trigger( "mouseover" );
	setTimeout( menumouseleave1, 350 );

	function menumouseleave1() {
		equal( $menu.find( "div[aria-expanded='true']" ).length, 1, "first submenu expanded" );
		$menu.find( ":nth-child(7)" ).find( "div" ).eq( 0 ).children().eq( 0 ).trigger( "mouseover" );
		setTimeout( menumouseleave2, 350 );
	}
	function menumouseleave2() {
		equal( $menu.find( "div[aria-expanded='true']" ).length, 2, "second submenu expanded" );
		$menu.find( "div[aria-expanded='true']:first" ).trigger( "mouseleave" );
		setTimeout( menumouseleave3, 350 );
	}
	function menumouseleave3() {
		equal( $menu.find( "div[aria-expanded='true']" ).length, 1, "second submenu collapsed" );
		$menu.trigger( "mouseleave" );
		setTimeout( menumouseleave4, 350 );
	}
	function menumouseleave4() {
		equal( $menu.find( "div[aria-expanded='true']" ).length, 0, "first submenu collapsed" );
		start();
	}
});


test("handle keyboard navigation on menu without scroll and without submenus", function() {
	expect(12);
	var element = $('#menu1').menu({
		select: function(event, ui) {
			menu_log($(ui.item[0]).text());
		},
		focus: function( event, ui ) {
			menu_log($(event.target).find(".ui-state-focus").parent().index());
		}
	});

	menu_log("keydown",true);
	element.focus();
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal( $("#log").html(), "2,1,0,keydown,", "Keydown DOWN");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equal( $("#log").html(), "1,keydown,", "Keydown UP");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equal( $("#log").html(), "keydown,", "Keydown LEFT (no effect)");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equal( $("#log").html(), "keydown,", "Keydown RIGHT (no effect)");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equal( $("#log").html(), "4,keydown,", "Keydown PAGE_DOWN");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equal( $("#log").html(), "keydown,", "Keydown PAGE_DOWN (no effect)");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equal( $("#log").html(), "0,keydown,", "Keydown PAGE_UP");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equal( $("#log").html(), "keydown,", "Keydown PAGE_UP (no effect)");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
	equal( $("#log").html(), "4,keydown,", "Keydown END");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
	equal( $("#log").html(), "0,keydown,", "Keydown HOME");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	equal( $("#log").html(), "keydown,", "Keydown ESCAPE (no effect)");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	equal( $("#log").html(), "Aberdeen,keydown,", "Keydown ENTER");
});

asyncTest("handle keyboard navigation on menu without scroll and with submenus", function() {
	expect(14);
	var element = $('#menu2').menu({
		select: function(event, ui) {
			menu_log($(ui.item[0]).text());
		},
		focus: function( event, ui ) {
			menu_log($(event.target).find(".ui-state-focus").parent().index());
		}
	});

	menu_log("keydown",true);
	element.one( "menufocus", function( event, ui ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equal( $("#log").html(), "2,1,keydown,", "Keydown DOWN");
		setTimeout( menukeyboard1, 50 );
	});
	element.focus();

	function menukeyboard1() {
		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		equal( $("#log").html(), "0,1,keydown,", "Keydown UP");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equal( $("#log").html(), "keydown,", "Keydown LEFT (no effect)");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

		setTimeout( function() {
			equal( $("#log").html(), "0,4,3,2,1,keydown,", "Keydown RIGHT (open submenu)");
		}, 50);
		setTimeout( menukeyboard2, 50 );
	}

	function menukeyboard2() {
		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equal( $("#log").html(), "4,keydown,", "Keydown LEFT (close submenu)");

		//re-open submenu
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
		setTimeout( menukeyboard3, 50 );
	}

	function menukeyboard3() {
		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		equal( $("#log").html(), "2,keydown,", "Keydown PAGE_DOWN");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		equal( $("#log").html(), "keydown,", "Keydown PAGE_DOWN (no effect)");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal( $("#log").html(), "0,keydown,", "Keydown PAGE_UP");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal( $("#log").html(), "keydown,", "Keydown PAGE_UP (no effect)");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
		equal( $("#log").html(), "2,keydown,", "Keydown END");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
		equal( $("#log").html(), "0,keydown,", "Keydown HOME");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		equal( $("#log").html(), "4,keydown,", "Keydown ESCAPE (close submenu)");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		setTimeout( menukeyboard4, 50 );
	}

	function menukeyboard4() {
		equal( $("#log").html(), "0,keydown,", "Keydown ENTER (open submenu)");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		equal( $("#log").html(), "Ada,keydown,", "Keydown ENTER (select item)");

		start();
	}
});

test("handle keyboard navigation on menu with scroll and without submenus", function() {
	expect(14);
	var element = $('#menu3').menu({
		select: function(event, ui) {
			menu_log($(ui.item[0]).text());
		},
		focus: function( event, ui ) {
			menu_log($(event.target).find(".ui-state-focus").parent().index());
		}
	});

	menu_log("keydown",true);
	element.focus();
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal( $("#log").html(), "2,1,0,keydown,", "Keydown DOWN");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equal( $("#log").html(), "0,1,keydown,", "Keydown UP");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equal( $("#log").html(), "keydown,", "Keydown LEFT (no effect)");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equal( $("#log").html(), "keydown,", "Keydown RIGHT (no effect)");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equal( $("#log").html(), "10,keydown,", "Keydown PAGE_DOWN");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equal( $("#log").html(), "20,keydown,", "Keydown PAGE_DOWN");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equal( $("#log").html(), "10,keydown,", "Keydown PAGE_UP");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equal( $("#log").html(), "0,keydown,", "Keydown PAGE_UP");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equal( $("#log").html(), "keydown,", "Keydown PAGE_UP (no effect)");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
	equal( $("#log").html(), "37,keydown,", "Keydown END");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equal( $("#log").html(), "keydown,", "Keydown PAGE_DOWN (no effect)");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
	equal( $("#log").html(), "0,keydown,", "Keydown HOME");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	equal( $("#log").html(), "keydown,", "Keydown ESCAPE (no effect)");

	menu_log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	equal( $("#log").html(), "Aberdeen,keydown,", "Keydown ENTER");
});

asyncTest("handle keyboard navigation on menu with scroll and with submenus", function() {
	expect(14);
	var element = $('#menu4').menu({
		select: function(event, ui) {
			menu_log($(ui.item[0]).text());
		},
		focus: function( event, ui ) {
			menu_log($(event.target).find(".ui-state-focus").parent().index());
		}
	});

	menu_log("keydown",true);
	element.one( "menufocus", function( event, ui ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equal( $("#log").html(), "2,1,keydown,", "Keydown DOWN");
		setTimeout( menukeyboard1, 50 );
	});
	element.focus();


	function menukeyboard1() {
		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		equal( $("#log").html(), "0,1,keydown,", "Keydown UP");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equal( $("#log").html(), "keydown,", "Keydown LEFT (no effect)");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

		setTimeout( function() {
			equal( $("#log").html(), "0,1,keydown,", "Keydown RIGHT (open submenu)");
		}, 50);
		setTimeout( menukeyboard2, 50 );
	}

	function menukeyboard2() {
		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equal( $("#log").html(), "1,keydown,", "Keydown LEFT (close submenu)");

		//re-open submenu
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
		setTimeout( menukeyboard3, 50 );
	}

	function menukeyboard3() {
		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		equal( $("#log").html(), "10,keydown,", "Keydown PAGE_DOWN");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		equal( $("#log").html(), "20,keydown,", "Keydown PAGE_DOWN");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal( $("#log").html(), "10,keydown,", "Keydown PAGE_UP");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal( $("#log").html(), "0,keydown,", "Keydown PAGE_UP");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
		equal( $("#log").html(), "27,keydown,", "Keydown END");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
		equal( $("#log").html(), "0,keydown,", "Keydown HOME");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
		equal( $("#log").html(), "1,keydown,", "Keydown ESCAPE (close submenu)");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		setTimeout( menukeyboard4, 50 );
	}

	function menukeyboard4() {
		equal( $("#log").html(), "0,keydown,", "Keydown ENTER (open submenu)");

		menu_log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		equal( $("#log").html(), "Aberdeen,keydown,", "Keydown ENTER (select item)");

		start();
	}
});

})(jQuery);
