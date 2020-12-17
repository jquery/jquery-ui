define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/autocomplete"
], function( QUnit, $, helper ) {

QUnit.module( "autocomplete: options", { afterEach: helper.moduleAfterEach }  );

var data = [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby",
	"python", "c", "scala", "groovy", "haskell", "perl" ];

QUnit.test( "appendTo: null", function( assert ) {
	assert.expect( 1 );
	var element = $( "#autocomplete" ).autocomplete();
	assert.equal( element.autocomplete( "widget" ).parent()[ 0 ], document.body,
		"defaults to body" );
	element.autocomplete( "destroy" );
} );

QUnit.test( "appendTo: explicit", function( assert ) {
	assert.expect( 6 );
	var detached = $( "<div>" ),
		element = $( "#autocomplete" );

	element.autocomplete( {
		appendTo: ".autocomplete-wrap"
	} );
	assert.equal( element.autocomplete( "widget" ).parent()[ 0 ],
		$( "#autocomplete-wrap1" )[ 0 ], "first found element" );
	assert.equal( $( "#autocomplete-wrap2 .ui-autocomplete" ).length, 0,
		"only appends to one element" );
	element.autocomplete( "destroy" );

	element.autocomplete().autocomplete( "option", "appendTo", "#autocomplete-wrap1" );
	assert.equal( element.autocomplete( "widget" ).parent()[ 0 ],
		$( "#autocomplete-wrap1" )[ 0 ], "modified after init" );
	element.autocomplete( "destroy" );

	element.autocomplete( {
		appendTo: detached
	} );
	assert.equal( element.autocomplete( "widget" ).parent()[ 0 ], detached[ 0 ],
		"detached jQuery object" );
	element.autocomplete( "destroy" );

	element.autocomplete( {
		appendTo: detached[ 0 ]
	} );
	assert.equal( element.autocomplete( "widget" ).parent()[ 0 ], detached[ 0 ],
		"detached DOM element" );
	element.autocomplete( "destroy" );

	element.autocomplete().autocomplete( "option", "appendTo", detached );
	assert.equal( element.autocomplete( "widget" ).parent()[ 0 ], detached[ 0 ],
		"detached DOM element via option()" );
	element.autocomplete( "destroy" );
} );

QUnit.test( "appendTo: ui-front", function( assert ) {
	assert.expect( 2 );
	var element = $( "#autocomplete" );

	$( "#autocomplete-wrap2" ).addClass( "ui-front" );
	element.autocomplete();
	assert.equal( element.autocomplete( "widget" ).parent()[ 0 ],
		$( "#autocomplete-wrap2" )[ 0 ], "null, inside .ui-front" );
	element.autocomplete( "destroy" );

	element.autocomplete( {
		appendTo: $()
	} );
	assert.equal( element.autocomplete( "widget" ).parent()[ 0 ],
		$( "#autocomplete-wrap2" )[ 0 ], "empty jQuery object, inside .ui-front" );
} );

function autoFocusTest( assert, afValue, focusedLength ) {
	var ready = assert.async();
	var element = $( "#autocomplete" ).autocomplete( {
		autoFocus: afValue,
		delay: 0,
		source: data,
		open: function() {
			assert.equal(
				element.autocomplete( "widget" )
					.find( ".ui-menu-item-wrapper.ui-state-active" )
					.length,
				focusedLength,
				"first item is " + ( afValue ? "" : "not" ) + " auto focused" );
			ready();
		}
	} );
	element.val( "ja" ).trigger( "keydown" );
}

QUnit.test( "autoFocus: false", function( assert ) {
	assert.expect( 1 );
	autoFocusTest( assert, false, 0 );
} );

QUnit.test( "autoFocus: true", function( assert ) {
	assert.expect( 1 );
	autoFocusTest( assert, true, 1 );
} );

QUnit.test( "delay", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var element = $( "#autocomplete" ).autocomplete( {
			source: data,
			delay: 25
		} ),
		menu = element.autocomplete( "widget" );
	element.val( "ja" ).trigger( "keydown" );

	assert.ok( menu.is( ":hidden" ), "menu is closed immediately after search" );

	setTimeout( function() {
		assert.ok( menu.is( ":visible" ), "menu is open after delay" );
		ready();
	}, 50 );
} );

QUnit.test( "disabled", function( assert ) {
	var ready = assert.async();
	assert.expect( 5 );
	var element = $( "#autocomplete" ).autocomplete( {
			source: data,
			delay: 0
		} ),
		menu = element.autocomplete( "disable" ).autocomplete( "widget" );
	element.val( "ja" ).trigger( "keydown" );

	assert.ok( menu.is( ":hidden" ) );

	assert.lacksClasses( element, "ui-state-disabled" );
	assert.hasClasses( menu, "ui-autocomplete-disabled" );
	assert.ok( !element.attr( "aria-disabled" ), "element doesn't get aria-disabled" );

	setTimeout( function() {
		assert.ok( menu.is( ":hidden" ) );
		ready();
	} );
} );

QUnit.test( "minLength", function( assert ) {
	assert.expect( 2 );
	var element = $( "#autocomplete" ).autocomplete( {
			source: data
		} ),
		menu = element.autocomplete( "widget" );
	element.autocomplete( "search", "" );
	assert.ok( menu.is( ":hidden" ), "blank not enough for minLength: 1" );

	element.autocomplete( "option", "minLength", 0 );
	element.autocomplete( "search", "" );
	assert.ok( menu.is( ":visible" ), "blank enough for minLength: 0" );
} );

