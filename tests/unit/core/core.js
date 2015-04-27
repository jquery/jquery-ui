define( [
	"jquery",
	"lib/common",
	"ui/core"
], function( $, common ) {

module( "core - jQuery extensions" );

common.testJshint( "core" );

test( "innerWidth - getter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	equal( el.innerWidth(), 122, "getter passthru" );
	el.hide();
	equal( el.innerWidth(), 122, "getter passthru when hidden" );
});

test( "innerWidth - setter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	el.innerWidth( 120 );
	equal( el.width(), 98, "width set properly" );
	el.hide();
	el.innerWidth( 100 );
	equal( el.width(), 78, "width set properly when hidden" );
});

test( "innerHeight - getter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	equal( el.innerHeight(), 70, "getter passthru" );
	el.hide();
	equal( el.innerHeight(), 70, "getter passthru when hidden" );
});

test( "innerHeight - setter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	el.innerHeight( 60 );
	equal( el.height(), 40, "height set properly" );
	el.hide();
	el.innerHeight( 50 );
	equal( el.height(), 30, "height set properly when hidden" );
});

test( "outerWidth - getter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	equal( el.outerWidth(), 140, "getter passthru" );
	el.hide();
	equal( el.outerWidth(), 140, "getter passthru when hidden" );
});

test( "outerWidth - setter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	el.outerWidth( 130 );
	equal( el.width(), 90, "width set properly" );
	el.hide();
	el.outerWidth( 120 );
	equal( el.width(), 80, "width set properly when hidden" );
});

test( "outerWidth(true) - getter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	equal( el.outerWidth(true), 154, "getter passthru w/ margin" );
	el.hide();
	equal( el.outerWidth(true), 154, "getter passthru w/ margin when hidden" );
});

test( "outerWidth(true) - setter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	el.outerWidth( 130, true );
	equal( el.width(), 76, "width set properly" );
	el.hide();
	el.outerWidth( 120, true );
	equal( el.width(), 66, "width set properly when hidden" );
});

test( "outerHeight - getter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	equal( el.outerHeight(), 86, "getter passthru" );
	el.hide();
	equal( el.outerHeight(), 86, "getter passthru when hidden" );
});

test( "outerHeight - setter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	el.outerHeight( 80 );
	equal( el.height(), 44, "height set properly" );
	el.hide();
	el.outerHeight( 70 );
	equal( el.height(), 34, "height set properly when hidden" );
});

test( "outerHeight(true) - getter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	equal( el.outerHeight(true), 98, "getter passthru w/ margin" );
	el.hide();
	equal( el.outerHeight(true), 98, "getter passthru w/ margin when hidden" );
});

test( "outerHeight(true) - setter", function() {
	expect( 2 );
	var el = $( "#dimensions" );

	el.outerHeight( 90, true );
	equal( el.height(), 42, "height set properly" );
	el.hide();
	el.outerHeight( 80, true );
	equal( el.height(), 32, "height set properly when hidden" );
});

test( "uniqueId / removeUniqueId", function() {
	expect( 3 );
	var el = $( "img" ).eq( 0 );
	equal( el.attr( "id" ), null, "element has no initial id" );
	el.uniqueId();
	ok( /ui-id-\d+$/.test( el.attr( "id" ) ), "element has generated id" );
	el.removeUniqueId();
	equal( el.attr( "id" ), null, "unique id has been removed from element" );
});


test( "labels", function() {
	expect( 2 );

	var expected = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10" ],
		foundFragment = [],
		foundDom = [],
		dom = $( "#labels-fragment" ),
		domLabels = dom.find( "input" ).labels(),
		fragmentLabels = $( dom.html() ).find( "input" ).labels();

	domLabels.each( function( index ){
		foundDom.push( $( this ).text().trim() );
	} );
	deepEqual( foundDom, expected,
		"Labels finds labels all labels in the DOM, and sorts them in DOM order" );

	fragmentLabels.each( function( index ){
		foundFragment.push( $( this ).text().trim() );
	} );
	deepEqual( foundFragment, expected,
		"Labels finds all labels in fragments, and sorts them in dom order" );
} );

asyncTest( "form", function() {
	expect( 12 );

	var dom = $( "#form-dom" ),
		domInputs = dom.find( "input" ),
		formTests = [],
		count = 0,
		first = true,
		fragmentDom = $( $( "#form-fragment" ).html().trim() ),
		fragmentInputs = fragmentDom.find( "input" ).add( fragmentDom.filter( "input " ) );

	function testInputReset( input ) {
		var form = input.form(),
			resolveValue = ( count === 0 || count === 6 || count === 7 ) ? "changed" : "",
			deffered = new $.Deferred();

		count++;
		input.val( "changed" );
		deffered.then( function( value ) {
			equal( input.val(), value, "Proper form found for #" + input.attr( "id" ) );
		} );

		form.trigger( "reset" );
		setTimeout( function() {
			deffered.resolve( resolveValue );
		} );
		return deffered;
	}
	$( "#form-fragment" ).remove();
	domInputs.each( function() {
		formTests.push( testInputReset( $( this ) ) );
	} );

	fragmentInputs.each( function() {
		formTests.push( testInputReset( $( this ) ) );
	} );
	$.when.apply( formTests ).then( function() {
		start();
	} );
} );

} );
