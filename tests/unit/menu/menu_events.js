/*
 * menu_events.js
 */
(function($) {

module("menu: events");

test("handle click on menu", function() {
	expect(1);
	var ac = $('#menu1').menu({
		select: function(event, ui) {
			log();
		}
	});
	log("click",true);
	clickMenu($('#menu1'),"1");
	log("afterclick");
	clickMenu( ac,"2");
	clickMenu($('#menu1'),"3");
	clickMenu( ac,"1");
	equals( $("#log").html(), "1,3,2,afterclick,1,click,", "Click order not valid.");
});

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
	$( "<a/>", { id: "remove"} ).appendTo("body").trigger( "click" );

	$("#remove").remove();
});

asyncTest( "handle submenu auto collapse: mouseleave", function() {
	expect( 4 );
	var $menu = $( "#menu2" ).menu();

	$menu.find( "li:nth-child(7)" ).trigger( "mouseover" );
	setTimeout(function() {
		equal( $menu.find( "ul[aria-expanded='true']" ).length, 1, "first submenu expanded" );
		$menu.find( "li:nth-child(7) li:first" ).trigger( "mouseover" );
		setTimeout(function() {
			equal( $menu.find( "ul[aria-expanded='true']" ).length, 2, "second submenu expanded" );
			$menu.find( "ul[aria-expanded='true']:first" ).trigger( "mouseleave" );
			equal( $menu.find( "ul[aria-expanded='true']" ).length, 1, "second submenu collapsed" );
			$menu.trigger( "mouseleave" );
			equal( $menu.find( "ul[aria-expanded='true']" ).length, 0, "first submenu collapsed" );
			start();
		}, 400);
	}, 200);
});

