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

// Support: Core 1.9 Only, IE8 Only
// The use of $.trim() in the two tests below this is to account for IE8 missing string.trim()
// We need to trim the values at all because of a bug in core 1.9.x
test( "labels", function() {
	expect( 2 );

	var expected = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11" ],
		foundFragment = [],
		foundDom = [],
		dom = $( "#labels-fragment" ),
		domLabels = dom.find( "#test" ).labels(),
		fragmentLabels = $( $.trim( dom.html() ) ).find( "#test" );

	domLabels.each( function(){
		foundDom.push( $.trim( $( this ).text() ) );
	} );
	deepEqual( foundDom, expected,
		"Labels finds labels all labels in the DOM, and sorts them in DOM order" );

	// Remove fragment DOM so id's are not duplicated and we know we are finding the detached labels
	dom.remove();
	fragmentLabels = fragmentLabels.labels();
	fragmentLabels.each( function(){
		foundFragment.push( $.trim( $( this ).text() ) );
	} );
	deepEqual( foundFragment, expected,
		"Labels finds all labels in fragments, and sorts them in dom order" );
} );

asyncTest( "form", function() {
	expect( 12 );

	var dom = $( "#form-dom" ),
		domInputs = dom.find( "input" ),
		formTests = [],
		fragmentDom = $( $.trim( $( "#form-fragment" ).html() ) ),
		fragmentInputs = fragmentDom.find( "input" ).add( fragmentDom.filter( "input " ) );

	function testInputReset( input, dom ) {
		var form = input.form(),

			// If the input has a form value should be reset, other wise it should still be changed
			resolveValue = form.length ? "" : "changed",

			// Create a deffered to resolve after the form has been reset
			deffered = new $.Deferred();

		// When the deffered is resolved check if the input has beem reset or not
		deffered.then( function( value ) {
			equal( input.val(), value, "Proper form found for #" + input.attr( "id" ) );
		} );

		input.val( "changed" );

		// If there is a form we reset just that. If there is not a form, reset every form.
		// The idea is if a form is found resetting that form should reset the input.
		// If no form is found no amount of resetting should change the value.
		( form.length ? form : dom.find( "form" ).add( dom.filter( form ) ) ).trigger( "reset" );

		// We need to wait for the form to actually reset then resolve the deffered
		setTimeout( function() {
			deffered.resolve( resolveValue );
		} );
		return deffered;
	}

	// Remove fragment DOM so id's are not duplicated and we know we are finding the detached forms
	$( "#form-fragment" ).remove();

	// Iterate over each set of inputs attached and detached and push the deffereds the test helper
	// returns to an array
	domInputs.each( function() {
		formTests.push( testInputReset( $( this ), $( document ) ) );
	} );

	fragmentInputs.each( function() {
		formTests.push( testInputReset( $( this ), fragmentDom ) );
	} );

	// We are doing a whole pile of async tests here so we will start when they all resolve
	$.when.apply( formTests ).then( function() {
		start();
	} );
} );

} );
