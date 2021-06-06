define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/autocomplete"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "autocomplete: events", { afterEach: helper.moduleAfterEach }  );

var data = [ "Clojure", "COBOL", "ColdFusion", "Java", "JavaScript", "Scala", "Scheme" ];

$.each( [
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
	QUnit.test( "all events - " + settings.type, function( assert ) {
		var ready = assert.async();
		assert.expect( 13 );
		var element = $( settings.selector )
				.autocomplete( {
					autoFocus: false,
					delay: 0,
					source: data,
					search: function( event ) {
						assert.equal( event.originalEvent.type, "keydown", "search originalEvent" );
					},
					response: function( event, ui ) {
						assert.deepEqual( ui.content, [
							{ label: "Clojure", value: "Clojure" },
							{ label: "Java", value: "Java" },
							{ label: "JavaScript", value: "JavaScript" }
						], "response ui.content" );
						ui.content.splice( 0, 1 );
					},
					open: function() {
						assert.ok( menu.is( ":visible" ), "menu open on open" );
					},
					focus: function( event, ui ) {
						assert.equal( event.originalEvent.type, "menufocus", "focus originalEvent" );
						assert.deepEqual( ui.item, { label: "Java", value: "Java" }, "focus ui.item" );
					},
					close: function( event ) {
						assert.equal( event.originalEvent.type, "menuselect", "close originalEvent" );
						assert.ok( menu.is( ":hidden" ), "menu closed on close" );
					},
					select: function( event, ui ) {
						assert.equal( event.originalEvent.type, "menuselect", "select originalEvent" );
						assert.deepEqual( ui.item, { label: "Java", value: "Java" }, "select ui.item" );
					},
					change: function( event, ui ) {
						assert.equal( event.originalEvent.type, "blur", "change originalEvent" );
						assert.deepEqual( ui.item, { label: "Java", value: "Java" }, "change ui.item" );
						assert.ok( menu.is( ":hidden" ), "menu closed on change" );
						ready();
					}
				} ),
			menu = element.autocomplete( "widget" );

		element.simulate( "focus" )[ settings.valueMethod ]( "j" ).trigger( "keydown" );
		setTimeout( function() {
			assert.ok( menu.is( ":visible" ), "menu is visible after delay" );
			element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );

			// Blur must be async for IE to handle it properly
			setTimeout( function() {
				element.simulate( "blur" );
			} );
		} );
	} );
} );

QUnit.test( "change without selection", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	var element = $( "#autocomplete" ).autocomplete( {
		delay: 0,
		source: data,
		change: function( event, ui ) {
			assert.strictEqual( ui.item, null );
			ready();
		}
	} );
	element.triggerHandler( "focus" );
	element.val( "ja" ).triggerHandler( "blur" );
} );

QUnit.test( "cancel search", function( assert ) {
	var ready = assert.async();
	assert.expect( 6 );
	var first = true,
		element = $( "#autocomplete" ).autocomplete( {
			delay: 0,
			source: data,
			search: function() {
				if ( first ) {
					assert.equal( element.val(), "ja", "val on first search" );
					first = false;
					return false;
				}
				assert.equal( element.val(), "java", "val on second search" );
			},
			open: function() {
				assert.ok( true, "menu opened" );
			}
		} ),
		menu = element.autocomplete( "widget" );
	element.val( "ja" ).trigger( "keydown" );
	setTimeout( function() {
		assert.ok( menu.is( ":hidden" ), "menu is hidden after first search" );
		element.val( "java" ).trigger( "keydown" );
		setTimeout( function() {
			assert.ok( menu.is( ":visible" ), "menu is visible after second search" );
			assert.equal( menu.find( ".ui-menu-item" ).length, 2, "# of menu items" );
			ready();
		} );
	} );
} );

QUnit.test( "cancel focus", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	var customVal = "custom value",
		element = $( "#autocomplete" ).autocomplete( {
			delay: 0,
			source: data,
			focus: function() {
				$( this ).val( customVal );
				return false;
			}
		} );
	element.val( "ja" ).trigger( "keydown" );
	setTimeout( function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		assert.equal( element.val(), customVal );
		ready();
	} );
} );

QUnit.test( "cancel select", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	var customVal = "custom value",
		element = $( "#autocomplete" ).autocomplete( {
			delay: 0,
			source: data,
			select: function() {
				$( this ).val( customVal );
				return false;
			}
		} );
	element.val( "ja" ).trigger( "keydown" );
	setTimeout( function() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		element.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		assert.equal( element.val(), customVal );
		ready();
	} );
} );

QUnit.test( "blur during remote search", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	var ac = $( "#autocomplete" ).autocomplete( {
		delay: 0,
		source: function( request, response ) {
			assert.ok( true, "trigger request" );
			ac.simulate( "blur" );
			setTimeout( function() {
				response( [ "result" ] );
				ready();
			}, 25 );
		},
		open: function() {
			assert.ok( false, "opened after a blur" );
		}
	} );
	ac.val( "ro" ).trigger( "keydown" );
} );

} );