test("handle keyboard navigation on menu without scroll and without submenus", function() {
	expect(12);
	var element = $('#menu1').menu({
		select: function(event, ui) {
			log($(ui.item[0]).text());
		},
		focus: function( event, ui ) {
			log($(event.target).find(".ui-state-focus").parent().index());
		}
	});

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equals( $("#log").html(), "1,0,keydown,", "Keydown DOWN");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equals( $("#log").html(), "0,keydown,", "Keydown UP");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equals( $("#log").html(), "keydown,", "Keydown LEFT (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equals( $("#log").html(), "keydown,", "Keydown RIGHT (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equals( $("#log").html(), "4,keydown,", "Keydown PAGE_DOWN");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equals( $("#log").html(), "keydown,", "Keydown PAGE_DOWN (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equals( $("#log").html(), "0,keydown,", "Keydown PAGE_UP");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equals( $("#log").html(), "keydown,", "Keydown PAGE_UP (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
	equals( $("#log").html(), "4,keydown,", "Keydown END");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
	equals( $("#log").html(), "0,keydown,", "Keydown HOME");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	equals( $("#log").html(), "keydown,", "Keydown ESCAPE (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	equals( $("#log").html(), "Aberdeen,keydown,", "Keydown ENTER");
});

asyncTest("handle keyboard navigation on menu without scroll and with submenus", function() {
	expect(14);
	var element = $('#menu2').menu({
		select: function(event, ui) {
			log($(ui.item[0]).text());
		},
		focus: function( event, ui ) {
			log($(event.target).find(".ui-state-focus").parent().index());
		}
	});

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equals( $("#log").html(), "1,0,keydown,", "Keydown DOWN");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equals( $("#log").html(), "0,keydown,", "Keydown UP");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equals( $("#log").html(), "keydown,", "Keydown LEFT (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

	setTimeout( function() {
		equals( $("#log").html(), "0,4,3,2,1,keydown,", "Keydown RIGHT (open submenu)");
	}, 50);

	setTimeout( function() {
		log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equals( $("#log").html(), "4,keydown,", "Keydown LEFT (close submenu)");

		//re-open submenu
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

		setTimeout( function() {
			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
			equals( $("#log").html(), "2,keydown,", "Keydown PAGE_DOWN");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
			equals( $("#log").html(), "keydown,", "Keydown PAGE_DOWN (no effect)");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
			equals( $("#log").html(), "0,keydown,", "Keydown PAGE_UP");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
			equals( $("#log").html(), "keydown,", "Keydown PAGE_UP (no effect)");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
			equals( $("#log").html(), "2,keydown,", "Keydown END");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
			equals( $("#log").html(), "0,keydown,", "Keydown HOME");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
			equals( $("#log").html(), "4,keydown,", "Keydown ESCAPE (close submenu)");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );

			setTimeout( function() {
				equals( $("#log").html(), "0,keydown,", "Keydown ENTER (open submenu)");

				log("keydown",true);
				element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				equals( $("#log").html(), "Ada,keydown,", "Keydown ENTER (select item)");

				start();
			}, 200);
		}, 150);
	}, 100);

});

test("handle keyboard navigation on menu with scroll and without submenus", function() {
	expect(14);
	var element = $('#menu3').menu({
		select: function(event, ui) {
			log($(ui.item[0]).text());
		},
		focus: function( event, ui ) {
			log($(event.target).find(".ui-state-focus").parent().index());
		}
	});

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equals( $("#log").html(), "1,0,keydown,", "Keydown DOWN");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equals( $("#log").html(), "0,keydown,", "Keydown UP");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equals( $("#log").html(), "keydown,", "Keydown LEFT (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equals( $("#log").html(), "keydown,", "Keydown RIGHT (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equals( $("#log").html(), "10,keydown,", "Keydown PAGE_DOWN");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equals( $("#log").html(), "20,keydown,", "Keydown PAGE_DOWN");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equals( $("#log").html(), "10,keydown,", "Keydown PAGE_UP");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equals( $("#log").html(), "0,keydown,", "Keydown PAGE_UP");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
	equals( $("#log").html(), "keydown,", "Keydown PAGE_UP (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
	equals( $("#log").html(), "37,keydown,", "Keydown END");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	equals( $("#log").html(), "keydown,", "Keydown PAGE_DOWN (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
	equals( $("#log").html(), "0,keydown,", "Keydown HOME");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	equals( $("#log").html(), "keydown,", "Keydown ESCAPE (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	equals( $("#log").html(), "Aberdeen,keydown,", "Keydown ENTER");
});

asyncTest("handle keyboard navigation on menu with scroll and with submenus", function() {
	expect(14);
	var element = $('#menu4').menu({
		select: function(event, ui) {
			log($(ui.item[0]).text());
		},
		focus: function( event, ui ) {
			log($(event.target).find(".ui-state-focus").parent().index());
		}
	});

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equals( $("#log").html(), "1,0,keydown,", "Keydown DOWN");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equals( $("#log").html(), "0,keydown,", "Keydown UP");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equals( $("#log").html(), "keydown,", "Keydown LEFT (no effect)");

	log("keydown",true);
	element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

	setTimeout( function() {
		equals( $("#log").html(), "0,1,keydown,", "Keydown RIGHT (open submenu)");
	}, 50);

	setTimeout( function() {
		log("keydown",true);
		element.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		equals( $("#log").html(), "1,keydown,", "Keydown LEFT (close submenu)");

		//re-open submenu
		element.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );

		setTimeout( function() {
			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
			equals( $("#log").html(), "10,keydown,", "Keydown PAGE_DOWN");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
			equals( $("#log").html(), "20,keydown,", "Keydown PAGE_DOWN");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
			equals( $("#log").html(), "10,keydown,", "Keydown PAGE_UP");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
			equals( $("#log").html(), "0,keydown,", "Keydown PAGE_UP");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.END } );
			equals( $("#log").html(), "27,keydown,", "Keydown END");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
			equals( $("#log").html(), "0,keydown,", "Keydown HOME");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
			equals( $("#log").html(), "1,keydown,", "Keydown ESCAPE (close submenu)");

			log("keydown",true);
			element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );

			setTimeout( function() {
				equals( $("#log").html(), "0,keydown,", "Keydown ENTER (open submenu)");

				log("keydown",true);
				element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				equals( $("#log").html(), "Aberdeen,keydown,", "Keydown ENTER (select item)");

				start();
			}, 200);
		}, 150);
	}, 100);

});

})(jQuery);
