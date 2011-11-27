(function( $ ) {

module( "autocomplete: events" );

var data = [ "Clojure", "COBOL", "ColdFusion", "Java", "JavaScript", "Scala", "Scheme" ];

$.each([
	{
		type: "input",
		selector: "#autocomplete",
		valueMethod: "val"
	},
	{
		type: "textarea",
		selector: "#autocomplete-textarea",
		valueMethod: "val"
	},
	{
		type: "contenteditable",
		selector: "#autocomplete-contenteditable",
		valueMethod: "text"
	}
], function( i, settings ) {
	asyncTest( "all events - " + settings.type, function() {
		expect( 13 );
		var element = $( settings.selector )
				.autocomplete({
					autoFocus: false,
					delay: 0,
					source: data,
					search: function( event ) {
						equal( event.originalEvent.type, "keydown", "search originalEvent" );
					},
					response: function( event, ui ) {
						deepEqual( ui.content, [
							{ label: "Clojure", value: "Clojure" },
							{ label: "Java", value: "Java" },
							{ label: "JavaScript", value: "JavaScript" }
						], "response ui.content" );
						ui.content.splice( 0, 1 );
					},
					open: function( event ) {
						ok( menu.is( ":visible" ), "menu open on open" );
					},
					focus: function( event, ui ) {
						equal( event.originalEvent.type, "menufocus", "focus originalEvent" );
						deepEqual( ui.item, { label: "Java", value: "Java" }, "focus ui.item" );
					},
					close: function( event ) {
						equal( event.originalEvent.type, "menuselect", "close originalEvent" );
						ok( menu.is( ":hidden" ), "menu closed on close" );
					},
					select: function( event, ui ) {
						equal( event.originalEvent.type, "menuselect", "select originalEvent" );
						deepEqual( ui.item, { label: "Java", value: "Java" }, "select ui.item" );
					},
					change: function( event, ui ) {
						equal( event.originalEvent.type, "blur", "change originalEvent" );
						deepEqual( ui.item, { label: "Java", value: "Java" }, "change ui.item" );
						ok( menu.is( ":hidden" ), "menu closed on change" );
						start();
					}
				}),
			menu = element.autocomplete( "widget" );

		element.simulate( "focus" )[ settings.valueMethod ]( "j" ).keydown();
		setTimeout(function() {
			ok( menu.is( ":visible" ), "menu is visible after delay" );
			element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			element.simulate( "blur" );
		}, 50 );
	});
});

asyncTest( "change without selection", function() {
	expect( 1 );
	var element = $( "#autocomplete" ).autocomplete({
		delay: 0,
		source: data,
		change: function( event, ui ) {
			strictEqual( ui.item, null );
			start();
		}
	});
	element.triggerHandler( "focus" );
	element.val( "ja" ).triggerHandler( "blur" );
});

asyncTest( "cancel search", function() {
	expect( 6 );
	var first = true,
		element = $( "#autocomplete" ).autocomplete({
			delay: 0,
			source: data,
			search: function() {
				if ( first ) {
					equal( element.val(), "ja", "val on first search" );
					first = false;
					return false;
				}
				equal( element.val(), "java", "val on second search" );
			},
			open: function() {
				ok( true, "menu opened" );
			}
		}),
		menu = element.autocomplete( "widget" );
	element.val( "ja" ).keydown();
	setTimeout(function() {
		ok( menu.is( ":hidden" ), "menu is hidden after first search" );
		element.val( "java" ).keydown();
		setTimeout(function() {
			ok( menu.is( ":visible" ), "menu is visible after second search" );
			equal( menu.find( ".ui-menu-item" ).length, 2, "# of menu items" );
			start();
		}, 50 );
	}, 50 );
});

asyncTest( "cancel focus", function() {
	expect( 1 );
	var customVal = "custom value";
		element = $( "#autocomplete" ).autocomplete({
			delay: 0,
			source: data,
			focus: function( event, ui ) {
				$( this ).val( customVal );
				return false;
			}
		});
	element.val( "ja" ).keydown();
	setTimeout(function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equal( element.val(), customVal );
		start();
	}, 50 );
});

asyncTest( "cancel select", function() {
	expect( 1 );
	var customVal = "custom value",
		element = $( "#autocomplete" ).autocomplete({
			delay: 0,
			source: data,
			select: function( event, ui ) {
				$( this ).val( customVal );
				return false;
			}
		});
	element.val( "ja" ).keydown();
	setTimeout(function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		equal( element.val(), customVal );
		start();
	}, 50 );
});