QUnit.test( "minLength, exceed then drop below", function( assert ) {
	var ready = assert.async();
	assert.expect( 4 );
	var element = $( "#autocomplete" ).autocomplete( {
			minLength: 2,
			source: function( req, res ) {
				assert.equal( req.term, "12", "correct search term" );
				setTimeout( function() {
					res( [ "item" ] );
				} );
			}
		} ),
		menu = element.autocomplete( "widget" );

	assert.ok( menu.is( ":hidden" ), "menu is hidden before first search" );
	element.autocomplete( "search", "12" );

	assert.ok( menu.is( ":hidden" ), "menu is hidden before second search" );
	element.autocomplete( "search", "1" );

	setTimeout( function() {
		assert.ok( menu.is( ":hidden" ), "menu is hidden after searches" );
		ready();
	} );
} );

QUnit.test( "minLength, exceed then drop below then exceed", function( assert ) {
	assert.expect( 3 );
	var _res = [],
		element = $( "#autocomplete" ).autocomplete( {
			minLength: 2,
			source: function( req, res ) {
				_res.push( res );
			}
		} ),
		menu = element.autocomplete( "widget" );

	// Trigger a valid search
	assert.ok( menu.is( ":hidden" ), "menu is hidden before first search" );
	element.autocomplete( "search", "12" );

	// Trigger a search below the minLength, to turn on cancelSearch flag
	assert.ok( menu.is( ":hidden" ), "menu is hidden before second search" );
	element.autocomplete( "search", "1" );

	// Trigger a valid search
	element.autocomplete( "search", "13" );

	// React as if the first search was cancelled (default ajax behavior)
	_res[ 0 ]( [] );

	// React to second search
	_res[ 1 ]( [ "13" ] );

	assert.ok( menu.is( ":visible" ), "menu is visible after searches" );
} );

QUnit.test( "source, local string array", function( assert ) {
	assert.expect( 1 );
	var element = $( "#autocomplete" ).autocomplete( {
			source: data
		} ),
		menu = element.autocomplete( "widget" );
	element.val( "ja" ).autocomplete( "search" );
	assert.equal( menu.find( ".ui-menu-item" ).text(), "javajavascript" );
} );

function sourceTest( assert, source, async ) {
	var ready;
	var element = $( "#autocomplete" ).autocomplete( {
			source: source
		} ),
		menu = element.autocomplete( "widget" );
	function result() {
		var items = menu.find( ".ui-menu-item" );
		assert.equal( items.length, 3, "Should find three results." );
		assert.deepEqual( items.eq( 0 ).data( "ui-autocomplete-item" ), {
			label: "java",
			value: "java"
		} );
		assert.deepEqual( items.eq( 1 ).data( "ui-autocomplete-item" ), {
			label: "javascript",
			value: "javascript"
		} );
		assert.deepEqual( items.eq( 2 ).data( "ui-autocomplete-item" ), {
			label: "clojure",
			value: "clojure"
		} );
		element.autocomplete( "destroy" );
		if ( async ) {
			ready();
		}
	}
	if ( async ) {
		ready = assert.async();
		$( document ).one( "ajaxStop", result );
	}
	element.val( "j" ).autocomplete( "search" );
	if ( !async ) {
		result();
	}
}

QUnit.test( "source, local object array, only labels", function( assert ) {
	assert.expect( 4 );
	sourceTest( assert, [
		{ label: "java", value: null },
		{ label: "php", value: null },
		{ label: "coldfusion", value: "" },
		{ label: "javascript", value: "" },
		{ label: "clojure" }
	] );
} );

QUnit.test( "source, local object array, only values", function( assert ) {
	assert.expect( 4 );
	sourceTest( assert, [
		{ value: "java", label: null },
		{ value: "php", label: null },
		{ value: "coldfusion", label: "" },
		{ value: "javascript", label: "" },
		{ value: "clojure" }
	] );
} );

QUnit.test( "source, url string with remote json string array", function( assert ) {
	assert.expect( 4 );
	sourceTest( assert, "remote_string_array.txt", true );
} );

QUnit.test( "source, url string with remote json object array, only value properties", function( assert ) {
	assert.expect( 4 );
	sourceTest( assert, "remote_object_array_values.txt", true );
} );

QUnit.test( "source, url string with remote json object array, only label properties", function( assert ) {
	assert.expect( 4 );
	sourceTest( assert, "remote_object_array_labels.txt", true );
} );

QUnit.test( "source, custom", function( assert ) {
	assert.expect( 5 );
	sourceTest( assert, function( request, response ) {
		assert.equal( request.term, "j" );
		response( [
			"java",
			{ label: "javascript", value: null },
			{ value: "clojure", label: null }
		] );
	} );
} );

QUnit.test( "source, update after init", function( assert ) {
	assert.expect( 2 );
	var element = $( "#autocomplete" ).autocomplete( {
			source: [ "java", "javascript", "haskell" ]
		} ),
		menu = element.autocomplete( "widget" );
	element.val( "ja" ).autocomplete( "search" );
	assert.equal( menu.find( ".ui-menu-item" ).text(), "javajavascript" );
	element.autocomplete( "option", "source", [ "php", "asp" ] );
	element.val( "ph" ).autocomplete( "search" );
	assert.equal( menu.find( ".ui-menu-item" ).text(), "php" );
} );

} );
