(function( $ ) {

module( "autocomplete: options" );

var data = [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby",
	"python", "c", "scala", "groovy", "haskell", "perl" ];

test( "appendTo: null", function() {
	expect( 1 );
	var element = $( "#autocomplete" ).autocomplete();
	equal( element.autocomplete( "widget" ).parent()[ 0 ], document.body,
		"defaults to body" );
	element.autocomplete( "destroy" );
});

test( "appendTo: explicit", function() {
	expect( 6 );
	var detached = $( "<div>" ),
		element = $( "#autocomplete" );

	element.autocomplete({
		appendTo: ".autocomplete-wrap"
	});
	equal( element.autocomplete( "widget" ).parent()[ 0 ],
		$( "#autocomplete-wrap1" )[ 0 ], "first found element" );
	equal( $( "#autocomplete-wrap2 .ui-autocomplete" ).length, 0,
		"only appends to one element" );
	element.autocomplete( "destroy" );

	element.autocomplete().autocomplete( "option", "appendTo", "#autocomplete-wrap1" );
	equal( element.autocomplete( "widget" ).parent()[ 0 ],
		$( "#autocomplete-wrap1" )[ 0 ], "modified after init" );
	element.autocomplete( "destroy" );

	element.autocomplete({
		appendTo: detached
	});
	equal( element.autocomplete( "widget" ).parent()[ 0 ], detached[ 0 ],
		"detached jQuery object" );
	element.autocomplete( "destroy" );

	element.autocomplete({
		appendTo: detached[ 0 ]
	});
	equal( element.autocomplete( "widget" ).parent()[ 0 ], detached[ 0 ],
		"detached DOM element" );
	element.autocomplete( "destroy" );

	element.autocomplete().autocomplete( "option", "appendTo", detached );
	equal( element.autocomplete( "widget" ).parent()[ 0 ], detached[ 0 ],
		"detached DOM element via option()" );
	element.autocomplete( "destroy" );
});

test( "appendTo: ui-front", function() {
	expect( 2 );
	var element = $( "#autocomplete" );

	$( "#autocomplete-wrap2" ).addClass( "ui-front" );
	element.autocomplete();
	equal( element.autocomplete( "widget" ).parent()[ 0 ],
		$( "#autocomplete-wrap2" )[ 0 ], "null, inside .ui-front" );
	element.autocomplete( "destroy" );

	element.autocomplete({
		appendTo: $()
	});
	equal( element.autocomplete( "widget" ).parent()[ 0 ],
		$( "#autocomplete-wrap2" )[ 0 ], "empty jQuery object, inside .ui-front" );
});

function autoFocusTest( afValue, focusedLength ) {
	var element = $( "#autocomplete" ).autocomplete({
		autoFocus: afValue,
		delay: 0,
		source: data,
		open: function() {
			equal(
				element.autocomplete( "widget" )
					.children( ".ui-menu-item.ui-state-focus" )
					.length,
				focusedLength,
				"first item is " + (afValue ? "" : "not") + " auto focused" );
			start();
		}
	});
	element.val( "ja" ).keydown();
	stop();
}

test( "autoFocus: false", function() {
	expect( 1 );
	autoFocusTest( false, 0 );
});

test( "autoFocus: true", function() {
	expect( 1 );
	autoFocusTest( true, 1 );
});

asyncTest( "delay", function() {
	expect( 2 );
	var element = $( "#autocomplete" ).autocomplete({
			source: data,
			delay: 50
		}),
		menu = element.autocomplete( "widget" );
	element.val( "ja" ).keydown();

	ok( menu.is( ":hidden" ), "menu is closed immediately after search" );

	setTimeout(function() {
		ok( menu.is( ":visible" ), "menu is open after delay" );
		start();
	}, 100 );
});

asyncTest( "disabled", function() {
	expect( 5 );
	var element = $( "#autocomplete" ).autocomplete({
			source: data,
			delay: 0
		}),
		menu = element.autocomplete( "disable" ).autocomplete( "widget" );
	element.val( "ja" ).keydown();

	ok( menu.is( ":hidden" ) );

	ok( !element.is( ".ui-state-disabled" ), "element doesn't get ui-state-disabled" );
	ok( !element.attr( "aria-disabled" ), "element doesn't get aria-disabled" );
	ok( menu.is( ".ui-autocomplete-disabled" ), "element gets ui-autocomplete-disabled" );

	setTimeout(function() {
		ok( menu.is( ":hidden" ) );
		start();
	}, 50 );
});

test( "minLength", function() {
	expect( 2 );
	var element = $( "#autocomplete" ).autocomplete({
			source: data
		}),
		menu = element.autocomplete( "widget" );
	element.autocomplete( "search", "" );
	ok( menu.is( ":hidden" ), "blank not enough for minLength: 1" );

	element.autocomplete( "option", "minLength", 0 );
	element.autocomplete( "search", "" );
	ok( menu.is( ":visible" ), "blank enough for minLength: 0" );
});

asyncTest( "minLength, exceed then drop below", function() {
	expect( 4 );
	var element = $( "#autocomplete" ).autocomplete({
			minLength: 2,
			source: function( req, res ) {
				equal( req.term, "12", "correct search term" );
				setTimeout(function() {
					res([ "item" ]);
				}, 1 );
			}
		}),
		menu = element.autocomplete( "widget" );

	ok( menu.is( ":hidden" ), "menu is hidden before first search" );
	element.autocomplete( "search", "12" );

	ok( menu.is( ":hidden" ), "menu is hidden before second search" );
	element.autocomplete( "search", "1" );

	setTimeout(function() {
		ok( menu.is( ":hidden" ), "menu is hidden after searches" );
		start();
	}, 50 );
});

test( "minLength, exceed then drop below then exceed", function() {
	expect( 3 );
	var _res = [],
		element = $( "#autocomplete" ).autocomplete({
			minLength: 2,
			source: function( req, res ) {
				_res.push( res );
			}
		}),
		menu = element.autocomplete( "widget" );

	// trigger a valid search
	ok( menu.is( ":hidden" ), "menu is hidden before first search" );
	element.autocomplete( "search", "12" );

	// trigger a search below the minLength, to turn on cancelSearch flag
	ok( menu.is( ":hidden" ), "menu is hidden before second search" );
	element.autocomplete( "search", "1" );

	// trigger a valid search
	element.autocomplete( "search", "13" );
	// react as if the first search was cancelled (default ajax behavior)
	_res[ 0 ]([]);
	// react to second search
	_res[ 1 ]([ "13" ]);

	ok( menu.is( ":visible" ), "menu is visible after searches" );
});

test( "source, local string array", function() {
	expect( 1 );
	var element = $( "#autocomplete" ).autocomplete({
			source: data
		}),
		menu = element.autocomplete( "widget" );
	element.val( "ja" ).autocomplete( "search" );
	equal( menu.find( ".ui-menu-item" ).text(), "javajavascript" );
});

function sourceTest( source, async ) {
	var element = $( "#autocomplete" ).autocomplete({
			source: source
		}),
		menu = element.autocomplete( "widget" );
	function result() {
		var items = menu.find( ".ui-menu-item" );
		equal( items.length, 3, "Should find three results." );
		deepEqual( items.eq( 0 ).data( "ui-autocomplete-item" ), {
			label: "java",
			value: "java"
		});
		deepEqual( items.eq( 1 ).data( "ui-autocomplete-item" ), {
			label: "javascript",
			value: "javascript"
		});
		deepEqual( items.eq( 2 ).data( "ui-autocomplete-item" ), {
			label: "clojure",
			value: "clojure"
		});
		element.autocomplete( "destroy" );
		if ( async ) {
			start();
		}
	}
	if ( async ) {
		stop();
		$( document ).one( "ajaxStop", result );
	}
	element.val( "j" ).autocomplete( "search" );
	if ( !async ) {
		result();
	}
}

test( "source, local object array, only labels", function() {
	expect( 4 );
	sourceTest([
		{ label: "java", value: null },
		{ label: "php", value: null },
		{ label: "coldfusion", value: "" },
		{ label: "javascript", value: "" },
		{ label: "clojure" }
	]);
});

test( "source, local object array, only values", function() {
	expect( 4 );
	sourceTest([
		{ value: "java", label: null },
		{ value: "php", label: null },
		{ value: "coldfusion", label: "" },
		{ value: "javascript", label: "" },
		{ value: "clojure" }
	]);
});

test( "source, url string with remote json string array", function() {
	expect( 4 );
	sourceTest( "remote_string_array.txt", true );
});

test( "source, url string with remote json object array, only value properties", function() {
	expect( 4 );
	sourceTest( "remote_object_array_values.txt", true );
});

test( "source, url string with remote json object array, only label properties", function() {
	expect( 4 );
	sourceTest( "remote_object_array_labels.txt", true );
});

test( "source, custom", function() {
	expect( 5 );
	sourceTest(function( request, response ) {
		equal( request.term, "j" );
		response([
			"java",
			{ label: "javascript", value: null },
			{ value: "clojure", label: null }
		]);
	});
});

test( "source, update after init", function() {
	expect( 2 );
	var element = $( "#autocomplete" ).autocomplete({
			source: [ "java", "javascript", "haskell" ]
		}),
		menu = element.autocomplete( "widget" );
	element.val( "ja" ).autocomplete( "search" );
	equal( menu.find( ".ui-menu-item" ).text(), "javajavascript" );
	element.autocomplete( "option", "source", [ "php", "asp" ] );
	element.val( "ph" ).autocomplete( "search" );
	equal( menu.find( ".ui-menu-item" ).text(), "php" );
});

}( jQuery ) );