asyncTest( "blur during remote search", function() {
	expect( 1 );
	var ac = $( "#autocomplete" ).autocomplete({
		delay: 0,
		source: function( request, response ) {
			ok( true, "trigger request" );
			ac.simulate( "blur" );
			setTimeout(function() {
				response([ "result" ]);
				start();
			}, 100 );
		},
		open: function() {
			ok( false, "opened after a blur" );
		}
	});
	ac.val( "ro" ).keydown();
});

asyncTest( "With an input pressing up causes the menu to be shown", function() {
	arrowsActivateOpensMenuTest( "#autocomplete", true, true );
});

asyncTest( "With an input pressing down causes the menu to be shown", function() {
	arrowsActivateOpensMenuTest( "#autocomplete", false, true );
});

asyncTest( "With a textarea pressing up doesn't cause the menu to be shown", function() {
	arrowsActivateOpensMenuTest( "#autocomplete-textarea", true, false );
});

asyncTest( "With a textarea pressing down doesn't cause the menu to be shown", function() {
	arrowsActivateOpensMenuTest( "#autocomplete-textarea", false, false );
});

asyncTest( "With a contenteditable pressing up doesn't cause the menu to be shown", function() {
	arrowsActivateOpensMenuTest( "#autocomplete-contenteditable", true, false );
});

asyncTest( "With a contenteditable pressing down doesn't cause the menu to be shown", function() {
	arrowsActivateOpensMenuTest( "#autocomplete-contenteditable", false, false );
});

function arrowsActivateOpensMenuTest( id, isKeyUp, isMenuVisible ) {
	expect( 3 );
	var element = $( id ).autocomplete({
		source: data,
		delay: 0,
		minLength: 0
	});
	menu = element.autocomplete( "widget" );
	ok( menu.is( ":hidden" ), "menu is hidden to start with" );
	element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );

	setTimeout(function() {
		equal( menu.is( ":visible" ), isMenuVisible, "menu is visible after delay" );
		equal( menu.find( "a.ui-state-focus" ).text(), "", "nothing should be initially selected" );
		start();
	}, 50 );
}

test( "Pressing up selects the previous search item when active with input", function() {
	searchUpDownSelectsItemTest( "#autocomplete", true, "" );
});

test( "Pressing down selects the next search item when active with input", function() {
	searchUpDownSelectsItemTest( "#autocomplete", false, "JavaScript" );
});

test( "Pressing up selects the previous search item when active with textarea", function() {
	searchUpDownSelectsItemTest( "#autocomplete-textarea", true, "" );
});

test( "Pressing down selects the next search item when active with textarea", function() {
	searchUpDownSelectsItemTest( "#autocomplete-textarea", false, "JavaScript" );
});

test( "Pressing up selects the previous search item when active with contenteditable", function() {
	searchUpDownSelectsItemTest( "#autocomplete-contenteditable", true, "" );
});

test( "Pressing down selects the next search item when active with contenteditable", function() {
	searchUpDownSelectsItemTest( "#autocomplete-contenteditable", false, "JavaScript" );
});

function searchUpDownSelectsItemTest( id, isKeyUp, itemThatShouldBeSelected ) {
	expect( 2 );
	var element = $( id ).autocomplete({
		source: data,
		autoFocus: true,
		delay: 0
	});
	menu = element.autocomplete( "widget" );

	element.autocomplete( "search", "a" );

	equal( menu.find( "a.ui-state-focus" ).text(), "Java", "Java should be initially selected" );
	element.simulate( "keydown", { keyCode: ( isKeyUp ? $.ui.keyCode.UP : $.ui.keyCode.DOWN ) } );
	equal( menu.find( "a.ui-state-focus" ).text(), itemThatShouldBeSelected, "Check you've selected the expected value." );
}

}( jQuery ) );
