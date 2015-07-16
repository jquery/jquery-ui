define( [
	"jquery",
	"lib/common",
	"ui/form",
	"ui/labels",
	"ui/unique-id"
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

test( "Labels", function() {
	expect( 2 );

	var expected = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10" ];
	var dom = $( "#labels-fragment" );

	function testLabels( testType ) {
		var labels = dom.find( "#test" ).labels();
		var found = labels.map( function() {

				// Support: Core 1.9 Only
				// We use $.trim() because core 1.9.x silently fails when white space is present
				return $.trim( $( this ).text() );
			} ).get();

		deepEqual( found, expected,
			".labels() finds all labels in " + testType + ", and sorts them in DOM order" );
	}

	testLabels( "the DOM" );

	// Detach the dom to test on a fragment
	dom.detach();
	testLabels( "document fragments" );
} );

( function() {
	var domAttached = $( "#form-test" );
	var domDetached = $( "#form-test-detached" ).detach();

	function testForm( name, dom ) {
		var inputs = dom.find( "input" );

		inputs.each( function() {
			var input = $( this );

			asyncTest( name + this.id.replace( /_/g, " " ), function() {
				expect( 1 );
				var form = input.form();

				// If input has a form the value should reset to "" if not it should be "changed"
				var value = form.length ? "" : "changed";

				input.val( "changed" );

				// If there is a form we reset just that. If there is not a form, reset every form.
				// The idea is if a form is found resetting that form should reset the input.
				// If no form is found no amount of resetting should change the value.
				( form.length ? form : dom.find( "form" ).addBack( "form" ) ).each( function() {
					this.reset();
				} );

				setTimeout( function() {
					equal( input.val(), value, "Proper form found for #" + input.attr( "id" ) );
					start();
				} );
			} );
		} );
	}

	testForm( "form: attached: ", domAttached );
	testForm( "form: detached: ", domDetached );
} )();
} );
